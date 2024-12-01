import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Spinner, Button, Form, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { deleteUser } from '../api/apiService';
import { useAuth } from '../components/AuthContext';
import '../styles/deleteUser.css';

const DeleteUser: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors([error.message || 'Failed to delete account.']);
      } else {
        setErrors(['An unexpected error occurred.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <Container className="d-flex justify-content-center align-items min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto">
          <Card className="delete-user-card p-4 shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Delete Account</h2>
              {errors.length > 0 && (
                <Alert variant="danger" className="text-center">
                  <ul className="mb-0">
                    {errors.map((err, idx) => (
                      <div key={idx}>{err}</div>
                    ))}
                  </ul>
                </Alert>
              )}
              {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

              <Form onSubmit={handleDelete}>
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Confirm Your Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>

                <Form.Group controlId="confirmDeletion" className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label="I understand that deleting my account is irreversible."
                    checked={confirmDeletion}
                    onChange={(e) => setConfirmDeletion(e.target.checked)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="danger" type="submit" disabled={loading} className="flex-grow-1 me-2">
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} className="flex-grow-1 ms-2">
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action is irreversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteUser;
