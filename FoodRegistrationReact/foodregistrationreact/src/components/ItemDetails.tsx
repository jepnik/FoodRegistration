import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Item } from '../types/item';
import API_URL from '../apiConfig';

interface ItemDetailsProps {
  show: boolean;
  onHide: () => void;
  itemId: number; 
}
// Detailed view of a single item 
const ItemDetails: React.FC<ItemDetailsProps> = ({ show, onHide, itemId }) => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      const fetchItem = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`${API_URL}/api/items/${itemId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch item details for ID ${itemId}.`);
          }
          const data: Item = await response.json();
          setItem(data);
        } catch (err) {
          setError(`Failed to load item details: ${err.message}`);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchItem();
    }
  }, [show, itemId]);

  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      dialogClassName="item-details-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Item Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading item details...</p>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {item && (
          <>
            <Row className="align-items-center mb-4">
              <Col xs={12} md={4} className="text-center">
                {item.imageUrl ? (
                  <img
                    src={`${API_URL}${item.imageUrl}`}
                    alt={item.name}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: '200px',
                      objectFit: 'cover',
                      border: '1px solid #ddd',
                      padding: '4px',
                    }}
                  />
                ) : (
                  <p>No Image Available</p>
                )}
              </Col>
              <Col xs={12} md={8}>
                <h4 className="text-center text-md-left mb-3">{item.name}</h4>
                <p>
                  <strong>Category:</strong> {item.category || 'N/A'}
                </p>
                <p>
                  <strong>Certificate:</strong> {item.certificate || 'N/A'}
                </p>
                <p>
                  <strong>Country of Origin:</strong> {item.countryOfOrigin || 'N/A'}
                </p>
                <p>
                  <strong>Country of Provenance:</strong> {item.countryOfProvenance || 'N/A'}
                </p>
              </Col>
            </Row>
            <hr />
            <h5 className="text-center">Nutritional Information pr 100g</h5>
            <Row className="mb-3">
              <Col xs={6} md={4}>
                <p><strong>Energy (kcal):</strong> {item.energy || 'N/A'}</p>
              </Col>
              <Col xs={6} md={4}>
                <p><strong>Carbohydrates:</strong> {item.carbohydrates || 'N/A'}</p>
              </Col>
              <Col xs={6} md={4}>
                <p><strong>Sugar:</strong> {item.sugar || 'N/A'}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={6} md={4}>
                <p><strong>Protein:</strong> {item.protein || 'N/A'}</p>
              </Col>
              <Col xs={6} md={4}>
                <p><strong>Fat:</strong> {item.fat || 'N/A'}</p>
              </Col>
              <Col xs={6} md={4}>
                <p><strong>Fibre:</strong> {item.fibre || 'N/A'}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <p><strong>Saturated Fat:</strong> {item.saturatedfat || 'N/A'}</p>
              </Col>
              <Col xs={6} md={4}>
                <p><strong>Unsaturated Fat:</strong> {item.unsaturatedfat || 'N/A'}</p>
              </Col>
              <Col xs={6} md={4}>
                <p><strong>Salt:</strong> {item.salt || 'N/A'}</p>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemDetails;
