import mongoose from 'mongoose';
import {
  normalizePhoneNumber,
  validatePhoneNumber,
  maskPhoneNumber,
  hashOtp,
  verifyOtpHash,
  generateSecureOtp,
} from '../src/utils/phone.utils';
import User from '../src/models/User.model';
import MobileOtp from '../src/models/MobileOtp.model';

const API_BASE = 'http://localhost:5000/api/v1';

async function runMobileAuthTests() {
  console.log('--- STARTING MOBILE AUTH TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Test Phone Normalization
  assert(normalizePhoneNumber('9876543210') === '+919876543210', 'Normalizes 10-digit number');
  assert(normalizePhoneNumber('+91 98765 43210') === '+919876543210', 'Normalizes spaces');
  assert(normalizePhoneNumber('09876543210') === '+919876543210', 'Normalizes trunk 0 prefix');
  assert(normalizePhoneNumber('+91-98765-43210') === '+919876543210', 'Normalizes dashes');

  // 2. Test Phone Validation
  assert(validatePhoneNumber('+919876543210') === true, 'Validates standard Indian mobile');
  assert(validatePhoneNumber('+915876543210') === false, 'Rejects Indian mobile starting with 5');
  assert(validatePhoneNumber('+9198765') === false, 'Rejects short number');
  assert(validatePhoneNumber('invalid') === false, 'Rejects alphabetic input');

  // 3. Test Masking
  assert(maskPhoneNumber('+919876543210') === '+91 ******3210', 'Masks middle digits correctly');

  // 4. Test Cryptographic Hash & Timing-Safe Verification
  const otp = generateSecureOtp();
  assert(otp.length === 6 && /^\d{6}$/.test(otp), 'Generates secure 6-digit OTP');
  const h = hashOtp('+919876543210', otp);
  assert(verifyOtpHash('+919876543210', otp, h) === true, 'Verifies valid OTP hash');
  assert(verifyOtpHash('+919876543210', '000000', h) === false, 'Rejects invalid OTP hash');

  // 5. Test Send OTP Endpoint
  const testPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const sendRes = await fetch(`${API_BASE}/auth/mobile/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone }),
  });
  const sendData: any = await sendRes.json();
  assert(sendRes.status === 200 && sendData.success === true, 'POST /mobile/send-otp responds 200');
  assert(sendData.data.phone.startsWith('+91'), 'Returned phone is normalized');
  const receivedOtp = sendData.data._devOtp;
  assert(Boolean(receivedOtp), 'Development mode provides OTP in _devOtp');

  // 6. Test Cooldown Enforcement
  const cooldownRes = await fetch(`${API_BASE}/auth/mobile/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone }),
  });
  assert(cooldownRes.status === 429, 'Cooldown rejects immediate resend with 429');

  // 7. Test Invalid OTP Attempt
  const wrongRes = await fetch(`${API_BASE}/auth/mobile/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone, otp: '111111' }),
  });
  const wrongData: any = await wrongRes.json();
  assert(wrongRes.status === 400 && wrongData.message.includes('incorrect'), 'Rejects wrong OTP with 400');

  // 8. Test Successful OTP Verification for New User
  const verifyRes = await fetch(`${API_BASE}/auth/mobile/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone, otp: receivedOtp }),
  });
  const verifyData: any = await verifyRes.json();
  assert(verifyRes.status === 200 && verifyData.success === true, 'POST /mobile/verify-otp responds 200');
  assert(verifyData.data.isNewUser === true, 'New phone detected as isNewUser: true');
  assert(Boolean(verifyData.data.registrationToken), 'Issues registrationToken for Name Page');

  // 9. Test Complete Profile (New User Registration)
  const completeRes = await fetch(`${API_BASE}/auth/mobile/complete-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      registrationToken: verifyData.data.registrationToken,
      name: 'Pooja Patil',
      role: 'student',
    }),
  });
  const completeData: any = await completeRes.json();
  assert(completeRes.status === 201 && completeData.success === true, 'POST /mobile/complete-profile responds 201');
  assert(completeData.data.user.name === 'Pooja Patil', 'User created with correct name');
  assert(completeData.data.user.role === 'student', 'User created with correct role');
  assert(Boolean(completeData.data.token), 'Issues valid session JWT');

  // 10. Test Existing User Flow (Immediate Login Without Name Page)
  // Delete cooldown by clearing old OTP record directly or waiting
  await mongoose.connect('mongodb://127.0.0.1:27017/skillsense');
  await MobileOtp.deleteMany({ phone: `+91${testPhone}` });

  const resend2 = await fetch(`${API_BASE}/auth/mobile/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone }),
  });
  const resendData2: any = await resend2.json();
  const otp2 = resendData2.data._devOtp;

  const verify2 = await fetch(`${API_BASE}/auth/mobile/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone, otp: otp2 }),
  });
  const verifyData2: any = await verify2.json();
  assert(verify2.status === 200, 'Existing user verify responds 200');
  assert(verifyData2.data.isNewUser === false, 'Existing user recognized with isNewUser: false');
  assert(verifyData2.data.user.name === 'Pooja Patil', 'Existing user profile loaded immediately');
  assert(Boolean(verifyData2.data.token), 'Existing user receives authenticated token directly');

  // 11. Test Admin Privilege Escalation Prevention
  // Generate another registration token
  const testPhone2 = `97${Math.floor(10000000 + Math.random() * 90000000)}`;
  const s3 = await fetch(`${API_BASE}/auth/mobile/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone2 }),
  });
  const s3Data: any = await s3.json();
  const v3 = await fetch(`${API_BASE}/auth/mobile/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone2, otp: s3Data.data._devOtp }),
  });
  const v3Data: any = await v3.json();

  const completeAdminRes = await fetch(`${API_BASE}/auth/mobile/complete-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      registrationToken: v3Data.data.registrationToken,
      name: 'Sneha Rao',
      role: 'admin', // Attempting to self-register as admin
    }),
  });
  const completeAdminData: any = await completeAdminRes.json();
  if (!completeAdminData.data) {
    console.error('completeAdminRes failed:', completeAdminRes.status, completeAdminData);
  }
  assert(completeAdminData.data?.user?.role === 'student', 'Admin role selection is rejected and sanitized to student');

  console.log(`\nRESULTS: ${passed} Passed, ${failed} Failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runMobileAuthTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
