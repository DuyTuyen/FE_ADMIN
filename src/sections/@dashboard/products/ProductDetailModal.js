import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'react-bootstrap';
import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import CreateProductDetailModal from './CreateProductDetailModel';
import Color from 'src/enums/Color';
import { DEFAULT_ATTRIBUTE } from '@mui/system/cssVars/getInitColorSchemeScript';

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
              Các gói sản phẩm
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 1000 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell></TableCell>
                        <TableCell>Free</TableCell>
                        <TableCell>O365 Business Premium</TableCell>
                        <TableCell>Office 365 E3</TableCell>
                        <TableCell>
                          <Button onClick={() => {setIsShowCreateDetailModal(true)}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                            Thêm gói
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                          <TableRow >
                            <TableCell align="left">Tin nhắn và tìm kiếm không giới hạn</TableCell>
                            <TableCell align="left">v</TableCell>
                            <TableCell align="left">v</TableCell>
                            <TableCell align="left">v</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="left">Số lượng người dùng tối đa</TableCell>
                            <TableCell align="left">300</TableCell>
                            <TableCell align="left">300</TableCell>
                            <TableCell align="left">Không giới hạn</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="left">Giá(VND)</TableCell>
                            <TableCell align="left">miễn phí</TableCell>
                            <TableCell align="left">400.000VND/tháng</TableCell>
                            <TableCell align="left">600.000VND/tháng</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="left">
                                <Button onClick={() => {setIsShowCreateDetailModal(true)}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                Thêm quyền lợi mới (+)
                              </Button>
                            </TableCell>
                          </TableRow>
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