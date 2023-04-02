import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'react-bootstrap';
import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import CreateProductDetailModal from './CreateProductDetailModel';
import Color from 'src/enums/Color';

ProductDetailModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    prouct: PropTypes.object,
};

function ProductDetailModal(props) {

    const { isShow, onClose, product, onCreateProductDetail } = props
    const [isShowCreateDetailModal, setIsShowCreateDetailModal] = useState(false)

    function handleClose() {
        if (onClose)
            onClose()
  }
  
  function handleCreateProductDetail(formData) {
    setIsShowCreateDetailModal(false)
    if (onCreateProductDetail)
      onCreateProductDetail(formData);
  }

    return (
      <>
        <Modal size="xl" style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{product?.name}</Modal.Title>
            <Button onClick={() => {setIsShowCreateDetailModal(true)}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo mới
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 1000 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã định danh</TableCell>
                        <TableCell>Màu sắc</TableCell>
                        <TableCell>Hình ảnh</TableCell>
                        <TableCell>Số lượng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product?.r_productDetails.map((detail) => {
                        return (
                          <TableRow key={detail._id}>
                            <TableCell align="left">{detail._id}</TableCell>
                            <TableCell align="left">{Color[detail.color]}</TableCell>
                            <TableCell align="left">
                              <img
                                src={`${process.env.REACT_APP_CLOUDINARYURL}${detail.img}`}
                                style={{ width: 100, height: 100 }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <Form.Select aria-label="Default select example">
                                {detail.r_consignments?.length > 0 ? (
                                  detail.r_consignments?.map((c) => (
                                    <option key={c._id}>
                                      kích cỡ {c.size} còn {c.quantity} sản phẩm
                                    </option>
                                  ))
                                ) : (
                                  <option>Không còn sản phẩm nào trong kho</option>
                                )}
                              </Form.Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Modal.Body>
        </Modal>
        <CreateProductDetailModal
          isShow={isShowCreateDetailModal}
          onClose={() => {
            setIsShowCreateDetailModal(false);
          }}
          onSubmit={handleCreateProductDetail}
          product={product}
        />
      </>
    );
}

export default ProductDetailModal;