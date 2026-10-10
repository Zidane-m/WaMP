import React from 'react';

export type BadgeVariant =
  | 'tersedia'
  | 'terjual'
  | 'jual'
  | 'barter'
  | 'hibah'
  | 'sangat_baik'
  | 'layak_pakai'
  | 'perlu_perbaikan'
  | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'md'
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantStyles: Record<BadgeVariant, string> = {
    tersedia: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    terjual: 'bg-slate-100 text-slate-600 border-slate-200',
    jual: 'bg-blue-50 text-blue-700 border-blue-200',
    barter: 'bg-amber-50 text-amber-700 border-amber-200',
    hibah: 'bg-purple-50 text-purple-700 border-purple-200',
    sangat_baik: 'bg-teal-50 text-teal-700 border-teal-200',
    layak_pakai: 'bg-sky-50 text-sky-700 border-sky-200',
    perlu_perbaikan: 'bg-orange-50 text-orange-700 border-orange-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
