import React from 'react';
import '../styles/Footer.css';

interface FooterProps {
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer >
      <div className="container">
        &copy; 2024 - FoodRegistration | Contact us: +47 999 99 999 | Email: 
        <a href="mailto:vårbedrift@gmail.com" className="text-white"> FoodTrace@gmail.com</a>
      </div>
    </footer>
  );
};

export default Footer;
