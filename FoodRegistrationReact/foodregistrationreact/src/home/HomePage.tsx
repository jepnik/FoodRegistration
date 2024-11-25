import React, { useState, useEffect } from 'react'; // Import React and hooks
import { Table, Button, Form } from 'react-bootstrap'; // Import required Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import API_URL from '../apiConfig';
import { Item } from '../types/item';

//const API_URL = 'http://localhost:5244'; // Adjust to match your backend's base URL

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]); // All items fetched from the API
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Items after filtering
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query input
  const navigate = useNavigate();


  // Fetch items from the API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/itemapi/items`); // Adjust endpoint as needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Item[] = await response.json(); // Parse response JSON
      setItems(data); // Update items state
      setFilteredItems(data); // Initialize filtered items
      console.log(data);
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch items.');
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Delete Item
  const deleteItem = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/itemapi/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }

      // Update local state to remove the deleted item
      setItems((prevItems) => prevItems.filter((item) => item.itemId !== id));
      setFilteredItems((prevItems) => prevItems.filter((item) => item.itemId !== id));
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // be abel to seacrh for big and small letter for name, category and certificate in the search bar 
  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.certificate.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="container mt-4">
      <h1 className="text-center">Food Items</h1>

      {/* Search bar */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, category, or certificate"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      {/* Error message display */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Table View */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Certificate</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.itemId}>
              <td>{item.itemId}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.certificate}</td>
              <td>
                <img
                  src={`${API_URL}${item.imageUrl}`}
                  alt={item.name}
                  style={{ width: '60px', height: '60px' }}
                />
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/update/${item.itemId}`)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteItem(item.itemId)} // Delete item on click
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button href='/create' className="btn btn-confirm mt-3">Create new item</Button>  
    </div>
  );
};


export default HomePage;
