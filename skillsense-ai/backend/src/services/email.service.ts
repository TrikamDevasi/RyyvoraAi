import nodemailer from 'nodemailer';
import env from '../config/env';
import logger from '../utils/logger';

let transporter: nodemailer.Transporter | null = null;

const hasRealCredentials = 
  Boolean(env.GMAIL_USER && 
  env.GMAIL_APP_PASSWORD && 
  !env.GMAIL_USER.includes('your.gmail') && 
  !env.GMAIL_APP_PASSWORD.includes('xxxx'));

if (hasRealCredentials) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });
} else {
  logger.warn('Email service running in simulation mode (GMAIL_USER / GMAIL_APP_PASSWORD not configured)');
}

export const sendPasswordResetEmail = async (
  toEmail: string,
  resetToken: string,
  userName: string
) => {
  const resetUrl = `${env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

  if (!transporter) {
    logger.info(`[SIMULATION] Password reset email for ${toEmail}: ${resetUrl}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"SkillSense AI" <${env.GMAIL_USER}>`,
      to: toEmail,
      subject: 'Reset Your SkillSense AI Password',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#08060f;font-family:sans-serif;padding:40px 20px;">
          <div style="max-width:480px;margin:0 auto;background:#0d0a1a;
                      border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:40px;">
            <h2 style="color:#F59E0B;text-align:center;font-size:24px;margin-bottom:8px;">
              SkillSense AI
            </h2>
            <p style="color:#9ca3af;text-align:center;font-size:12px;
                      letter-spacing:0.1em;margin-bottom:32px;">
              MEASURING SKILLS · PREDICTING FUTURES
            </p>
            <h3 style="color:#ffffff;font-size:18px;margin-bottom:12px;">
              Hi ${userName},
            </h3>
            <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin-bottom:24px;">
              We received a request to reset your password. 
              Click the button below to create a new password.
              This link expires in <strong style="color:#F59E0B;">1 hour</strong>.
            </p>
            <a href="${resetUrl}"
               style="display:block;background:linear-gradient(135deg,#F59E0B,#D97706);
                      color:#000;font-weight:bold;text-align:center;padding:14px 24px;
                      border-radius:12px;text-decoration:none;font-size:15px;
                      margin-bottom:24px;">
              Reset My Password →
            </a>
            <p style="color:#4b5563;font-size:12px;text-align:center;line-height:1.5;">
              If you didn't request this, ignore this email.<br/>
              Your password won't change.
            </p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
            <p style="color:#374151;font-size:11px;text-align:center;">
              © 2026 SkillSense AI. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    logger.error('Failed to send password reset email:', err);
  }
};

export const sendVerificationEmail = async (
  toEmail: string,
  verificationToken: string,
  userName: string
) => {
  const verificationUrl = `${env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

  if (!transporter) {
    logger.info(`[SIMULATION] Email verification link for ${toEmail}: ${verificationUrl}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"SkillSense AI" <${env.GMAIL_USER}>`,
      to: toEmail,
      subject: 'Verify Your SkillSense AI Account',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#08060f;font-family:sans-serif;padding:40px 20px;">
          <div style="max-width:480px;margin:0 auto;background:#0d0a1a;
                      border:1px solid rgba(139,92,246,0.3);border-radius:16px;padding:40px;">
            <h2 style="color:#8B5CF6;text-align:center;font-size:24px;margin-bottom:8px;">
              SkillSense AI
            </h2>
            <p style="color:#9ca3af;text-align:center;font-size:12px;
                      letter-spacing:0.1em;margin-bottom:32px;">
              MEASURING SKILLS · PREDICTING FUTURES
            </p>
            <h3 style="color:#ffffff;font-size:18px;margin-bottom:12px;">
              Welcome, ${userName}!
            </h3>
            <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin-bottom:24px;">
              Thank you for joining SkillSense AI. Please verify your email address to 
              unlock all features and start your career assessment journey.
            </p>
            <a href="${verificationUrl}"
               style="display:block;background:linear-gradient(135deg,#8B5CF6,#6D28D9);
                      color:#fff;font-weight:bold;text-align:center;padding:14px 24px;
                      border-radius:12px;text-decoration:none;font-size:15px;
                      margin-bottom:24px;">
              Verify My Email →
            </a>
            <p style="color:#4b5563;font-size:12px;text-align:center;line-height:1.5;">
              If you didn't create this account, you can safely ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
            <p style="color:#374151;font-size:11px;text-align:center;">
              © 2026 SkillSense AI. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    logger.error('Failed to send verification email:', err);
  }
};
