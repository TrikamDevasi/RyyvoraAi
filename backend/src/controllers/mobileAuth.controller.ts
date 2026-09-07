import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import MobileOtp from '../models/MobileOtp.model';
import {
  normalizePhoneNumber,
  validatePhoneNumber,
  maskPhoneNumber,
  hashOtp,
  verifyOtpHash,
  generateSecureOtp,
} from '../utils/phone.utils';
import { sendOtpSms } from '../services/sms.service';
import { signToken } from '../utils/jwt.utils';
import env from '../config/env';
import logger from '../utils/logger';

const REGISTRATION_TOKEN_SECRET = env.JWT_SECRET || 'skillsense_mobile_reg_secret_2026';

// Helper to set auth cookies (same as auth.controller.ts)
// Sets both ryyvora_* and legacy skillsense_* cookies for zero-downtime dual-brand compatibility
const setAuthCookie = (res: Response, token: string, role?: string) => {
  const tokenOpts = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
  res.cookie('ryyvora_token', token, tokenOpts);
  res.cookie('skillsense_token', token, tokenOpts);
  if (role) {
    const roleOpts = {
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
    res.cookie('ryyvora_role', role, roleOpts);
    res.cookie('skillsense_role', role, roleOpts);
  }
};

/**
 * POST /api/v1/auth/mobile/send-otp
 * Validates mobile number, enforces 60s cooldown, generates 6-digit OTP, stores hash, sends SMS.
 */
export const sendMobileOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawPhone = req.body.phone;
    if (!rawPhone || typeof rawPhone !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit mobile number.',
        data: null,
      });
      return;
    }

    const normalizedPhone = normalizePhoneNumber(rawPhone);
    if (!validatePhoneNumber(normalizedPhone)) {
      res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit mobile number (e.g. +91 9876543210).',
        data: null,
      });
      return;
    }

    // Check for existing OTP record to enforce 60-second cooldown
    const existingOtp = await MobileOtp.findOne({ phone: normalizedPhone }).sort({ createdAt: -1 });
    if (existingOtp) {
      const secondsSinceLastSent = (Date.now() - new Date(existingOtp.lastSentAt).getTime()) / 1000;
      if (secondsSinceLastSent < 60) {
        const waitSeconds = Math.ceil(60 - secondsSinceLastSent);
        res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting another verification code.`,
          data: { cooldownSeconds: waitSeconds },
        });
        return;
      }
    }

    // Invalidate any older unverified OTPs for this phone number
    await MobileOtp.deleteMany({ phone: normalizedPhone });

    // Generate secure 6-digit OTP and HMAC hash
    const otp = generateSecureOtp();
    const otpHash = hashOtp(normalizedPhone, otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    await MobileOtp.create({
      phone: normalizedPhone,
      otpHash,
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt,
      verified: false,
    });

    // Dispatch SMS via service (logs to console in dev mode, sends SMS in production)
    const smsResult = await sendOtpSms(normalizedPhone, otp);

    const isDev = process.env.NODE_ENV === 'development';

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${maskPhoneNumber(normalizedPhone)}`,
      data: {
        phone: normalizedPhone,
        maskedPhone: maskPhoneNumber(normalizedPhone),
        cooldownSeconds: 60,
        expiresInSeconds: 300,
        // Only provide dev helper in strictly development environment
        ...(isDev ? { _devOtp: otp } : {}),
      },
    });
  } catch (err: any) {
    logger.error('sendMobileOtp error: ' + err.message);
    res.status(500).json({
      success: false,
      message: "We couldn't send the verification code. Check your connection and try again.",
      data: null,
    });
  }
};

/**
 * POST /api/v1/auth/mobile/verify-otp
 * Validates OTP code, checks attempt limits, marks verified, returns either session (existing user)
 * or temporary registrationToken (new user).
 */
