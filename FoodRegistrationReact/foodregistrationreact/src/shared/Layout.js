import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, userEmail }) => {
  return (
    <>
      {/* Header with dynamic userEmail */}
      <Header userEmail={userEmail} />
      {/* Main content area with padding for fixed header */}
      <main style={{ paddingTop: '80px' }}>{children}</main>
      {/* Footer at the bottom */}
      <Footer />
    </>
  );
};

export default Layout;

