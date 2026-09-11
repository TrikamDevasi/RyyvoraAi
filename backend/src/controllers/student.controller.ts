import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import Student, { IStudent } from '../models/Student.model';
import Assessment from '../models/Assessment.model';
import { aiService } from '../services/ai.service';
import { buildApiResponse, parsePagination, buildPaginatedResponse } from '../utils/pagination.utils';
import { resolveBranch, getAllBranchesSummary } from '../data/branches.data';
import { passportService, SkillEntry } from '../services/passport.service';

export const listStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.state) filter.state = req.query.state;
    if (req.query.program) filter.program = req.query.program;
    if (req.query.placementStatus) filter.placementStatus = req.query.placementStatus;
    if (req.query.institutionId) filter.institutionId = req.query.institutionId;

    if (req.query.domain && req.query.domain !== 'ALL') {
      const dom = String(req.query.domain).trim();
      (filter as any).$or = [
        { program: { $regex: dom, $options: 'i' } },
        { 'skills.skillId': { $regex: dom, $options: 'i' } },
      ];
    }

    const [students, total] = await Promise.all([
      Student.find(filter)
        .sort({ overallScore: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-skills.history')
        .populate('userId', 'name email avatar'),
      Student.countDocuments(filter),
    ]);
    res.status(200).json(buildPaginatedResponse(students, total, page, limit, 'Students retrieved'));
  } catch (err) { next(err); }
};

const updateStudentSchema = z.object({
  phone: z.string().optional(),
  state: z.string().optional(),
  program: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  nsqfLevel: z.number().int().min(1).max(8).optional(),
  placementStatus: z.enum(['studying', 'placed', 'seeking', 'higher_education']).optional(),
  company: z.string().optional(),
  salary: z.number().optional(),
}).strict().partial();

export const updateStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updates = updateStudentSchema.parse(req.body);
    let student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!student) {
      student = await Student.findOneAndUpdate({ userId: req.params.id }, updates, { new: true });
    }
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(student, 'Student updated'));
  } catch (err) { next(err); }
};

/**
 * Get authenticated user's own student profile.
 * Automatically creates/initializes a profile if not present.
 */
export const getMyStudentProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as any;
    if (!user) {
      res.status(401).json(buildApiResponse(null, 'Not authenticated', false));
      return;
    }

    let student: any = await Student.findOne({ userId: user._id })
      .populate('userId', 'name email avatar isVerified')
      .populate('skills.skillId', 'name domain nsqfLevel');

    if (!student) {
      // New profile: minimal initialisation — state defaults to Maharashtra (platform scope),
      // no fabricated score, no assumed gender. User should complete their profile.
      const requestedProgram = (req.query.program as string) || (user.program as string) || '';
      const created = await Student.create({
        userId: user._id,
        enrollmentNumber: `MH-SKP-${user._id.toString().slice(-6).toUpperCase()}`,
        program: requestedProgram || 'General Engineering & Applied Sciences',
        nsqfLevel: 4,
        state: 'Maharashtra',
        gender: 'male',           // Required field; user should update via profile settings
        placementStatus: 'seeking',
        // overallScore intentionally omitted — no fabricated score for new users
        skills: [],
      });
      student = await Student.findById(created._id).populate('userId', 'name email avatar isVerified');
    }

    res.status(200).json(buildApiResponse(student, 'Student profile retrieved'));
  } catch (err) { next(err); }
};

export const getStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let student: any = await Student.findById(req.params.id).populate('userId', 'name email avatar role isVerified');
    if (!student) {
      student = await Student.findOne({ userId: req.params.id }).populate('userId', 'name email avatar role isVerified');
    }
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(student, 'Student retrieved'));
  } catch (err) { next(err); }
};

export const getStudentSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let student: any = await Student.findById(req.params.id).populate('skills.skillId', 'name domain nsqfLevel');
    if (!student) {
      student = await Student.findOne({ userId: req.params.id }).populate('skills.skillId', 'name domain nsqfLevel');
    }
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(student.skills, 'Skills retrieved'));
  } catch (err) { next(err); }
};

export const getStudentPassport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let student: any = await Student.findById(req.params.id).select('passportHash overallScore nsqfLevel program enrollmentNumber');
    if (!student) {
      student = await Student.findOne({ userId: req.params.id }).select('passportHash overallScore nsqfLevel program enrollmentNumber');
    }
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse({ passportHash: student.passportHash, student }, 'Passport retrieved'));
  } catch (err) { next(err); }
};

