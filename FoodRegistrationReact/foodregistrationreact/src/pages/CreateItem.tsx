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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="card p-4 shadow" style={{ width: '600px' }}>
        <h1 className="text-center mb-4">Create New Item</h1>
        <ItemForm onSubmit={handleCreate} isUpdate={false} />
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-primary"
            type="submit"
            form="item-form"
          >
            Create Item
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
