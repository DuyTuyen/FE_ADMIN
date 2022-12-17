import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import { BrandList, BrandCartWidget } from '../sections/@dashboard/brand';
import Iconify from '../components/iconify';

import { brandAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import { useNavigate } from 'react-router-dom';
import Loading from 'src/components/loading/Loading';
import CreateBrandModal from 'src/sections/@dashboard/brand/CreateCategoryModal';
import UpdateBrandModal from 'src/sections/@dashboard/brand/UpdateCategoryModal';
import DeleteBrandModal from 'src/sections/@dashboard/brand/DeleteCategoryModal';

// ----------------------------------------------------------------------
export default function BrandPage() {
  const loading = useSelector((state) => state.loading.value);

  const dispatch = useDispatch();

  const navigate = useNavigate();

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
        setBrands(res.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
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
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
      setShowCreateForm(true);
    } finally {
      dispatch(closeLoading());
    }
  }

  async function handleOnSubmitUpdate(formData) {
    setShowUpdateForm(false);
    dispatch(showLoading());
    try {
      const resData = await brandAPI.update(clickedElement._id, formData);
      const filterBrands = brands.filter((r) => r._id !== clickedElement._id);
      const newBrands = [resData.data, ...filterBrands];
      setBrands(newBrands);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
      setShowUpdateForm(true);
    } finally {
      dispatch(closeLoading());
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false);
    dispatch(showLoading());
    try {
      await brandAPI.delete(clickedElement._id);
      const newBrands = brands.filter((r) => r._id !== clickedElement._id);
      setBrands(newBrands);
    } catch (error) {
      if (axios.isAxiosError(error)) alert(error.response ? error.response.data.message : error.message);
      else alert(error.toString());
    } finally {
      dispatch(closeLoading());
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <Helmet>
        <title> Dashboard: Brand</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            BRAND
          </Typography>
          <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            NEW BRAND
          </Button>
        </Stack>
        <BrandList
          brands={brands}
          onUpdateClick={handleUpdateFormShow}
          onDeleteClick={handleDeleteFormShow}
        />
        <BrandCartWidget />
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
