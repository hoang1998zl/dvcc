import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentMenu: 1,
  isOpenBusiness: false,
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
  },
});

export const {
  setCurrentMenu,
  setIsOpenBusiness
} = MenuSlice.actions

export default MenuSlice.reducer