import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell, Popover, MenuItem, FormControl, Select } from '@mui/material';
// components

import { aboutCompanyAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import Loading from 'src/components/loading/Loading';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';

import Iconify from 'src/components/iconify/Iconify';
import CreateAboutCompanyModal from 'src/sections/@dashboard/about-company/CreateAboutCompanyModal';
import UpdateAboutCompanyModal from 'src/sections/@dashboard/about-company/UpdateAboutCompanyModal';
import DeleteAboutCompanyModal from 'src/sections/@dashboard/about-company/DeleteAboutCompanyModal';
import Page from '../enums/page'

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function AboutCompanyPage() {
  const loading = useSelector(state => state.loading.value)

  const dispatch = useDispatch()


  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [aboutCompanys, setAboutCompany] = useState([{}])
  
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

  function handleUpdateFormShow(aboutCompany) {
    setClickedElement(aboutCompany)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(aboutCompany) {
    setClickedElement(aboutCompany);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  function handleDetailModalShow(aboutCompany) {
    setClickedElement(aboutCompany);
    setShowDetailModal(true);
  }

  function handleCloseDetailModalShow() {
    setShowDetailModal(false)
  }

  useEffect(() => {
    async function getAboutCompany() {
      dispatch(showLoading());
      try {
        const res = await aboutCompanyAPI.getAll();
        setAboutCompany(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    getAboutCompany();
  }, []);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await aboutCompanyAPI.create(data)
      const newAboutCompany = [...aboutCompanys]
      newAboutCompany.unshift(res.data)
      setAboutCompany(newAboutCompany)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_ABOUT_COMPANY}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_ABOUT_COMPANY}))
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
      const resData = await aboutCompanyAPI.update(data)
      const filterAboutCompany = aboutCompanys.filter((r) => r.id !== resData.data.id)
      const newAboutCompany = [resData.data, ...filterAboutCompany]
      setAboutCompany(newAboutCompany)
    }
    catch (error) {
      if (axios.isAxiosError(error))
      dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_ABOUT_COMPANY}))
    else
      dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_ABOUT_COMPANY}))
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
      await aboutCompanyAPI.delete(clickedElement.id)
      const newAboutCompany = aboutCompanys.filter((r) => r.id !== clickedElement.id)
      setAboutCompany(newAboutCompany)
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
      <title> Bài viết về công ty </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Bài viết giới thiệu
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
              {aboutCompanys.map((row) => {
                const { id, title, content} = row;
                // const selectedUser = selected.indexOf(name) !== -1;

                return (
                  <TableRow key={id}>

                    <TableCell align="left">{title}</TableCell>

                    <TableCell align="left">{content}</TableCell>

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

    <CreateAboutCompanyModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateAboutCompanyModal
        isShow={showUpdateForm}
        activeAboutCompany={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteAboutCompanyModal
        isShow={showDeleteForm}
        activeAboutCompany={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
  </>
  );
}
