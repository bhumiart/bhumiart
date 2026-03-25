import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../home/Header';
import Footer from '../home/Footer';

const MainLayout = ({ cartCount, wishlistCount }) => {
  return (
    <div className="min-h-screen bg-primary-50 selection:bg-accent-200 selection:text-accent-900">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
