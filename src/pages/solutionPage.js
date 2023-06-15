import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell, FormControl, MenuItem, Select } from '@mui/material';
// components

import { solutionAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from 'src/redux/slices/LoadingSlice';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import Loading from 'src/components/loading/Loading';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';

import Iconify from 'src/components/iconify/Iconify';
import UpdateSolutionModal from 'src/sections/@dashboard/solution/UpdateSolutionModal';
import CreateSolutionModal from 'src/sections/@dashboard/solution/CreateSolutionModal';
import DeleteSolutionModal from 'src/sections/@dashboard/solution/DeleteSolutionModal';
import Page from '../enums/page';

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function SolutionPage() {
  const loading = useSelector(state => state.loading.value)

  const dispatch = useDispatch()


  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [solutions, setSolution] = useState([{}])
  
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

  function handleUpdateFormShow(solution) {
    setClickedElement(solution)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(solution) {
    setClickedElement(solution);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  function handleDetailModalShow(solution) {
    setClickedElement(solution);
    setShowDetailModal(true);
  }

  function handleCloseDetailModalShow() {
    setShowDetailModal(false)
  }

  useEffect(() => {
    async function getSolution() {
      dispatch(showLoading());
      try {
        const res = await solutionAPI.getAll();
        setSolution(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    getSolution();
  }, []);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await solutionAPI.create(data)
      const newSolution = [...solutions]
      newSolution.unshift(res.data)
      setSolution(newSolution)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_SOLUTION}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_SOLUTION}))
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
      const resData = await solutionAPI.update(data)
      const filterSolution = solutions.filter((r) => r.id !== resData.data.id)
      const newSolution = [resData.data, ...filterSolution]
      setSolution(newSolution)
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
      await solutionAPI.delete(clickedElement.id)
      const newSolution = solutions.filter((r) => r.id !== clickedElement.id)
      setSolution(newSolution)
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
      <title> Giải pháp</title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Giải pháp
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
              {solutions.map((row) => {
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

    <CreateSolutionModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateSolutionModal
        isShow={showUpdateForm}
        activeSolution={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteSolutionModal
        isShow={showDeleteForm}
        activeSolution={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
  </>
  );
}
