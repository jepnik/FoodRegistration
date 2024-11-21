import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, userEmail }) => {
  return (
    <>
      {/* Header with dynamic userEmail */}
      <Header userEmail={userEmail} />
      {/* Main content area with padding for fixed header */}
      {/* <main style={{ paddingTop: '40px' }}>{children}</main> */}
      <div className="content">{children}</div> {/* Hovedinnhold skyver footer */}
      {/* Footer at the bottom */}
      <Footer />
    </>
  );
};

export default Layout;

