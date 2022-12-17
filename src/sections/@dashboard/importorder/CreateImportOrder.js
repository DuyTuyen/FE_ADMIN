import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

CreateImportOrderModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateImportOrder: PropTypes.func,
  importOrder: PropTypes.array,
};

function CreateImportOrderModal(props) {
  const errorMessage = useSelector((state) => state.error.value);

  const { isShow, onClose, onSubmit, importOrder } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateImportOrder(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (onSubmit) onSubmit(formData);
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create ImportOrder</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' ? (
        errorMessage.split('---').map((err, index) => (
          <Alert key={index} severity="error">
            {err}
          </Alert>
        ))
      ) : (
        <></>
      )}
      <Form onSubmit={handleCreateImportOrder}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control name="quantity" type="text" placeholder="Input Quantity " />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control name="price" type="number" min="1" placeholder="Input Price" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Size</Form.Label>
            <Form.Control name="size" type="number" min="1" placeholder="Input Size" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateImportOrderModal;
