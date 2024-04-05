import React from 'react'
import { useSelector } from 'react-redux';
import PhongBan from '../HoSo/PhongBan/PhongBan';
import DuyetPhep from '../CauHinhChung/DuyetPhep/DuyetPhep';
import TaiKhoanDvcc from './TaiKhoanDvcc/TaiKhoanDvcc';
import DuyetPhepDVCC from './DuyetPhepDVCC/DuyetPhepDVCC';

export default function TaiKhoan() {
  const { mainHeight } = useSelector(state => state.PageSlice);
  const defaultWidth = 300;
  return (
    <div
      className='w-full flex justify-center gap-4 py-4 2xl:px-4'
      style={{
        height: `calc(${mainHeight}px - 3.5rem)`,
      }}
    >
      <div
        className='bg-white rounded-xl shadow-lg p-4 sticky top-0 overflow-y-auto customScrollbar'
        style={{
          width: `${defaultWidth}px`,
        }}
      >
        <PhongBan />
      </div>
      <div className='w-full flex flex-col'>
          <DuyetPhep></DuyetPhep>
          <div className='grid md:grid-cols-2 grid-col-1 bg-white rounded-lg shadow-md h-full mt-4 px-1'>
              <TaiKhoanDvcc></TaiKhoanDvcc>
              <DuyetPhepDVCC></DuyetPhepDVCC>
          </div>
      </div>
    </div>
  )
}
