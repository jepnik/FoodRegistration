import React, { useState, useEffect } from 'react'; // Import React and hooks
import { Table, Button, Form } from 'react-bootstrap'; // Import required Bootstrap components

const API_URL = 'http://localhost:5244'; // Adjust to match your backend's base URL

const HomePage = () => {
  const [items, setItems] = useState([]); // All items fetched from the API
  const [filteredItems, setFilteredItems] = useState([]); // Items after filtering
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchQuery, setSearchQuery] = useState(''); // Search query input

  // Fetch items from the API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/itemapi/items`); // Adjust endpoint as needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Parse response JSON
      setItems(data); // Update items state
      setFilteredItems(data); // Initialize filtered items
      console.log(data); // Debugging
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

  // Update filtered items based on the search query
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query)) || // Optional category check
        (item.certificate && item.certificate.toLowerCase().includes(query)) // Optional certificate check
    );
    setFilteredItems(filtered);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Food Items</h1>
      
      {/* Search bar */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, category, or certificate"
          value={searchQuery}
          onChange={handleSearchChange}
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
                <Button variant="success" size="sm" className="me-2">
                  Update
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default HomePage;