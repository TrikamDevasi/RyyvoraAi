import { Router, Request, Response } from 'express';
import passport from 'passport';
import {
  register, login, refreshTokens, logout, getMe,
  getPublicStats, forgotPassword, verifyResetToken,
  resetPassword, verifyEmail, resendVerification,
  getPreferences, updatePreferences,
} from '../controllers/auth.controller';
import {
  sendMobileOtp,
  verifyMobileOtp,
  completeMobileProfile,
  linkMobilePhone,
} from '../controllers/mobileAuth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter, otpSendLimiter, otpVerifyLimiter } from '../middleware/rateLimit.middleware';
import { IUser } from '../models/User.model';
import { signToken } from '../utils/jwt.utils';
import env from '../config/env';
import { validateTrustedOrigin } from '../config/origins';

const sanitizeOAuthRole = (candidate: string | null | undefined): string => {
  const safeRoles = ['student', 'employer', 'institute', 'industry'];
  const normalized = (candidate || '').toLowerCase().trim();
  return safeRoles.includes(normalized) ? normalized : 'student';
};

const router = Router();

const encodeUser = (user: IUser): string => {
  const payload = {
    id:           String(user._id),
    name:         user.name,
    email:        user.email,
    role:         user.role,
    avatar:       user.avatar ?? '',
    isVerified:   user.isVerified,
    isActive:     user.isActive,
    authProvider: user.authProvider,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// ── Mobile OTP Authentication ──────────────────────────────────────────────────
router.post('/mobile/send-otp', otpSendLimiter, sendMobileOtp);
router.post('/mobile/verify-otp', otpVerifyLimiter, verifyMobileOtp);
router.post('/mobile/complete-profile', authLimiter, completeMobileProfile);
router.post('/mobile/link-phone', protect, linkMobilePhone);

// ── Local Auth ─────────────────────────────────────────────────────────────────
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/demo-login', async (req: Request, res: Response) => {
  // Strict environment guard: demo-login is disabled in production and when DEMO_MODE is false
  if (env.NODE_ENV === 'production' || env.DEMO_MODE !== 'true') {
    res.status(404).json({
      success: false,
      message: 'Demo login is disabled in this environment. Please authenticate via standard sign in.',
    });
    return;
  }
  try {
    const role = (req.body.role || 'student').toLowerCase();
    // Demo accounts are seeded by src/scripts/seedLongitudinalOutcomes.ts (npm run seed:outcomes).
    // These email addresses MUST match the DEMO_USERS array in that script.
    const demoEmails: Record<string, string> = {
      student:    'trainee@ryyvora.demo',
      employer:   'employer@ryyvora.demo',
      institute:  'institute@ryyvora.demo',
      government: 'government@ryyvora.demo',
      admin:      'admin@ryyvora.demo',
      industry:   'industry@ryyvora.demo',
    };
    const demoNames: Record<string, string> = {
      student:    'Aarav Deshmukh',
      employer:   'Tata Consultancy Services (TCS)',
      institute:  'MSSDS Pune Regional Training Center',
      government: 'Maharashtra Skilling Directorate',
      industry:   'MSSDS Sector Skill Council Intelligence',
      admin:      'Ryyvora Platform Admin',
    };

    const email = demoEmails[role] || `${role}.demo@ryyvora.demo`;
    const name = demoNames[role] || `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        isVerified: true,
        authProvider: 'local',
        password: crypto.randomBytes(32).toString('hex'),
      });
    }

    if (role === 'institute') {
      if (!user.institutionId) {
        const Institution = (await import('../models/Institution.model')).default;
        // Try seeded institution first, then any available institution
        const inst = await Institution.findOne({ contactEmail: 'institute@ryyvora.demo' })
          || await Institution.findOne({});
        if (inst) {
          user.institutionId = inst._id as any;
          await user.save();
        }
      }
    }

    if (role === 'student') {
      let student = await Student.findOne({ userId: user._id });
      if (!student) {
        await Student.create({
          userId: user._id,
          enrollmentNumber: `SKP-${user._id.toString().slice(-6).toUpperCase()}`,
          program: 'Full-Stack Software Engineering',
          nsqfLevel: 5,
          state: 'Maharashtra',
          gender: 'male',
          skills: [
            { skillId: 'React.js & Next.js' as any, score: 88, lastAssessed: new Date() },
            { skillId: 'Node.js & Express' as any, score: 82, lastAssessed: new Date() },
            { skillId: 'PostgreSQL & Prisma' as any, score: 79, lastAssessed: new Date() },
            { skillId: 'Docker & Microservices' as any, score: 75, lastAssessed: new Date() },
            { skillId: 'TypeScript Systems' as any, score: 85, lastAssessed: new Date() },
          ],
          overallScore: 84,
          placementStatus: 'studying',
          passportHash: `SKP-${user._id.toString().slice(-8).toUpperCase()}-VERIFIED`,
        });
      }
    }

    const token = signToken({ id: String(user._id), role: user.role, email: user.email });

    res.cookie('ryyvora_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('ryyvora_role', user.role, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_role', user.role, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: `Logged in as demo ${role}`,
      data: {
        token,
        user: {
          id: String(user._id),
          _id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
          institutionId: user.institutionId ? String(user.institutionId) : undefined,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Demo login failed' });
  }
});
router.post('/switch-role', protect, async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as IUser;
    // Privilege Escalation Guard: Only administrators can switch stakeholder perspective
    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only platform administrators are authorized to switch stakeholder perspectives.',
      });
      return;
    }

    const rawRole = (req.body.role || '').toLowerCase();
    const validRoles = ['student', 'employer', 'institute', 'industry', 'government', 'admin'];
    if (!validRoles.includes(rawRole)) {
      res.status(400).json({ success: false, message: 'Invalid role specified' });
      return;
    }

    const userId = (req.user as any)?._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.role = rawRole as any;
    await user.save();

    const token = signToken({ id: String(user._id), role: user.role, email: user.email });

    res.cookie('ryyvora_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('ryyvora_role', user.role, {
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_role', user.role, {
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: `Role switched to ${user.role}`,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          institutionId: user.institutionId,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to switch role' });
  }
});
router.get('/me', protect, getMe);
router.get('/preferences', protect, getPreferences);
router.patch('/preferences', protect, updatePreferences);
router.put('/preferences', protect, updatePreferences);
router.post('/logout', protect, logout);
router.get('/stats', getPublicStats);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/reset-password/:token', verifyResetToken);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
import User from '../models/User.model';
import Student from '../models/Student.model';
import crypto from 'crypto';

export { refreshTokens };

const isGitHubConfigured = () => {
  const id = env.GITHUB_CLIENT_ID;
  const sec = env.GITHUB_CLIENT_SECRET;
  return Boolean(id && sec && !id.includes('your_') && id !== 'your_github_client_id_here');
};

const isGoogleConfigured = () => {
  const id = env.GOOGLE_CLIENT_ID;
  const sec = env.GOOGLE_CLIENT_SECRET;
  return Boolean(id && sec && !id.includes('your_'));
};

// ── Google OAuth ───────────────────────────────────────────────────────────────
router.get('/google', (req: Request, res: Response, next) => {
  const origin = validateTrustedOrigin((req.query.origin as string) || (req.headers.referer ? new URL(req.headers.referer).origin : null));
  const role = sanitizeOAuthRole(req.query.role as string);
  const statePayload = Buffer.from(JSON.stringify({ origin, role })).toString('base64');

  if (!isGoogleConfigured()) {
    if (env.NODE_ENV === 'production') {
      return res.redirect(`${origin}/auth?error=oauth_failed`);
    }
    // If not configured in development, perform dev login
    (async () => {
      try {
        let user = await User.findOne({ email: 'google.dev@skillsense.demo' });
        const userRole = role;
        if (!user) {
          user = await User.create({
            name: 'Google Verified User',
            email: 'google.dev@skillsense.demo',
            role: userRole,
            isVerified: true,
            authProvider: 'google',
            password: crypto.randomBytes(32).toString('hex'),
          });
        } else if (role && user.role !== userRole) {
          user.role = userRole as any;
          await user.save();
        }
        let student = await Student.findOne({ userId: user._id });
        if (!student && user.role === 'student') {
          await Student.create({
            userId: user._id,
            enrollmentNumber: `SKP-${user._id.toString().slice(-6).toUpperCase()}`,
            program: 'Full-Stack Software Engineering',
            nsqfLevel: 5,
            state: 'Maharashtra',
            gender: 'male',
            skills: [],
            overallScore: 82,
            placementStatus: 'studying',
          });
        }
        const token = signToken({ id: String(user._id), role: user.role, email: user.email });
        const encoded = encodeUser(user);
        return res.redirect(`${origin}/auth/callback?token=${token}&user=${encoded}&provider=google`);
      } catch {
        return res.redirect(`${origin}/auth?error=google_failed`);
      }
    })();
    return;
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false, state: statePayload })(req, res, next);
});

router.get('/google/callback',
  (req: Request, res: Response, next) => {
    let origin = validateTrustedOrigin(null);
    try {
      const stateRaw = (req.query.state as string) || '';
      if (stateRaw) {
        const decoded = JSON.parse(Buffer.from(stateRaw, 'base64').toString('utf-8'));
        if (decoded.origin) origin = validateTrustedOrigin(decoded.origin);
      }
    } catch {
      if ((req.query.state as string)?.startsWith('http')) origin = validateTrustedOrigin(req.query.state as string);
    }
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${origin}/auth?error=google_failed`,
    })(req, res, next);
  },
  async (req: Request, res: Response) => {
    let user = req.user as IUser;
    let origin = validateTrustedOrigin(null);
    let requestedRole = '';

    try {
      const stateRaw = (req.query.state as string) || '';
      if (stateRaw) {
        const decoded = JSON.parse(Buffer.from(stateRaw, 'base64').toString('utf-8'));
        if (decoded.origin) origin = validateTrustedOrigin(decoded.origin);
        if (decoded.role) requestedRole = sanitizeOAuthRole(decoded.role);
      }
    } catch {
      if ((req.query.state as string)?.startsWith('http')) origin = validateTrustedOrigin(req.query.state as string);
    }

    if (requestedRole) {
      const dbUser = await User.findById(user._id);
      // Privilege Escalation Prevention: Never overwrite admin or government roles from query params
      if (dbUser && !['admin', 'government'].includes(dbUser.role) && requestedRole !== dbUser.role) {
        dbUser.role = requestedRole as any;
        await dbUser.save();
        user = dbUser;
      }
    }

    const token = signToken({ id: String(user._id), role: user.role, email: user.email });
    const encoded = encodeUser(user);

    res.cookie('ryyvora_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('ryyvora_role', user.role, {
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_role', user.role, {
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect(
      `${origin}/auth/callback?token=${token}&user=${encoded}&provider=google`
    );
  }
);

