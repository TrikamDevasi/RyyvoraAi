import { Router, Request, Response } from 'express';
import passport from 'passport';
import {
  register, login, refreshTokens, logout, getMe,
  getPublicStats, forgotPassword, verifyResetToken,
  resetPassword, verifyEmail, resendVerification
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
router.post('/logout', protect, logout);
router.get('/stats', getPublicStats);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/reset-password/:token', verifyResetToken);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
export { refreshTokens };

// ── Google OAuth ───────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

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
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

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
