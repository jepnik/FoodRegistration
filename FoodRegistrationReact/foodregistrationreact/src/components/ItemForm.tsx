import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { Item } from "../types/item";

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (item: Item) => void;
  isUpdate: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  onSubmit,
  isUpdate,
}) => {
  const [formData, setFormData] = useState<Item>(
    initialData || {
      itemId: 0,
      name: "",
      category: "",
      certificate: "",
      imageUrl: "",
      energy: undefined,
      carbohydrates: undefined,
      sugar: undefined,
      protein: undefined,
      fat: undefined,
      saturatedfat: undefined,
      unsaturatedfat: undefined,
      fibre: undefined,
      salt: undefined,
      countryOfOrigin: "",
      countryOfProvenance: "",
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || undefined : value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.countryOfOrigin)
      newErrors.countryOfOrigin = "Country of origin is required.";
    if (!formData.countryOfProvenance)
      newErrors.countryOfProvenance = "Country of provenance is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Field configurations for dynamic rendering
  const fieldConfigurations = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Category", name: "category", type: "text", required: true },
    { label: "Certificate", name: "certificate", type: "text" },
    { label: "Image URL", name: "imageUrl", type: "text" },
    ...[
      "energy",
      "carbohydrates",
      "sugar",
      "protein",
      "fat",
      "saturatedfat",
      "unsaturatedfat",
      "fibre",
      "salt",
    ].map((field) => ({
      label: field.charAt(0).toUpperCase() + field.slice(1),
      name: field,
      type: "number",
    })),
    {
      label: "Country of Origin",
      name: "countryOfOrigin",
      type: "text",
      required: true,
    },
    {
      label: "Country of Provenance",
      name: "countryOfProvenance",
      type: "text",
      required: true,
    },
  ];

  return (
    <Form id="item-form" onSubmit={handleSubmit}>
      {Object.keys(errors).length > 0 && (
        <Alert variant="danger">
          <ul className="mb-0">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Render Fields Dynamically */}
      {fieldConfigurations.map(({ label, name, type, required }) => (
        <Form.Group key={name} className="mb-3">
          <Form.Label>{label}</Form.Label>
          <Form.Control
            type={type}
            name={name}
            value={formData[name as keyof Item] ?? ""} // Handle undefined values
            onChange={handleChange}
            isInvalid={required && !!errors[name]}
            required={required} // Enables HTML5 validation
          />
          {required && (
            <Form.Control.Feedback type="invalid">
              {errors[name]}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      ))}
    </Form>
  );
};

export default ItemForm;