// ── GitHub OAuth ───────────────────────────────────────────────────────────────
router.get('/github', (req: Request, res: Response, next) => {
  const origin = validateTrustedOrigin((req.query.origin as string) || (req.headers.referer ? new URL(req.headers.referer).origin : null));
  const role = sanitizeOAuthRole(req.query.role as string);
  const statePayload = Buffer.from(JSON.stringify({ origin, role })).toString('base64');

  if (!isGitHubConfigured()) {
    if (env.NODE_ENV === 'production') {
      return res.redirect(`${origin}/auth?error=oauth_failed`);
    }
    // If GitHub OAuth credentials are not set in development, seamlessly log in/create the GitHub developer user
    (async () => {
      try {
        let user = await User.findOne({ email: 'github.developer@skillsense.demo' });
        const userRole = role;
        if (!user) {
          user = await User.create({
            name: 'GitHub Verified Developer',
            email: 'github.developer@skillsense.demo',
            avatar: 'https://avatars.githubusercontent.com/u/9919?v=4',
            role: userRole,
            isVerified: true,
            authProvider: 'github',
            password: crypto.randomBytes(32).toString('hex'),
          });
        } else if (role && user.role !== userRole) {
          user.role = userRole as any;
          await user.save();
        }
        let student = await Student.findOne({ userId: user._id });
        if (!student && user.role === 'student') {
          await Student.create({
            userId: user._id,
            enrollmentNumber: `SKP-${user._id.toString().slice(-6).toUpperCase()}`,
            program: 'Cloud Architecture & Open Source',
            nsqfLevel: 5,
            state: 'Maharashtra',
            gender: 'male',
            skills: [],
            overallScore: 86,
            placementStatus: 'studying',
          });
        }
        const token = signToken({ id: String(user._id), role: user.role, email: user.email });
        const encoded = encodeUser(user);
        return res.redirect(`${origin}/auth/callback?token=${token}&user=${encoded}&provider=github`);
      } catch {
        return res.redirect(`${origin}/auth?error=github_failed`);
      }
    })();
    return;
  }
  passport.authenticate('github', { scope: ['user:email'], session: false, state: statePayload })(req, res, next);
});

