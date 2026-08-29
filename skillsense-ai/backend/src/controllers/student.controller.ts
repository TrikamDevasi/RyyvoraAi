import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Student, { IStudent } from '../models/Student.model';
import Assessment from '../models/Assessment.model';
import { aiService } from '../services/ai.service';
import { buildApiResponse, parsePagination, buildPaginatedResponse } from '../utils/pagination.utils';

export const listStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.state) filter.state = req.query.state;
    if (req.query.program) filter.program = req.query.program;
    if (req.query.placementStatus) filter.placementStatus = req.query.placementStatus;
    if (req.query.institutionId) filter.institutionId = req.query.institutionId;

    const [students, total] = await Promise.all([
      Student.find(filter).skip(skip).limit(limit).select('-skills.history').populate('userId', 'name email avatar'),
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
  placementStatus: z.enum(['seeking', 'placed', 'not_seeking']).optional(),
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
      const created = await Student.create({
        userId: user._id,
        enrollmentNumber: `SKP-${user._id.toString().slice(-6).toUpperCase()}`,
        program: 'Computer Science & Engineering',
        nsqfLevel: 4,
        state: 'Karnataka',
        gender: 'male',
        placementStatus: 'seeking',
        overallScore: 78,
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
    let student: any = await Student.findById(req.params.id).select('passportHash overallScore nsqfLevel program');
    if (!student) {
      student = await Student.findOne({ userId: req.params.id }).select('passportHash overallScore nsqfLevel program');
    }
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse({ passportHash: student.passportHash, student }, 'Passport retrieved'));
  } catch (err) { next(err); }
};

export const submitAssessment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skillId, responses, score, adaptiveLevel } = req.body;
    let targetStudentId = req.params.id;

    let student: any = await Student.findById(targetStudentId);
    if (!student) {
      student = await Student.findOne({ userId: targetStudentId });
    }

    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student record not found', false));
      return;
    }

    // Create assessment record
    const assessment = await Assessment.create({
      studentId: student._id,
      skillId,
      responses,
      score,
      adaptiveLevel: adaptiveLevel ?? 1,
    });

    const skillScores = await aiService.extractSkills(responses ?? []);

    const skillIndex = student.skills.findIndex(
      (s: any) => String(s.skillId) === String(skillId)
    );
    if (skillIndex >= 0) {
      student.skills[skillIndex].score = score;
      student.skills[skillIndex].lastAssessed = new Date();
      student.skills[skillIndex].history.push({ score, date: new Date() });
    } else if (skillId) {
      student.skills.push({ skillId, score, lastAssessed: new Date(), history: [{ score, date: new Date() }] });
    }
    
    if (student.skills.length > 0) {
      student.overallScore = Math.round(
        student.skills.reduce((sum: number, s: any) => sum + s.score, 0) / student.skills.length
      );
    }

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
      program: student.program || 'Software Engineering',
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
