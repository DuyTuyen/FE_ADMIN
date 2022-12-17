import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

CreateCategoryModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateCategory: PropTypes.func,
  categories: PropTypes.array,
  brands: PropTypes.array,
};

function CreateCategoryModal(props) {
  const errorMessage = useSelector((state) => state.error.value);

  const { isShow, onClose, onSubmit, categories } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateCategory(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (onSubmit) onSubmit(formData);
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Category</Modal.Title>
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
      <Form onSubmit={handleCreateCategory}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Type category name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control name="img" type="file" min="1" placeholder="Select image" />
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

export default CreateCategoryModal;
