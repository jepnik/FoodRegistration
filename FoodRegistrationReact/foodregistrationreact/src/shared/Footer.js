import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white text-center py-3">
      <div className="container">
        &copy; 2024 - FoodRegistration | Contact us: +47 999 99 999 | Email: 
        <a href="mailto:vårbedrift@gmail.com" className="text-white"> vårbedrift@gmail.com</a>
      </div>
    </footer>
  );
};

export default Footer;
