/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { useStore } from './store/useStore';

export default function App() {
  const { fetchProducts, fetchSettings } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="auth" element={<Auth />} />
          <Route path="profile" element={<Profile />} />
          <Route path="offers" element={<Products />} />
          <Route path="categories" element={<Products />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<div className="p-20 text-center text-2xl">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
