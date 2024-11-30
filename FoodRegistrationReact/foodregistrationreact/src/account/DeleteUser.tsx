// File: src/account/DeleteUser.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Spinner, Button, Form } from 'react-bootstrap';
import { deleteUser } from '../api/apiService';
import { useAuth } from '../components/AuthContext';
import '../styles/deleteUser.css';

const DeleteUser: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage(null);

    // Client-side validation
    if (!confirmDeletion) {
      setErrors(['Please confirm that you want to delete your account.']);
      return;
    }

    if (password.length < 6) {
      setErrors(['Password must be at least 6 characters long.']);
      return;
    }

    try {
      setLoading(true);
      const data = await deleteUser(password, confirmDeletion, token!);
      setSuccessMessage(data.message || 'Account deleted successfully.');
      setPassword('');
      setConfirmDeletion(false);
      setTimeout(() => {
        logout(); // Clear auth context and tokens
        navigate('/register'); // Redirect to registration or home page
      }, 2000); // Redirect after 2 seconds
    } catch (error: any) {
      setErrors([error.message || 'Failed to delete account.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-user-form">
      <h2>Delete Account</h2>
      {errors.length > 0 && (
        <Alert variant="danger">
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </Alert>
      )}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleDelete}>
        <Form.Group controlId="password">
          <Form.Label>Confirm Your Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmDeletion" className="mt-3">
          <Form.Check
            type="checkbox"
            label="I understand that deleting my account is irreversible."
            checked={confirmDeletion}
            onChange={(e) => setConfirmDeletion(e.target.checked)}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between mt-3">
          <Button variant="danger" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Delete Account'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DeleteUser;

