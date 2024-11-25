import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Item } from '../types/item';
import API_URL from '../apiConfig';

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('name'); // Column to sort by
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Sorting direction
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch items when component mounts
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/itemapi/items`);
        if (!response.ok) {
          throw new Error('Failed to fetch items.');
        }
        const data: Item[] = await response.json();
        setItems(data);
      } catch (error) {
        setError('Failed to fetch items.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Sorting function for Name and ID
  const handleSort = (column: string) => {
    const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedItems = [...items];
    sortedItems.sort((a, b) => {
      if (column === 'name') {
        return newSortDirection === 'asc'
          ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          : b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      } else if (column === 'id') {
        return newSortDirection === 'asc' ? a.itemId - b.itemId : b.itemId - a.itemId;
      }
      return 0;
    });
    setItems(sortedItems);
  };

  // Handling item deletion
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_URL}/api/itemapi/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }
      setItems((prevItems) => prevItems.filter((item) => item.itemId !== id));
    } catch (error) {
      alert('Failed to delete item.');
    }
  };

  // Filtering items by name or category
  const filtered = items.filter(
    (item) =>
      item.itemId.toString().includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.certificate && item.certificate.toLowerCase().includes(searchQuery.toLowerCase()
  ));
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container mt-4">
      <h1>Food Items</h1>

      {/* Search bar */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {/* Table View */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              ID {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('name')}>
              Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Category</th>
            <th>Certificate</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.itemId}>
              <td>{item.itemId}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.certificate || 'N/A'}</td>
              <td>
                {item.imageUrl ? (
                  <img
                    src={`${API_URL}${item.imageUrl}`}
                    alt={item.name}
                    style={{ width: '60px', height: '60px' }}
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td>
                <Button variant="success" size="sm" onClick={() => navigate(`/update/${item.itemId}`)}>
                  Update
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.itemId)}>
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
