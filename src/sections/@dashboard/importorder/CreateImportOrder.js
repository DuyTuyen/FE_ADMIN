import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import CreateImportOrderDetail from './CreateImportOrderDetail';
import { useState } from 'react';
import { useEffect } from 'react';
import { fCurrency } from 'src/utils/formatNumber';

CreateImportOrderModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateImportOrder: PropTypes.func,
  importOrder: PropTypes.array,
};

function CreateImportOrderModal(props) {
  const [details, setDetails] = useState([])
  const [importedAt, setImportedAt] = useState(new Date())
  const [totalPrice, setTotalPrice] = useState(0)
  const [isShowDetailForm, setIsShowDetailForm] = useState(false)
  const errorMessage = useSelector((state) => state.error.value);

  const { isShow, onClose, onShow, onSubmit } = props;

  useEffect(() => {
    const tempTotalPrice = details.reduce((total, detail) => total + detail.price * detail.quantity, 0)
    setTotalPrice(tempTotalPrice)
  }, [details])

  function handleClose() {
    if (onClose)
      onClose()
  }

  function handleCreateImportOrder(e) {
    e.preventDefault()
    if (onSubmit) {
      const tempDetails = details.map(detail => {
        return {
          r_productDetail: detail._id,
          quantity: detail.quantity,
          price: detail.price,
          size: detail.size,
          consignmentStatus: detail.consignmentStatus
        }
      })
      onSubmit({ totalPrice, importedAt, r_importOrderDetails: tempDetails })
    }
  }

  function handleAddMoreDetail(detail) {
    const newDetails = [...details]
    const foundDetail = newDetails.find(d => d._id === detail._id && d.size === detail.size)
    if (foundDetail)
      foundDetail.quantity += detail.quantity
    else
      newDetails.push(detail)
    setIsShowDetailForm(false)
    onShow()
    setDetails(newDetails)
  }

  return (
    <>
      <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo đơn hàng</Modal.Title>
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
            <Form.Group className="mb-3" >
              <Form.Label>
                Sản phẩm
              </Form.Label>
              {
                details.map(detail => (
                  <Form.Check
                    key={detail._id}
                    type={"checkbox"}
                    id={`${detail._id}`}
                    label={`${detail.name} - Quantity: ${detail.quantity} - Price: ${fCurrency(detail.price)}`}
                    defaultChecked={true}
                    onChange={(e) => setDetails(details.filter(d => d._id != detail._id))}
                  />
                ))
              }
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày nhập hàng:</Form.Label>
              <Form.Control max={new Date()} type="date" value={importedAt} onChange={(e) => setImportedAt(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tổng tiền: <strong>{fCurrency(totalPrice)}</strong></Form.Label>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => {handleClose();setIsShowDetailForm(true);}}>
              nhập thêm sản phẩm
            </Button>
            <Button type="submit">
              Tạo
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <CreateImportOrderDetail
        isShow={isShowDetailForm}
        onClose={() => {onShow(); setIsShowDetailForm(false)}}
        onAddMoreDetail={handleAddMoreDetail}
      />
    </>
  );
}

export default CreateImportOrderModal;
