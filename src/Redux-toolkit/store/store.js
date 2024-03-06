import { configureStore } from "@reduxjs/toolkit";
import PageSlice from "../reducer/PageSlice";
import MenuSlice from "../reducer/MenuSlice";
import PhongBanSlice from "../reducer/PhongBanSlice";
import UserSlice from "../reducer/UserSlice";


const store = configureStore({
  reducer: {
    PageSlice: PageSlice,
    MenuSlice: MenuSlice,
    PhongBanSlice: PhongBanSlice,
    UserSlice: UserSlice,
  },
})

export default store;