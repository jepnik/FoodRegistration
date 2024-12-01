import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Alert, Spinner } from 'react-bootstrap';
import { Item } from '../types/item';
import { createItem } from '../api/apiService';
import { useAuth } from '../components/AuthContext'; 
import ItemForm from '../components/ItemForm'; // Adjust the path as needed

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
    countryOfOrigin: '',
    countryOfProvenance: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper function to format field names
  const formatFieldName = (field: string): string => {
    return field
      .replace(/([A-Z])/g, ' ') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

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
          setSubmissionError(`Failed to create the item.`);
        }
      } else {
        setSubmissionError(`Failed to create the item.`);
      }
    } finally {
      setIsSubmitting(false); // End submission loading state
    }
  };

  return (
    <ItemForm
      formData={formData}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submissionError={submissionError}
      successMessage={successMessage}
      mode="create" // Pass the mode prop
    />
  );
};

export default CreateItem;
