import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function UpdatePaymentStatusModal(props) {
  const { isShow, onClose, onUpdatePaymentStatus } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleUpdatePaymentStatus(e) {
    e.preventDefault();
    if (onUpdatePaymentStatus) onUpdatePaymentStatus();
  }

  return (
    <Modal style={{zIndex: 9999} } show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận đã thanh toán đơn hàng này</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleUpdatePaymentStatus}>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Xác nhận
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdatePaymentStatusModal;
