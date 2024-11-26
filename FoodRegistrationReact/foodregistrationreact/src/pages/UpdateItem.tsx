import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Item } from '../types/item';
import API_URL from '../apiConfig';

const UpdateItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Item | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the item details when the component mounts
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/api/items/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch item with ID ${id}.`);
        }

        const data: Item = await response.json();
        setFormData(data);
      } catch (error) {
        setSubmissionError(`Failed to fetch the item: ${error.message}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === 'number' ? (parseFloat(value) || undefined) : value,
          }
        : null
    );
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData?.name) newErrors.name = 'Name is required.';
    if (!formData?.category) newErrors.category = 'Category is required.';
    if (!formData?.countryOfOrigin) newErrors.countryOfOrigin = 'Country of origin is required.';
    if (!formData?.countryOfProvenance) newErrors.countryOfProvenance = 'Country of provenance is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm() || !formData) return;

    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update item with ID ${id}.`);
      }

      alert('Item updated successfully!');
      navigate('/');
    } catch (error) {
      setSubmissionError(`Failed to update the item: ${error.message}`);
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (submissionError) return <Alert variant="danger">{submissionError}</Alert>;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="card p-4 shadow" style={{ width: '600px' }}>
        <h1 className="text-center mb-4">Update Item</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData?.name || ''}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData?.category || ''}
              onChange={handleChange}
              isInvalid={!!errors.category}
            />
            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Certificate</Form.Label>
            <Form.Control
              type="text"
              name="certificate"
              value={formData?.certificate || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={formData?.imageUrl || ''}
              onChange={handleChange}
            />
          </Form.Group>

          {['energy', 'carbohydrates', 'sugar', 'protein', 'fat', 'saturatedfat', 'unsaturatedfat', 'fibre', 'salt'].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type="number"
                name={field}
                value={formData?.[field as keyof Item] || ''}
                onChange={handleChange}
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Country of Origin</Form.Label>
            <Form.Control
              type="text"
              name="countryOfOrigin"
              value={formData?.countryOfOrigin || ''}
              onChange={handleChange}
              isInvalid={!!errors.countryOfOrigin}
            />
            <Form.Control.Feedback type="invalid">{errors.countryOfOrigin}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Country of Provenance</Form.Label>
            <Form.Control
              type="text"
              name="countryOfProvenance"
              value={formData?.countryOfProvenance || ''}
              onChange={handleChange}
              isInvalid={!!errors.countryOfProvenance}
            />
            <Form.Control.Feedback type="invalid">{errors.countryOfProvenance}</Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Update Item
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
