import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login, refreshTokens, logout, getMe, getPublicStats, forgotPassword, verifyResetToken, resetPassword, verifyEmail, resendVerification } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { IUser } from '../models/User.model';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Generate a long-lived JWT identical to the one produced by local login.
 * Uses JWT_SECRET + JWT_EXPIRE so auth.middleware.ts can verify it.
 */
const generateToken = (id: string, role: string): string =>
  jwt.sign(
    { id, role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRE || '7d') as jwt.SignOptions['expiresIn'] }
  );

/**
 * Encode safe user fields as a base64 JSON string so the frontend callback
 * page can hydrate the auth store without an extra /auth/me round-trip.
 */
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
export { refreshTokens }; // keep named export available if other modules import it

// ── Google OAuth ───────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${FRONTEND_URL}/auth?error=google_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as IUser;
    console.log('[Google OAuth] Callback success — email:', user.email, '| role:', user.role);

    const token   = generateToken(String(user._id), user.role);
    const encoded = encodeUser(user);

    // Matching requested redirect: http://localhost:3000/auth/callback?token=JWT_TOKEN_HERE
    // We also provide 'user' as base64 for immediate hydration
    res.redirect(
      `${FRONTEND_URL}/auth/callback?token=${token}&user=${encoded}&provider=google`
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
    failureRedirect: `${FRONTEND_URL}/auth?error=github_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as IUser;
    console.log('[GitHub OAuth] Callback success — email:', user.email, '| role:', user.role);

    const token   = generateToken(String(user._id), user.role);
    const encoded = encodeUser(user);

    res.redirect(
      `${FRONTEND_URL}/auth/callback?token=${token}&user=${encoded}&provider=github`
    );
  }
);

export default router;
