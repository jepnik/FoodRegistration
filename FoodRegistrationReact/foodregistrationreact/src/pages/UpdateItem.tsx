import React, { useState, useEffect } from 'react';  
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Item } from '../types/item';
import { getItemById, updateItem } from '../api/apiService';
import { useAuth } from '../components/AuthContext';
import ItemForm from '../components/ItemForm'; 

const UpdateItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [formData, setFormData] = useState<Item | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper function to format field names for validation messages
  const formatFieldName = (field: string): string => {
    return field
      .replace(/([A-Z])/g, ' ') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  // Fetch the item details when the component mounts
  useEffect(() => {
    const fetchItem = async () => {
      if (!token) {
        setSubmissionError('User is not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const data: Item = await getItemById(Number(id), token);
        if (!data) {
          setSubmissionError('Item not found.');
        } else {
          setFormData(data);
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        const status = error.response?.status;
        if ([401, 403].includes(status) || 
            error.message.includes('Unauthorized') || 
            error.message.includes('Invalid token') || 
            error.message.includes('jwt expired')) {
          logout();
          navigate('/login');
        } else if (status === 404) {
          setSubmissionError('Item not found.');
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

    setFormData(prev => prev ? ({
      ...prev,
      [name]: type === 'number' && value !== '' ? parseFloat(value) : type === 'number' ? 0 : value,
    }) : prev);

    // Clear the specific field error on change
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required Fields
    if (!formData?.name?.trim()) newErrors.name = 'Name is required.';
    if (!formData?.category?.trim()) newErrors.category = 'Category is required.';
    if (!formData?.countryOfOrigin?.trim())
      newErrors.countryOfOrigin = 'Country of origin is required.';
    if (!formData?.countryOfProvenance?.trim())
      newErrors.countryOfProvenance = 'Country of provenance is required.';

    // Nutritional Fields Validation
    const nutritionalFields: Array<keyof typeof formData> = [
      'energy',
      'carbohydrates',
      'sugar',
      'protein',
      'fat',
      'saturatedfat',
      'unsaturatedfat',
      'fibre',
      'salt',
    ];

    nutritionalFields.forEach((field) => {
      const value = formData?.[field];
      if (typeof value !== 'number' || isNaN(value)) {
        const fieldName = formatFieldName(field);
        newErrors[field] = `${fieldName} must have a valid numerical value.`;
      } else if (value < 0) {
        const fieldName = formatFieldName(field);
        newErrors[field] = `${fieldName} cannot be negative.`;
      }
    });

    // Validation: Sum of Saturated Fat and Unsaturated Fat Equals Fat
    const saturatedFat = formData?.saturatedfat;
    const unsaturatedFat = formData?.unsaturatedfat;
    const totalFat = formData?.fat;

    if (
      typeof saturatedFat === 'number' &&
      typeof unsaturatedFat === 'number' &&
      typeof totalFat === 'number'
    ) {
      const calculatedFat = saturatedFat + unsaturatedFat;
      // Allow a small margin for floating-point arithmetic
      if (Math.abs(calculatedFat - totalFat) > 0.0001) {
        newErrors.saturatedfat = 'Sum of Saturated Fat and Unsaturated Fat must equal Fat.';
        newErrors.unsaturatedfat = 'Sum of Saturated Fat and Unsaturated Fat must equal Fat.';
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

    if (!validateForm() || !formData) return;

    if (!token) {
      setSubmissionError('User is not authenticated. Please log in.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateItem(Number(id), formData, token);
      setSuccessMessage('Item updated successfully!');
      // Optionally, navigate to another page after a short delay
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error: any) {
      console.error('Update error:', error);
      if (
        error.response?.status === 401 ||
        error.message.includes('Unauthorized') ||
        error.message.includes('Invalid token') ||
        error.message.includes('jwt expired')
      ) {
        logout();
        navigate('/login');
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
          setSubmissionError(`Failed to update the item`);
        }
      } else {
        setSubmissionError(`Failed to update the item`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (loading)
    return (
      <div className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" />
        <p>Loading item details...</p>
      </div>
    );

  return (
    <ItemForm
      formData={formData}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submissionError={submissionError}
      successMessage={successMessage}
      mode="update" // Set the mode to 'update'
    />
  );
};

export default UpdateItem;
