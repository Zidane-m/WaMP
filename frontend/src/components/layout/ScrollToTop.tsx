import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Komponen pembantu untuk otomatis me-reset posisi scroll ke paling atas
 * setiap kali pengguna berpindah rute/halaman di React Router.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
