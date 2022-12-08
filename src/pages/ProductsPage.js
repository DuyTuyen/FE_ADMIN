import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import Iconify from '../components/iconify';

import { productAPI } from '../api/ConfigAPI';

// ----------------------------------------------------------------------
export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [product,setProduct]= useState([])

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [activeProduct, setActiveProduct] = useState({});

  function hanldeCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(product) {
    setActiveProduct(product)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(product) {
    setActiveProduct(product);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  useEffect(() => {
    async function getProduct() {
      try {
        const res = await productAPI.getAll();
        setProduct(res.data)
      } catch (error) {
        console.log(error);
      }
    }
    getProduct()
  }, [])
  
  async function handleOnSubmit(formRef) {
    try {
      const formData = new FormData(formRef.current)

      const resData= await productAPI.create(formData)
    } catch (error) {
      console.log(error);
    }
  }

  async function handleOnSubmitUpdate(formRef) {
    try {
      const formData = new FormData(formRef.current)
      formData.append('id', activeProduct._id)
      const resData = await productAPI.update(formData)
      setShowUpdateForm(false)
      const filterProduct = product.filter((r) => r._id !== resData.data._id)
      const updateProduct = [...filterProduct, resData.data]
      setProduct(updateProduct)
    } catch (error) {
      console.log(error);
    }
  }

  async function handleOnSubmitDelete() {
    try {
      const resData = await productAPI.delete(activeProduct._id)
      const updateProduct = product.filter((r) => r._id !== activeProduct._id)
      setProduct(updateProduct)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      {/* <CreateProduct
        isShow={showCreateForm}
        onSubmit={() => handleOnSubmit()}
        onCreateProduct={() => hanldeCreateFormShow()}
        onCloseFormShow={() => handleCloseCreateFormShow()}
      />

      <UpdateProduct
        isShow={showUpdateForm}
        activeProduct={activeProduct}
        onSubmitUpdate={(e) => handleOnSubmitUpdate(e)}
        onUpdateProduct={(e) => handleUpdateFormShow(e)}
        onCloseUpdate={() => handleCloseUpdateFormShow()}
      />
      
      <DeleteProduct
        isShow={showDeleteForm}
        activeProduct={activeProduct}
        onSubmitDelete={() => handleOnSubmitDelete()}
        onDeleteProduct={() => handleDeleteFormShow()}
        onCloseDelete={() => handleCloseDeleteFormShow()}
      /> */}
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            PRODUCTS
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            NEW PRODUCTS
          </Button>
        </Stack>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={product} />
        <ProductCartWidget />
      </Container>
    </>
  );
}
