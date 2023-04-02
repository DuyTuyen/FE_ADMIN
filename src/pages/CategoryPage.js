import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import { CategoryList } from '../sections/@dashboard/categories';
import Iconify from '../components/iconify';

import { categoryAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import { useNavigate } from 'react-router-dom';
import Loading from 'src/components/loading/Loading';
import CreateCategoryModal from 'src/sections/@dashboard/categories/CreateCategoryModal';
import DeleteCategoryModal from 'src/sections/@dashboard/categories/DeleteCategoryModal';
import UpdateCategoryModal from 'src/sections/@dashboard/categories/UpdateCategoryModal';
import { reject } from 'lodash';
// ----------------------------------------------------------------------
export default function CategoriesPage() {
  const loading = useSelector((state) => state.loading.value);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

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

  function handleUpdateFormShow(category) {
    setClickedElement(category);
    setShowUpdateForm(true);
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false);
  }

  function handleDeleteFormShow(category) {
    setClickedElement(category);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false);
  }

  useEffect(() => {
    async function getCategoties() {
      dispatch(showLoading());
      try {
        const res = await categoryAPI.getAll();
        setCategories(res.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
      } finally {
        dispatch(closeLoading());
      }
    }
    getCategoties();
  }, []);

  async function handleOnSubmitCreate(formData) {
    setShowCreateForm(false);
    dispatch(showLoading());
    try {
      const res = await categoryAPI.create(formData);
      const newCategories = [...categories];
      newCategories.unshift(res.data);
      setCategories(newCategories);
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
      const resData = await categoryAPI.update(clickedElement._id,formData);
      const filterCategories = categories.filter((r) => r._id !== clickedElement._id);
      const newCategories = [resData.data, ...filterCategories];
      setCategories(newCategories);
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
      await categoryAPI.delete(clickedElement._id);
      const newCategories = categories.filter((r) => r._id !== clickedElement._id);
      setCategories(newCategories);
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
        <title> Dashboard: Loại</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Loại
          </Typography>
          <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo mới
          </Button>
        </Stack>
        <CategoryList
          categories={categories}
          onUpdateClick={handleUpdateFormShow}
          onDeleteClick={handleDeleteFormShow}
        />
      </Container>
      <CreateCategoryModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

      <UpdateCategoryModal
        isShow={showUpdateForm}
        activeCategory={clickedElement}
        onSubmit={(formData) => handleOnSubmitUpdate(formData)}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <DeleteCategoryModal
        isShow={showDeleteForm}
        activeCategory={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  );
}
