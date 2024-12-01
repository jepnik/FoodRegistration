import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Item } from '../types/item';
import { getItems, deleteItem } from '../api/apiService';
import API_URL from '../apiConfig';
import ItemDetails from '../components/ItemDetails';
import { useAuth } from '../components/AuthContext';

const HomePage: React.FC = () => {
  const { token, logout } = useAuth(); // Include token
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
      setError(null); 

      try {
        // Check if the token exists
        if (!token) {
          throw new Error('User is not authenticated. Please log in.');
        }
         // Pass the token
        const data = await getItems(token);
        setItems(data);
        console.log(data); 
      } catch (error: any) {
        console.error(
          `There was a problem with the fetch operation: ${error.message}`
        );
        if (
          error.message === 'Unauthorized' ||
          error.message === 'Invalid token.' ||
          error.message === 'User is not authenticated. Please log in.'
        ) {
         
          logout(); 
          navigate('/login'); 
        } else {
          setError('Failed to fetch items.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [token, logout, navigate]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      // Check if the token exists
      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }
      
      //pass the token 
      await deleteItem(id, token); 
      setItems((prevItems) => prevItems.filter((item) => item.itemId !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      if (
        err.message === 'Unauthorized' ||
        err.message === 'Invalid token.' ||
        err.message === 'User is not authenticated. Please log in.'
      ) {
        // Token might be invalid or expired
        logout(); 
        navigate('/login'); 
      } else {
        alert(err.message || 'Failed to delete item.');
      }
    }
  };

  const handleSort = (column: string) => {
    const newSortDirection =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
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
      (item.certificate || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setShowDetails(true);
  };

  if (loading)
    return (
      <div className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" />
        <p>Loading items...</p>
      </div>
    );

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
            <th onClick={() => handleSort('itemId')} style={{ cursor: 'pointer' }}>
              ID{' '}
              {sortColumn === 'itemId'
                ? sortDirection === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name{' '}
              {sortColumn === 'name'
                ? sortDirection === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </th>
            <th
              onClick={() => handleSort('category')}
              style={{ cursor: 'pointer' }}
            >
              Category{' '}
              {sortColumn === 'category'
                ? sortDirection === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </th>
            <th>Certificate</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr
              key={item.itemId}
              onClick={() => handleRowClick(item.itemId)}
              style={{ cursor: 'pointer' }}
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
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                    }}
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
                    e.stopPropagation();
                    navigate(`/update/${item.itemId}`);
                  }}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
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

      <Button
        variant="primary"
        onClick={() => navigate('/create')}
        className="mt-3"
        style={{ color: 'white' }}
      >
        Create Item
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
