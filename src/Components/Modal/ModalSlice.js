import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  type: "",
  title: "",
  width: "",
}

export const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setOpenModalSlice: (state, action) => {
      state.open = action.payload.open;
      state.type = action.payload.type;
      state.title = action.payload.title;
      state.width = action.payload.width;
    },
    setCloseModalSlice: (state) => {
      state.open = false;
      state.type = "";
      state.title = "";
    },
  },
})

export const {
  setOpenModalSlice,
  setCloseModalSlice,
} = ModalSlice.actions;

export default ModalSlice.reducer;
