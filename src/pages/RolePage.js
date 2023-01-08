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
import { useEffect } from 'react';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import {  Form } from 'react-bootstrap';
import Loading from 'src/components/loading/Loading';
import ActionDropdown from 'src/components/Dropdown/ActionDropdown';
import { roleAPI } from 'src/api/ConfigAPI';

export default function RolePage() {
    const loading = useSelector((state) => state.loading.value);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        async function getRoles() {
            dispatch(showLoading());
            try {
                const res = await roleAPI.getAll();
                setRoles(res.data);
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
                else dispatch(setErrorValue(error.toString()));
                navigate("/error")
            } finally {
                dispatch(closeLoading());
            }
        }
        getRoles();
    }, []);

    return (
        loading ?
            <Loading /> :
            <>
                <Helmet>
                    <title> Chức vụ | Minimal UI </title>
                </Helmet>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Chức vụ
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
                                            <TableCell>Chức vụ</TableCell>
                                            <TableCell>Mô tả</TableCell>
                                            <TableCell>Quyền hạn</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {roles.map((row) => {
                                            return (
                                                <TableRow key={row._id}>


                                                    <TableCell align="left">{row._id}</TableCell>
                                                    <TableCell align="left">{row.title}</TableCell>
                                                    <TableCell align="left">{row.description}</TableCell>
                                                    <TableCell align="left">
                                                        <Form.Select aria-label="Default select example">
                                                            {
                                                                row.r_permissions.map(p => (
                                                                    <option key={p._id}>
                                                                        {p.type}
                                                                    </option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                    </TableCell>
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
