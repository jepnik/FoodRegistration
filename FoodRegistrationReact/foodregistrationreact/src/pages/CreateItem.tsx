// src/pages/CreateItem.tsx

import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Item } from '../types/item';
import { createItem } from '../api/apiService';
import { useAuth } from '../components/AuthContext'; // Import AuthContext for token and logout
import '../styles/site.css'; // Ensure the correct path to your CSS

const CreateItem: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth(); // Get the token and logout function

  // Initialize form data excluding itemId as it will be ignored on the backend
  const [formData, setFormData] = useState<Item>({
    itemId: 0, // Default value; will be ignored by the backend
    name: '',
    category: '',
    certificate: '',
    imageUrl: '',
    energy: undefined,
    carbohydrates: undefined,
    sugar: undefined,
    protein: undefined,
    fat: undefined,
    saturatedfat: undefined, // Correct key
    unsaturatedfat: undefined, // Correct key
    fibre: undefined,
    salt: undefined,
    countryOfOrigin: undefined,
    countryOfProvenance: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? parseFloat(value) : type === 'number' ? 0 : value,
    }));

    // Clear the specific field error on change
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Helper function to format field names
  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' ') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required Fields
    if (!formData.name?.trim()) newErrors.name = 'Name is required.';
    if (!formData.category?.trim()) newErrors.category = 'Category is required.';
    if (!formData.countryOfOrigin?.trim())
      newErrors.countryOfOrigin = 'Country of origin is required.';
    if (!formData.countryOfProvenance?.trim())
      newErrors.countryOfProvenance = 'Country of provenance is required.';

    // Nutritional Fields Validation
    const nutritionalFields: Array<keyof typeof formData> = [
      'energy',
      'carbohydrates',
      'sugar',
      'protein',
      'fat',
      'saturatedfat', // Correct key
      'unsaturatedfat', // Correct key
      'fibre',
      'salt',
    ];

    nutritionalFields.forEach((field) => {
      const value = formData[field];
      if (typeof value !== 'number' || isNaN(value)) {
        const fieldName = formatFieldName(field);
        newErrors[field] = `${fieldName} must have a valid numerical value.`;
      } else if (value < 0) {
        const fieldName = formatFieldName(field);
        newErrors[field] = `${fieldName} cannot be negative.`;
      }
    });

    // **New Validation: Sum of Saturated Fat and Unsaturated Fat Equals Fat**
    const saturatedFat = formData.saturatedfat;
    const unsaturatedFat = formData.unsaturatedfat;
    const totalFat = formData.fat;

    if (
      typeof saturatedFat === 'number' &&
      typeof unsaturatedFat === 'number' &&
      typeof totalFat === 'number'
    ) {
      const calculatedFat = saturatedFat + unsaturatedFat;
      // Allow a small margin for floating-point arithmetic
      if (Math.abs(calculatedFat - totalFat) > 0.0001) {
        newErrors.saturatedfat =
          'Sum of Saturated Fat and Unsaturated Fat must equal Fat.';
        newErrors.unsaturatedfat =
          'Sum of Saturated Fat and Unsaturated Fat must equal Fat.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    // Check if the token exists
    if (!token) {
      setSubmissionError('User is not authenticated. Please log in.');
      return;
    }

    setIsSubmitting(true); // Start submission loading state
    try {
      await createItem(formData, token); // Pass the token to createItem

      setSuccessMessage('Item created successfully!');
      // Optionally, navigate to another page after a short delay
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error: any) {
      console.error('Creation error:', error);
      if (
        error.response?.status === 401 ||
        error.message === 'Unauthorized' ||
        error.message === 'Invalid token.' ||
        error.message === 'User is not authenticated. Please log in.'
      ) {
        // Token might be invalid or expired
        logout(); // Clear authentication state
        navigate('/login'); // Redirect to login page
      } else if (error.response?.status === 400 && error.response.data) {
        // Handle validation errors from the backend
        const backendErrors = error.response.data.errors;
        if (backendErrors) {
          const formattedErrors: { [key: string]: string } = {};
          Object.keys(backendErrors).forEach((key) => {
            formattedErrors[key] = backendErrors[key].join(' ');
          });
          setErrors(formattedErrors);
          setSubmissionError('Please correct the highlighted errors.');
        } else {
          setSubmissionError(`Failed to create the item: ${error.message}`);
        }
      } else {
        setSubmissionError(`Failed to create the item: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false); // End submission loading state
    }
  };

  return (
    <>
      {/* Inject CSS to remove number input spinners */}
      <style>
        {`
          /* Chrome, Safari, Edge, Opera */
          input[type=number]::-webkit-outer-spin-button,
          input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <div className="card p-4 shadow" style={{ width: '600px' }}>
          <h1 className="text-center mb-4">Create New Item</h1>

          {/* Success Message */}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          {/* Submission Error Message */}
          {submissionError && <Alert variant="danger">{submissionError}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Name Field */}
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                // Removed placeholder
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Category Field */}
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                isInvalid={!!errors.category}
                // Removed placeholder
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
                value={formData.certificate || ''}
                onChange={handleChange}
                // Removed placeholder
              />
            </Form.Group>

            {/* Image URL Field */}
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                // Removed placeholder
              />
            </Form.Group>

            <h2 className="text-center">Nutritional Information per 100g</h2>

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
                <Form.Label>{formatFieldName(field)} *</Form.Label>
                <Form.Control
                  type="number" 
                  name={field}
                  value={formData[field as keyof typeof formData] ?? ''}
                  onChange={handleChange}
                  isInvalid={!!errors[field]}
                  min="0" 
                  step="any" 
                  onWheel={(e) => e.currentTarget.blur()} 
                />
                <Form.Control.Feedback type="invalid">
                  {errors[field]}
                </Form.Control.Feedback>
              </Form.Group>
            ))}

            {/* Country of Origin Field */}
            <Form.Group className="mb-3">
              <Form.Label>Country of Origin *</Form.Label>
              <Form.Control
                type="text"
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                isInvalid={!!errors.countryOfOrigin}
                // Removed placeholder
              />
              <Form.Control.Feedback type="invalid">
                {errors.countryOfOrigin}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Country of Provenance Field */}
            <Form.Group className="mb-3">
              <Form.Label>Country of Provenance *</Form.Label>
              <Form.Control
                type="text"
                name="countryOfProvenance"
                value={formData.countryOfProvenance}
                onChange={handleChange}
                isInvalid={!!errors.countryOfProvenance}
                // Removed placeholder
              />
              <Form.Control.Feedback type="invalid">
                {errors.countryOfProvenance}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Submit and Cancel Buttons */}
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="create-button"
                style={{ width: '130px', height: '40px' }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" /> Creating...
                  </>
                ) : (
                  'Create Item'
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                style={{ width: '130px', height: '40px' }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateItem;
