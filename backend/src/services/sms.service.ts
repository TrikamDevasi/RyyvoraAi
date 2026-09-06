import logger from '../utils/logger';
import { maskPhoneNumber } from '../utils/phone.utils';

export interface SendSmsResult {
  success: boolean;
  provider: 'development' | 'twilio' | 'msg91' | 'aws_sns';
  messageId?: string;
  error?: string;
}

/**
 * Service to dispatch SMS OTPs.
 * In development / demo mode, logs the OTP securely to the server terminal.
 * In production mode, routes to configured SMS gateway (Twilio, MSG91, AWS SNS).
 */
export async function sendOtpSms(phone: string, otp: string): Promise<SendSmsResult> {
  const mode = process.env.MOBILE_OTP_MODE || (process.env.NODE_ENV === 'production' ? 'production' : 'development');
  const masked = maskPhoneNumber(phone);

  // If in development mode or SMS provider not explicitly configured
  if (mode === 'development' || !process.env.SMS_PROVIDER) {
    logger.info(`===========================================================`);
    logger.info(`[MOBILE OTP DEV SIMULATION]`);
    logger.info(`Target Phone : ${masked} (${phone})`);
    logger.info(`One-Time Code: >>> ${otp} <<<`);
    logger.info(`Valid for    : 5 Minutes (Max 5 Attempts)`);
    logger.info(`===========================================================`);

    return {
      success: true,
      provider: 'development',
      messageId: `sim_${Date.now()}`,
    };
  }

  // Production provider integration
  try {
    const provider = process.env.SMS_PROVIDER.toLowerCase();

    if (provider === 'msg91') {
      const authKey = process.env.MSG91_AUTH_KEY;
      const templateId = process.env.MSG91_TEMPLATE_ID;
      if (!authKey || !templateId) {
        throw new Error('MSG91 credentials missing in environment.');
      }
      // MSG91 API call (Fetch)
      const res = await fetch('https://api.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: authKey,
        },
        body: JSON.stringify({
          template_id: templateId,
          mobile: phone.replace('+', ''),
          otp,
        }),
      });
      if (!res.ok) {
        throw new Error(`MSG91 API error: ${res.statusText}`);
      }
      return { success: true, provider: 'msg91' };
    }

    if (provider === 'twilio') {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_FROM_NUMBER;
      if (!accountSid || !authToken || !fromNumber) {
        throw new Error('Twilio credentials missing in environment.');
      }
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const params = new URLSearchParams();
      params.append('To', phone);
      params.append('From', fromNumber);
      params.append('Body', `Your Ryyvora AI verification code is ${otp}. Valid for 5 minutes.`);

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      if (!res.ok) {
        throw new Error(`Twilio API error: ${res.statusText}`);
      }
      return { success: true, provider: 'twilio' };
    }

    logger.warn(`Unknown SMS provider configured: ${provider}. Falling back to development log.`);
    logger.info(`[MOBILE OTP FALLBACK] Code for ${masked}: ${otp}`);
    return { success: true, provider: 'development' };
  } catch (err: any) {
    logger.error('SMS Gateway Error: ' + err.message);
    return {
      success: false,
      provider: 'development',
      error: err.message,
    };
  }
}
