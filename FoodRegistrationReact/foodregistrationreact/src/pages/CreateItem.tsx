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
        method: 'POST', // Using POST to create new item
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem), // Sending new item data
      });

      if (!response.ok) {
        throw new Error('Failed to create item.');
      }

      navigate('/'); // Navigate back after successful creation
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  return (
    <div>
      <ItemForm onSubmit={handleCreate} isUpdate={false} /> {/* Pass handleCreate to ItemForm */}
    </div>
  );
};

export default CreateItem;
