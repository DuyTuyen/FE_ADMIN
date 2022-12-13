import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

UpdateProductModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    categories: PropTypes.array,
    brands: PropTypes.array,
    activeProduct: PropTypes.object,
};

function UpdateProductModal(props) {
    const errorMessage = useSelector(state => state.error.value)
    const { isShow, onClose, onSubmit, categories, brands, activeProduct } = props

    function handleClose() {
        if (onClose)
            onClose()
    }

    function handleUpdateProduct(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = {
            name: formData.get("name"),
            price: parseInt(formData.get("price")),
            des: formData.get("des"),
            r_category: formData.get("r_category"),
            r_brand: formData.get("r_brand"),
        }
        if (onSubmit)
            onSubmit(data)
    }

    return (
        <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            {errorMessage !== "" ?
                errorMessage.split("---").map((err, index) => <Alert key={index} severity="error">{err}</Alert>) :
                <></>
            }
            <Form onSubmit={handleUpdateProduct} >

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control defaultValue={activeProduct?.name} name="name" type="text" placeholder="Type product name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control defaultValue={activeProduct?.price} name="price" type="number" min="1" placeholder="Type product price (VND)" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control defaultValue={activeProduct?.des} name="des" type="text" placeholder="Type product description" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select selected={activeProduct?.r_category._id} name="r_category" aria-label="Select Category">
                            {
                                categories.map(cate => (
                                    <option  key={cate._id} value={cate._id}>{cate.name}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Select selected={activeProduct?.r_brand._id} name="r_brand" aria-label="Select Brand">
                            {
                                brands.map(brand => (
                                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                                ))
                            }
                        </Form.Select>
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

export default UpdateProductModal;