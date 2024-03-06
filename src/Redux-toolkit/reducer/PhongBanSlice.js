import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentPhongBan: null,
}

export const PhongBanSlice = createSlice({
  name: "phongban",
  initialState,
  reducers: {
    setCurrentPhongBan: (state, action) => {
      state.currentPhongBan = action.payload
    },
  },
});

export const {
  setCurrentPhongBan
} = PhongBanSlice.actions

export default PhongBanSlice.reducer