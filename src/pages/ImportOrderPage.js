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

// mock

import { importOrderAPI } from 'src/api/ConfigAPI';
import { useEffect } from 'react';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import CreateImportOrderModal from 'src/sections/@dashboard/importorder/CreateImportOrder';
import { fCurrency } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import { Form } from 'react-bootstrap';
import Loading from 'src/components/loading/Loading';

export default function ImportOrderPage() {
  const loading = useSelector((state) => state.loading.value);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [importOrders, setImportOrder] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  function hanldeCreateFormShow() {
    setShowCreateForm(true);
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }


  useEffect(() => {
    async function getImportOrder() {
      dispatch(showLoading());
      try {
        const res = await importOrderAPI.getAll();
        setImportOrder(res.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
        navigate("/error")
      } finally {
        dispatch(closeLoading());
      }
    }
    getImportOrder();
  }, []);

  async function handleOnSubmitCreate(formData) {
    setShowCreateForm(false);
    dispatch(showLoading());
    try {
      const res = await importOrderAPI.create(formData);
      const newImportOrders = [...importOrders];
      newImportOrders.unshift(res.data);
      setImportOrder(newImportOrders);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
      setShowCreateForm(true);
    } finally {
      dispatch(closeLoading());
    }
  }

  return (
    loading ?
      <Loading /> :
      <>
        <Helmet>
          <title> Đơn nhập hàng | Minimal UI </title>
        </Helmet>

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Đơn nhập hàng
            </Typography>
            <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo mới
            </Button>
          </Stack>

          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã định danh</TableCell>
                      <TableCell>Tổng tiền</TableCell>
                      <TableCell>Chi tiết</TableCell>
                      <TableCell>Ngày nhập hàng</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importOrders.map((row) => {
                      return (
                        <TableRow key={row._id}>


                          <TableCell align="left">{row._id}</TableCell>

                          <TableCell align="left">{fCurrency(row.totalPrice)}</TableCell>

                          <TableCell align="left">
                            <Form.Select aria-label="Default select example">
                              {
                                row.r_importOrderDetails.map(detail => (
                                  <option key={detail._id}>
                                    {detail.r_productDetail.r_product.name} {detail.r_productDetail.color} {detail.size} - {fCurrency(detail.price)} - {detail.quantity} sản phẩm 
                                  </option>
                                ))
                              }
                            </Form.Select>
                          </TableCell>
                          <TableCell align="left">
                            {fDate(row.importedAt)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="large" color="inherit">
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        <CreateImportOrderModal
          isShow={showCreateForm}
          onSubmit={(data) => {
            handleOnSubmitCreate(data);
          }}
          onShow={() => hanldeCreateFormShow()}
          onClose={() => handleCloseCreateFormShow()}
        />
      </>
  );
}
