import jwt from 'jsonwebtoken';
import { UserRole } from '../types';
import env from '../config/env';

export interface TokenPayload {
  id: string;
  role: UserRole | string;
  email?: string;
  purpose?: string;
}

export const signToken = (
  payload: TokenPayload,
  expiresIn: string = env.JWT_EXPIRES_IN
): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = <T = TokenPayload>(token: string): T => {
  return jwt.verify(token, env.JWT_SECRET) as T;
};

// Aliases for compatibility
export const signAccessToken = (userId: string, role: UserRole | string): string => {
  return signToken({ id: userId, role }, env.JWT_EXPIRES_IN);
};

export const signRefreshToken = (userId: string): string => {
  return signToken({ id: userId, role: 'refresh' }, '30d');
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return verifyToken<TokenPayload>(token);
};
