import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Item } from '../types/item';
import ItemDetails from './ItemDetails';

interface ItemTableProps {
  items: Item[];
  onDelete: (id: number) => void; // Callback to handle delete action
  onUpdate: (id: number) => void; // Callback to handle update action
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onDelete, onUpdate }) => {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const handleRowClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setShowDetails(true);
  };

  return (
    <div>
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
          {items.map((item) => (
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
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '60px', height: '60px' }}
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    onUpdate(item.itemId);
                  }}
                >
                  Update
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    onDelete(item.itemId);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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

export default ItemTable;

