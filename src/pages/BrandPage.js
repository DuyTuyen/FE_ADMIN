import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import { BrandList } from '../sections/@dashboard/brand';
import Iconify from '../components/iconify';

import { brandAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import Loading from 'src/components/loading/Loading';
import CreateBrandModal from 'src/sections/@dashboard/brand/CreateBrandModal';
import UpdateBrandModal from 'src/sections/@dashboard/brand/UpdateBrandModal';
import DeleteBrandModal from 'src/sections/@dashboard/brand/DeleteBrandModal';
import Page from '../enums/page';
// ----------------------------------------------------------------------
export default function BrandPage() {
  const loading = useSelector((state) => state.loading.value);

  const dispatch = useDispatch();

  const [brands, setBrands] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  function hanldeCreateFormShow() {
    setShowCreateForm(true);
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(brand) {
    setClickedElement(brand);
    setShowUpdateForm(true);
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false);
  }

  function handleDeleteFormShow(brand) {
    setClickedElement(brand);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false);
  }

  useEffect(() => {
    async function getBrands() {
      dispatch(showLoading());
      try {
        const res = await brandAPI.getAll();
        console.log(res.data)
        setBrands(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message))
      else
        alert((error.toString()))
      } finally {
        dispatch(closeLoading());
      }
    }
    getBrands();
  }, []);

  async function handleOnSubmitCreate(formData) {
    setShowCreateForm(false);
    dispatch(showLoading());
    try {
      const res = await brandAPI.create(formData);
      const newBrands = [...brands];
      newBrands.unshift(res.data);
      setBrands(newBrands);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_BRAND}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_BRAND}));
      setShowCreateForm(true);
    } finally {
      dispatch(closeLoading());
    }
  }

  async function handleOnSubmitUpdate(formData) {
    setShowUpdateForm(false);
    dispatch(showLoading());
    try {
      const resData = await brandAPI.update(clickedElement.id, formData);
      const filterBrands = brands.filter((r) => r.id !== clickedElement.id);
      const newBrands = [resData.data, ...filterBrands];
      setBrands(newBrands);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_BRAND}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_BRAND}))
      setShowUpdateForm(true);
    } finally {
      dispatch(closeLoading());
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false);
    dispatch(showLoading());
    try {
      await brandAPI.delete(clickedElement.id);
      const newBrands = brands.filter((r) => r.id !== clickedElement.id);
      setBrands(newBrands);
    } catch (error) {
      if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message));
      else 
        alert(error.toString());
    } finally {
      dispatch(closeLoading());
    }
  }
  return loading ? <Loading /> : (
    <>
      <Helmet>
        <title>Thương hiệu</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Thương hiệu
          </Typography>
            <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo mới
            </Button>
        </Stack>
            <BrandList
              brands={brands}
              onUpdateClick={handleUpdateFormShow}
              onDeleteClick={handleDeleteFormShow}
            /> 
      </Container>
      <CreateBrandModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

      <UpdateBrandModal
        isShow={showUpdateForm}
        activeBrand={clickedElement}
        onSubmit={(formData) => handleOnSubmitUpdate(formData)}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <DeleteBrandModal
        isShow={showDeleteForm}
        activeBrand={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  );
}
