import { configureStore } from '@reduxjs/toolkit'
import loadingSlice from './slices/LoadingSlice'
import errorSlice from './slices/ErrorSlice'

export const store = configureStore({
  reducer: {
    loading: loadingSlice,
    error: errorSlice
  },
})