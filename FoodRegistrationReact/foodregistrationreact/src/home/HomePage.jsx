import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

const API_URL = "http://localhost:5244"; // Sett din backend API URL her

const HomePage = () => {
  // Hooks for state management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch items from the backend API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/itemapi/items`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Parse JSON response
      setItems(data); // Update state with fetched data
      console.log(data); // Debugging
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch items.'); // Set error state
    } finally {
      setLoading(false); // End loading
    }
  };

  // Hook to fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdate = (itemId) => {
    console.log(`Update item with ID: ${itemId}`);
    // Naviger til oppdateringssiden, eller implementer oppdateringslogikk
  };

  const handleDelete = (itemId) => {
    console.log(`Delete item with ID: ${itemId}`);
    // Implementer sletteloggikk
  };

  const handleCreate = () => {
    console.log("Navigate to Create Item page");
    // Naviger til opprettelsesiden
  };

  return (
    <div className="table-container">
      <h1 className="text-center">Food Items</h1>
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
          {items.map(item => (
            <tr key={item.itemId}>
              <td>{item.itemId}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.certificate}</td>
              <td>
                <img src={`${API_URL}${item.imageUrl}`} alt={item.name}
                 width="60" /*  style={{ width: "60px", height: "60px" }} */
                />
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleUpdate(item.itemId)}
                  className="me-2"
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.itemId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="create-button-container">
        <Button variant="primary" size="lg" onClick={handleCreate}>
          Create New Item
        </Button>
      </div>
    </div>
  );
};

export default HomePage;