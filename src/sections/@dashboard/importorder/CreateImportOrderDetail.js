import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { productAPI } from 'src/api/ConfigAPI';
import SIZEENUM from '../../../enums/size'

function CreateImportOrderDetail(props) {
    const [products, setProducts] = useState([])
    const [activeProduct, setActiveProduct] = useState(null)
    const [activeProductDetailId, setActiveProductDetailId] = useState("")
    const [size, setSize] = useState(Object.values(SIZEENUM)[0])
    const [quantity, setQuantity] = useState(1)
    const [price, setPrice] = useState(1)
    const [consignmentStatus, setConsignmentStatus] = useState("new")

    const { isShow, onClose, onAddMoreDetail } = props

    useEffect(() => {
        async function getStartingProducts() {
            try {
                const res = await productAPI.getAll()
                const startingProducts = res.data
                setProducts(startingProducts)
                setActiveProduct(startingProducts[0])
                setActiveProductDetailId(startingProducts[0].r_productDetails[0]._id)
            } catch (error) {
                alert(error.toString())
            }
        }
        getStartingProducts()
    }, [])

    useEffect(() => {
        if(activeProduct)
            setActiveProductDetailId(activeProduct.r_productDetails[0]._id)
    },[activeProduct])

    function handleClose() {
        if (onClose)
            onClose()
    }

    function handleAddMoreProducts(e) {
        e.preventDefault()
        if (onAddMoreDetail) {
            onAddMoreDetail({
                _id: activeProductDetailId,
                name: `${activeProduct.name} - Size: ${size}`,
                quantity: parseInt(quantity),
                price: parseInt(price),
                consignmentStatus,
                size
            })
        }
    }

    return (
        <Modal style={{ zIndex: 10000 }}show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nh???p th??m s???n ph???m</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleAddMoreProducts}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>S???n ph???m</Form.Label>
                        <Form.Select onChange={(e) => { setActiveProduct(products[e.target.value]) }}>
                            {
                                products.map((product, index) => (
                                    <option key={product._id} value={index}>{product.name}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ch???n m??u s???c</Form.Label>
                        <Form.Select onChange={(e) => { setActiveProductDetailId(e.target.value) }}>
                            {
                                activeProduct?.r_productDetails.map((detail) => (
                                    <option key={detail._id} value={detail._id}>{detail.color}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ch???n k??ch c???</Form.Label>
                        <Form.Select  onChange={(e) => { setSize(e.target.value) }}>
                            {
                                Object.values(SIZEENUM).map((size,index) =>
                                    <option key={index} value={size}>{size}</option>
                                )
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>S??? l?????ng</Form.Label>
                        <Form.Control min={1} type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Gi?? nh???p</Form.Label>
                        <Form.Control min={1} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>?????nh t??nh tr???ng</Form.Label>
                        <Form.Select onChange={(e) => { setConsignmentStatus(e.target.value) }}>
                            <option value={"new"}>M???i</option>
                            <option value={"in_stock"}>B??n ngay</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Th??m
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreateImportOrderDetail;