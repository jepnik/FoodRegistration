import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Define props for Layout
interface LayoutProps {
  children?: React.ReactNode; // The content to display
  userEmail?: string; // Optional userEmail
}

const Layout: React.FC<LayoutProps> = ({ children, userEmail }) => {
  return (
    <div className="App">
      <Header userEmail={userEmail} />
      <div className="content">
        {children || <Outlet />} {/* main content, use Outlet for nested routes */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

