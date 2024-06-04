import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadPage: 1,
};

export const MacroLuongSlice = createSlice({
  name: "macroLuong",
  initialState,
  reducers: {
    setReloadPage: (state,action) => {
        state.reloadPage = action.payload;
      }
    },
});

export const { setReloadPage } = MacroLuongSlice.actions;

export default MacroLuongSlice.reducer;
