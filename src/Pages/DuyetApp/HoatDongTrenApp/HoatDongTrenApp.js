import React from 'react'
import DiTreVeSom from './DiTreVeSom/DiTreVeSom'
import CongTac from './CongTac/CongTac'
import NghiPhep from './NghiPhep/NghiPhep'
import { useDispatch, useSelector } from 'react-redux';
import { setTabApp } from '../../../Redux-toolkit/reducer/ChamCongSlice';
import Tangca from './TangCa/Tangca';
import DangKyCa from './DangKyCa/DangKyCa';

export default function HoatDongTrenApp() {
  let dispatch = useDispatch();
  let currentTab = useSelector(state => state.ChamCongSlice.tabApp);

  const tab = [
    {
      id: 1,
      name: 'Đi trễ - về sớm'
    },
    {
      id: 2,
      name: 'Nghỉ phép'
    },
    {
      id: 3,
      name: 'Công tác'
    },
    {
      id: 5,
      name: 'Tăng Ca'
    },
    {
      id: 4,
      name: 'Đăng ký ca'
    }
  ]

  const renderTab = () => {
    return tab.map((item) => {
      return (
        <button
          key={item.id}
          type="button"
          className={`h-10 px-1 rounded-full text-center focus:outline-none ${currentTab == item.id ? 'bg-orange-100 text-orange-400' : 'bg-transparent text-gray-600'}`}
          onClick={() => dispatch(setTabApp(item.id))}
        >
          {item.name}
        </button>
      )
    })
  }

  let renderContent = () => {
    switch (currentTab) {
      case 1:
        return <DiTreVeSom />
      case 2:
        return <NghiPhep />
      case 3:
        return <CongTac />
      case 4:
        return <DangKyCa />
      case 5:
        return <Tangca />
      default:
        return <NghiPhep />
    }
  }

  return (
    <div className='w-full bg-white rounded-lg p-2 lg:p-4'>
      <h1 className='w-full h-10 mb-4 flex justify-center items-center text-lg text-white bg-orange-400 rounded uppercase'>
        Duyệt phép của nhân viên
      </h1>
      <div
        className='w-full flex justify-between items-center gap-4 mb-4'
      >
        <div className='flex-1 p-1 rounded-full border border-orange-400 grid grid-cols-5'>
          {renderTab()}
        </div>
      </div>
      <div className='w-full overflow-x-auto customScrollbar'>
        {renderContent()}
      </div>
    </div>
  )
}
