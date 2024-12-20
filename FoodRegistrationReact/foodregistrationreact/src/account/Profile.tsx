import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { getProfile, logoutUser } from '../api/apiService';
import { useAuth } from '../components/AuthContext';
import API_URL from '../apiConfig';

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

  // Get user icon based on email domain
  const getUserIcon = (email: string): string => {
    // If no email, return default icon
    if (!email) return `${API_URL}/images/FoodTrace.png`;

    const domain = email.split('@')[1];

    // Return icon based on domain
    return domain === 'foodcompany.com'
      ? `${API_URL}/images/UserLogo.png`
      : `${API_URL}/images/AlternativeUserLogo.png`;
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      // Check if the token exists
      if (!token) {
        setError('User is not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, logout, navigate]);

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during logout.');
    }
  };

  if (loading) {
    return (
      <div className="text-center" >
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
      //style={{ minHeight: '10vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="d-flex flex-column align-items-center p-4">
        <h1 className="text-center mb-4">Profile</h1>
        {profile && (
          <>
            {/* Display the user icon as a circular image */}
            <div className="text-center mb-4">
              <img
                src={getUserIcon(profile.email)}
                alt="User Icon"
                className="rounded-circle"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
              <p>
                This application allows you to register, track, and manage food items along with their nutritional
                content. 
            </p>
            <p>
              You can perform the following actions:
            </p>
            <ul>
                <li>
                    <strong>Change Password:</strong> Update your password to ensure your account remains secure.
                </li>
                <li>
                    <strong>Delete Account:</strong> Permanently remove your account and all associated data from the
                    system.
                </li>
            </ul>

            <div className="d-flex flex-column">
              <Button
                className="mb-3"
                variant="success"
                onClick={() => navigate('/change-password')}
              >
                Change Password
              </Button>
              <Button 
              className="mb-3"
              variant="secondary" onClick={handleLogout}
              style={{ color: 'white', fontSize: '1rem' }}>

                Log Out
              </Button>
              {/* Replace "Edit Profile" button with "Delete Account" button */}
              <Button
                className="mb-3"
                variant="danger"
                onClick={() => navigate('/delete-user')}
              >
                Delete Account
              </Button>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
