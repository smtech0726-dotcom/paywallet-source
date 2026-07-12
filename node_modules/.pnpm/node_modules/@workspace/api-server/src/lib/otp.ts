export const OTP_TTL_SECONDS = 5 * 60;

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function normalizePhone(phone: string): string {
  return phone.trim();
}
