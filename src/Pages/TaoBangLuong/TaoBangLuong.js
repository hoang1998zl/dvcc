import { Tabs } from 'antd'
import React from 'react'
import BangThongSo from './BangThongSo/BangThongSo';
import BangNhapLieu from './BangNhapLieu/BangNhapLieu';
import CongThucLuong from './CongThucLuong/CongThucLuong';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { setCTLflag } from '../../Redux-toolkit/reducer/MenuSlice';

export default function TaoBangLuong() {
  const { CTLflag } = useSelector(state => state.MenuSlice);
  let dispatch = useDispatch();
  const items = [
    {
      key: '1',
      label: 'Bảng Macro',
      children: <BangThongSo></BangThongSo>,
    },
    {
      key: '3',
      label: 'Bảng Nhập Liệu',
      children: <BangNhapLieu></BangNhapLieu>,
    },
    {
      key: '4',
      label: 'Công Thức Lương',
      children: <CongThucLuong />,
    },
  ];
  let renderTBL = (
    <div id='taoBangLuong' className='m-4 p-4 rounded-lg bg-white shadow-md'>
      <Tabs className='customTab' type='card' defaultActiveKey={CTLflag?'4':'1'} items={items}> </Tabs>
      <ToastContainer/>
    </div>
  );
  dispatch(setCTLflag(false));
  return renderTBL;
}
