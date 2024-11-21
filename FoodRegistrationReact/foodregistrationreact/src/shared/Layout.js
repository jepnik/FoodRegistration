import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, userEmail }) => {
  return (
    <div className="App">
      <Header userEmail={userEmail} />
      <div className="content">{children}</div> {/* Hovedinnhold */}
      <Footer />
    </div>
  );
};

export default Layout;
