import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell, MenuItem, FormControl, Select } from '@mui/material';
// components

import { newsAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import Loading from 'src/components/loading/Loading';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';

import Iconify from 'src/components/iconify/Iconify';
import UpdateNewsModal from 'src/sections/@dashboard/news/UpdateNewsModal';
import CreateNewsModal from 'src/sections/@dashboard/news/CreateNewsModal';
import DeleteNewsModal from 'src/sections/@dashboard/news/DeleteNewsModal';
import Page from '../enums/page';

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function NewsPage() {
  const loading = useSelector(state => state.loading.value)

  const dispatch = useDispatch()



  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [newss, setNews] = useState([])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);

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

  function handleUpdateFormShow(news) {
    setClickedElement(news)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(news) {
    setClickedElement(news);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  useEffect(() => {
    async function getNews() {
      dispatch(showLoading());
      try {
        const res = await newsAPI.getAll();
        setNews(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    getNews();
  }, []);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await newsAPI.create(data)
      const newNews = [...newss]
      newNews.unshift(res.data)
      setNews(newNews)
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
      console.log(1,data)
      const resData = await newsAPI.update(data)
      const filterNews = newss.filter((r) => r.id !== resData.data.id)
      const newNews = [resData.data, ...filterNews]
      setNews(newNews)
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
      await newsAPI.delete(clickedElement.id)
      const newNews = newss.filter((r) => r.id !== clickedElement.id)
      setNews(newNews)
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
      <title> Tin tức </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Tin tức
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
              {newss.map((row) => {
                const { id, title, content} = row;
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

    <CreateNewsModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateNewsModal
        isShow={showUpdateForm}
        activeNews={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteNewsModal
        isShow={showDeleteForm}
        activeNews={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
  </>
  );
}
