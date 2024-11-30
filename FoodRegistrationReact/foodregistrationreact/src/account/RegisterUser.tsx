// File: src/account/RegisterUser.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import PasswordStrengthMeter from '../components/passwordStrengthMeter'; // Ensure correct casing
import { registerUser } from '../api/apiService'; // Import the function
import '../styles/registerAndPassword.css';
import Footer from "../shared/Footer";
import '../styles/Footer.css';

const RegisterUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be 6 characters or longer');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      setLoading(true);
      const response = await registerUser(email, password, confirmPassword);
      console.log(response); // Log the server response
  
      // Use the response if needed, for example, display a message from the response
      if (response.message) {
        setSuccess(response.message);
      } else {
        setSuccess('Registration successful. Redirecting to login page...');
      }
  
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err); // Log the error
  
      // Handle 409 Conflict error
      if (err.message.includes('Email is already registered')) {
        setError('This email is already registered. Please use a different email.');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <>
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={5} className="mx-auto">
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          {success && <Alert variant="success" className="text-center">{success}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-100" // Ensures full width
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
               {/* Password Strength Meter */}
               <PasswordStrengthMeter password={password} />
               
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-100" // Ensures full width
              />
             
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-100" // Ensures full width
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    {' Registering...'}
                  </>
                ) : (
                  'Register'
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
    <Footer position="absolute" /> 
    </>
  );
};

export default RegisterUser;
