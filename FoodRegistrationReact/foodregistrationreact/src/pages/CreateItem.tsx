import React from 'react';
import { useNavigate } from 'react-router-dom';
import ItemForm from '../components/ItemForm';
import { Item } from '../types/item';
import API_URL from '../apiConfig';

const CreateItem: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async (newItem: Item) => {
    try {
      const response = await fetch(`${API_URL}/api/itemapi/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to create item.');
      }

      alert('Item created successfully!');
      navigate('/'); // Navigate back to homepage
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create New Item</h1>
      <ItemForm
        onSubmit={handleCreate}
        isUpdate={false}
      />
    </div>
  );
};

export default CreateItem;
