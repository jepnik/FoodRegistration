// src/components/ItemForm.tsx

import React from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Item } from '../types/item';
import { useNavigate } from 'react-router-dom';

interface ItemFormProps {
  formData: Item;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  submissionError: string | null;
  successMessage: string | null;
  mode: 'create' | 'update'; // New prop to determine the form mode
}

const ItemForm: React.FC<ItemFormProps> = ({
  formData,
  errors,
  handleChange,
  handleSubmit,
  isSubmitting,
  submissionError,
  successMessage,
  mode, // Destructure the new prop
}) => {
  const navigate = useNavigate(); // Define navigate function

  // Helper function to format field names
  const formatFieldName = (field: string): string => {
    return field
      .replace(/([A-Z])/g, ' ') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
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
          <h1 className="text-center mb-4">
            {mode === 'create' ? 'Create New Item' : 'Update Item'}
          </h1>

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
                    <Spinner as="span" animation="border" size="sm" />{' '}
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  mode === 'create' ? 'Create Item' : 'Update Item'
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

export default ItemForm;