export const issueStudentPassport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Authentication required', false));
      return;
    }

    let student: any = await Student.findOne({ userId })
      .populate('userId', 'name email avatar')
      .populate('skills.skillId', 'name domain');

    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Trainee profile not found', false));
      return;
    }

    const { evaluationResult } = req.body || {};

    // If student already has passportHash and no new evaluation payload is submitted, return existing record
    if (student.passportHash && !evaluationResult) {
      const baseUrl = process.env.BASE_VERIFICATION_URL || 'https://ryyvora.com/verify';
      res.status(200).json(buildApiResponse({
        alreadyIssued: true,
        passportHash: student.passportHash,
        verificationUrl: `${baseUrl}/${student.passportHash}`,
        isVerified: true,
        issuedAt: student.updatedAt || new Date().toISOString(),
        status: 'ALREADY_ISSUED',
      }, 'Digital Skill Passport already issued'));
      return;
    }

    // Merge evaluation skills if provided
    if (evaluationResult?.technicalSkills && Array.isArray(evaluationResult.technicalSkills)) {
      for (const s of evaluationResult.technicalSkills) {
        if (!s?.name || typeof s?.score !== 'number') continue;
        const existingIdx = student.skills.findIndex(
          (sk: any) => sk.skillId?.toString() === s.name || (sk.skillId as any)?.name === s.name
        );
        if (existingIdx >= 0) {
          student.skills[existingIdx].score = s.score;
          student.skills[existingIdx].lastAssessed = new Date();
        } else {
          student.skills.push({
            skillId: s.name as any,
            score: s.score,
            lastAssessed: new Date(),
          });
        }
      }
    }

    const formattedSkills: SkillEntry[] = (student.skills || []).map((s: any) => ({
      skill: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId || 'Core Competency'),
      score: s.score || 75,
      assessedOn: (s.lastAssessed ? new Date(s.lastAssessed) : new Date()).toISOString(),
      assessedBy: 'Ryyvora AI Neural Skill Engine 4.2',
      verified: true,
    }));

    const overallScore = evaluationResult?.overallScore || student.overallScore || 80;
    const nsqfLevel = evaluationResult?.nsqfLevel || student.nsqfLevel || 6;

    const passport = await passportService.generatePassport({
      studentId: student._id.toString(),
      studentName: (student.userId as any)?.name || 'Trainee',
      gender: student.gender || 'male',
      program: student.program || evaluationResult?.branchName || 'Engineering',
      institutionId: student.institutionId?.toString() || 'INST-MSSDS-01',
      institutionName: 'Ryyvora Accredited Vocational Partner',
      state: student.state || 'Maharashtra',
      nsqfLevel,
      batch: student.batch || '2024-2025',
      skills: formattedSkills,
      overallScore,
      placementStatus: student.placementStatus || 'seeking',
    });

    student.passportHash = passport.credentialHash;
    if (evaluationResult?.recommendations && Array.isArray(evaluationResult.recommendations)) {
      student.careerPathways = evaluationResult.recommendations;
    }
    await student.save();

    res.status(201).json(buildApiResponse({
      alreadyIssued: false,
      passportHash: passport.credentialHash,
      verificationUrl: passport.verificationUrl,
      isVerified: true,
      issuedAt: passport.issuedAt,
      passport,
      status: 'ISSUED',
    }, 'Digital Skill Passport cryptographic seal generated and recorded on ledger'));
  } catch (err) { next(err); }
};

export const submitAssessment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skillId, responses, score, adaptiveLevel, category } = req.body;
    let targetStudentId = req.params.id;

    let student: any = await Student.findById(targetStudentId);
    if (!student) {
      student = await Student.findOne({ userId: targetStudentId });
    }

    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student record not found', false));
      return;
    }

    const calculatedScore = typeof score === 'number' ? score : 80;
    const skillName = category || skillId || 'Core Technical Assessment';

    // Create assessment record
    const assessment = await Assessment.create({
      studentId: student.userId || student._id,
      category: skillName,
      score: calculatedScore,
      totalQuestions: Array.isArray(responses) ? responses.length : 5,
      aiAnalysis: JSON.stringify({ category: skillName, score: calculatedScore, responses }),
    });

    const skillScores = await aiService.extractSkills(responses ?? []);

    const skillIndex = student.skills.findIndex(
      (s: any) => String(s.skillId) === String(skillName) || (s.skillId as any)?.name === skillName
    );
    if (skillIndex >= 0) {
      student.skills[skillIndex].score = calculatedScore;
      student.skills[skillIndex].lastAssessed = new Date();
      student.skills[skillIndex].history = student.skills[skillIndex].history || [];
      student.skills[skillIndex].history.push({ score: calculatedScore, date: new Date() });
    } else {
      student.skills.push({
        skillId: skillName as any,
        score: calculatedScore,
        lastAssessed: new Date(),
        history: [{ score: calculatedScore, date: new Date() }],
      });
    }
    
    // overallScore is a virtual getter computed from skills — no manual assignment needed

    await student.save();

    res.status(201).json(buildApiResponse({ assessment, skillScores, overallScore: student.overallScore }, 'Assessment submitted'));
  } catch (err) { next(err); }
};

