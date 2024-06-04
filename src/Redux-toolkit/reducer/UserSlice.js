import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentNhanVien: null,
  congTy: {},
  loading: true,
}

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentNhanVien: (state, action) => {
      state.currentNhanVien = action.payload
    },
    setCongTy : (state,action) => {
      state.congTy = {...action.payload};
    },
    setLoading: (state,action) => {
      state.loading = action.payload
    },
  },
});

export const {
  setCurrentNhanVien,setCongTy,setLoading,
} = UserSlice.actions

export default UserSlice.reducer