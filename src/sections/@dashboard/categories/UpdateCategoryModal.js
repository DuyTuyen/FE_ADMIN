import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

UpdateCategoryModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeCategory: PropTypes.object,
};

function UpdateCategoryModal(props) {
  const errorMessage = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeCategory } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleUpdateCategory(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (onSubmit) onSubmit(formData);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Category</Modal.Title>
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
      <Form onSubmit={handleUpdateCategory}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              defaultValue={activeCategory?.name}
              name="name"
              type="text"
              placeholder="Type Category name"
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

export default UpdateCategoryModal;
