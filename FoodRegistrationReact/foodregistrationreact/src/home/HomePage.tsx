import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Item } from '../types/item';
import API_URL from '../apiConfig';
import ItemDetails from '../components/ItemDetails';

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/items`);
        if (!response.ok) {
          throw new Error('Failed to fetch items.');
        }
        const data: Item[] = await response.json();
        setItems(data);
      } catch (err) {
        setError('Failed to fetch items.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Delete an item
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }
      setItems((prevItems) => prevItems.filter((item) => item.itemId !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  // Sorting functionality
  const handleSort = (column: string) => {
    const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedItems = [...items].sort((a, b) => {
      const aValue = a[column as keyof Item];
      const bValue = b[column as keyof Item];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newSortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setItems(sortedItems);
  };

  // Filter items based on search query
  const filteredItems = items.filter(
    (item) =>
      item.itemId.toString().includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.certificate && item.certificate.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show item details in modal
  const handleRowClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setShowDetails(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h1>Food Items</h1>

      {/* Search bar */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by ID, Name, Category, or Certificate"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {/* Table View */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th
              onClick={() => handleSort('itemId')}
              style={{ cursor: 'pointer', fontWeight: sortColumn === 'itemId' ? 'bold' : 'normal' }}
            >
              ID {sortColumn === 'itemId' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort('name')}
              style={{ cursor: 'pointer', fontWeight: sortColumn === 'name' ? 'bold' : 'normal' }}
            >
              Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort('category')}
              style={{ cursor: 'pointer', fontWeight: sortColumn === 'category' ? 'bold' : 'normal' }}
            >
              Category {sortColumn === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort('certificate')}
              style={{ cursor: 'pointer', fontWeight: sortColumn === 'certificate' ? 'bold' : 'normal' }}
            >
              Certificate {sortColumn === 'certificate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr
              key={item.itemId}
              style={{ cursor: 'pointer', backgroundColor: '#f9f9f9', borderRadius: '5px' }}
              onClick={() => handleRowClick(item.itemId)}
            >
              <td>{item.itemId}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.certificate || 'N/A'}</td>
              <td>
                {item.imageUrl ? (
                  <img
                    src={`${API_URL}${item.imageUrl}`}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    navigate(`/update/${item.itemId}`);
                  }}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    handleDelete(item.itemId);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Item Details */}
      {selectedItemId && (
        <ItemDetails
          show={showDetails}
          onHide={() => setShowDetails(false)}
          itemId={selectedItemId}
        />
      )}
     
        <Button
          variant="primary"
          onClick={() => navigate('/create')}
          className="mb-3"
        >
          Create New Item
        </Button>
      </div>  
  );
};

export default HomePage;
