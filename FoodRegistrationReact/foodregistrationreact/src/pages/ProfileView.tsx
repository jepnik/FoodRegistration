import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';
import API_URL from '../apiConfig';

interface UserProfile {
  userId: number;
  email: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/account/profile`, {
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile. Please log in.');
        }

        const data: UserProfile = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/account/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to log out.');
      }

      navigate('/login'); // Redirect to login page
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
    return <Alert variant="danger" className="text-center">{error}</Alert>;
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
              >
                Change Password
              </Button>
              <Button
                className="mb-3"
                variant="success"
                onClick={() => navigate('/edit-profile')}
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
