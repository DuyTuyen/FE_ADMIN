import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    TableHead,
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';

import CONSIGNMENSTATUS from '../enums/consignmentStatus';
import { useEffect } from 'react';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import { fDate } from 'src/utils/formatTime';
import { Alert } from 'react-bootstrap';
import Loading from 'src/components/loading/Loading';
import ActionDropdown from 'src/components/Dropdown/ActionDropdown';
import { consignmentAPI } from 'src/api/ConfigAPI';
import UpdateConsignmentsModal from 'src/sections/@dashboard/consignment/UpdateConsignmentModal';

export default function ConsignmentPage() {
    const loading = useSelector((state) => state.loading.value);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [consignments, setConsignments] = useState([]);

    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const [clickedElement, setClickedElement] = useState(null);

    function hanldeUpdateFormShow(updatingConsignment) {
        setShowUpdateForm(true);
        setClickedElement(updatingConsignment)
    }

    function handleCloseUpdateFormShow() {
        setShowUpdateForm(false);
    }


    useEffect(() => {
        async function getConsignments() {
            dispatch(showLoading());
            try {
                const res = await consignmentAPI.getAll();
                setConsignments(res.data);
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
                else dispatch(setErrorValue(error.toString()));
                navigate("/error")
            } finally {
                dispatch(closeLoading());
            }
        }
        getConsignments();
    }, []);

    async function handleOnSubmitUpdate(data) {
        setShowUpdateForm(false);
        dispatch(showLoading());
        try {
            console.log("dadsa")
            const res = await consignmentAPI.updateStatus(data);
            console.log(res.data)
            const newConsignments = consignments.filter(o => o._id !== data.id);
            newConsignments.unshift(res.data);
            setConsignments(newConsignments);
        } catch (error) {
            if (axios.isAxiosError(error))
                dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
            else dispatch(setErrorValue(error.toString()));
            setShowUpdateForm(true);
        } finally {
            dispatch(closeLoading());
        }
    }

    return (
        loading ?
            <Loading /> :
            <>
                <Helmet>
                    <title>Lô hàng</title>
                </Helmet>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Lô hàng
                    </Typography>
                </Stack>

                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 1000 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã định danh</TableCell>
                                        <TableCell>Tên Sản phẩm</TableCell>
                                        <TableCell>Kích cỡ</TableCell>
                                        <TableCell>Hình ảnh</TableCell>
                                        <TableCell>Số lượng còn lại</TableCell>
                                        <TableCell>Ngày nhập hàng</TableCell>
                                        <TableCell>Tình trạng</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {consignments.map((row) => {
                                        return (
                                            <TableRow key={row._id}>


                                                <TableCell align="left">{row._id}</TableCell>
                                                <TableCell align="left">{row.r_productDetail.r_product.name}</TableCell>
                                                <TableCell align="left">{row.size}</TableCell>
                                                <TableCell align="left">
                                                    <img
                                                        style={{width: 150, height: 150}}
                                                        alt={`lô hàng ${row._id}`}
                                                        src={`${process.env.REACT_APP_CLOUDINARYURL}${row.r_productDetail.img}`}
                                                    />
                                                </TableCell>
                                                <TableCell align="left">{row.quantity}</TableCell>
                                                <TableCell align="left">{fDate(row.importedAt)}</TableCell>
                                                <TableCell align="left">
                                                    <Alert variant={row.status === 'new' || row.status === 'in_stock' ? "success" : "danger"}>
                                                        {CONSIGNMENSTATUS[row.status]}
                                                    </Alert>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <ActionDropdown clickedElement={row} onUpdateClick={hanldeUpdateFormShow} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                </Card>
                <UpdateConsignmentsModal
                    isShow={showUpdateForm}
                    onClose={handleCloseUpdateFormShow}
                    onSubmit={handleOnSubmitUpdate}
                    activeConsignments={clickedElement}
                />
            </>
    );
}
