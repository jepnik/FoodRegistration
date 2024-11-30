import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css'; // Ensure the CSS is properly linked
import API_URL from '../apiConfig';
import { useAuth } from '../components/AuthContext'; // Import useAuth

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Get authentication state and logout function
  const logo = `${API_URL}/images/logoHvit.ico`;
  const userIcon = `${API_URL}/images/UserLogo.png`;

  // Dropdown state for toggling visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Toggle the dropdown when the user icon is clicked
  const handleUserIconClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  // Add event listener for clicks outside the dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow"
      style={{ backgroundColor: '#83B271' }}
    >
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" className="logo me-2" />
          FOODTRACE
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="navbar-nav d-none d-sm-flex flex-row align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/create">
                Create
              </Link>
            </li>
          )}
        </ul>

        {/* Spacer to push user icon to the right */}
        <div className="flex-grow-1"></div>

        {/* User Icon and Dropdown */}
        {isAuthenticated && (
          <div className="d-flex align-items-center" ref={dropdownRef}>
            {/* User Icon */}
            <div className="user-icon-wrapper">
              <img
                src={userIcon}
                alt="User Icon"
                className="user-icon"
                onClick={handleUserIconClick}
              />
              {dropdownOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show custom-dropdown"
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '60px',
                    zIndex: 1000,
                  }}
                >
                  {/* Mobile Navigation Links */}
                  <Link
                    to="/"
                    className="dropdown-item d-sm-none"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/create"
                    className="dropdown-item d-sm-none"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Create
                  </Link>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile View: Hamburger Menu for Unauthenticated Users */}
        {!isAuthenticated && (
          <button
            className="navbar-toggler ms-auto"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={dropdownOpen}
            aria-label="Toggle navigation"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {/* Mobile View: Dropdown Menu for Unauthenticated Users */}
        {!isAuthenticated && dropdownOpen && (
          <div
            className="dropdown-menu dropdown-menu-end show custom-dropdown"
            style={{
              position: 'absolute',
              right: '10px',
              top: '60px',
              zIndex: 1000,
            }}
          >
            <Link
              to="/login"
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
