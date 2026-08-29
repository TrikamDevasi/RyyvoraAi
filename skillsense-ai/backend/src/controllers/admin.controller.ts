import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import User from '../models/User.model';
import Institution from '../models/Institution.model';
import Student from '../models/Student.model';
import Assessment from '../models/Assessment.model';
import { parsePagination, buildPaginatedResponse, buildApiResponse } from '../utils/pagination.utils';
import { fairnessService } from '../services/fairness.service';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'employer', 'institute', 'industry', 'government', 'admin']),
});

const updateUserSchema = z.object({
  role: z.enum(['student', 'employer', 'institute', 'industry', 'government', 'admin']).optional(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
});

const createInstituteSchema = z.object({
  name: z.string().min(2, 'Institution name is required'),
  code: z.string().optional(),
  type: z.enum(['ITI', 'Polytechnic', 'PMKK', 'University', 'Private']),
  state: z.string().min(2, 'State is required'),
  district: z.string().optional(),
  programs: z.array(z.string()).default([]),
  nsqfAffiliation: z.boolean().default(true),
  isVerified: z.boolean().default(false),
});

// ────── USERS ──────

export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).select('-password -refreshToken').sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    res.status(200).json(buildPaginatedResponse(users, total, page, limit, 'Users retrieved'));
  } catch (err) { next(err); }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = createUserSchema.parse(req.body);
    const user = await User.create(body);
    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.refreshToken;
    res.status(201).json(buildApiResponse(userObj, 'User created'));
  } catch (err) { next(err); }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = updateUserSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, body, { new: true }).select('-password -refreshToken');
    if (!user) { res.status(404).json(buildApiResponse(null, 'User not found', false)); return; }
    res.status(200).json(buildApiResponse(user, 'User updated'));
  } catch (err) { next(err); }
};

export const softDeleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false, isDeleted: true }, { new: true }).select('-password -refreshToken');
    if (!user) { res.status(404).json(buildApiResponse(null, 'User not found', false)); return; }
    res.status(200).json(buildApiResponse(user, 'User deactivated'));
  } catch (err) { next(err); }
};

// ────── INSTITUTES ──────

export const listInstitutes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const [institutions, total] = await Promise.all([
      Institution.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Institution.countDocuments(),
    ]);
    res.status(200).json(buildPaginatedResponse(institutions, total, page, limit, 'Institutions retrieved'));
  } catch (err) { next(err); }
};

export const createInstitute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = createInstituteSchema.parse(req.body);
    const institution = await Institution.create(body);
    res.status(201).json(buildApiResponse(institution, 'Institution created'));
  } catch (err) { next(err); }
};

export const verifyInstitute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!institution) { res.status(404).json(buildApiResponse(null, 'Institution not found', false)); return; }
    res.status(200).json(buildApiResponse(institution, 'Institution verified'));
  } catch (err) { next(err); }
};

// ────── SYSTEM REPORTS ──────

export const getSystemReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [userCount, studentCount, institutionCount, assessmentCount] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      Student.countDocuments(),
      Institution.countDocuments(),
      Assessment.countDocuments(),
    ]);

    const usersByRole = await User.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const placementDist = await Student.aggregate([
      { $group: { _id: '$placementStatus', count: { $sum: 1 } } },
    ]);

    res.status(200).json(buildApiResponse({
      counts: { users: userCount, students: studentCount, institutions: institutionCount, assessments: assessmentCount },
      usersByRole,
      placementDistribution: placementDist,
    }, 'System reports retrieved'));
  } catch (err) { next(err); }
};

// ────── FAIRNESS DASHBOARD ──────

export const getFairnessDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const students = await Student.find().limit(150).lean();
    const formatted = students.map((s: any) => ({
      id: String(s._id),
      gender: s.gender || 'male',
      region: (s.state === 'Delhi' || s.state === 'Punjab') ? 'north' : (s.state === 'Karnataka' || s.state === 'Tamil Nadu') ? 'south' : 'west',
      nsqfLevel: s.nsqfLevel || 4,
      overallScore: s.overallScore || 68,
      placementStatus: s.placementStatus || 'seeking',
      salary: s.salary || 320000,
    }));

    const metrics = fairnessService.computeFairnessMetrics(formatted as any, 'Current Audit Period');
    res.status(200).json(buildApiResponse(metrics, 'Fairness dashboard data retrieved'));
  } catch (err) { next(err); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalStudents, totalInstitutes, totalAdmins, recentUsers] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'student', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'institute', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'admin', isDeleted: { $ne: true } }),
      User.find({ isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role createdAt lastLogin'),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isDeleted: { $ne: true }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstitutes,
        totalAdmins,
        newThisMonth,
        recentUsers,
      }
    });
  } catch (err) {
    next(err);
  }
};

export const hardDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User permanently deleted' });
  } catch (err) {
    next(err);
  }
};
