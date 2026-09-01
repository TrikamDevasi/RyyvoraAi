import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import Skill from '../models/Skill.model';
import Institution from '../models/Institution.model';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email.service';
import { signToken, verifyToken } from '../utils/jwt.utils';
import env from '../config/env';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'employer', 'institute', 'industry']).default('student'),
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

// Helper to set auth cookie
const setAuthCookie = (res: Response, token: string) => {
  res.cookie('skillsense_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        message: parsed.error.errors.map(e => e.message).join(', '),
      });
      return;
    }

    const { name, email, password, role } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        data: null,
        message: 'Email already registered. Please login instead.',
      });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: false,
      authProvider: 'local',
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    try {
      await sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (emailErr) {
      // Non-blocking email failure
    }

    const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        token,
      },
      message: 'Registration successful',
    });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({
        success: false,
        data: null,
        message: 'Email already registered',
      });
      return;
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        message: parsed.error.errors.map(e => e.message).join(', '),
      });
      return;
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
      });
      return;
    }

    if (user.authProvider !== 'local' || !user.password) {
      res.status(401).json({
        success: false,
        data: null,
        message: `This account uses ${user.authProvider} login. Please sign in with ${user.authProvider}.`,
      });
      return;
    }

    if (!user.isActive || user.isDeleted) {
      res.status(403).json({
        success: false,
        data: null,
        message: 'Your account has been suspended or deactivated. Please contact support.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
      });
      return;
    }
    
    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: { user },
      message: 'User fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    const preferences = user?.preferences || { navigationStyle: 'sidebar', theme: 'dark', sidebarCollapsed: false };
    res.status(200).json({
      success: true,
      data: { preferences },
      message: 'Preferences retrieved',
    });
  } catch (err) {
    next(err);
  }
};

const preferencesSchema = z.object({
  navigationStyle: z.enum(['sidebar', 'navbar']).optional(),
  theme: z.string().optional(),
  sidebarCollapsed: z.boolean().optional(),
});

export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = preferencesSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid preferences payload: ' + parsed.error.errors.map(e => e.message).join(', '),
      });
      return;
    }

    const userId = (req.user as any)?._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.preferences = {
      ...(user.preferences || {}),
      ...parsed.data,
    };
    await user.save();

    res.status(200).json({
      success: true,
      data: { preferences: user.preferences },
      message: 'Preferences updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Session active' });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('skillsense_token', { path: '/' });
  res.clearCookie('skillsense_role', { path: '/' });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getPublicStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalStudents, verifiedInstitutions] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'student', isDeleted: { $ne: true } }),
      Institution.countDocuments({ isVerified: true }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        partnersCount: verifiedInstitutions,
        coursesCount: await Skill.countDocuments(),
        accuracy: null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load public stats' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
    return;
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    res.status(404).json({ success: false, message: 'No account found with this email' });
    return;
  }

  const resetToken = signToken({ id: user._id.toString(), role: user.role, purpose: 'reset-password' }, '1h');

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  try {
    await sendPasswordResetEmail(user.email, resetToken, user.name);
  } catch (err) {
    // Continue
  }

  res.json({ success: true, message: 'Password reset link sent to your email' });
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    const decoded = verifyToken<any>(token);

    if (decoded.purpose !== 'reset-password') {
      res.status(400).json({ success: false, message: 'Invalid reset link purpose' });
      return;
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
      return;
    }

    res.json({ success: true, valid: true, email: user.email });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      return;
    }

    const token = req.params.token as string;
    const decoded = verifyToken<any>(token);

    if (decoded.purpose !== 'reset-password') {
      res.status(400).json({ success: false, message: 'Invalid reset link purpose' });
      return;
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
      return;
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now sign in.' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification link' 
      });
      return;
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully' 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ success: false, message: 'Email already verified' });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, verificationToken, user.name);

    res.status(200).json({ success: true, message: 'Verification email resent' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
