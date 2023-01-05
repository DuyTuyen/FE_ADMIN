import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';

UpdateConsignmentsModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeConsignments: PropTypes.object,
};

function UpdateConsignmentsModal(props) {
  const [status, setStatus] = useState(null)
  const { isShow, onClose, onSubmit, activeConsignments } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleUpdateConsignments(e) {
    e.preventDefault();
    if (onSubmit)
      onSubmit({ id: activeConsignments._id, status });
  }

  useEffect(() => {
    if(activeConsignments){
        setStatus(activeConsignments.status === 'new' ? "in_stock": "new")
    }
  },[activeConsignments])

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật Lô hàng</Modal.Title>
      </Modal.Header>
      {
        ["comming_out_of_stock", "out_of_stock"].includes(activeConsignments?.status) ?
          <h1>Bạn không thể thay đổi trạng thái lô hàng được nữa!</h1> :
          <Form onSubmit={handleUpdateConsignments}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select onChange={(e) => { setStatus(e.target.value) }}>
                  {
                    activeConsignments?.status === "new" ?
                      <>
                        <option value="in_stock">Bán hàng ngay</option>
                      </> :
                      activeConsignments?.status === "in_stock" ?
                        <>
                          <option value="new">Lưu trữ lại</option>
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

export default UpdateConsignmentsModal;
