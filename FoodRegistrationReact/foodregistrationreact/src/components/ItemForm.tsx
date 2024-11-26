import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Item } from '../types/item';

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (item: Item) => void;
  isUpdate: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({ initialData, onSubmit, isUpdate }) => {
  const [formData, setFormData] = useState<Item>(
    initialData || {
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
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || undefined : value,
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
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {Object.keys(errors).length > 0 && (
        <Alert variant="danger">
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

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

      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          name="category"
          value={formData.category}
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
          value={formData.certificate}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </Form.Group>

      {['energy', 'carbohydrates', 'sugar', 'protein', 'fat', 'saturatedfat', 'unsaturatedfat', 'fibre', 'salt'].map((field) => (
        <Form.Group className="mb-3" key={field}>
          <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
          <Form.Control
            type="number"
            name={field}
            value={formData[field as keyof Item] || ''}
            onChange={handleChange}
          />
        </Form.Group>
      ))}

      <Form.Group className="mb-3">
        <Form.Label>Country of Origin</Form.Label>
        <Form.Control
          type="text"
          name="countryOfOrigin"
          value={formData.countryOfOrigin}
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
          value={formData.countryOfProvenance}
          onChange={handleChange}
          isInvalid={!!errors.countryOfProvenance}
        />
        <Form.Control.Feedback type="invalid">{errors.countryOfProvenance}</Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit">
        {isUpdate ? 'Update Item' : 'Create Item'}
      </Button>
    </Form>
  );
};

export default ItemForm;
