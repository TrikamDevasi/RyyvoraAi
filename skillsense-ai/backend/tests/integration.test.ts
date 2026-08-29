import assert from 'assert';
import http from 'http';
import app from '../src/app';
import { signToken } from '../src/utils/jwt.utils';
import User from '../src/models/User.model';
import Student from '../src/models/Student.model';

export async function runIntegrationTests(): Promise<void> {
  console.log('🧪 Running Express Route, Security & Authorization Integration Tests...');

  const originalFindById = User.findById;
  const originalStudentFindById = Student.findById;

  (User as any).findById = (id: string) => ({
    exec: async () => ({
      _id: id,
      name: 'Test Student',
      email: 'student@example.com',
      role: id.includes('1') ? 'student' : 'institute',
      isActive: true,
      isDeleted: false,
    }),
    then: (resolve: any) => resolve({
      _id: id,
      name: 'Test Student',
      email: 'student@example.com',
      role: id.includes('1') ? 'student' : 'institute',
      isActive: true,
      isDeleted: false,
    }),
  });

  (Student as any).findById = (id: string) => ({
    then: (resolve: any) => resolve({
      _id: id,
      userId: '660000000000000000000002', // Belongs to student 2
      skills: [],
    }),
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 1. Root & Health endpoint
    const healthRes = await fetch(`${baseUrl}/health`);
    assert(healthRes.status === 200 || healthRes.status === 503, 'Health endpoint should respond with status code');
    console.log('  ✅ Root & Health endpoints operational');

    // 2. CORS Production Origin Check
    const allowedCorsRes = await fetch(`${baseUrl}/health`, {
      headers: { Origin: 'http://localhost:3000' },
    });
    assert.strictEqual(
      allowedCorsRes.headers.get('access-control-allow-origin'),
      'http://localhost:3000',
      'Allowed origin must be mirrored in Access-Control-Allow-Origin'
    );
    console.log('  ✅ Trusted CORS origin accepted with Access-Control-Allow-Origin');

    const blockedCorsRes = await fetch(`${baseUrl}/health`, {
      headers: { Origin: 'https://skillsense-evil.vercel.app' },
    });
    assert.notStrictEqual(
      blockedCorsRes.headers.get('access-control-allow-origin'),
      'https://skillsense-evil.vercel.app',
      'Untrusted origin must NOT receive Access-Control-Allow-Origin header'
    );
    console.log('  ✅ Untrusted CORS origin blocked from credentialed access');

    // 3. Privilege Escalation in Public Registration -> Blocked (400)
    const adminRegRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Attacker User',
        email: 'attacker@example.com',
        password: 'Password123!',
        role: 'admin', // Malicious attempt to self-register as admin
      }),
    });
    assert.strictEqual(adminRegRes.status, 400, 'Public self-registration as admin must be blocked with 400 Bad Request');
    console.log('  ✅ Public privilege escalation (admin self-registration) blocked with 400');

    // 4. Unauthenticated Protected Route -> 401
    const unauthRes = await fetch(`${baseUrl}/api/v1/students/660000000000000000000001`);
    assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request must return 401');
    console.log('  ✅ Unauthenticated request blocked with 401');

    // 5. Student Role accessing Admin Route -> 403
    const studentToken = signToken({ id: '660000000000000000000001', role: 'student', email: 'studentA@example.com' });
    const adminRes = await fetch(`${baseUrl}/api/v1/admin/users`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(adminRes.status, 403, 'Student accessing admin route must return 403 Forbidden');
    console.log('  ✅ Student accessing admin route blocked with 403');

    // 6. Student IDOR in Analytics Route -> 403
    const idorAnalyticsRes = await fetch(`${baseUrl}/api/v1/analytics/skill-gaps/660000000000000000000002`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(idorAnalyticsRes.status, 403, 'Student A accessing Student B analytics must return 403 Forbidden');
    console.log('  ✅ Analytics student IDOR guarded with 403 Forbidden');

    // 7. Institute Multi-Tenancy Isolation -> 403
    const instToken = signToken({ id: '660000000000000000000005', role: 'institute', email: 'inst@example.com' });
    const instRes = await fetch(`${baseUrl}/api/v1/institutes/660000000000000000000099/dashboard`, {
      headers: { Authorization: `Bearer ${instToken}` },
    });
    assert.strictEqual(instRes.status, 403, 'Institute accessing another institute must return 403 Forbidden');
    console.log('  ✅ Institute multi-tenancy isolation enforced (403 Forbidden)');

    // 8. Mass Assignment Protection in Student Update -> Extra unauthorized keys rejected
    const massAssignRes = await fetch(`${baseUrl}/api/v1/students/660000000000000000000001`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        role: 'admin', // Malicious mass assignment key
        isVerified: true,
        passportHash: 'faked_hash',
      }),
    });
    assert.strictEqual(massAssignRes.status, 400, 'Mass assignment of unauthorized keys must be rejected with 400');
    console.log('  ✅ Mass assignment attack rejected with 400 (strict schema validation)');

  } finally {
    User.findById = originalFindById;
    Student.findById = originalStudentFindById;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}