export const verifyMobileOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone: rawPhone, otp } = req.body;

    if (!rawPhone || !otp) {
      res.status(400).json({
        success: false,
        message: 'Mobile number and 6-digit verification code are required.',
        data: null,
      });
      return;
    }

    const normalizedPhone = normalizePhoneNumber(rawPhone);
    const cleanedOtp = String(otp).trim();

    if (cleanedOtp.length !== 6 || !/^\d{6}$/.test(cleanedOtp)) {
      res.status(400).json({
        success: false,
        message: 'That code is incorrect. Try again.',
        data: null,
      });
      return;
    }

    const otpRecord = await MobileOtp.findOne({ phone: normalizedPhone }).sort({ createdAt: -1 });

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        message: 'This code has expired. Request a new code.',
        data: null,
      });
      return;
    }

    // Check expiration
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await MobileOtp.deleteOne({ _id: otpRecord._id });
      res.status(400).json({
        success: false,
        message: 'This code has expired. Request a new code.',
        data: null,
      });
      return;
    }

    // Check attempt lockout
    if (otpRecord.attempts >= 5) {
      await MobileOtp.deleteOne({ _id: otpRecord._id });
      res.status(429).json({
        success: false,
        message: 'Too many attempts. Request a new code.',
        data: null,
      });
      return;
    }

    // Verify hash securely
    const isValid = verifyOtpHash(normalizedPhone, cleanedOtp, otpRecord.otpHash);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remainingAttempts = Math.max(0, 5 - otpRecord.attempts);

      if (remainingAttempts === 0) {
        await MobileOtp.deleteOne({ _id: otpRecord._id });
        res.status(429).json({
          success: false,
          message: 'Too many attempts. Request a new code.',
          data: null,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: 'That code is incorrect. Try again.',
        data: { remainingAttempts },
      });
      return;
    }

    // Mark verified & delete OTP to prevent replay attacks
    await MobileOtp.deleteOne({ _id: otpRecord._id });

    // Check if user already exists
    let existingUser = await User.findOne({ phone: normalizedPhone });

    if (existingUser) {
      // EXISTING USER FLOW
      existingUser.phoneVerified = true;
      existingUser.lastLogin = new Date();
      await existingUser.save();

      const token = signToken({
        id: existingUser._id.toString(),
        role: existingUser.role,
        email: existingUser.email,
        phone: existingUser.phone,
      });

      setAuthCookie(res, token, existingUser.role);

      res.status(200).json({
        success: true,
        message: 'Signed in successfully!',
        data: {
          isNewUser: false,
          user: {
            id: String(existingUser._id),
            _id: String(existingUser._id),
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone,
            role: existingUser.role,
            avatar: existingUser.avatar,
            isVerified: existingUser.isVerified,
            phoneVerified: existingUser.phoneVerified,
            profileCompleted: existingUser.profileCompleted ?? true,
          },
          token,
        },
      });
      return;
    }

    // NEW USER FLOW: Issue a signed temporary registration token
    const registrationToken = jwt.sign(
      {
        phone: normalizedPhone,
        purpose: 'mobile_registration',
      },
      REGISTRATION_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      message: 'Mobile number verified. Please enter your name to complete registration.',
      data: {
        isNewUser: true,
        phone: normalizedPhone,
        maskedPhone: maskPhoneNumber(normalizedPhone),
        registrationToken,
      },
    });
  } catch (err: any) {
    logger.error('verifyMobileOtp error: ' + err.message);
    res.status(500).json({
      success: false,
      message: 'Unable to verify code. Please try again.',
      data: null,
    });
  }
};

/**
 * POST /api/v1/auth/mobile/complete-profile
 * Creates user profile after name & role are provided by new mobile user.
 */
