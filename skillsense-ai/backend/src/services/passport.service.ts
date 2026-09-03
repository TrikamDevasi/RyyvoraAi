// backend/src/services/passport.service.ts

import crypto from 'crypto';
import Student from '../models/Student.model';
import logger from '../utils/logger';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface SkillEntry {
  skill: string;
  score: number;
  assessedOn: string;
  assessedBy: string;
  verified: boolean;
}

export interface PassportInput {
  studentId: string;
  studentName: string;
  gender: 'male' | 'female';
  dateOfBirth?: string;
  program: string;
  institutionId: string;
  institutionName: string;
  state: string;
  nsqfLevel: number;
  batch: string;
  skills: SkillEntry[];
  overallScore: number;
  placementStatus: 'placed' | 'studying' | 'seeking';
  company?: string;
  role?: string;
  salary?: number;
  issuedAt?: string;
}

export interface SkillPassport extends PassportInput {
  passportId: string;
  version: string;
  issuedAt: string;
  expiresAt: string;
  credentialHash: string;
  verificationUrl: string;
  qrData: string;
  nsqfBadge: string;
  status: 'active' | 'revoked' | 'expired';
  auditTrail: { action: string; actor: string; timestamp: string }[];
}

export interface PassportVerificationResult {
  isValid: boolean;
  passportId: string;
  studentName: string;
  program: string;
  nsqfLevel: number;
  overallScore: number;
  verifiedAt: string;
  reason?: string;
}

// ── PassportService Class ─────────────────────────────────────────────────────

export class PassportService {
  private readonly PASSPORT_VERSION    = '1.0';
  private readonly VALIDITY_YEARS      = 3;
  private readonly BASE_VERIFICATION_URL = 'https://skillsense.ai/verify';
  private readonly HASH_SECRET = process.env.PASSPORT_SECRET ?? 'skillsense-default-secret';

  // ── 1. Generate Full Skill Passport (in-memory / API response) ─────────────
  async generatePassport(input: PassportInput): Promise<SkillPassport> {
    const passportId = this.generatePassportId(input.studentId);
    const issuedAt   = input.issuedAt ?? new Date().toISOString();
    const expiresAt  = this.computeExpiry(issuedAt);

    const credentialHash = this.generateCredentialHash({
      passportId,
      studentId:    input.studentId,
      overallScore: input.overallScore,
      nsqfLevel:    input.nsqfLevel,
      issuedAt,
    });

    const verificationUrl = `${this.BASE_VERIFICATION_URL}/${passportId}`;
    const qrData = JSON.stringify({
      id:        passportId,
      name:      input.studentName,
      program:   input.program,
      nsqfLevel: input.nsqfLevel,
      score:     input.overallScore,
      hash:      credentialHash.slice(0, 16),
      url:       verificationUrl,
    });

    return {
      ...input,
      passportId,
      version: this.PASSPORT_VERSION,
      issuedAt,
      expiresAt,
      credentialHash,
      verificationUrl,
      qrData,
      nsqfBadge: this.getNSQFBadge(input.nsqfLevel),
      status: 'active',
      auditTrail: [{ action: 'PASSPORT_ISSUED', actor: 'system', timestamp: issuedAt }],
    };
  }

  // ── 2. Generate & Persist Passport Hash to MongoDB ─────────────────────────
  async generatePassportHashForStudent(studentId: string): Promise<string> {
    try {
      const student = await Student.findById(studentId).populate('skills.skillId');
      if (!student) throw new Error('Student not found');

      const skillString = student.skills
        .map((s: any) => `${(s.skillId as any).name}:${s.score}`)
        .sort()
        .join('|');

      const dataToHash = `${studentId}:${skillString}:${student.updatedAt.getTime()}`;
      const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

      (student as any).passportHash = hash;
      await student.save();

      logger.info(`Passport hash generated for student ${studentId}`);
      return hash;
    } catch (err) {
      logger.error('Passport hash generation error:', err);
      return `ERROR-PASSPORT-${studentId}`;
    }
  }

  // ── 3. Verify Passport Object (hash + expiry + revocation check) ───────────
  async verifyPassport(
    passportId: string,
    providedHash: string,
    passport: SkillPassport
  ): Promise<PassportVerificationResult> {
    const now    = new Date();
    const expiry = new Date(passport.expiresAt);

    if (passport.status === 'revoked') {
      return this.buildVerifyResult(false, passportId, passport, now, 'Passport has been revoked.');
    }

    if (now > expiry) {
      return this.buildVerifyResult(
        false, passportId, passport, now,
        `Passport expired on ${expiry.toLocaleDateString('en-IN')}.`
      );
    }

    // Timing-safe hash comparison
    try {
      const valid = crypto.timingSafeEqual(
        Buffer.from(passport.credentialHash, 'hex'),
        Buffer.from(providedHash, 'hex')
      );
      return this.buildVerifyResult(
        valid, passportId, passport, now,
        valid ? undefined : 'Hash mismatch — credential may have been tampered.'
      );
    } catch {
      return this.buildVerifyResult(false, passportId, passport, now, 'Invalid hash format.');
    }
  }

