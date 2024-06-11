import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMenu, setIsOpenBusiness } from '../../Redux-toolkit/reducer/MenuSlice';
import { GiNotebook } from "react-icons/gi";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import audio from "../../issets/sound/low_spring_open.mp3"

export default function Bussiness({logoutComponent}) {
  const dispatch = useDispatch();
  const isOpenBusiness = useSelector((state) => state.MenuSlice.isOpenBusiness);
  const currentMenu = useSelector((state)=> state.MenuSlice.currentMenu);
  const hoveringAudio = new Audio(audio);
  const LstApp = [
    {
      name: 'Macro Lương',
      icon: <GiNotebook />,
      menuID: 7,
    },
    {
      name: 'Bảng lương',
      icon: <LiaMoneyCheckAltSolid />,
      menuID: 8,
    },
  ];
  useEffect(() => {
    hoveringAudio.load();
  }, []);
  const renderApp = () => {
    return LstApp.map((item,index) => {
      return (
        <a
          key={index}
          type='button'
          className={`flex flex-col justify-start items-center cursor-pointer hover:text-orange-400 [&>*:first-child]:hover:shadow-lg [&>*:first-child]:hover:border-orange-400 ${currentMenu==item.menuID?'text-orange-400':'text-gray-500'}`}
          onClick={()=>{dispatch(setCurrentMenu(item.menuID));dispatch(setIsOpenBusiness(false))}}
          onMouseEnter={()=>{
            hoveringAudio.play();
          }}
          onMouseLeave={()=>{
            hoveringAudio.pause();
            hoveringAudio.currentTime = 0;
          }}
        >
          <div
            className={`w-12 h-12 p-1 rounded-md border flex justify-center items-center text-2xl ${currentMenu==item.menuID&&'border-orange-400'}`}
          >
            {item.icon}
          </div>
          <span
            className={`mt-1 text-center`}
          >
            {item.name}<br />
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
        className={`${isOpenBusiness == true ? 'w-full md:w-1/2 lg:w-1/3 2xl:w-1/5 p-4' : 'w-0 p-0'} h-[calc(100vh-4rem-1rem)] fixed top-16 right-0 overflow-y-auto rounded-lg lg:rounded-r-none bg-white transition-all delay-75 duration-100 ease-linear z-[1000] flex flex-col`}
      >
        <div className='w-full gap-x-2 flex justify-center items-end mb-6 lg:mb-6 2xl:mb-12'>
          <h1 className='text-2xl lg:text-xl 2xl:text-2xl text-left flex-1 text-orange-400'>
            PREMIUM MODE
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
            Ứng dụng mở rộng
          </h1>

          <div className='grid grid-cols-2 gap-2 p-2'>
            {renderApp()}
          </div>
        </div>
        <div className='flex justify-center text-3xl mt-auto border-t-2 border-gray-300'>
          <div className='pt-2'>{logoutComponent()}</div>
        </div>
      </div>
    </>
  )
}
