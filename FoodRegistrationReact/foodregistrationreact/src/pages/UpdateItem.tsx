import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Item } from '../types/item';
import ItemForm from '../components/ItemForm';
import API_URL from '../apiConfig';

const UpdateItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/api/itemapi/items/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item.');
        const data: Item = await response.json();
        setItem(data);
      } catch (err) {
        setError('Failed to fetch item');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleUpdate = async (updatedItem: Item) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to update this item?');
    if (!isConfirmed) return; // If the user cancels, don't proceed with the update

    try {
      const response = await fetch(`${API_URL}/api/itemapi/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error('Failed to update item.');
      }

      navigate(`/details/${id}`); // Redirect to the item details page after successful update
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>No item found</p>;

  return (
    <div>
      <h2>Update Item</h2>
      <ItemForm initialData={item} onSubmit={handleUpdate} isUpdate={true} />
    </div>
  );
};

export default UpdateItem;
