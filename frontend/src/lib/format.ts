/**
 * Format angka nominal ke mata uang Rupiah
 * Contoh: 85000 -> "Rp 85.000"
 */
export function formatRupiah(amount: number): string {
  if (amount === 0) {
    return 'Gratis / Hibah';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format tanggal ISO ke format bahasa Indonesia
 * Contoh: "2026-10-10T08:00:00Z" -> "10 Oktober 2026"
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}
