import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner, Button } from "react-bootstrap";
import { changePassword } from "../api/apiService";
import { useAuth } from "../components/AuthContext";
import "../styles/registerAndPassword.css";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { token } = useAuth(); // Access to token

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage(null);

    // Client-side validation
    if (newPassword !== confirmNewPassword) {
      setErrors(['New passwords do not match.']);
      return;
    }

    if (newPassword.length < 6) {
      setErrors(['New password must be at least 6 characters long.']);
      return;
    }

    try {
      setLoading(true);
      const data = await changePassword(oldPassword, newPassword, token!);
      setSuccessMessage(data.message || 'Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => navigate('/profile'), 2000); // Redirect after 2 seconds
    } catch (error: any) {
      setErrors([error.message || 'Failed to change password.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Change Password</h2>
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

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-between mt-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/profile')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
