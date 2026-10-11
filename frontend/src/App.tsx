import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import ItemDetailPage from './pages/ItemDetailPage';
import ItemFormPage from './pages/ItemFormPage';
import ItemEditPage from './pages/ItemEditPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyItemsPage from './pages/MyItemsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="barang/:id" element={<ItemDetailPage />} />
            <Route path="barang/:id/edit" element={<ItemEditPage />} />
            <Route path="jual" element={<ItemFormPage />} />
            <Route path="tentang" element={<AboutPage />} />
            <Route path="masuk" element={<LoginPage />} />
            <Route path="daftar" element={<RegisterPage />} />
            <Route path="barang-saya" element={<MyItemsPage />} />
            <Route path="keranjang" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
