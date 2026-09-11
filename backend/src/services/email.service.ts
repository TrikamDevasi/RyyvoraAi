/**
 * email.service.ts — Ryyvora AI Transactional Email
 *
 * Provider priority:
 *   1. Resend (primary)          — configure RESEND_API_KEY
 *   2. Gmail SMTP (fallback)     — configure GMAIL_USER + GMAIL_APP_PASSWORD
 *   3. Development simulation    — logs email content to console (no external call)
 *
 * Security rules:
 *   - Never log API keys, passwords, or tokens.
 *   - Never silently pretend an email was sent.
 *   - In development simulation mode, log the URL / token only to the server console.
 */

import nodemailer from 'nodemailer';
import logger from '../utils/logger';

// ── Provider Detection ─────────────────────────────────────────────────────────

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@ryyvora.ai';

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD;
const hasValidGmail =
  Boolean(gmailUser && gmailPass) &&
  !gmailUser!.includes('your.gmail') &&
  !gmailPass!.includes('xxxx');

const hasResend = Boolean(
  resendApiKey &&
  !resendApiKey.startsWith('re_REPLACE') &&
  resendApiKey.length > 10
);

// ── Resend HTTP helper ─────────────────────────────────────────────────────────

async function sendViaResend(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!hasResend) throw new Error('Resend not configured');
  const body = JSON.stringify({
    from: `Ryyvora AI <${resendFromEmail}>`,
    to: [options.to],
    subject: options.subject,
    html: options.html,
  });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // API key access — never logged
      Authorization: `Bearer ${resendApiKey}`,
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown error');
    throw new Error(`Resend API error ${res.status}: ${errText}`);
  }
}

// ── Gmail Nodemailer helper ────────────────────────────────────────────────────

let gmailTransporter: nodemailer.Transporter | null = null;
if (hasValidGmail) {
  gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  });
} else if (!hasResend) {
  logger.warn(
    '[EMAIL] No email provider configured. ' +
    'Set RESEND_API_KEY (recommended) or GMAIL_USER + GMAIL_APP_PASSWORD. ' +
    'Email verification and password reset will be logged to the console only.'
  );
}

// ── Core Dispatch ──────────────────────────────────────────────────────────────

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  simulationFallback: string; // the URL/token to log in dev/simulation mode
}): Promise<{ provider: string; simulated: boolean }> {
  // 1. Try Resend (primary)
  if (hasResend) {
    try {
      await sendViaResend({ to: options.to, subject: options.subject, html: options.html });
      return { provider: 'resend', simulated: false };
    } catch (err: any) {
      logger.error(`[EMAIL] Resend failed: ${err.message}. Trying Gmail fallback.`);
    }
  }

  // 2. Try Gmail (fallback)
  if (gmailTransporter) {
    try {
      await gmailTransporter.sendMail({
        from: `"Ryyvora AI" <${gmailUser}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return { provider: 'gmail', simulated: false };
    } catch (err: any) {
      logger.error(`[EMAIL] Gmail failed: ${err.message}. Falling back to simulation.`);
    }
  }

  // 3. Simulation mode — log to console; DO NOT expose tokens in log at WARN level
  logger.info('=============================================================');
  logger.info('[EMAIL SIMULATION — configure RESEND_API_KEY for real sends]');
  logger.info(`To      : ${options.to}`);
  logger.info(`Subject : ${options.subject}`);
  logger.info(`Action  : ${options.simulationFallback}`);
  logger.info('=============================================================');
  return { provider: 'simulation', simulated: true };
}

// ── HTML Templates ─────────────────────────────────────────────────────────────

const baseWrapper = (accentColor: string, content: string) => `
<!DOCTYPE html>
<html>
<body style="background:#08060f;font-family:'Inter',sans-serif,Arial;padding:40px 20px;margin:0;">
  <div style="max-width:480px;margin:0 auto;background:#0d0a1a;
              border:1px solid ${accentColor}4d;border-radius:16px;padding:40px;">
    <h2 style="color:${accentColor};text-align:center;font-size:24px;margin:0 0 6px;">
      Ryyvora AI
    </h2>
    <p style="color:#9ca3af;text-align:center;font-size:11px;
              letter-spacing:0.12em;margin:0 0 32px;text-transform:uppercase;">
      Workforce Outcome Intelligence · SIH 2026
    </p>
    ${content}
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0 20px;" />
    <p style="color:#374151;font-size:11px;text-align:center;margin:0;">
      © 2026 Ryyvora AI. All rights reserved.
    </p>
  </div>
</body>
</html>`;

// ── Public API ─────────────────────────────────────────────────────────────────

export const sendPasswordResetEmail = async (
  toEmail: string,
  resetToken: string,
  userName: string
): Promise<void> => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/auth/reset-password/${resetToken}`;

  const html = baseWrapper('#F59E0B', `
    <h3 style="color:#ffffff;font-size:18px;margin:0 0 12px;">Hi ${userName},</h3>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px;">
      We received a request to reset your Ryyvora AI password.
      Click the button below to create a new password.
      This link expires in <strong style="color:#F59E0B;">1 hour</strong>.
    </p>
    <a href="${resetUrl}"
       style="display:block;background:linear-gradient(135deg,#F59E0B,#D97706);
              color:#000;font-weight:700;text-align:center;padding:14px 24px;
              border-radius:12px;text-decoration:none;font-size:15px;margin-bottom:24px;">
      Reset My Password →
    </a>
    <p style="color:#4b5563;font-size:12px;text-align:center;line-height:1.5;margin:0;">
      If you didn't request this, ignore this email.<br/>Your password won't change.
    </p>
  `);

  const result = await sendEmail({
    to: toEmail,
    subject: 'Reset Your Ryyvora AI Password',
    html,
    simulationFallback: `Password reset URL → ${resetUrl}`,
  });

  if (result.simulated) {
    logger.warn(
      `[EMAIL] Password reset for ${toEmail} was SIMULATED (no email provider configured). ` +
      'Set RESEND_API_KEY in .env for real delivery.'
    );
  }
};

export const sendVerificationEmail = async (
  toEmail: string,
  verificationToken: string,
  userName: string
): Promise<void> => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

  const html = baseWrapper('#8B5CF6', `
    <h3 style="color:#ffffff;font-size:18px;margin:0 0 12px;">Welcome, ${userName}!</h3>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Thank you for joining Ryyvora AI — Maharashtra's Workforce Outcome Intelligence Platform.
      Please verify your email address to unlock all features and start your career assessment journey.
    </p>
    <a href="${verificationUrl}"
       style="display:block;background:linear-gradient(135deg,#8B5CF6,#6D28D9);
              color:#fff;font-weight:700;text-align:center;padding:14px 24px;
              border-radius:12px;text-decoration:none;font-size:15px;margin-bottom:24px;">
      Verify My Email →
    </a>
    <p style="color:#4b5563;font-size:12px;text-align:center;line-height:1.5;margin:0;">
      If you didn't create this account, you can safely ignore this email.
    </p>
  `);

  const result = await sendEmail({
    to: toEmail,
    subject: 'Verify Your Ryyvora AI Account',
    html,
    simulationFallback: `Email verification URL → ${verificationUrl}`,
  });

  if (result.simulated) {
    logger.warn(
      `[EMAIL] Verification email for ${toEmail} was SIMULATED (no email provider configured). ` +
      'Set RESEND_API_KEY in .env for real delivery.'
    );
  }
};
