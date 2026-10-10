import { formatRupiah } from './format';

/**
 * Membuat tautan chat WhatsApp ke nomor penjual dengan pesan otomatis
 */
export function buildWhatsAppLink(
  phone: string,
  itemName: string,
  price: number,
  transactionType: 'Jual' | 'Barter' | 'Hibah',
  sellerName?: string
): string {
  // Pastikan nomor dibersihkan dari spasi atau strip
  const cleanPhone = phone.replace(/\D/g, '');

  let priceLabel = '';
  if (transactionType === 'Barter') {
    priceLabel = 'tawaran barter';
  } else if (transactionType === 'Hibah') {
    priceLabel = 'hibah gratis';
  } else {
    priceLabel = `seharga ${formatRupiah(price)}`;
  }

  const greeting = sellerName ? `Halo kak ${sellerName}` : 'Halo kak';
  const text = `${greeting}, saya tertarik dengan barang "${itemName}" (${priceLabel}) yang diposting di CampusPreloved. Apakah barangnya masih tersedia untuk COD di kampus?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
