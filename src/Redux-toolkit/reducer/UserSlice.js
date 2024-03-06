import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentNhanVien: null,
}

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentNhanVien: (state, action) => {
      state.currentNhanVien = action.payload
    },
  },
});

export const {
  setCurrentNhanVien
} = UserSlice.actions

export default UserSlice.reducer