import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ItemListPage = () => {
  // Mock data for food items
  const items = [
    {
      itemId: 1,
      name: "Apple",
      category: "Fruit",
      certificate: "Organic",
      imageUrl: "/images/apple.jpg",
      energy: 52,
      carbohydrates: 14,
      sugar: 10,
      protein: 0.3,
      fat: 0.2,
      saturatedFat: 0.0,
      unsaturatedFat: 0.1,
      fibre: 2.4,
      salt: 0.0,
      countryOfOrigin: "Norway",
      countryOfProvenance: "Norway"
    },
    {
      itemId: 2,
      name: "Banana",
      category: "Fruit",
      certificate: "Fair Trade",
      imageUrl: "/images/biff.jpg",
      energy: 89,
      carbohydrates: 23,
      sugar: 12,
      protein: 1.1,
      fat: 0.3,
      saturatedFat: 0.1,
      unsaturatedFat: 0.2,
      fibre: 2.6,
      salt: 0.0,
      countryOfOrigin: "Ecuador",
      countryOfProvenance: "Ecuador"
    }
  ];

  return (
    <div>
      <h1>Food Items</h1>
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
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
              
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ItemListPage;
