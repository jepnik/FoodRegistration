import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/Header.css';

const API_URL = "http://localhost:5244";

// Define the props type
interface HeaderProps {
  userEmail?: string; // userEmail is optional and a string
}

const Header: React.FC<HeaderProps> = ({ userEmail }) => {
  const navigate = useNavigate(); // Hook for dynamic navigation
  const logo = `${API_URL}/images/logoHvit.ico`; // Dynamic logo from API
  const userIcon = `${API_URL}/images/userLogo.png`; // Dynamic user icon from API

  return (
    <header className="navbar navbar-expand-lg navbar-dark shadow" style={{ backgroundColor: '#83B271' }}>
      {/* Brand Logo and Name */}
      <a className="navbar-brand d-flex align-items-center" href="/">
        <img src={logo} alt="Logo" className="logo me-2" />
        FOODTRACE
      </a>

      {/* Hamburger Toggle Button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar Links and User Icon */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            {/* Replace href with a dynamic navigation handler */}
            <button
              className="btn btn-link nav-link text-white"
              style={{ textDecoration: 'none' }}
              onClick={() => navigate('/create')} // Navigate to Create Item page
            >
              Create Item
            </button>
          </li>

          {/* Account and Log out for Hamburger Menu */}
          {userEmail && (
            <>
              <li className="nav-item d-lg-none">
                <a className="nav-link" href="/account/profile">Account</a>
              </li>
              <li className="nav-item d-lg-none">
                <a className="nav-link" href="/account/logout">Log out</a>
              </li>
            </>
          )}
        </ul>

        {/* User Icon Dropdown for Large Screens */}
        {userEmail && (
          <div className="dropdown ms-auto d-none d-lg-block">
            <button
              className="btn dropdown-toggle user-icon-btn"
              id="userMenuIcon"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                src={userIcon}
                alt="User Icon"
                className="user-icon"
              />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuIcon">
              <li><a className="dropdown-item" href="/account/profile">Account</a></li>
              <li><a className="dropdown-item" href="/account/logout">Log out</a></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
