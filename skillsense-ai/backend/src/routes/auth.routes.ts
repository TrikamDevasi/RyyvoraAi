import { Router, Request, Response } from 'express';
import passport from 'passport';
import {
  register, login, refreshTokens, logout, getMe,
  getPublicStats, forgotPassword, verifyResetToken,
  resetPassword, verifyEmail, resendVerification,
  getPreferences, updatePreferences,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { IUser } from '../models/User.model';
import { signToken } from '../utils/jwt.utils';
import env from '../config/env';

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

// ── Local Auth ─────────────────────────────────────────────────────────────────
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
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
  if (!isGoogleConfigured()) {
    // If not configured in development, perform dev login
    (async () => {
      try {
        let user = await User.findOne({ email: 'google.dev@skillsense.demo' });
        if (!user) {
          user = await User.create({
            name: 'Google Verified User',
            email: 'google.dev@skillsense.demo',
            role: 'student',
            isVerified: true,
            authProvider: 'google',
            password: crypto.randomBytes(32).toString('hex'),
          });
        }
        let student = await Student.findOne({ userId: user._id });
        if (!student) {
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
        return res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}&user=${encoded}&provider=google`);
      } catch {
        return res.redirect(`${env.FRONTEND_URL}/auth?error=google_failed`);
      }
    })();
    return;
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/auth?error=google_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as IUser;
    const token = signToken({ id: String(user._id), role: user.role, email: user.email });
    const encoded = encodeUser(user);

    res.redirect(
      `${env.FRONTEND_URL}/auth/callback?token=${token}&user=${encoded}&provider=google`
    );
  }
);

// ── GitHub OAuth ───────────────────────────────────────────────────────────────
router.get('/github', (req: Request, res: Response, next) => {
  if (!isGitHubConfigured()) {
    // If GitHub OAuth credentials are not set in .env, seamlessly log in/create the GitHub developer user
    (async () => {
      try {
        let user = await User.findOne({ email: 'github.developer@skillsense.demo' });
        if (!user) {
          user = await User.create({
            name: 'GitHub Verified Developer',
            email: 'github.developer@skillsense.demo',
            avatar: 'https://avatars.githubusercontent.com/u/9919?v=4',
            role: 'student',
            isVerified: true,
            authProvider: 'github',
            password: crypto.randomBytes(32).toString('hex'),
          });
        }
        let student = await Student.findOne({ userId: user._id });
        if (!student) {
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
        return res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}&user=${encoded}&provider=github`);
      } catch {
        return res.redirect(`${env.FRONTEND_URL}/auth?error=github_failed`);
      }
    })();
    return;
  }
  passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
});

router.get('/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/auth?error=github_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as IUser;
    const token = signToken({ id: String(user._id), role: user.role, email: user.email });
    const encoded = encodeUser(user);

    res.redirect(
      `${env.FRONTEND_URL}/auth/callback?token=${token}&user=${encoded}&provider=github`
    );
  }
);


export default router;
