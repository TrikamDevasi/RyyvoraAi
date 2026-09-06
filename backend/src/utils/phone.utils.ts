import crypto from 'crypto';
import env from '../config/env';

const OTP_SECRET = env.JWT_SECRET || 'skillsense_mobile_otp_secret_2026';

/**
 * Normalizes any Indian phone representation into canonical E.164: +91XXXXXXXXXX
 * Example inputs:
 *  - "9876543210"       -> "+919876543210"
 *  - "+91 98765 43210"  -> "+919876543210"
 *  - "09876543210"      -> "+919876543210"
 *  - "+91-98765-43210"  -> "+919876543210"
 */
export function normalizePhoneNumber(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  // Remove whitespace, dashes, parentheses, dots
  let cleaned = raw.trim().replace(/[\s\-().]/g, '');

  // Strip leading 00 if international format
  if (cleaned.startsWith('0091')) {
    cleaned = '+91' + cleaned.slice(4);
  }

  // Handle +91 prefix
  if (cleaned.startsWith('+91')) {
    const digits = cleaned.slice(3).replace(/\D/g, '');
    return `+91${digits}`;
  }

  // Handle leading 0 (trunk code in India)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    const digits = cleaned.slice(1).replace(/\D/g, '');
    return `+91${digits}`;
  }

  // If standard 10-digit number without country code
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  // Fallback with plus if present
  return cleaned.startsWith('+') ? `+${digits}` : `+91${digits}`;
}

/**
 * Validates whether a normalized phone number is a valid 10-digit Indian mobile number.
 * Indian mobile numbers start with 6, 7, 8, or 9 followed by 9 digits.
 */
export function validatePhoneNumber(normalizedPhone: string): boolean {
  if (!normalizedPhone) return false;
  const regex = /^\+91[6-9]\d{9}$/;
  return regex.test(normalizedPhone);
}

/**
 * Masks a phone number for privacy display.
 * Example: "+919876543210" -> "+91 ******3210"
 */
export function maskPhoneNumber(normalizedPhone: string): string {
  if (!normalizedPhone || normalizedPhone.length < 13) return normalizedPhone;
  const last4 = normalizedPhone.slice(-4);
  return `+91 ******${last4}`;
}

/**
 * Computes a cryptographically secure HMAC SHA-256 hash of an OTP bound to the user's phone.
 * Plaintext OTPs are never stored.
 */
export function hashOtp(phone: string, otp: string): string {
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${phone}:${otp.trim()}`)
    .digest('hex');
}

/**
 * Securely verifies an OTP using timing-safe buffer comparison to prevent timing attacks.
 */
export function verifyOtpHash(phone: string, inputOtp: string, expectedHash: string): boolean {
  try {
    const inputHash = hashOtp(phone, inputOtp);
    const bufA = Buffer.from(inputHash, 'hex');
    const bufB = Buffer.from(expectedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Generates a cryptographically random 6-digit numeric OTP.
 * Uses crypto.randomInt (NOT Math.random()).
 */
export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}
