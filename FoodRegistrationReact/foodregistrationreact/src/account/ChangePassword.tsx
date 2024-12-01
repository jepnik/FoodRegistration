// File: src/account/ChangePassword.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner, Button, Form, Container, Row, Col } from "react-bootstrap";
import { changePassword } from "../api/apiService";
import { useAuth } from "../components/AuthContext";
import PasswordStrengthMeter from "../components/passwordStrengthMeter"; // Import the component
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

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={5} className="mx-auto">
          <h2 className="text-center mb-4">Change Password</h2>
          {errors.length > 0 && (
            <Alert variant="danger" className="text-center">
                {errors.map((err, idx) => (
                  <div key={idx}>{err}</div>
                ))}
            </Alert>
          )}
          {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="oldPassword" className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-100"
              />
            </Form.Group>

            <Form.Group controlId="newPassword" className="mb-3">
               {/* Password Strength Meter */}
               <PasswordStrengthMeter password={newPassword} />
               
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-100"
              />
             
            </Form.Group>

            <Form.Group controlId="confirmNewPassword" className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="w-100"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    {' Changing...'}
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
