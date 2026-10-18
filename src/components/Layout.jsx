import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="app-layout">
      {/* Centered Mobile Container */}
      <div className="app-container">
        <main style={{ paddingBottom: '90px', minHeight: '100vh', position: 'relative' }}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
