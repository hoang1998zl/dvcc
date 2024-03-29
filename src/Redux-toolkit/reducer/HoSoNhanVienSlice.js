import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nhanVienHS: {},
  reloadHS: 0,
  nhanVienUpdated: {},
  relaType: '12'
}

export const HoSoNhanVienSlice = createSlice({
  name: "hoSoNhanVien",
  initialState,
  reducers: {
    setNhanVienHS: (state, action) => {
      state.nhanVienHS = {...action.payload};
    },
    setReloadHS: (state, action) => {
      state.reloadHS = action.payload;
    },
    setnhanVienUpdated: (state, action) => {
      state.nhanVienUpdated = {...action.payload};
    },
    setRelaType: (state, action) => {
      state.relaType = action.payload;
    }
  }
})

export const {
    setNhanVienHS,setReloadHS,setnhanVienUpdated,setRelaType
} = HoSoNhanVienSlice.actions

export default HoSoNhanVienSlice.reducer