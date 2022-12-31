import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import ORDERSTATUS from '../../../enums/orderStatus';
import { useState } from 'react';

UpdateOrderModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeOrder: PropTypes.object,
};

function UpdateOrderModal(props) {
  const [status, setStatus] = useState("new")
  const { isShow, onClose, onSubmit, activeOrder } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleUpdateOrder(e) {
    e.preventDefault();
    if (onSubmit)
      onSubmit({ id: activeOrder._id, status });
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật đơn hàng</Modal.Title>
      </Modal.Header>
      {
        ["success", "falied"].includes(activeOrder?.status) ?
          <h1>Bạn không thể thay đổi trạng thái đơn hàng được nữa!</h1> :
          <Form onSubmit={handleUpdateOrder}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select onChange={(e) => { setStatus(e.target.value) }}>
                  {
                    activeOrder?.status === "new" ?
                      <>
                        <option selected value="shipping">Giao hàng</option>
                        <option value="failed">Bỏ đơn hàng</option>
                      </> :
                      activeOrder?.status === "shipping" ?
                        <>
                          <option selected value="success">Giao thành công</option>
                          <option value="failed">Bỏ đơn hàng</option>
                        </> :
                        <></>
                  }
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Cập nhật
              </Button>
            </Modal.Footer>
          </Form>
      }
    </Modal>
  );
}

export default UpdateOrderModal;
