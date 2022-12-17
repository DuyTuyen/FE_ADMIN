import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

UpdateBrandModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeBrand: PropTypes.object,
};

function UpdateBrandModal(props) {
  const errorMessage = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeBrand } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleUpdateBrand(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (onSubmit) onSubmit(formData);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Brand</Modal.Title>
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
      <Form onSubmit={handleUpdateBrand}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              defaultValue={activeBrand?.name}
              name="name"
              type="text"
              placeholder="Type Brand name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              name="img"
              type="file"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateBrandModal;
