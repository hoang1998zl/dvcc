import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


import logo from '../../issets/img/logo_orange.jpg'
import cauhinhchung01 from "../../issets/img/cauhinhchung01.png";
import cauhinhchung02 from "../../issets/img/cauhinhchung02.png";
import cauhinhchung03 from "../../issets/img/cauhinhchung03.png";
import app01 from "../../issets/img/app01.png";
import app02 from "../../issets/img/app02.png";
import app03 from "../../issets/img/app03.png";
import chamcong01 from "../../issets/img/chamcong01.png";
import chamcong02 from "../../issets/img/chamcong02.png";
import chamcong03 from "../../issets/img/chamcong03.png";
import hoso01 from "../../issets/img/hoso01.png";
import hoso02 from "../../issets/img/hoso02.png";
import hoso03 from "../../issets/img/hoso03.png";
import taobangluong01 from "../../issets/img/taobangluong01.png";
import taobangluong02 from "../../issets/img/taobangluong02.png";
import taobangluong03 from "../../issets/img/taobangluong03.png";

import { IoCube } from "react-icons/io5";
import { FaArrowUpRightDots, FaGear, FaUser } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { BsGearWide } from "react-icons/bs";

import { setCurrentMenu, setIsOpenBusiness } from '../../Redux-toolkit/reducer/MenuSlice';

export default function Header() {

  const [currentHoverMenu, setCurrentHoverMenu] = useState(null);

  const { currentMenu } = useSelector(state => state.MenuSlice);
  const { isOpenBusiness } = useSelector((state) => state.MenuSlice);

  const dispatch = useDispatch();

  const menu = [
    {
      menu_id: 1,
      menu_name: "Báo Cáo",
      menu_icon: <FaArrowUpRightDots />,
    },
    {
      menu_id: 2,
      menu_name: "Cấu Hình",
      menu_icon: <FaGear />,
    },
    {
      menu_id: 3,
      menu_name: "Hồ Sơ",
      menu_icon: <FaUser />,
    }, {
      menu_id: 4,
      menu_name: "Duyệt App",
      menu_icon: <IoCube />,
    }, {
      menu_id: 5,
      menu_name: "Chấm Công",
      menu_icon: (
        <>
          <LuClock3 />
          <FaLocationDot className='absolute top-1/2 left-1/2 text-center text-xs' />
        </>
      ),
    }, {
      menu_id: 6,
      menu_name: "Macro Lương",
      menu_icon: (
        <>
          <BsGearWide />
          <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm pb-0.5 font-bold'>s</span>
        </>
      ),
    }
  ];

  const renderMenuHeader = () => {
    return menu.map((item, index) => {
      return (
        <li
          key={item.menu_id}
          className={`w-6 lg:w-20 h-full flex flex-col justify-center items-center cursor-pointer border-b-2 relative ${currentHoverMenu == item.menu_id || currentMenu == item.menu_id ? "border-orange-400" : "border-transparent"}`}
          onClick={() => {
            dispatch(setCurrentMenu(item.menu_id));
          }}
          onMouseEnter={() => {
            setCurrentHoverMenu(item.menu_id);
          }}
          onMouseLeave={() => {
            setCurrentHoverMenu(null);
          }}
        >
          <div
            className={`h-6 aspect-square flex justify-center items-center text-xl relative ${currentHoverMenu == item.menu_id || currentMenu == item.menu_id ? "text-orange-400" : "text-gray-500"}`}
          >
            {item.menu_icon}
          </div>
          <span
            className={`hidden lg:block text-xs lg:leading-4 ${currentHoverMenu == item.menu_id || currentMenu == item.menu_id ? "text-orange-400" : "text-gray-500"}`}
          >
            {item.menu_name}
          </span>
        </li>
      )
    })
  }

  return (
    <div
      id='Header'
      className='w-full h-12 flex justify-between items-center gap-x-4 bg-white z-[100] shadow-md'
    >

      <div className='py-1.5 flex h-full items-center gap-x-2 ps-2 lg:ps-10'>
        <img
          className='object-cover h-full'
          src={logo}
          alt=""
        />
        <form className='hidden lg:block lg:w-64 h-full relative py-0.5'>
          <input
            type="text"
            className='w-full h-full ps-10 pe-2 rounded-md focus:outline-none bg-gray-200'
            placeholder='Tìm kiếm'
          />
          <i className='fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-600'></i>
        </form>
      </div>


      <ul className='flex-1 h-full hidden lg:flex justify-center items-center gap-x-2'>
        {renderMenuHeader()}
      </ul>

      <button
        type="button"
        onClick={() => {
          dispatch(setIsOpenBusiness(!isOpenBusiness));
        }}
        className='h-full text-gray-600 focus:outline-none px-2 border-s-2 border-gray-300'
      >
        <div className='text-xl leading-6'>
          <i className="fa-solid fa-ellipsis-vertical"></i>
          <i className="fa-solid fa-ellipsis-vertical"></i>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
        <span className='-pt-3 block capitalize text-xs'>
          for business
          <i className='fa-solid fa-caret-down ms-1'></i>
        </span>
      </button>

    </div>
  )
}
