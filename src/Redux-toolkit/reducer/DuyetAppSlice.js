import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  nv_id: null,
  ngay: "01",
  thang: moment().format("MM"),
  nam: moment().format("YYYY"),
  ngayKT: moment().endOf('month').format("DD"),
  thangKT: moment().format("MM"),
  namKT: moment().format("YYYY"),
  newNoti: 0
}

export const DuyetAppSlice = createSlice({
  name: "duyetapp",
  initialState,
  reducers: {
        setNhanVien: (state, action) => {
            state.nv_id = action.payload;
        },
        setNgay: (state, action) => {
            state.ngay = action.payload;
        },
        setThang: (state, action) => {
            state.thang = action.payload;
        },
        setNam: (state, action) => {
            state.nam = action.payload;
        },
        setNgayKT: (state, action) => {
            state.ngayKT = action.payload;
        },
        setThangKT: (state, action) => {
            state.thangKT = action.payload;
        },
        setNamKT: (state, action) => {
            state.namKT = action.payload;
        },
        setNewNoti: (state, action) => {
            state.newNoti = action.payload;
        }
    },
    
});

export const { setNgay,setThang,setNam,setNhanVien,setNgayKT,setThangKT,setNamKT, setNewNoti } = DuyetAppSlice.actions;

export default DuyetAppSlice.reducer;
