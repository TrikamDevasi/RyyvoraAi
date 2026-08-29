import assert from 'assert';
import { signToken, verifyToken } from '../src/utils/jwt.utils';
import bcrypt from 'bcryptjs';

export async function runAuthTests() {
  console.log('🧪 Running Authentication & JWT Tests...');

  // 1. Sign and verify valid JWT
  const userPayload = { id: 'usr_test_123', role: 'student', email: 'test@example.com' };
  const token = signToken(userPayload, '1h');
  assert(typeof token === 'string' && token.length > 20, 'JWT token should be a non-empty string');

  const decoded: any = verifyToken(token);
  assert.strictEqual(decoded.id, userPayload.id, 'Decoded token ID must match payload');
  assert.strictEqual(decoded.role, userPayload.role, 'Decoded token role must match payload');
  assert.strictEqual(decoded.email, userPayload.email, 'Decoded token email must match payload');
  console.log('  ✅ JWT sign & verify passed');

  // 2. Password hashing & comparison
  const rawPassword = 'SecurePassword123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  assert(hashedPassword !== rawPassword, 'Hashed password must not match plain text');

  const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
  assert.strictEqual(isMatch, true, 'Valid password must match hash');

  const isBadMatch = await bcrypt.compare('WrongPassword456!', hashedPassword);
  assert.strictEqual(isBadMatch, false, 'Invalid password must not match hash');
  console.log('  ✅ Password bcrypt hashing & verification passed');
}
