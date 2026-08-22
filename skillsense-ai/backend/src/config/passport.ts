// backend/src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import User from '../models/User.model';
import logger from '../utils/logger';

console.log('[Passport] GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID?.slice(0, 20));

// ── JWT Strategy ──────────────────────────────────────────────────────────────
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
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
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Try existing user by googleId
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            const email = profile.emails?.[0]?.value;
            // Link to existing account by email or create new
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              // Create new user
              user = new User({
                googleId: profile.id,
                name: profile.displayName || 'Google User',
                email,
                avatar: profile.photos?.[0]?.value,
                role: 'student',
                isVerified: true,
                authProvider: 'google',
                // password not required for OAuth users
                password: `oauth_${profile.id}_${Date.now()}`,
              });
              await user.save();
            }
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
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/github/callback',
        scope: ['user:email'],
      },
      async (_accessToken: string, _refreshToken: string, profile: { id: string; displayName: string; username?: string; emails?: { value: string }[]; photos?: { value: string }[] }, done: (err: Error | null, user?: Express.User | false) => void) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            const email = profile.emails?.[0]?.value;
            user = await User.findOne({ email });
            if (user) {
              user.githubId = profile.id;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              user = new User({
                githubId: profile.id,
                name: profile.displayName || profile.username || 'GitHub User',
                email,
                avatar: profile.photos?.[0]?.value,
                role: 'student',
                isVerified: true,
                authProvider: 'github',
                password: `oauth_${profile.id}_${Date.now()}`,
              });
              await user.save();
            }
          }

          return done(null, user);
        } catch (err) {
          logger.error('GitHub OAuth error:', err);
          return done(err as Error, false);
        }
      }
    )
  );
} else {
  logger.warn('GitHub OAuth disabled — GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not set');
}

export default passport;
