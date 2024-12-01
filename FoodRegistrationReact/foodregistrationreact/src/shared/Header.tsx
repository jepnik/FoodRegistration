import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css'; 
import API_URL from '../apiConfig';
import { useAuth } from '../components/AuthContext'; 
import { getProfile } from '../api/apiService';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, token } = useAuth(); 
  const logo = `${API_URL}/images/logoHvit.ico`;

  // State for dropdown and user profile
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<{ email: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Function to get user icon based on email domain
  const getUserIcon = (email: string): string => {
    if (!email) return `${API_URL}/images/FoodTrace.png`; 
    const domain = email.split('@')[1];
    return domain === 'foodcompany.com'
      ? `${API_URL}/images/UserLogo.png`
      : `${API_URL}/images/AlternativeUserLogo.png`;
  };

  // Fetch user profile on load if authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && token) {
        try {
          const userProfile = await getProfile(token); 
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchUserProfile();
  }, [isAuthenticated, token]);

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  // Add event listener for outside clicks
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
        {isAuthenticated && profile && (
          <div className="d-flex align-items-center" ref={dropdownRef}>
            {/* User Icon */}
            <div className="user-icon-wrapper">
              <img
                src={getUserIcon(profile.email)}
                alt="User Icon"
                className="user-icon"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ cursor: 'pointer' }}
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