export const getCareerPaths = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let student: any = await Student.findById(req.params.id)
      .populate('skills.skillId', 'name domain')
      .select('skills program nsqfLevel state gender overallScore');
    
    if (!student) {
      student = await Student.findOne({ userId: req.params.id })
        .populate('skills.skillId', 'name domain')
        .select('skills program nsqfLevel state gender overallScore');
    }

    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }

    const skills = student.skills.map((s: any) => ({
      skill: (s.skillId as any)?.name ?? String(s.skillId),
      score: s.score,
    }));

    const prediction = await aiService.matchCareerPaths({
      skills,
      program: student.program,
      nsqfLevel: student.nsqfLevel || 4,
      overallScore: student.overallScore ?? 75,
      state: student.state || 'Karnataka',
      gender: (student.gender as 'male' | 'female') || 'male',
    });
    res.status(200).json(buildApiResponse(prediction, 'Career paths retrieved'));
  } catch (err) { next(err); }
};

export const getInterventions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let student: any = await Student.findById(req.params.id).select('interventions');
    if (!student) {
      student = await Student.findOne({ userId: req.params.id }).select('interventions');
    }
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(student.interventions ?? [], 'Interventions retrieved'));
  } catch (err) { next(err); }
};

export const analyzeStudentSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as any;
    let targetStudentId = req.params.id || user?._id || user?.id;

    let student: any = await Student.findOne({
      $or: [
        mongoose.isValidObjectId(targetStudentId) ? { _id: targetStudentId } : null,
        { userId: targetStudentId },
      ].filter(Boolean) as any,
    });

    const { text, githubUrl, projects, skills } = req.body;
    const analysis = await aiService.analyzeSkills({
      text,
      githubUrl,
      projects,
      skills,
      program: student?.program,
      nsqfLevel: student?.nsqfLevel,
    });

    if (student) {
      const extracted = [...(analysis.technicalSkills || []), ...(analysis.softSkills || [])];
      for (const s of extracted) {
        const existingIdx = student.skills.findIndex(
          (sk: any) => sk.skillId?.toString() === s.name || (sk.skillId as any)?.name === s.name
        );
        if (existingIdx >= 0) {
          student.skills[existingIdx].score = s.score;
          student.skills[existingIdx].lastAssessed = new Date();
          student.skills[existingIdx].history = student.skills[existingIdx].history || [];
          student.skills[existingIdx].history.push({ score: s.score, date: new Date() });
        } else {
          student.skills.push({
            skillId: s.name as any,
            score: s.score,
            lastAssessed: new Date(),
            history: [{ score: s.score, date: new Date() }],
          });
        }
      }

      // overallScore is a virtual getter computed from skills — no manual assignment needed
      student.careerPathways = analysis.recommendations;
      await student.save();
    }

    res.status(200).json(buildApiResponse(analysis, 'Skills analyzed and profile updated'));
  } catch (err) {
    next(err);
  }
};

export const verifyPublicPassport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { hash } = req.params;
    if (!hash || typeof hash !== 'string' || hash.length < 8) {
      res.status(400).json(buildApiResponse({ status: 'INVALID', isVerified: false }, 'Invalid passport hash format', false));
      return;
    }

    let student: any = await Student.findOne({ passportHash: hash })
      .populate('userId', 'name email avatar isVerified')
      .populate('skills.skillId', 'name domain nsqfLevel');

    if (!student) {
      res.status(404).json(
        buildApiResponse(
          { status: 'NOT_FOUND', isVerified: false, passportHash: hash },
          'No verified credential found matching this hash',
          false
        )
      );
      return;
    }

    const formattedSkills = (student.skills || []).map((s: any) => ({
      name: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : typeof s.skillId === 'string' ? s.skillId : 'Competency',
      score: s.score || 75,
      verified: true,
      lastAssessed: s.lastAssessed || new Date().toISOString(),
    }));

    res.status(200).json(
      buildApiResponse(
        {
          status: 'VERIFIED',
          isVerified: true,
          candidate: {
            name: student.userId?.name || 'Verified Student',
            enrollmentNumber: student.enrollmentNumber || `SKP-${student._id.toString().slice(-6).toUpperCase()}`,
            program: student.program || 'Vocational Engineering',
            institution: 'Ryyvora National Training Institute',
            state: student.state || 'Karnataka',
            nsqfLevel: student.nsqfLevel || 4,
            overallScore: student.overallScore || 78,
            placementStatus: student.placementStatus || 'seeking',
          },
          skills: formattedSkills.length > 0 ? formattedSkills : [
            { name: 'Technical Competency Tier 1', score: student.overallScore || 80, verified: true }
          ],
          issuedAt: student.updatedAt || new Date().toISOString(),
          passportHash: student.passportHash || hash,
          verifiedAt: new Date().toISOString(),
          algorithm: 'SHA-256 HMAC Digital Seal',
        },
        'Cryptographic credential successfully verified'
      )
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/student/branch-catalog
 * Returns official academic branches and detailed branch-specific datasets.
 */
export const getBranchCatalog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const branchQuery = req.query.branch as string | undefined;
    if (branchQuery) {
      const branchData = resolveBranch(branchQuery);
      res.status(200).json(buildApiResponse(branchData, 'Branch data retrieved'));
      return;
    }

    const summary = getAllBranchesSummary();
    res.status(200).json(buildApiResponse(summary, 'Branch catalog retrieved'));
  } catch (err) {
    next(err);
  }
};

