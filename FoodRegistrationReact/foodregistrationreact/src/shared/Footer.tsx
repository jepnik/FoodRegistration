import React from 'react';
import '../styles/Footer.css';

interface FooterProps {
  position?: 'absolute' | 'relative' | 'fixed'; // Added 'fixed' as an option
}

const Footer: React.FC<FooterProps> = ({ position = 'fixed' }) => {
  return (
    <footer className={`footer-base footer-${position}`}>
      <div className="container">
        &copy; 2024 - FoodRegistration | Contact us: +47 999 99 999 | Email: 
        <a href="mailto:vårbedrift@gmail.com" className="text-white"> FoodTrace@gmail.com</a>
      </div>
    </footer>
  );
};

export default Footer;
