import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell, Popover, MenuItem } from '@mui/material';
// components

import {productAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import { useNavigate } from 'react-router-dom';
import Loading from 'src/components/loading/Loading';
import CreateProductModal from 'src/sections/@dashboard/products/CreateProductModal';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';
import { Image } from 'react-bootstrap';
import UpdateProductModal from 'src/sections/@dashboard/products/UpdateProductModal';
import Iconify from 'src/components/iconify/Iconify';
import ProductDetailModal from 'src/sections/@dashboard/products/ProductDetailModal';
import Page from '../enums/page';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sản phẩm', alignRight: false },
  { id: 'brand', label: 'Thương hiệu', alignRight: false },
  { id: 'category', label: 'Loại sản phẩm', alignRight: false },
  { id: 'image', label: 'Hình ảnh', alignRight: false },
  {id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function ProductsPage() {
  const loading = useSelector(state => state.loading.value)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [products, setProducts] = useState([{}])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  function handleCreateFormShow() {
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
    async function getProducts() {
      dispatch(showLoading());
      try {
        const res = await productAPI.getAll();
        setProducts(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    getProducts();
  }, []);

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
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_PRODUCT}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_PRODUCT}))
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
      data['id'] = clickedElement.id
      const resData = await productAPI.update(data)
      const filterProducts = products.filter((r) => r.id !== resData.data.id)
      const newProducts = [resData.data, ...filterProducts]
      setProducts(newProducts)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_PRODUCT}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_PRODUCT}))
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
      await productAPI.delete(clickedElement.id)
      const newProducts = products.filter((r) => r.id !== clickedElement.id)
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

  return loading ? (
    <Loading />
  ) : (
    <>
    <Helmet>
      <title> Sản phẩm </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Sản phẩm
      </Typography>
      <Button onClick={handleCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
        Tạo mới
      </Button>
    </Stack>

    <Card>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={10}
              numSelected={selected.length}
            />
            <TableBody>
              {products.map((row) => {
                const { id, name, brand, category, image, deleted_at} = row;
                // const selectedUser = selected.indexOf(name) !== -1;

                return (
                  <TableRow key={id}>
                    {/*  <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}> */}
                    {/* <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                      </TableCell> */}

                    <TableCell align="right" component="th" scope="row" padding="none">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="left">{brand?.name}</TableCell>

                    <TableCell align="left">{category?.name}</TableCell>

                    <TableCell align="left">
                      <Image src={image?.path} alt={name} height={100} width={100} />
                    </TableCell>
                    <TableCell align="right">
                      <Button aria-describedby={id} variant="contained" onClick={handleOpenMenu} >
                        click
                        </Button>
                      <Popover
                        open={Boolean(open)}
                        anchorEl={open}
                        onClose={handleCloseMenu}
                        // anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        // PaperProps={{
                        //   sx: {
                        //     p: 1,
                        //     width: 140,
                        //     '& .MuiMenuItem-root': {
                        //       px: 1,
                        //       typography: 'body2',
                        //       borderRadius: 0.75,
                        //     },
                        //   },
                        // }}
                      >
                        <MenuItem onClick={() => {
                          handleDetailModalShow(row)
                          handleCloseMenu()
                        }}>
                          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                          Xem chi tiết
                        </MenuItem>

                        <MenuItem onClick={() => {
                          handleUpdateFormShow(row)
                          handleCloseMenu()
                        }}>
                          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                          Chỉnh sửa
                        </MenuItem>

                        <MenuItem 
                          onClick={() => {
                            handleDeleteFormShow(row)
                            handleCloseMenu()
                          }} 
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                          Xoá
                        </MenuItem>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>

    <CreateProductModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateProductModal
        isShow={showUpdateForm}
        updateProduct={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <ProductDetailModal 
        isShow = {showDetailModal}
        onClose={() => handleCloseUpdateFormShow()}
        product = {clickedElement}
      />
  </>
  );
}
