import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import User from '../models/User.model';
import logger from '../utils/logger';
import env from './env';
import crypto from 'crypto';

// ── JWT Strategy ──────────────────────────────────────────────────────────────
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const id = payload.id || payload.userId;
      const user = await User.findById(id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

// ── Google OAuth Strategy ─────────────────────────────────────────────────────
import Student from '../models/Student.model';

const ensureStudentProfile = async (userId: any) => {
  try {
    const existing = await Student.findOne({ userId });
    if (!existing) {
      await Student.create({
        userId,
        enrollmentNumber: `SKP-${userId.toString().slice(-6).toUpperCase()}`,
        program: 'Software Engineering & AI',
        nsqfLevel: 5,
        state: 'Maharashtra',
        gender: 'male',
        skills: [],
        overallScore: 78,
        placementStatus: 'studying',
        interventions: [],
      });
    }
  } catch (err) {
    logger.warn('Failed to ensure student profile for OAuth user:', err);
  }
};

// ── Google OAuth Strategy ─────────────────────────────────────────────────────
const isGoogleConfigured = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && !env.GOOGLE_CLIENT_ID.includes('your_');
if (isGoogleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        callbackURL: env.GOOGLE_CALLBACK_URL || `${env.FRONTEND_URL.replace(':3000', ':5000')}/api/v1/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await User.findOne({ email });
            }
            if (user) {
              user.googleId = profile.id;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              user = new User({
                googleId: profile.id,
                name: profile.displayName || 'Google User',
                email: email || `google_${profile.id}@users.noreply.google.com`,
                avatar: profile.photos?.[0]?.value,
                role: 'student',
                isVerified: true,
                authProvider: 'google',
                password: crypto.randomBytes(32).toString('hex'),
              });
              await user.save();
            }
          }

          if (user && user.role === 'student') {
            await ensureStudentProfile(user._id);
          }

          return done(null, user);
        } catch (err) {
          logger.error('Google OAuth error:', err);
          return done(err as Error, false);
        }
      }
    )
  );
} else {
  logger.warn('Google OAuth disabled — GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set');
}

// ── GitHub OAuth Strategy ─────────────────────────────────────────────────────
const isGitHubConfigured = env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && !env.GITHUB_CLIENT_ID.includes('your_');
if (isGitHubConfigured) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID!,
        clientSecret: env.GITHUB_CLIENT_SECRET!,
        callbackURL: env.GITHUB_CALLBACK_URL || `${env.FRONTEND_URL.replace(':3000', ':5000')}/api/v1/auth/github/callback`,
        scope: ['user:email'],
      },
      async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            const email = profile.emails?.[0]?.value || (profile.username ? `${profile.username}@users.noreply.github.com` : `github_${profile.id}@users.noreply.github.com`);
            user = await User.findOne({ email });
            const avatar = profile.photos?.[0]?.value || profile._json?.avatar_url;

            if (user) {
              user.githubId = profile.id;
              if (!user.avatar && avatar) {
                user.avatar = avatar;
              }
              await user.save();
            } else {
              user = new User({
                githubId: profile.id,
                name: profile.displayName || profile.username || 'GitHub User',
                email,
                avatar,
                role: 'student',
                isVerified: true,
                authProvider: 'github',
                password: crypto.randomBytes(32).toString('hex'),
              });
              await user.save();
            }
          }

          if (user && user.role === 'student') {
            await ensureStudentProfile(user._id);
          }

          return done(null, user);
        } catch (err) {
          logger.error('GitHub OAuth error:', err);
          return done(err as Error, false);
        }
      }
    )
  );
  logger.info('GitHub OAuth strategy initialized successfully ✓');
} else {
  logger.warn('GitHub OAuth disabled — GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not set or is placeholder');
}

export default passport;

