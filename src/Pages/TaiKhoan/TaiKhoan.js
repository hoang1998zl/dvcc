import React from 'react'
import { useSelector } from 'react-redux';
import PhongBan from '../HoSo/PhongBan/PhongBan';
import DuyetPhep from '../CauHinhChung/DuyetPhep/DuyetPhep';

export default function TaiKhoan() {
  const { mainHeight } = useSelector(state => state.PageSlice);
  const defaultWidth = 300;
  return (
    <div
      className='w-full flex justify-center gap-4 py-4 2xl:px-4'
      style={{
        height: `calc(${mainHeight}px - 3rem)`,
      }}
    >
      <div
        className='bg-white rounded-xl shadow-lg p-4 sticky top-0'
        style={{
          width: `${defaultWidth}px`,
        }}
      >
        <PhongBan />
      </div>
      <div className='w-full'>
          <DuyetPhep></DuyetPhep>
      </div>
    </div>
  )
}
