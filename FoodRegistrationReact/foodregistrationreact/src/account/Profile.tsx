import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { getProfile, logoutUser } from '../api/apiService';
import { useAuth } from '../components/AuthContext';
import '../styles/site.css';

interface UserProfile {
  userId: number;
  email: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      // Check if the token exists
      if (!token) {
        setError('User is not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile with token:', token); // Debugging statement
        const data = await getProfile(token); // Pass the token
        console.log('Profile data received:', data); // Debugging statement
        setProfile(data);
      } catch (err: any) {
        console.error('Fetch error:', err);

        if (
          err.message === 'Unauthorized' ||
          err.message === 'Invalid token.' ||
          err.message === 'jwt expired' ||
          err.message === 'User is not authenticated. Please log in.'
        ) {
          // Token might be invalid or expired
          logout(); // Clear authentication state
          navigate('/login'); // Redirect to login page
        } else {
          setError(err.message || 'An error occurred while fetching the profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, logout, navigate]);

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token); // Pass the token
      }
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during logout.');
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h1 className="text-center mb-4">Profile</h1>
        {profile && (
          <>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>User ID:</strong> {profile.userId}
            </p>
            <div className="d-flex flex-column">
              <Button
                className="mb-3"
                variant="primary"
                onClick={() => navigate('/change-password')}
                style={{ color: 'white', fontSize: '1rem' }}
              >
              Change Password
              </Button>
              <Button
                className="mb-3"
                variant="success"
                onClick={() => navigate('/edit-profile')}
                style={{ color: 'white', fontSize: '1rem' }}
              >
                Edit Profile
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
