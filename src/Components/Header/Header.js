import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


import logo from '../../issets/img/logo_orange.jpg'

import { IoCube } from "react-icons/io5";
import { FaArrowUpRightDots, FaGear, FaRegCalendarCheck, FaUser } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";

import { setCurrentMenu, setIsOpenBusiness } from '../../Redux-toolkit/reducer/MenuSlice';
import { dvccService } from '../../services/dvccService';
import { setNewNoti } from '../../Redux-toolkit/reducer/DuyetAppSlice';
import { localStorageService } from '../../services/localStorageService';
import { macroLuongService } from '../../services/macroLuongService';
import Bussiness from '../Bussiness/Bussiness';

export default function Header() {

  const token = localStorageService.getItem("token");
  const [currentHoverMenu, setCurrentHoverMenu] = useState(0);
  let [reload,setReload] = useState(0);

  const { currentMenu } = useSelector(state => state.MenuSlice);
  const { isOpenBusiness } = useSelector((state) => state.MenuSlice);
  let newNoti = useSelector(state => state.DuyetAppSlice.newNoti);
  const [permission, setPermission] = useState('FREE');

  const dispatch = useDispatch();
  useEffect(() => {
    // cái này để load số thông báo trên duyệt app
    dvccService.getTotal(token).then((res) => {
      let total = 0;
      total = res.data?.content?.nghiPhep + res.data?.content?.diTre + res.data?.content?.veSom + res.data?.content?.congTac + res.data?.content?.tangCa + res.data?.content?.dangKyCa + res.data?.content?.nghiKhac;
      dispatch(setNewNoti(total));
    })
      .catch((err) => {
        console.log(err);
      });
  }, [reload])
  useEffect(()=>{
    macroLuongService.getPermission(token).then((res) => {
      setPermission(res.data.content);
    }).catch((err) => {
        console.log(err);
    });
  },[]);
  let autoReload = () => {
    setTimeout(() => {
      setReload(Date.now());
    },[60000])
  }
  const menu = [
    {
      menu_id: 1,
      menu_name: "Báo Cáo",
      menu_icon: <FaArrowUpRightDots />,
    },
    {
      menu_id: 2,
      menu_name: "Thiết lập",
      menu_icon: <FaGear />,
    },
    {
      menu_id: 3,
      menu_name: "Hồ Sơ",
      menu_icon: <FaUser />,
    },
    {
      menu_id: 6,
      menu_name: "Tài Khoản",
      menu_icon: <FaLocationDot />,
    },
    {
      menu_id: 5,
      menu_name: "Chấm Công",
      menu_icon: (
        <>
          <LuClock3 />
          <FaLocationDot className='absolute top-1/2 left-1/2 text-center text-xs' />
        </>
      ),
    },
    {
      menu_id: 4,
      menu_name: "Duyệt App",
      menu_icon: <IoCube />,
    },
    // {
    //   menu_id: 7,
    //   menu_name: "Bảng Lương",
    //   menu_icon: <FaRegCalendarCheck />,
    // },
  ];

  const renderMenuHeader = () => {
    return menu.map((item) => {
      return (
        <li
          key={item.menu_id}
          className={`w-6 lg:w-20 h-full flex flex-col justify-center items-center cursor-pointer border-b-2 relative ${currentHoverMenu === item.menu_id || currentMenu === item.menu_id ? "border-orange-400" : "border-transparent"}`}
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
            className={`h-6 aspect-square flex justify-center items-center text-xl relative ${currentHoverMenu === item.menu_id || currentMenu === item.menu_id ? "text-orange-400" : "text-gray-500"}`}
          >
            {item.menu_icon}
          </div>
          <span
            className={`hidden lg:block text-xs lg:leading-4 ${currentHoverMenu === item.menu_id || currentMenu === item.menu_id ? "text-orange-400" : "text-gray-500"}`}
          >
            {item.menu_name}
          </span>
          {
            item.menu_id == 4 &&
            <div className={`p-0.5 min-w-[15px] aspect-square rounded-full bg-red-500 absolute top-0 right-1/4 text-white flex justify-center items-center text-[0.6rem]`}>
              {newNoti}
            </div>
          }
        </li>
      )
    })
  }

  return (<div>
    <div
      id='Header'
      className='w-full h-12 flex justify-between items-center gap-x-4 bg-white z-[100] shadow-md'
    >

      <div className='py-1.5 flex h-full items-center gap-x-2 ps-2 lg:ps-10'>
        <a className='h-full' href='http://labortracking.vn'>
          <img
            className='object-cover h-full'
            src={logo}
            alt=""
          />
        </a>
        
        {/* <form className='hidden lg:block lg:w-64 h-full relative py-0.5'>
          <input
            type="text"
            className='w-full h-full ps-10 pe-2 rounded-md focus:outline-none bg-gray-200'
            placeholder='Tìm kiếm'
          />
          <i className='fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-600'></i>
        </form> */}
      </div>


      <ul className='flex-1 h-full hidden lg:flex justify-center items-center gap-x-2'>
        {renderMenuHeader()}
      </ul>

      {permission=='PREMIUM' && (<button
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
      </button>)}
      {autoReload()}
    </div>
    {permission=='PREMIUM' && (<Bussiness/>)}</div>
  )
}
