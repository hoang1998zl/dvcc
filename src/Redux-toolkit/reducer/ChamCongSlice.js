import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  chamCong: 0,
  danhmuc_id: 0,
  nv_id:0,
  reloadPB: 0,
  month:moment().format("MM"),
  year: moment().format("YYYY"),
  reloadNV:0,
  reloadMany: 0,
  tabApp: 2
};

export const ChamCongSlice = createSlice({
  name: "chamCong",
  initialState,
  reducers: {
    setChamCong: (state, action) => {
        state.chamCong = action.payload;
      },
    setDanhMuc: (state, action) => {
        state.danhmuc_id = action.payload;
      },
    setNhanVien: (state, action) => {
        state.nv_id = action.payload;
      },
    setReloadPB: (state,action) => {
        state.reloadPB = action.payload;
      },
    setReloadNV: (state,action) => {
        state.reloadNV = action.payload;
      },
    setMonth: (state,action) => {
        state.month = action.payload;
      },
    setYear: (state,action) => {
        state.year = action.payload;
      },
    setReloadMany: (state,action) => {
        state.reloadMany = action.payload;
      },
    setTabApp: (state,action) => {
      state.tabApp = action.payload;
    }
    },
    
});

export const { setChamCong,setDanhMuc,setNhanVien,setReloadPB, setMonth, setReloadNV, setReloadMany, setYear, setTabApp } = ChamCongSlice.actions;

export default ChamCongSlice.reducer;
