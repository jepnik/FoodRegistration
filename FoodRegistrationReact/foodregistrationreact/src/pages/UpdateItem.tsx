import React, { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Item } from '../types/item';
import { getItemById, updateItem } from '../api/apiService';
import { useAuth } from '../components/AuthContext';

const UpdateItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, logout } = useAuth(); // Include token
  const [formData, setFormData] = useState<Item | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch the item details when the component mounts
  useEffect(() => {
    const fetchItem = async () => {
      if (!token) {
        setSubmissionError('User is not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const data: Item = await getItemById(Number(id), token); // Pass the token
        setFormData(data);
      } catch (error: any) {
        console.error('Fetch error:', error);
        if (
          error.message === 'Unauthorized' ||
          error.message === 'Invalid token.' ||
          error.message === 'jwt expired' ||
          error.message === 'User is not authenticated. Please log in.'
        ) {
          // Token might be invalid or expired
          logout(); // Clear authentication state
          navigate('/login'); // Redirect to login page
        } else {
          setSubmissionError(`Failed to fetch the item: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, token, logout, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || undefined : value,
          }
        : null
    );
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData?.name) newErrors.name = 'Name is required.';
    if (!formData?.category) newErrors.category = 'Category is required.';
    if (!formData?.countryOfOrigin)
      newErrors.countryOfOrigin = 'Country of origin is required.';
    if (!formData?.countryOfProvenance)
      newErrors.countryOfProvenance = 'Country of provenance is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm() || !formData) return;

    if (!token) {
      setSubmissionError('User is not authenticated. Please log in.');
      return;
    }

    setIsSubmitting(true); // Start submission loading state
    try {
      await updateItem(Number(id), formData, token); // Pass the token

      alert('Item updated successfully!');
      navigate('/'); // Redirect to home page
    } catch (error: any) {
      console.error('Update error:', error);
      if (
        error.message === 'Unauthorized' ||
        error.message === 'Invalid token.' ||
        error.message === 'jwt expired' ||
        error.message === 'User is not authenticated. Please log in.'
      ) {
        // Token might be invalid or expired
        logout(); // Clear authentication state
        navigate('/login'); // Redirect to login page
      } else {
        setSubmissionError(`Failed to update the item: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false); // End submission loading state
    }
  };

  if (loading)
    return (
      <div className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" />
        <p>Loading item details...</p>
      </div>
    );

  if (submissionError)
    return (
      <Alert variant="danger" className="text-center">
        {submissionError}
      </Alert>
    );

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="card p-4 shadow" style={{ width: '600px' }}>
        <h1 className="text-center mb-4">Update Item</h1>
        <Form onSubmit={handleSubmit}>
          {/* Name Field */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData?.name || ''}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Category Field */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData?.category || ''}
              onChange={handleChange}
              isInvalid={!!errors.category}
            />
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Certificate Field */}
          <Form.Group className="mb-3">
            <Form.Label>Certificate</Form.Label>
            <Form.Control
              type="text"
              name="certificate"
              value={formData?.certificate || ''}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Image URL Field */}
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={formData?.imageUrl || ''}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Nutritional Fields */}
          {[
            'energy',
            'carbohydrates',
            'sugar',
            'protein',
            'fat',
            'saturatedfat',
            'unsaturatedfat',
            'fibre',
            'salt',
          ].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Form.Label>
              <Form.Control
                type="text"
                name={field}
                value={formData ? (formData[field as keyof Item] ?? '') : ''}
                onChange={handleChange}
              />
            </Form.Group>
          ))}

          {/* Country of Origin Field */}
          <Form.Group className="mb-3">
            <Form.Label>Country of Origin</Form.Label>
            <Form.Control
              type="text"
              name="countryOfOrigin"
              value={formData?.countryOfOrigin || ''}
              onChange={handleChange}
              isInvalid={!!errors.countryOfOrigin}
            />
            <Form.Control.Feedback type="invalid">
              {errors.countryOfOrigin}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Country of Provenance Field */}
          <Form.Group className="mb-3">
            <Form.Label>Country of Provenance</Form.Label>
            <Form.Control
              type="text"
              name="countryOfProvenance"
              value={formData?.countryOfProvenance || ''}
              onChange={handleChange}
              isInvalid={!!errors.countryOfProvenance}
            />
            <Form.Control.Feedback type="invalid">
              {errors.countryOfProvenance}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Submit and Cancel Buttons */}
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Item'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateItem;
