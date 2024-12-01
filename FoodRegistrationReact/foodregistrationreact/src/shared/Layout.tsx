import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPath = location.pathname === "/login"; 
  return (
    <div className="App">
      <Header />
      <main className="content">
        <Outlet /> 
      </main>
      <Footer position={isLoginPath ? 'absolute' : 'relative'} />
    </div>
  );
};

export default Layout;
