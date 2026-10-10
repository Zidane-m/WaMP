/**
 * Normalisasi nomor WhatsApp ke format standar 62...
 * Contoh: '08123456789' -> '628123456789'
 *         '+628123456789' -> '628123456789'
 */
export function normalizeWhatsApp(phone: string): string {
  // Buang semua karakter selain angka
  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
}
