import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css'; // Ensure the CSS is properly linked
import API_URL from '../apiConfig';

interface HeaderProps {
  userEmail?: string; // User's email to check authentication
}

const Header: React.FC<HeaderProps> = ({ userEmail }) => {
  const navigate = useNavigate();
  const logo = `${API_URL}/images/logoHvit.ico`;  // Dynamic logo
  const userIcon = `${API_URL}/images/UserLogo.png`;  // User Icon for the dropdown
  

  // Dropdown state for toggling visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('userToken');  // Clear the token
    navigate('/login');  // Redirect to login page
    setDropdownOpen(false); // Close dropdown on logout
  };

  // Toggle the dropdown when the user logo is clicked
  const handleUserLogoClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark shadow" style={{ backgroundColor: '#83B271' }}>
      {/* Brand Logo */}
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
          {/* Home and Create Item Links */}
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item">
            <button className="btn btn-link nav-link text-white" onClick={() => navigate('/create')}>Create Item</button>
          </li>

          {/* Account and Logout Links for Authenticated Users */}
          {userEmail && (
            <>
              <li className="nav-item d-lg-none"><Link className="nav-link" to="/profile">Account</Link></li>
              <li className="nav-item d-lg-none">
                <button className="btn btn-link nav-link text-white" onClick={handleLogout}>Log out</button>
              </li>
            </>
          )}
        </ul>

        {/* User Icon Dropdown for Larger Screens */}
        {userEmail && (
          <div className="dropdown ms-auto d-none d-lg-block">
            <button
              className="btn dropdown-toggle user-icon-btn"
              id="userMenuIcon"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img src={userIcon} alt="User Icon" className="user-icon" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuIcon">
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li> {/* Profile link */}
              <li><button className="dropdown-item" onClick={handleLogout}>Log Out</button></li>
            </ul>
          </div>
        )}
      </div>

      {/* User Logo in the Right Corner */}
      <div className="ms-auto">
        <img
          src={userIcon}
          alt="User Logo"
          className="user-logo d-none d-lg-block"
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'contain',
            cursor: 'pointer',
            transition: 'transform 0.3s ease', // Smooth transformation on hover
          }}
          onClick={handleUserLogoClick} // Toggle the dropdown menu
        />
        {/* Dropdown Menu for User Logo */}
        {dropdownOpen && (
          <div className="dropdown-menu dropdown-menu-end show custom-dropdown">
            {/* Profile Link or Log Out based on authentication */}
            {userEmail ? (
              <>
                <Link className="dropdown-item" to="/profile">Profile</Link> {/* Profile link */}
                <button className="dropdown-item" onClick={handleLogout}>Log Out</button>
              </>
            ) : (
              <Link className="dropdown-item" to="/login">Log Ut</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
