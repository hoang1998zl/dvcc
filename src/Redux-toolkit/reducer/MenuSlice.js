import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentMenu: 1,
  isOpenBusiness: false,
  CTLflag: false,
}

export const MenuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setCurrentMenu: (state, action) => {
      state.currentMenu = action.payload
    },
    setIsOpenBusiness: (state, action) => {
      state.isOpenBusiness = action.payload
    },
    setCTLflag: (state, action) => {
      state.CTLflag = action.payload
    },
  },
});

export const {
  setCurrentMenu,
  setIsOpenBusiness,
  setCTLflag,
} = MenuSlice.actions

export default MenuSlice.reducer