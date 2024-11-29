import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Item } from '../types/item';
import API_URL from '../apiConfig';
import ItemDetails from '../components/ItemDetails';
import { useAuth } from '../components/AuthContext';

const HomePage: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('itemId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/items`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          throw new Error('Failed to fetch items.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.itemId !== id));
      } else {
        throw new Error('Failed to delete item.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
  };

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

  const filteredItems = items.filter(
    (item) =>
      item.itemId.toString().includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.certificate && item.certificate.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <th onClick={() => handleSort('itemId')}>ID</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('category')}>Category</th>
            <th onClick={() => handleSort('certificate')}>Certificate</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.itemId} onClick={() => handleRowClick(item.itemId)}>
              <td>{item.itemId}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.certificate || 'N/A'}</td>
              <td>
                {item.imageUrl ? (
                  <img
                    src={`${API_URL}${item.imageUrl}`} // Ensure the full URL is used
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
                  onClick={() => navigate(`/update/${item.itemId}`)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.itemId); }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create Button */}
      <Button variant="primary" onClick={() => navigate('/create')} className="mt-3">
        Create New Item
      </Button>

      {/* Modal for Item Details */}
      {selectedItemId && (
        <ItemDetails
          show={showDetails}
          onHide={() => setShowDetails(false)}
          itemId={selectedItemId}
        />
      )}
    </div>
  );
};

export default HomePage;
