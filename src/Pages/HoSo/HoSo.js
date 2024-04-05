import React from 'react'
import HoSoWrapper from './HoSoHoSo/HoSoWrapper'
import PhongBan from './PhongBan/PhongBan'
import DuyetPhepWrapper from './DuyetPhepWrapper/DuyetPhepWrapper'
import { useSelector } from 'react-redux';

export default function HoSo() {

  const { mainHeight } = useSelector(state => state.PageSlice);
  const defaultWidth = 250;

  return (
    <div
      className='w-full flex justify-center gap-4 py-4 2xl:px-4'
      style={{
        height: `calc(${mainHeight}px - 3.5rem)`,
      }}
    >
      <div
        className='bg-white rounded-xl shadow-lg p-4 pt-0 sticky top-0 overflow-y-auto'
        style={{
          width: `${defaultWidth}px`,
        }}
      >
        <PhongBan />
      </div>
      <div
        className='flex-1 customScrollbar overflow-y-auto'
        style={{
          height: `calc(${mainHeight}px - 3rem - 2rem)`,
        }}
      >
        <HoSoWrapper />
      </div>
      {/* <div
        style={{
          width: `${defaultWidth}px`,
        }}
      >
        <DuyetPhepWrapper />
      </div> */}
    </div>
  )
}
