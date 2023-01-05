import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductFilterSidebar } from '../sections/@dashboard/products';
import Iconify from '../components/iconify';

import { brandAPI, categoryAPI, productAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import { useNavigate } from 'react-router-dom';
import Loading from 'src/components/loading/Loading';
import CreateProductModal from 'src/sections/@dashboard/products/CreateProductModal';
import UpdateProductModal from 'src/sections/@dashboard/products/UpdateProductModal';
import DeleteProductModal from 'src/sections/@dashboard/products/DeleteProductModal';
import ProductDetailModal from 'src/sections/@dashboard/products/ProductDetailModal';
// ----------------------------------------------------------------------
export default function ProductsPage() {
  const loading = useSelector(state => state.loading.value)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [openFilter, setOpenFilter] = useState(false);
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  function hanldeCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(product) {
    setClickedElement(product)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(product) {
    setClickedElement(product);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  function handleDetailModalShow(product) {
    setClickedElement(product);
    setShowDetailModal(true);
  }

  function handleCloseDetailModalShow() {
    setShowDetailModal(false)
  }

  useEffect(() => {
    dispatch(showLoading())
    Promise.all([brandAPI.getAll(), categoryAPI.getAll(), productAPI.getAll()])
      .then((results) => {
        setBrands(results[0].data)
        setCategories(results[1].data)
        setProducts(results[2].data)
      })
      .catch(error => {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message))
        else
          dispatch(setErrorValue(error.toString()))
        navigate("/error")
      })
      .finally(() => {
        dispatch(closeLoading())
      })
  }, [])

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await productAPI.create(data)
      const newProducts = [...products]
      newProducts.unshift(res.data)
      setProducts(newProducts)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message))
      else
        dispatch(setErrorValue(error.toString()))
      setShowCreateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false)
    dispatch(showLoading())
    try {
      data['id'] = clickedElement._id
      const resData = await productAPI.update(data)
      const filterProducts = products.filter((r) => r._id !== resData.data._id)
      const newProducts = [resData.data, ...filterProducts]
      setProducts(newProducts)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message))
      else
        dispatch(setErrorValue(error.toString()))
      setShowUpdateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false)
    dispatch(showLoading())
    try {
      await productAPI.delete(clickedElement._id)
      const newProducts = products.filter((r) => r._id !== clickedElement._id)
      setProducts(newProducts)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        alert(error.response ? error.response.data.message : error.message)
      else
        alert(error.toString())
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function filterProducts({ selectedCate, selectedColors }) {
    try {
      dispatch(showLoading())
      let myFilter = ""
      myFilter += selectedColors.reduce((q_color, item) => `${q_color}color[]=${item}&`, "")
      if (selectedCate)
        myFilter += `r_category=${selectedCate}`
      const res = await productAPI.filter(myFilter)
      setProducts(res.data)
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message))
      else
        dispatch(setErrorValue(error.toString()))
      navigate("/error")
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function sortProducts(type){
    let tempProducts = [...products]
    console.log(type)
    if(type === 'asc')
      tempProducts.sort((a,b)=> a.price - b.price)
    else
    tempProducts.sort((a,b)=> b.price - a.price)
    setProducts(tempProducts)
  }

  return (
    loading ?
      <Loading /> :
      <>
        <Helmet>
          <title> Sản phẩm</title>
        </Helmet>

        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Sản phẩm
            </Typography>
            <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo mới
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ProductFilterSidebar
                openFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
                onFilter={filterProducts}
              />
              <ProductSort 
                onSort={sortProducts}
              />
            </Stack>
          </Stack>

          <ProductList
            products={products}
            onUpdateClick={handleUpdateFormShow}
            onDeleteClick={handleDeleteFormShow}
            onDetailClick={handleDetailModalShow}
          />
        </Container>
        <CreateProductModal
          isShow={showCreateForm}
          onSubmit={(data) => { handleOnSubmitCreate(data) }}
          onClose={() => handleCloseCreateFormShow()}
          categories={categories}
          brands={brands}
        />

        <UpdateProductModal
          isShow={showUpdateForm}
          activeProduct={clickedElement}
          onSubmit={(formData) => handleOnSubmitUpdate(formData)}
          onClose={() => handleCloseUpdateFormShow()}
          categories={categories}
          brands={brands}
        />

        <DeleteProductModal
          isShow={showDeleteForm}
          activeProduct={clickedElement}
          onSubmit={() => handleOnSubmitDelete()}
          onClose={() => handleCloseDeleteFormShow()}
        />

        <ProductDetailModal
          isShow={showDetailModal}
          product={clickedElement}
          onClose={handleCloseDetailModalShow}
        />
      </>
  );
}
