import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'react-bootstrap';
import Loading from 'src/components/loading/Loading';
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ActionDropdown from 'src/components/Dropdown/ActionDropdown';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useEffect } from 'react';

ProductDetailModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    prouct: PropTypes.object,
};

function ProductDetailModal(props) {

    const { isShow, onClose, product } = props

    function handleClose() {
        if (onClose)
            onClose()
    }

    return (
        <Modal size="xl" style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{product?.name}</Modal.Title>
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
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        product?.r_productDetails.map((detail) => {
                                            return (
                                                <TableRow key={detail._id}>
                                                    <TableCell align="left">{detail._id}</TableCell>
                                                    <TableCell align="left">{detail.color}</TableCell>
                                                    <TableCell align="left">
                                                        <img 
                                                            src={`${process.env.REACT_APP_CLOUDINARYURL}${detail.img}`}
                                                            style={{width:100,height:100}}
                                                        />    
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Form.Select aria-label="Default select example">
                                                            {
                                                                detail.r_consignments.length > 0?
                                                                detail.r_consignments.map(c => (
                                                                    <option key={c._id}>
                                                                        kích cỡ {c.size} còn {c.quantity} sản phẩm
                                                                    </option>
                                                                )):
                                                                <option>Không còn sản phẩm nào trong kho</option>
                                                            }
                                                        </Form.Select>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <ActionDropdown />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                </Card>
            </Modal.Body>
        </Modal>
    );
}

export default ProductDetailModal;