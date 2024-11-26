import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Item } from '../types/item';

interface ItemFormProps {
  initialData?: Item;  // initial data for update
  onSubmit: (item: Item) => void; // callback for form submission
  isUpdate: boolean;  // indicates whether it's update or create
}

const ItemForm: React.FC<ItemFormProps> = ({ initialData, onSubmit, isUpdate }) => {
  const [formData, setFormData] = useState<Item>(initialData || {
    itemId: 0,
    name: '',
    category: '',
    certificate: '',
    imageUrl: '',
    energy: undefined,
    carbohydrates: undefined,
    sugar: undefined,
    protein: undefined,
    fat: undefined,
    saturatedfat: undefined,
    unsaturatedfat: undefined,
    fibre: undefined,
    salt: undefined,
    countryOfOrigin: '',
    countryOfProvenance: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' && value === '' ? undefined : value,
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (!formData.countryOfOrigin) newErrors.countryOfOrigin = 'Country of origin is required.';
    if (!formData.countryOfProvenance) newErrors.countryOfProvenance = 'Country of provenance is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <div className="container mt-4">
      <h1>{isUpdate ? 'Update Item' : 'Create New Item'}</h1>
      {submissionError && <Alert variant="danger">{submissionError}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        {/* Other form fields such as category, certificate, image URL, and numeric fields */}
        
        <Button variant="primary" type="submit">
          {isUpdate ? 'Update Item' : 'Create Item'}
        </Button>
      </Form>
    </div>
  );
};

export default ItemForm;
