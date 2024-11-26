import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Item } from '../types/item';
import API_URL from '../apiConfig';

interface ItemDetailsProps {
  show: boolean;
  onHide: () => void;
  itemId: number; // Pass only the item ID
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ show, onHide, itemId }) => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the item data when the modal is shown
  useEffect(() => {
    if (show) {
      const fetchItem = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_URL}/api/itemapi/items/${itemId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch item data.');
          }
          const data: Item = await response.json();
          setItem(data);
        } catch (err) {
          setError('Failed to fetch item details.');
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [show, itemId]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Item Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading item details...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : item ? (
          <>
            <Row>
              <Col md={4}>
                {item.imageUrl ? (
                  <img
                    src={`${API_URL}${item.imageUrl}`}
                    alt={item.name}
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                  />
                ) : (
                  <p>No Image Available</p>
                )}
              </Col>
              <Col md={8}>
                <h4>{item.name}</h4>
                <p><strong>Category:</strong> {item.category || 'N/A'}</p>
                <p><strong>Certificate:</strong> {item.certificate || 'N/A'}</p>
                <p><strong>Country of Origin:</strong> {item.countryOfOrigin || 'N/A'}</p>
                <p><strong>Country of Provenance:</strong> {item.countryOfProvenance || 'N/A'}</p>
              </Col>
            </Row>
            <hr />
            <h5>Nutritional Information</h5>
            <Row>
              <Col><strong>Energy:</strong> {item.energy || 'N/A'}</Col>
              <Col><strong>Carbohydrates:</strong> {item.carbohydrates || 'N/A'}</Col>
              <Col><strong>Sugar:</strong> {item.sugar || 'N/A'}</Col>
            </Row>
            <Row>
              <Col><strong>Protein:</strong> {item.protein || 'N/A'}</Col>
              <Col><strong>Fat:</strong> {item.fat || 'N/A'}</Col>
              <Col><strong>Fibre:</strong> {item.fibre || 'N/A'}</Col>
            </Row>
            <Row>
              <Col><strong>Saturated Fat:</strong> {item.saturatedfat || 'N/A'}</Col>
              <Col><strong>Unsaturated Fat:</strong> {item.unsaturatedfat || 'N/A'}</Col>
              <Col><strong>Salt:</strong> {item.salt || 'N/A'}</Col>
            </Row>
          </>
        ) : (
          <p>No details available for this item.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemDetails;
