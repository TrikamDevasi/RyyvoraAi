import assert from 'assert';
import { requireRole } from '../src/middleware/auth.middleware';

export async function runAuthorizationTests() {
  console.log('🧪 Running Authorization & Guard Tests...');

  // 1. Role verification middleware
  const adminGuard = requireRole('admin');
  
  let rejectedStatus: number | null = null;
  let rejectedBody: any = null;
  let nextCalled = false;

  const mockRes = {
    status: (code: number) => {
      rejectedStatus = code;
      return {
        json: (body: any) => { rejectedBody = body; }
      };
    }
  } as any;

  // Student user trying to access admin route -> 403
  adminGuard(
    { user: { _id: 'u1', role: 'student' } } as any,
    mockRes,
    () => { nextCalled = true; }
  );

  assert.strictEqual(rejectedStatus, 403, 'Unauthorized role must be rejected with 403');
  assert.strictEqual(nextCalled, false, 'Next function must not be called on rejection');
  console.log('  ✅ Role guard rejects unauthorized roles (403)');

  // Admin user accessing admin route -> allowed
  nextCalled = false;
  rejectedStatus = null;
  adminGuard(
    { user: { _id: 'u2', role: 'admin' } } as any,
    mockRes,
    () => { nextCalled = true; }
  );

  assert.strictEqual(nextCalled, true, 'Admin user must pass role guard');
  assert.strictEqual(rejectedStatus, null, 'No error status should be set for authorized user');
  console.log('  ✅ Role guard accepts authorized roles');
}
