import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  ngay: moment().format("YYYY-MM-DD")
};

export const BaoCaoSlice = createSlice({
  name: "baoCao",
  initialState,
  reducers: {
    setNgay: (state, action) => {
        state.ngay = action.payload;
      }
    },
    
});

export const { setNgay } = BaoCaoSlice.actions;

export default BaoCaoSlice.reducer;
