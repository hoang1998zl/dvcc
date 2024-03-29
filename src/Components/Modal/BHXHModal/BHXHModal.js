import {  Input } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setnhanVienUpdated } from '../../../Redux-toolkit/reducer/HoSoNhanVienSlice';

function GioiThieuModal() {
  let dispatch = useDispatch();
  let nhanVienHS = useSelector(state => state.HoSoNhanVienSlice.nhanVienHS);
  let nhanVienUpdated = useSelector(state => state.HoSoNhanVienSlice.nhanVienUpdated);
  useEffect(() => {
    dispatch(setnhanVienUpdated(nhanVienHS));
  }, [nhanVienHS]);
  let changeInput = (field, value) => {
    let clone = { ...nhanVienUpdated };
    clone[field] = value;
    dispatch(setnhanVienUpdated(clone));
  }
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='w-full flex flex-col gap-2 md:col-span-2'>
        <p className='font-bold text-gray-400'>
            Mã số BHXH
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated.nv_masobhxh}
          onChange={(e) => {
            changeInput('nv_masobhxh',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2 md:col-span-2'>
        <p className='font-bold text-gray-400'>
            Lương đóng BHXH
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated.nv_luongdongbhxh}
          onChange={(e) => {
            changeInput('nv_luongdongbhxh',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2 md:col-span-2'>
        <p className='font-bold text-gray-400'>
            Công ty đóng
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated.nv_bhxh_congtydong}
          onChange={(e) => {
            changeInput('nv_bhxh_congtydong',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2 md:col-span-2'>
        <p className='font-bold text-gray-400'>
            Nhân viên đóng
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated.nv_bhxh_nhanviendong}
          onChange={(e) => {
            changeInput('nv_bhxh_nhanviendong',e.target.value);
          }}
        />
      </div>
    </div>
  )
}

export default GioiThieuModal