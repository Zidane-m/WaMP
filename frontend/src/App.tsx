import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-navy-900 tracking-tight">Campus</span>
              <span className="text-xl font-bold text-brand-600 tracking-tight">Preloved</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" />
            Fase 0 — Setup Berhasil
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-navy-900 mb-2">
            CampusPreloved Frontend
          </h1>
          <p className="text-slate-600 text-sm mb-6">
            Inisialisasi Vite + React + TypeScript + Tailwind CSS berhasil dijalankan. Siap untuk tahap implementasi halaman dan filter katalog.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 font-mono">
            API URL: {import.meta.env.VITE_API_URL}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} CampusPreloved — Web and Mobile Programming
      </footer>
    </div>
  );
};

export default App;
