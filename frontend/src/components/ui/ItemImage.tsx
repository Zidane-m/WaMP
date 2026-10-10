import React, { useState } from 'react';
import { BookOpen, Laptop, Armchair, PenTool, Shirt, Package } from 'lucide-react';

interface ItemImageProps {
  src: string | null;
  alt: string;
  categoryName?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export const ItemImage: React.FC<ItemImageProps> = ({
  src,
  alt,
  categoryName = '',
  className = '',
  aspectRatio = 'square'
}) => {
  const [hasError, setHasError] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fullImageUrl = src ? `${baseUrl}${src}` : null;

  const aspectStyles = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'h-full'
  }[aspectRatio];

  // Helper untuk memilih ikon dan palet berdasarkan kategori
  const getCategoryTheme = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('buku')) {
      return {
        icon: <BookOpen className="w-12 h-12 text-emerald-600" />,
        bg: 'bg-emerald-50 border-emerald-100',
        label: 'Buku Kuliah'
      };
    }
    if (lower.includes('elektronik')) {
      return {
        icon: <Laptop className="w-12 h-12 text-blue-600" />,
        bg: 'bg-blue-50 border-blue-100',
        label: 'Elektronik'
      };
    }
    if (lower.includes('perabot') || lower.includes('kos')) {
      return {
        icon: <Armchair className="w-12 h-12 text-amber-600" />,
        bg: 'bg-amber-50 border-amber-100',
        label: 'Perabot Kos'
      };
    }
    if (lower.includes('tulis') || lower.includes('gambar')) {
      return {
        icon: <PenTool className="w-12 h-12 text-teal-600" />,
        bg: 'bg-teal-50 border-teal-100',
        label: 'Alat Tulis'
      };
    }
    if (lower.includes('pakaian') || lower.includes('almamater')) {
      return {
        icon: <Shirt className="w-12 h-12 text-indigo-600" />,
        bg: 'bg-indigo-50 border-indigo-100',
        label: 'Pakaian'
      };
    }
    return {
      icon: <Package className="w-12 h-12 text-slate-500" />,
      bg: 'bg-slate-100 border-slate-200',
      label: 'Campus Preloved'
    };
  };

  const theme = getCategoryTheme(categoryName);

  if (!fullImageUrl || hasError) {
    return (
      <div
        className={`w-full ${aspectStyles} ${theme.bg} border flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="p-3 bg-white/80 rounded-2xl shadow-sm mb-2 backdrop-blur-xs">
          {theme.icon}
        </div>
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          {categoryName || theme.label}
        </span>
      </div>
    );
  }

  return (
    <img
      src={fullImageUrl}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`w-full ${aspectStyles} object-cover ${className}`}
    />
  );
};

export default ItemImage;