export const completeMobileProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationToken, name, role } = req.body;

    if (!registrationToken || !name || typeof name !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Name and valid verification token are required.',
        data: null,
      });
      return;
    }

    // Verify registration token
    let payload: any;
    try {
      payload = jwt.verify(registrationToken, REGISTRATION_TOKEN_SECRET);
      if (payload.purpose !== 'mobile_registration' || !payload.phone) {
        throw new Error('Invalid token purpose');
      }
    } catch {
      res.status(401).json({
        success: false,
        message: 'Registration session expired. Please verify your mobile number again.',
        data: null,
      });
      return;
    }

    const phone = payload.phone;

    // Validate Name (sensible Indian & global names, 2-80 chars)
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid full name between 2 and 80 characters.',
        data: null,
      });
      return;
    }

    // Validate Role (do not allow self-admin registration)
    const allowedRoles = ['student', 'employer', 'institute', 'industry', 'government'];
    const chosenRole = role && allowedRoles.includes(role.toLowerCase())
      ? role.toLowerCase()
      : 'student';

    // Prevent duplicate phone race condition
    let user = await User.findOne({ phone });
    if (user) {
      // User already exists, update name if empty
      if (!user.name) user.name = trimmedName;
      user.phoneVerified = true;
      user.profileCompleted = true;
      await user.save();
    } else {
      user = await User.create({
        name: trimmedName,
        phone,
        role: chosenRole,
        phoneVerified: true,
        profileCompleted: true,
        isVerified: true,
        authProvider: 'mobile',
      });

      // Auto-create Student document if role is student
      if (user.role === 'student') {
        try {
          const Student = (await import('../models/Student.model')).default;
          await Student.create({
            userId: user._id,
            enrollmentNumber: `SKP-${user._id.toString().slice(-6).toUpperCase()}`,
            program: 'Vocational Engineering & Technology',
            nsqfLevel: 5,
            state: 'Maharashtra',
            gender: 'other',
            skills: [],
            overallScore: 75,
            placementStatus: 'studying',
            passportHash: `SKP-${user._id.toString().slice(-8).toUpperCase()}-VERIFIED`,
          });
        } catch {
          // Non-blocking
        }
      }
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      phone: user.phone,
    });

    setAuthCookie(res, token, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: {
          id: String(user._id),
          _id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          phoneVerified: user.phoneVerified,
          profileCompleted: user.profileCompleted,
        },
        token,
      },
    });
  } catch (err: any) {
    logger.error('completeMobileProfile error: ' + err.message);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Unable to complete registration. Please try again.' 
        : `Unable to complete registration: ${err.message}`,
      data: null,
    });
  }
};

/**
 * POST /api/v1/auth/mobile/link-phone
 * Links a verified mobile number to an authenticated existing account.
 */
export const linkMobilePhone = async (req: Request, res: Response): Promise<void> => {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const { phone: rawPhone, otp } = req.body;
    const normalizedPhone = normalizePhoneNumber(rawPhone);

    if (!validatePhoneNumber(normalizedPhone) || !otp) {
      res.status(400).json({
        success: false,
        message: 'Valid phone and verification code are required.',
        data: null,
      });
      return;
    }

    const otpRecord = await MobileOtp.findOne({ phone: normalizedPhone }).sort({ createdAt: -1 });
    if (!otpRecord || new Date() > new Date(otpRecord.expiresAt)) {
      res.status(400).json({
        success: false,
        message: 'This code has expired. Request a new code.',
        data: null,
      });
      return;
    }

    const isValid = verifyOtpHash(normalizedPhone, String(otp).trim(), otpRecord.otpHash);
    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'That code is incorrect. Try again.',
        data: null,
      });
      return;
    }

    // Ensure phone is not already in use by another user
    const existing = await User.findOne({ phone: normalizedPhone });
    if (existing && existing._id.toString() !== authUser._id.toString()) {
      res.status(409).json({
        success: false,
        message: 'This mobile number is already linked to another account.',
        data: null,
      });
      return;
    }

    await MobileOtp.deleteOne({ _id: otpRecord._id });

    authUser.phone = normalizedPhone;
    authUser.phoneVerified = true;
    await authUser.save();

    res.status(200).json({
      success: true,
      message: 'Mobile number linked successfully!',
      data: { phone: normalizedPhone, phoneVerified: true },
    });
  } catch (err: any) {
    logger.error('linkMobilePhone error: ' + err.message);
    res.status(500).json({
      success: false,
      message: 'Unable to link mobile number. Please try again.',
      data: null,
    });
  }
};
