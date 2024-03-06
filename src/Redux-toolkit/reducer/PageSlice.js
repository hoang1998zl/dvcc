import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  headerHeight: 0,
  mainHeight: 0,
  reload: false,
}

export const PageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setHeaderHeight: (state, action) => {
      state.headerHeight = action.payload
    },
    setMainHeight: (state, action) => {
      state.mainHeight = action.payload
    },
    setReload: (state, action) => {
      state.reload = action.payload
    },
  },
});

export const {
  setLoading,
  setHeaderHeight,
  setMainHeight,
  setReload
} = PageSlice.actions

export default PageSlice.reducer