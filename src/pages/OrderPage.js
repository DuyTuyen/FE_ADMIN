import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell, MenuItem, FormControl, Select } from '@mui/material';
// components

import { orderAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import Loading from 'src/components/loading/Loading';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';
import {fDate} from '../utils/formatTime';
import Iconify from 'src/components/iconify/Iconify';
import UpdateOrderModal from 'src/sections/@dashboard/order/UpdateOrderModal';
import CreateOrderModal from 'src/sections/@dashboard/order/CreateOrderModal';
import DeleteOrderModal from 'src/sections/@dashboard/order/DeleteOrderModal';
import Page from '../enums/page';

const TABLE_HEAD = [
  { id: 'ID', label: 'Mã định danh', alignRight: false },
  { id: 'CusotmerName', label: 'Tên khách hàng', alignRight: false },
  { id: 'Phone', label: 'Số điện thoại', alignRight: false },
  { id: 'Email', label: 'Email', alignRight: false },
  { id: 'Products', label: 'Sản phẩm', alignRight: false },
  { id: 'Status', label: 'Trạng thái', alignRight: false },
  { id: 'CreatedAt', label: 'Ngày tạo', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function OrderPage() {
  const loading = useSelector(state => state.loading.value)

  const dispatch = useDispatch()

  const [page, setPage] = useState(0);

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [orders, setOrder] = useState([])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  function handleCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(order) {
    setClickedElement(order)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(order) {
    setClickedElement(order);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  useEffect(() => {
    async function getOrder() {
      dispatch(showLoading());
      try {
        const res = await orderAPI.getAll();
        console.log(res.data.data)
        setOrder(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    getOrder();
  }, []);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await orderAPI.create(data)
      const newOrder = [...orders]
      newOrder.unshift(res.data)
      setOrder(newOrder)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_NEWS}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_NEWS}))
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
      const resData = await orderAPI.update(data)
      const filterOrder = orders.filter((r) => r.id !== resData.data.id)
      const newOrder = [resData.data, ...filterOrder]
      setOrder(newOrder)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_NEWS}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_NEWS}))
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
      await orderAPI.delete(clickedElement.id)
      const newOrder = orders.filter((r) => r.id !== clickedElement.id)
      setOrder(newOrder)
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
      <title> Đơn hàng </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Đơn hàng
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
              headLabel={TABLE_HEAD}
              rowCount={10}
              numSelected={selected.length}
            />
            <TableBody>
              {orders.map((row) => {
                const { id, customerName, phone, email, createdAt, details, status, isPaid} = row;
                return (
                  <TableRow key={id}>
                    <TableCell align="left">{id}</TableCell>

                    <TableCell align="left">{customerName}</TableCell>

                    <TableCell align="left">{phone}</TableCell>
                    <TableCell align="left">{email}</TableCell>
                    <TableCell align="left">{
                      <select>
                          {
                             details.map(detail => (
                              <option>{`${detail.productName} - ${detail.quantity}`}</option>
                            ))
                          }
                      </select>
                     
                    }</TableCell>

                    <TableCell align="left">{
                      `${status === 'pending' ? 'Chờ duyệt' : status === 'success' ? 'Thành cộng' : 'Thất bại'} - ${isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`
                    }</TableCell>

                    <TableCell align="left">{
                      fDate(createdAt)
                    }</TableCell>

                    <TableCell align="right">
                    <FormControl>
                      <Select>
                          <MenuItem onClick={(e) => {
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
                      </Select>
                    </FormControl>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>

    <CreateOrderModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onShow={() => handleCreateFormShow()}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateOrderModal
        isShow={showUpdateForm}
        activeOrder={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteOrderModal
        isShow={showDeleteForm}
        activeOrder={clickedElement}
        onSubmit={() => {handleOnSubmitDelete()}}
        onClose={() => handleCloseDeleteFormShow()}
      />
  </>
  );
}
