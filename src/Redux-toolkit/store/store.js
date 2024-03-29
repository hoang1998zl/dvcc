import { configureStore } from "@reduxjs/toolkit";
import PageSlice from "../reducer/PageSlice";
import MenuSlice from "../reducer/MenuSlice";
import PhongBanSlice from "../reducer/PhongBanSlice";
import UserSlice from "../reducer/UserSlice";
import ChamCongSlice from "../reducer/ChamCongSlice";
import DuyetAppSlice from "../reducer/DuyetAppSlice";
import ModalSlice from "../../Components/Modal/ModalSlice";
import HoSoNhanVienSlice from "../reducer/HoSoNhanVienSlice";


const store = configureStore({
  reducer: {
    PageSlice: PageSlice,
    MenuSlice: MenuSlice,
    PhongBanSlice: PhongBanSlice,
    UserSlice: UserSlice,
    ChamCongSlice: ChamCongSlice,
    DuyetAppSlice:DuyetAppSlice,
    ModalSlice: ModalSlice,
    HoSoNhanVienSlice:HoSoNhanVienSlice
  },
})

export default store;