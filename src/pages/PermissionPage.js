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
    Typography,
    TableContainer,
    TableHead,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

import { permissionAPI } from 'src/api/ConfigAPI';
import { useEffect } from 'react';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import Loading from 'src/components/loading/Loading';
import ActionDropdown from 'src/components/Dropdown/ActionDropdown';

export default function PermissionPage() {
    const loading = useSelector((state) => state.loading.value);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        async function getPermissions() {
            dispatch(showLoading());
            try {
                const res = await permissionAPI.getAll();
                setPermissions(res.data);
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
                else dispatch(setErrorValue(error.toString()));
                navigate("/error")
            } finally {
                dispatch(closeLoading());
            }
        }
        getPermissions();
    }, []);

    return (
        loading ?
            <Loading /> :
            <>
                <Helmet>
                    <title> Quyền hạn | Minimal UI </title>
                </Helmet>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Quyền hạn
                        </Typography>
                        <Button  variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                            Tạo mới
                        </Button>
                    </Stack>

                    <Card>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 1000}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã định danh</TableCell>
                                            <TableCell>Quyền hạn</TableCell>
                                            <TableCell>Mô tả</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {permissions.map((row) => {
                                            return (
                                                <TableRow key={row._id}>


                                                    <TableCell align="left">{row._id}</TableCell>
                                                    <TableCell align="left">{row.type}</TableCell>
                                                    <TableCell align="left">{row.description}</TableCell>
                                                    <TableCell align="right">
                                                        <ActionDropdown />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Card>
            </>
    );
}
