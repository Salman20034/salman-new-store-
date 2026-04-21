import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Navbar />
      <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
