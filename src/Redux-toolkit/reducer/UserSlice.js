import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentNhanVien: null,
  congTy: {}
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
  },
});

export const {
  setCurrentNhanVien,setCongTy
} = UserSlice.actions

export default UserSlice.reducer