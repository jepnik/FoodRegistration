import React, { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { Item } from '../types/item';
import { getItemById, updateItem } from '../api/apiService';
import { useAuth } from '../components/AuthContext';
import ItemForm from '../components/ItemForm'; // Import the ItemForm component

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

  // Define required and nutritional fields
  const requiredFields: Array<keyof Item> = ['name', 'category', 'countryOfOrigin', 'countryOfProvenance'];
  const nutritionalFields: Array<keyof Item> = [
    'energy', 'carbohydrates', 'sugar', 'protein',
    'fat', 'saturatedfat', 'unsaturatedfat', 'fibre', 'salt'
  ];

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
          console.warn(`Item with ID ${id} not found.`);
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
      [name]: type === 'number' && value !== '' ? parseFloat(value) : value,
    }) : prev);

    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Helper function to format field names
  const formatFieldName = (field: string) =>
    field.replace(/([A-Z])/g, ' ').replace(/^./, str => str.toUpperCase());

  // Validate the form data
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    requiredFields.forEach(field => {
      const value = formData?.[field];
      if (!value?.toString().trim()) {
        newErrors[field] = `${formatFieldName(field)} is required.`;
      }
    });

    // Validate nutritional fields
    nutritionalFields.forEach(field => {
      const value = formData?.[field];
      if (typeof value !== 'number' || isNaN(value)) {
        newErrors[field] = `${formatFieldName(field)} must have a valid number.`;
      } else if (value < 0) {
        newErrors[field] = `${formatFieldName(field)} cannot be negative.`;
      }
    });

    // Validate fat composition
    const { saturatedfat, unsaturatedfat, fat } = formData || {};
    if (typeof saturatedfat === 'number' && typeof unsaturatedfat === 'number' && typeof fat === 'number') {
      const calculatedFat = saturatedfat + unsaturatedfat;
      if (Math.abs(calculatedFat - fat) > 0.0001) { // Allow minor floating-point discrepancies
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
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error: any) {
      console.error('Update error:', error);
      const status = error.response?.status;
      if ([401, 403].includes(status) || 
          error.message.includes('Unauthorized') || 
          error.message.includes('Invalid token') || 
          error.message.includes('jwt expired')) {
        logout();
        navigate('/login');
      } else if (status === 400 && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;
        const formattedErrors: { [key: string]: string } = {};
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = backendErrors[key].join(' ');
        });
        setErrors(formattedErrors);
        setSubmissionError('Please correct the highlighted errors.');
      } else if (status === 404) {
        setSubmissionError('Item not found.');
      } else {
        setSubmissionError(`Failed to update the item: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define form fields for dynamic rendering
  const formFields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Category', name: 'category', type: 'text', required: true },
    { label: 'Certificate', name: 'certificate', type: 'text', required: false },
    { label: 'Image URL', name: 'imageUrl', type: 'text', required: false },
    { label: 'Country of Origin', name: 'countryOfOrigin', type: 'text', required: true },
    { label: 'Country of Provenance', name: 'countryOfProvenance', type: 'text', required: true },
  ];

  const nutritionalFormFields = nutritionalFields.map(field => ({
    label: formatFieldName(field),
    name: field,
    type: 'number',
    required: true,
    min: 0,
    step: 'any',
  }));

  // Render loading state
  if (loading)
    return (
      <div className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" />
        <p>Loading item details...</p>
      </div>
    );

  // Render submission error with a "Go Back" option
  if (submissionError)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <Alert variant="danger" className="w-50 text-center">
          {submissionError}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/')}>
              Go Back
            </Button>
          </div>
        </Alert>
      </div>
    );

  // Render not found message if formData is null
  if (!formData)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <Alert variant="warning" className="w-50 text-center">
          Item not found.
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/')}>
              Go Back
            </Button>
          </div>
        </Alert>
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
