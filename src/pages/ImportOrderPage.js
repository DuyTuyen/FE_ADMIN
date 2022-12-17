import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TableHead,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// mock

import { importOrderAPI, importOrderDetailAPI, userAPI } from 'src/api/ConfigAPI';
import { useEffect } from 'react';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import CreateImportOrderModal from 'src/sections/@dashboard/importorder/CreateImportOrder';

export default function ImportOrderPage() {
  const loading = useSelector((state) => state.loading.value);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [importOrder, setImportOrder] = useState([]);

  const [importOrderDetails, setImportOrderDetails] = useState([]);

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
        const res = await importOrderDetailAPI.getAll();
        setImportOrder(res.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
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
      const newImportOrders = [...importOrder];
      newImportOrders.unshift(res.data);
      setImportOrderDetails(newImportOrders);
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
    <>
      <Helmet>
        <title> ImportOrder | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            ImportOrder
          </Typography>
          <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New ImportOrder
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Size</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importOrderDetails.map((row) => {
                    const { _id, quantity, price, size } = row;
                    // const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}></Stack>
                        </TableCell>

                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align="left">{price}</TableCell>

                        <TableCell align="left">{size}</TableCell>

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
      </Container>
      <CreateImportOrderModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />
    </>
  );
}