router.get('/github/callback',
  (req: Request, res: Response, next) => {
    let origin = validateTrustedOrigin(null);
    try {
      const stateRaw = (req.query.state as string) || '';
      if (stateRaw) {
        const decoded = JSON.parse(Buffer.from(stateRaw, 'base64').toString('utf-8'));
        if (decoded.origin) origin = validateTrustedOrigin(decoded.origin);
      }
    } catch {
      if ((req.query.state as string)?.startsWith('http')) origin = validateTrustedOrigin(req.query.state as string);
    }
    passport.authenticate('github', {
      session: false,
      failureRedirect: `${origin}/auth?error=github_failed`,
    })(req, res, next);
  },
  async (req: Request, res: Response) => {
    let user = req.user as IUser;
    let origin = validateTrustedOrigin(null);
    let requestedRole = '';

    try {
      const stateRaw = (req.query.state as string) || '';
      if (stateRaw) {
        const decoded = JSON.parse(Buffer.from(stateRaw, 'base64').toString('utf-8'));
        if (decoded.origin) origin = validateTrustedOrigin(decoded.origin);
        if (decoded.role) requestedRole = sanitizeOAuthRole(decoded.role);
      }
    } catch {
      if ((req.query.state as string)?.startsWith('http')) origin = validateTrustedOrigin(req.query.state as string);
    }

    if (requestedRole) {
      const dbUser = await User.findById(user._id);
      // Privilege Escalation Prevention: Never overwrite admin or government roles from query params
      if (dbUser && !['admin', 'government'].includes(dbUser.role) && requestedRole !== dbUser.role) {
        dbUser.role = requestedRole as any;
        await dbUser.save();
        user = dbUser;
      }
    }

    const token = signToken({ id: String(user._id), role: user.role, email: user.email });
    const encoded = encodeUser(user);

    res.cookie('ryyvora_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('ryyvora_role', user.role, {
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('skillsense_role', user.role, {
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect(
      `${origin}/auth/callback?token=${token}&user=${encoded}&provider=github`
    );
  }
);


export default router;