  // ── 4. Verify Passport from MongoDB (by hash string) ──────────────────────
  async verifyPassportByDBHash(hash: string): Promise<boolean> {
    try {
      const student = await Student.findOne({ passportHash: hash });
      return !!student;
    } catch (err) {
      logger.error('DB passport verification error:', err);
      return false;
    }
  }

  // ── 5. Update Skills on Existing Passport ─────────────────────────────────
  updateSkills(
    passport: SkillPassport,
    updatedSkills: SkillEntry[],
    updatedBy: string
  ): SkillPassport {
    const newScore = Math.round(
      updatedSkills.reduce((sum, s) => sum + s.score, 0) / updatedSkills.length
    );

    return {
      ...passport,
      skills:       updatedSkills,
      overallScore: newScore,
      credentialHash: this.generateCredentialHash({
        passportId:   passport.passportId,
        studentId:    passport.studentId,
        overallScore: newScore,
        nsqfLevel:    passport.nsqfLevel,
        issuedAt:     passport.issuedAt,
      }),
      auditTrail: [
        ...passport.auditTrail,
        { action: 'SKILLS_UPDATED', actor: updatedBy, timestamp: new Date().toISOString() },
      ],
    };
  }

  // ── 6. Revoke Passport ─────────────────────────────────────────────────────
  revokePassport(
    passport: SkillPassport,
    revokedBy: string,
    reason: string
  ): SkillPassport {
    return {
      ...passport,
      status: 'revoked',
      auditTrail: [
        ...passport.auditTrail,
        {
          action:    `PASSPORT_REVOKED: ${reason}`,
          actor:     revokedBy,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  // ── 7. Get Passport Summary (for QR scan / public API) ────────────────────
  getSummary(passport: SkillPassport) {
    return {
      passportId:       passport.passportId,
      studentName:      passport.studentName,
      program:          passport.program,
      institutionName:  passport.institutionName,
      state:            passport.state,
      nsqfLevel:        passport.nsqfLevel,
      nsqfBadge:        passport.nsqfBadge,
      overallScore:     passport.overallScore,
      topSkills: [...passport.skills]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((s) => ({ skill: s.skill, score: s.score })),
      placementStatus:  passport.placementStatus,
      company:          passport.company,
      role:             passport.role,
      status:           passport.status,
      issuedAt:         passport.issuedAt,
      expiresAt:        passport.expiresAt,
      verificationUrl:  passport.verificationUrl,
    };
  }

  // ── Private Helpers ───────────────────────────────────────────────────────

  private generatePassportId(studentId: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    // Use cryptographically secure random bytes instead of Math.random()
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `SKP-${studentId.slice(-4).toUpperCase()}-${timestamp}-${randomPart}`;
  }

  private generateCredentialHash(payload: Record<string, unknown>): string {
    const data = JSON.stringify({ ...payload, secret: this.HASH_SECRET });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private computeExpiry(issuedAt: string): string {
    const issued = new Date(issuedAt);
    issued.setFullYear(issued.getFullYear() + this.VALIDITY_YEARS);
    return issued.toISOString();
  }

  private getNSQFBadge(nsqfLevel: number): string {
    const badges: Record<number, string> = {
      1: 'NSQF-1: Entry Level',
      2: 'NSQF-2: Semi-Skilled',
      3: 'NSQF-3: Skilled',
      4: 'NSQF-4: Advanced Skilled',
      5: 'NSQF-5: Technical/Supervisory',
      6: 'NSQF-6: Managerial',
      7: 'NSQF-7: Senior Managerial',
      8: 'NSQF-8: Expert/Research',
    };
    return badges[nsqfLevel] ?? `NSQF Level ${nsqfLevel}`;
  }

  private buildVerifyResult(
    isValid: boolean,
    passportId: string,
    passport: SkillPassport,
    now: Date,
    reason?: string
  ): PassportVerificationResult {
    return {
      isValid,
      passportId,
      studentName:  passport.studentName,
      program:      passport.program,
      nsqfLevel:    passport.nsqfLevel,
      overallScore: passport.overallScore,
      verifiedAt:   now.toISOString(),
      reason,
    };
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const passportService = new PassportService();
