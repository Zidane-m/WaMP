import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Barang } from '../../types';
import { formatRupiah, formatDate } from '../../lib/format';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import Badge from '../ui/Badge';
import ItemImage from '../ui/ItemImage';

interface ItemCardProps {
  item: Barang;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const isSold = item.status === 'Terjual';
  const whatsappUrl = buildWhatsAppLink(
    item.penjual.no_whatsapp,
    item.nama_barang,
    item.harga,
    item.jenis_transaksi,
    item.penjual.nama_lengkap
  );

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative">
      {/* Gambar Barang dengan Tag Overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Link
          to={`/barang/${item.id_barang}`}
          aria-label={`Lihat detail ${item.nama_barang}`}
          className="block w-full h-full focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        >
          <ItemImage
            src={item.gambar_url}
            alt={item.nama_barang}
            categoryName={item.kategori.nama_kategori}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badge Jenis Transaksi di Pojok Kiri Atas */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <Badge variant={item.jenis_transaksi}>
            {item.jenis_transaksi}
          </Badge>
          <Badge variant={item.kondisi}>
            {item.kondisi}
          </Badge>
        </div>

        {/* Overlay Jika Barang Terjual */}
        {isSold && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Sudah Terjual
            </span>
          </div>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Label Kampus dan Kategori */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
            <span
              className="inline-flex items-center gap-1 font-medium text-navy-800 truncate"
              title={item.penjual.universitas.nama_universitas}
            >
              <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">{item.penjual.universitas.nama_universitas}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium flex-shrink-0">
              {item.kategori.nama_kategori}
            </span>
          </div>

          {/* Judul Barang */}
          <h3 className="font-bold text-navy-950 text-base sm:text-lg tracking-tight line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
            <Link
              to={`/barang/${item.id_barang}`}
              className="focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
            >
              {item.nama_barang}
            </Link>
          </h3>

          {/* Deskripsi Singkat */}
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-3 leading-relaxed">
            {item.deskripsi}
          </p>
        </div>

        {/* Bagian Harga dan Aksi */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                {item.jenis_transaksi === 'Jual' ? 'Harga' : 'Model Transaksi'}
              </span>
              <span className="text-lg font-extrabold text-navy-900 tracking-tight">
                {item.jenis_transaksi === 'Jual'
                  ? formatRupiah(item.harga)
                  : item.jenis_transaksi === 'Barter'
                  ? 'Siap Barter'
                  : 'Gratis (Hibah)'}
              </span>
            </div>

            <span
              className="text-[11px] text-slate-400 inline-flex items-center gap-1"
              title={`Diposting ${formatDate(item.created_at)}`}
            >
              <Calendar className="w-3 h-3" />
              {formatDate(item.created_at)}
            </span>
          </div>

          {/* Tombol Aksi */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to={`/barang/${item.id_barang}`}
              className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[44px] text-center focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              Lihat Detail
            </Link>

            {isSold ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 bg-slate-100 cursor-not-allowed min-h-[44px]"
              >
                Terjual
              </button>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-colors min-h-[44px] text-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                aria-label={`Hubungi penjual ${item.penjual.nama_lengkap} lewat WhatsApp`}
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>Chat WA</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
