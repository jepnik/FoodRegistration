import React from 'react';
import { Table, Button } from 'react-bootstrap';

const HomePage = () => {
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
    },
    {
      itemId: 3,
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
      itemId: 4,
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
    },
    {
      itemId: 5,
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
      itemId: 6,
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
    },
    {
      itemId: 7,
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
        {items.map((item) => (
          <tr key={item.itemId}>
            <td>{item.itemId}</td>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.certificate}</td>
            <td>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: "60px", height: "60px" }}
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