import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { userAPI } from 'src/api/ConfigAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from 'src/redux/slices/TokenSlice';
import axios from 'axios';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import Loading from 'src/components/loading/Loading';
import { Alert, Form } from 'react-bootstrap';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { loading, error } = useSelector(state => {
    return {
      loading: state.loading.value,
      error: state.error.value
    }
  })
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    try {
      e.preventDefault()
      dispatch(showLoading());
      const res = await userAPI.login({username, password})
      dispatch(setToken(res.data))
      navigate("/dashboard")
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
    } finally {
      dispatch(closeLoading());
    }
  };

  return (
    loading ?
      <Loading /> :
      <>
        {error !== '' ? (
          error.split('---').map((err, index) => (
            <Alert key={index} variant="danger" severity="error">
              {err}
            </Alert>
          ))
        ) : (
          <></>
        )}
        <Form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField value={username} onChange={(e) => { setUsername(e.target.value) }} name="text" label="Nhập tài khoản" />
            <TextField
              name="password"
              label="Nhập mật khẩu"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <LoadingButton style={{ marginTop: "10px" }} fullWidth size="large" type="submit" variant="contained">
            Login
          </LoadingButton>
        </Form>
      </>
  );
}
