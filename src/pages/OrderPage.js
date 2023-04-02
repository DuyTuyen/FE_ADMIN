import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TableHead,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

import ORDERSTATUS from '../enums/orderStatus';

import { orderAPI } from 'src/api/ConfigAPI';
import { useEffect } from 'react';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import { fCurrency } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import { Alert, Form } from 'react-bootstrap';
import Loading from 'src/components/loading/Loading';
import UpdateOrderModal from 'src/sections/@dashboard/order/UpdateOrder';
import ActionDropdown from 'src/components/Dropdown/ActionDropdown';
import UpdatePaymentStatusModal from 'src/sections/@dashboard/order/UpdatePaymentStatusModal';

export default function OrderPage() {
  const loading = useSelector((state) => state.loading.value);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isShowUpdatePaymentForm, setIsShowUpdatePaymentForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  function hanldeUpdateFormShow(updatingOrder) {
    setShowUpdateForm(true);
    setClickedElement(updatingOrder);
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false);
  }

  useEffect(() => {
    async function getOrders() {
      dispatch(showLoading());
      try {
        const res = await orderAPI.getAll();
        setOrders(res.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
        navigate('/error');
      } finally {
        dispatch(closeLoading());
      }
    }
    getOrders();
  }, []);

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false);
    dispatch(showLoading());
    try {
      const res = await orderAPI.update(data);
      const newOrders = orders.filter((o) => o._id !== data.id);
      newOrders.unshift(res.data);
      setOrders(newOrders);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
      setShowUpdateForm(true);
    } finally {
      dispatch(closeLoading());
    }
  }

  async function handleOnSubmitUpdatePaymentStatus() {
    setIsShowUpdatePaymentForm(false);
    dispatch(showLoading());
    try {
      const res = await orderAPI.updatePaymentStatus(clickedElement._id);
      const newOrders = orders.filter((o) => o._id !== clickedElement._id);
      newOrders.unshift(res.data[0]);
      setOrders(newOrders);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
    } finally {
        dispatch(closeLoading());

    }
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <Helmet>
        <title> Đơn hàng | Minimal UI </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Đơn hàng
        </Typography>
      </Stack>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1000 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã định danh</TableCell>
                  <TableCell>Tên khách hàng</TableCell>
                  <TableCell>SDT khách hàng</TableCell>
                  <TableCell>Email khách hàng</TableCell>
                  <TableCell>Địa chỉ khách hàng</TableCell>
                  <TableCell>Hàng dã mua</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Ngày mua</TableCell>
                  <TableCell>Tình trạng hóa đơn</TableCell>
                  <TableCell>Tình trạng thanh toán</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((row) => {
                  return (
                    <TableRow key={row._id}>
                      <TableCell align="left">{row._id}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.phone}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.address}</TableCell>

                      <TableCell align="left">
                        <Form.Select aria-label="Default select example">
                          {row.r_orderDetails.map((detail) => (
                            <option key={detail._id}>
                              {detail.r_productDetail.r_product.name} {detail.r_productDetail.color} {detail.size} -{' '}
                              {fCurrency(detail.price)} - {detail.quantity} sản phẩm
                            </option>
                          ))}
                        </Form.Select>
                      </TableCell>
                      <TableCell align="left">{fCurrency(row.totalBill)}</TableCell>

                      <TableCell align="left">{fDate(row.createdAt)}</TableCell>
                      <TableCell align="left">
                        {
                          <Alert variant={row.status === 'failed' ? 'danger' : 'success'}>
                            {ORDERSTATUS[row.status]}
                          </Alert>
                        }
                      </TableCell>
                      <TableCell align="left">
                        {
                          <Alert variant={row.isPaid ? 'success' : 'danger'}>
                            {row.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </Alert>
                        }
                      </TableCell>

                      <TableCell align="right">
                        <ActionDropdown
                          clickedElement={row}
                          onUpdateClick={hanldeUpdateFormShow}
                          onUpdatePaymentStatus={(order) => {
                            setIsShowUpdatePaymentForm(true);
                            setClickedElement(order);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
      <UpdateOrderModal
        isShow={showUpdateForm}
        onClose={handleCloseUpdateFormShow}
        onSubmit={handleOnSubmitUpdate}
        activeOrder={clickedElement}
      />
      <UpdatePaymentStatusModal
        isShow={isShowUpdatePaymentForm}
        onClose={() => {
          setIsShowUpdatePaymentForm(false);
        }}
        onUpdatePaymentStatus={handleOnSubmitUpdatePaymentStatus}
      />
    </>
  );
}
