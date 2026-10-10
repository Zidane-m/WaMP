import React, { useState } from 'react';
import { ShieldCheck, X, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export type PinActionType = 'delete' | 'mark_sold' | 'edit';

interface PinVerificationModalProps {
  isOpen: boolean;
  actionType: PinActionType;
  itemName: string;
  onClose: () => void;
  onSubmitPin: (pin: string) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const PinVerificationModal: React.FC<PinVerificationModalProps> = ({
  isOpen,
  actionType,
  itemName,
  onClose,
  onSubmitPin,
  isLoading = false,
  errorMessage = null,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.trim().length < 4) {
      setLocalError('PIN keamanan harus terdiri dari 4 hingga 6 digit angka');
      return;
    }
    setLocalError(null);
    await onSubmitPin(pin.trim());
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'delete':
        return 'Hapus Iklan Barang';
      case 'mark_sold':
        return 'Tandai Barang Terjual';
      case 'edit':
        return 'Ubah Data Barang';
      default:
        return 'Verifikasi PIN Pemilik';
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case 'delete':
        return `Masukkan PIN keamanan yang Anda buat saat memposting "${itemName}" untuk menghapus iklan ini secara permanen.`;
      case 'mark_sold':
        return `Masukkan PIN keamanan untuk mengubah status "${itemName}" menjadi Sudah Terjual.`;
      case 'edit':
        return `Masukkan PIN keamanan yang Anda buat saat memposting "${itemName}" untuk membuka formulir edit.`;
      default:
        return 'Masukkan PIN keamanan barang Anda.';
    }
  };

  const getSubmitButtonText = () => {
    switch (actionType) {
      case 'delete':
        return 'Hapus Permanen';
      case 'mark_sold':
        return 'Tandai Terjual';
      case 'edit':
        return 'Buka Formulir Edit';
      default:
        return 'Konfirmasi PIN';
    }
  };

  const activeError = localError || errorMessage;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-xl relative animate-in zoom-in-95 duration-150">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Tutup jendela verifikasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ikon dan Judul */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              actionType === 'delete'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-brand-50 text-brand-600'
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Otorisasi Pemilik
            </span>
            <h3 id="modal-title" className="text-lg font-bold text-navy-900">
              {getActionTitle()}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          {getActionDescription()}
        </p>

        {/* Pesan Error */}
        {activeError && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
            <span>{activeError}</span>
          </div>
        )}

        {/* Formulir PIN */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-pin-input" className="block text-xs font-bold text-slate-700 mb-1.5">
              PIN Keamanan (4-6 Digit Angka)
            </label>
            <div className="relative">
              <input
                id="modal-pin-input"
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Misal: 1234"
                disabled={isLoading}
                autoFocus
                className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-slate-300 text-sm font-mono tracking-widest text-center focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] justify-center"
                aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px]"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${
                actionType === 'delete'
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                  : 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{getSubmitButtonText()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinVerificationModal;
