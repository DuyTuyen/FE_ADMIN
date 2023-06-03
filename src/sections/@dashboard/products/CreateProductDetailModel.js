import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Color from 'src/enums/Color';
import { useEffect } from 'react';
import { useState } from 'react';

CreateProductDetailModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateProductDetail: PropTypes.func,
};

function CreateProductDetailModal(props) {
  const errorMessage = useSelector((state) => state.error.value);

    const { isShow, onClose, onSubmit, product } = props;
    const [r_product, setR_product] = useState(null)

  function handleClose() {
    if (onClose) onClose();
    }
    
    useEffect(() => {
        if (product)
            setR_product(product._id)
    },[product])

  function handleCreateProductDetail(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
  
    if (onSubmit) onSubmit(formData);
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm chi tiết sản phẩm</Modal.Title>
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
      <Form onSubmit={handleCreateProductDetail}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên gói</Form.Label>
            <Form.Group className="mb-3">
              <Form.Label></Form.Label>
            </Form.Group>{' '}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Chọn ảnh</Form.Label>
            <Form.Control name="img" type="file" />
          </Form.Group>
          <Form.Control name="r_product" type="hidden" value={r_product} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Thêm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateProductDetailModal;
