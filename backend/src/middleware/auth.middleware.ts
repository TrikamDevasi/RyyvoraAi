import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User.model';
import Student from '../models/Student.model';
import { verifyToken, TokenPayload } from '../utils/jwt.utils';
import { UserRole } from '../types';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.ryyvora_token || req.cookies?.skillsense_token) {
      token = req.cookies.ryyvora_token || req.cookies.skillsense_token;
    }

    if (!token || token === 'null' || token === 'undefined') {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized. Token missing.',
      });
      return;
    }

    const decoded = verifyToken<TokenPayload>(token);
    const id = decoded.id;
    const user = await User.findById(id);

    if (!user) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'User no longer exists',
      });
      return;
    }

    if (!user.isActive || user.isDeleted) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'User account is suspended or deleted',
      });
      return;
    }

    req.user = user;
    next();
  } catch (_err) {
    res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid or expired token',
    });
  }
};

export const optionalProtect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.skillsense_token) {
      token = req.cookies.skillsense_token;
    }
    if (token && token !== 'null' && token !== 'undefined') {
      const decoded = verifyToken<TokenPayload>(token);
      const user = await User.findById(decoded.id);
      if (user && user.isActive && !user.isDeleted) {
        req.user = user;
      }
    }
  } catch {
    // Proceed as guest
  }
  next();
};

export const requireRole = (...roles: (UserRole | string)[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        data: null,
        message: `Forbidden. Role '${userRole || 'anonymous'}' is not authorized to access this resource.`,
      });
      return;
    }
    next();
  };
};

export const authorize = requireRole;

/**
 * Ensures the requesting student can only access/modify their own student profile or analytics,
 * while allowing admin and government roles full access.
 * Checks req.params.id, req.params.studentId, or req.body.studentId.
 */
export const requireStudentOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, data: null, message: 'Not authorized' });
    return;
  }

  // Elevated roles bypass ownership check
  if (['admin', 'government'].includes(user.role)) {
    return next();
  }

  const requestedId = req.params.id || req.params.studentId || req.body?.studentId;
  if (!requestedId) {
    return next();
  }

  // Check if requestedId is the User's _id
  if (String(user._id) === String(requestedId)) {
    return next();
  }

  const student = await Student.findById(requestedId);
  if (!student) {
    // Also check if student exists with userId == requestedId
    const studentByUser = await Student.findOne({ userId: requestedId });
    if (studentByUser && String(studentByUser.userId) === String(user._id)) {
      return next();
    }
    res.status(404).json({ success: false, data: null, message: 'Student record not found' });
    return;
  }

  if (String(student.userId) !== String(user._id)) {
    res.status(403).json({
      success: false,
      data: null,
      message: 'Forbidden. You do not have permission to access or modify another student\'s record or analytics.',
    });
    return;
  }

  next();
};

/**
 * Ensures institute users can only access their own institution's resources,
 * while allowing admin full access.
 */
export const requireInstituteAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, data: null, message: 'Not authorized' });
    return;
  }

  if (user.role === 'admin') {
    return next();
  }

  const requestedInstitutionId = req.params.id || req.params.institutionId;
  const userInstId = (user as unknown as { institutionId?: string }).institutionId ? String((user as unknown as { institutionId?: string }).institutionId) : null;

  if (user.role === 'institute') {
    if (requestedInstitutionId === String(user._id) || (userInstId && userInstId === requestedInstitutionId)) {
      return next();
    }
  }

  res.status(403).json({
    success: false,
    data: null,
    message: 'Forbidden. You do not have permission to access another institution\'s data.',
  });
};
