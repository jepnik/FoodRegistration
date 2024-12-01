import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Item } from '../types/item';
import ItemDetails from './ItemDetails';

interface ItemTableProps {
  items: Item[];
  onDelete: (id: number) => void; // Callback to handle delete action
  onUpdate: (id: number) => void; // Callback to handle update action
  onRowClick: (id: number) => void; // Callback to handle row click (ItemDetails)
}
// ItemTable for showing all items with fewer rows than actual parameters of an item. 
const ItemTable: React.FC<ItemTableProps> = ({
  items,
  onDelete,
  onUpdate,
  onRowClick,
}) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="custom-hover-table">
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
              onClick={() => onRowClick(item.itemId)}
              style={{
                cursor: 'pointer',
                backgroundColor: hoveredRow === item.itemId ? '#f8f9fa' : '',
              }}
              onMouseEnter={() => setHoveredRow(item.itemId)}
              onMouseLeave={() => setHoveredRow(null)}
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
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onUpdate(item.itemId);
                  }}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation(); 
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ItemTable;
