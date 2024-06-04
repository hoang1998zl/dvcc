import React, { useEffect, useState } from 'react';


import home01 from "../../issets/img/home2.png";
import home02 from "../../issets/img/home_hover.png";
import quanlychamcong01 from "../../issets/img/icon/quanlychamcong02.png";
import quanlychamcong02 from "../../issets/img/icon/quanlychamcong03.png";
import { useDispatch, useSelector } from 'react-redux';
import { setIsOpenBusiness } from '../../Redux-toolkit/reducer/MenuSlice';

export default function Bussiness() {

  const dispatch = useDispatch();

  const isOpenBusiness = useSelector((state) => state.MenuSlice.isOpenBusiness);

  let [currentHoverApp, setCurrentHoverApp] = useState(null);


  const LstApp = [
    {
      id: 1,
      name: 'Trang Chính',
      name_: '',
      icon: home01,
      icon_hover: home02,
      link: 'http://weos.vn'
    },
    {
      id: 3,
      name: 'Định Vị',
      name_: 'Chấm Công',
      icon: quanlychamcong01,
      icon_hover: quanlychamcong02,
      link: `http://id.weos.vn`
    },
  ];

  const renderApp = () => {
    return LstApp.map((item) => {
      return (
        <a
          href={item.link}
          key={item.id}
          type='button'
          className={`flex flex-col justify-start items-center cursor-pointer text-gray-900`}
          onMouseEnter={() => {
            setCurrentHoverApp(item.id);
          }}
          onMouseLeave={() => {
            setCurrentHoverApp(null);
          }}
        >
          <div
            className={`w-12 h-12 p-1 rounded-md border flex justify-center items-center ${currentHoverApp == item.id ? 'text-orange-400' : 'text-sky-400'}`}
            style={{
              boxShadow: currentHoverApp == item.id ? "0px 2px 2px 0 rgba(0, 0, 0, 0.7)" : "none"
            }}
          >
            {/* {item.icon} */}
            <img
              className='w-8 h-8 object-contain'
              src={currentHoverApp == item.id ? item.icon_hover : item.icon}
              alt={''}
            />
          </div>
          <span
            className={`mt-1 text-center ${currentHoverApp == item.id ? 'text-orange-400' : 'text-gray-900'}`}
          >
            {item.name}<br />
            {item.name_}
          </span>
        </a>
      )
    })
  }
  return (
    <>
      <div
        className={`${isOpenBusiness == true ? 'block' : 'hidden'} w-full flex-1 h-full bg-black opacity-30 fixed top-0 left-0 z-[99]`}
        onClick={() => dispatch(setIsOpenBusiness(false))}
      ></div>
      <div
        className={`${isOpenBusiness == true ? 'w-full md:w-1/2 lg:w-1/3 2xl:w-1/5 p-4' : 'w-0 p-0'} h-[calc(100vh-4rem-1rem)] fixed top-16 right-0 overflow-y-auto rounded-lg lg:rounded-r-none bg-white transition-all delay-75 duration-100 ease-linear z-[1000]`}
      >
        <div className='w-full gap-x-2 flex justify-center items-end mb-6 lg:mb-6 2xl:mb-12'>
          <h1 className='text-2xl lg:text-xl 2xl:text-2xl text-left flex-1'>
            For Business
          </h1>
          <button
            type="button"
            className='w-10 h-10 rounded-full flex justify-center items-center hover:border text-xl hover:bg-gray-200'
            onClick={() => {
              dispatch(setIsOpenBusiness(false))
            }}
          >
            <i className='fa-solid fa-x'></i>
          </button>
        </div>
        <div className='w-full border rounded-lg mb-4'>
          <h1 className='hidden lg:block font-semibold text-[18px] lg:text-[16px] 2xl:text-[20px] text-left border-b py-5 px-4'>
            Ứng dụng liên quan
          </h1>

          <div className='grid grid-cols-3 gap-2 p-2'>
            {renderApp()}
          </div>
        </div>
      </div>
    </>
  )
}
