import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={logo} alt="Logo" className="logo me-2" />
        FOODTRACE
      </Link>

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
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
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
                <Link className="nav-link" to="/profile">Account</Link>
              </li>
              <li className="nav-item d-lg-none">
                <button
                  className="btn btn-link nav-link text-white"
                  style={{ textDecoration: 'none' }}
                  onClick={() => navigate('/logout')} // Navigate to Log out
                >
                  Log out
                </button>
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
              <li><Link className="dropdown-item" to="/profile">Account</Link></li>
              <li><button className="dropdown-item" onClick={() => navigate('/logout')}>Log out</button></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;