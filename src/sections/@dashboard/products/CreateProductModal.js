import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

CreateProductModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onCreateProduct: PropTypes.func,
    categories: PropTypes.array,
    brands: PropTypes.array,
};

function CreateProductModal(props) {
    const errorMessage = useSelector(state => state.error.value)

    const { isShow, onClose, onSubmit, categories, brands } = props

    function handleClose() {
        if (onClose)
            onClose()
    }

    function handleCreateProduct(e) {
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
        <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Product</Modal.Title>
            </Modal.Header>
            {errorMessage !== "" ?
                errorMessage.split("---").map((err, index) => <Alert key={index} severity="error">{err}</Alert>) :
                <></>
            }
            <Form onSubmit={handleCreateProduct} >

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Type product name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control name="price" type="number" min="1" placeholder="Type product price (VND)" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="des" type="text" placeholder="Type product description" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="r_category" aria-label="Select Category">
                            {
                                categories.map(cate => (
                                    <option key={cate._id} value={cate._id}>{cate.name}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Select name="r_brand" aria-label="Select Brand">
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
                        Create
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreateProductModal;