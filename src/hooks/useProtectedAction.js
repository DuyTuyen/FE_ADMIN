import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { protectedAPI } from 'src/api/ConfigAPI';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';

function useProtectedAction(props) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { permissions } = props
    const { token } = useSelector(state => {
        return {
            token: state.token.value
        }
    })

    useEffect(() => {
        async function checkPermissions(permissions) {
            try {
                await protectedAPI.checkAction(token, permissions)
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
                else dispatch(setErrorValue(error.toString()));
                navigate("/error")
            }
        }
        checkPermissions()
    }, [token, permissions])
}

export default useProtectedAction;