import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalSlice } from '../../../../../Components/Modal/ModalSlice';
import moment from 'moment';
import dayjs from 'dayjs';
import { nhanVienService } from '../../../../../services/nhanVienService';
import { localStorageService } from '../../../../../services/localStorageService';

function HoSoGioiThieu() {

  const dispatch = useDispatch();
  let [nhanVienHS,setNhanVienHS] = useState({});
  let token = localStorageService.getItem('token');
  const { currentNhanVien } = useSelector(state => state.UserSlice);
  let reloadHS = useSelector(state => state.HoSoNhanVienSlice.reloadHS);

  useEffect(()=>{
    if(!currentNhanVien){
      return;
    }
    nhanVienService.getNhanVienTheoId(token, currentNhanVien).then((res) => {
      setNhanVienHS(res.data?.content);
    })
      .catch((err) => {
        console.log(err);
      });
  },[currentNhanVien,reloadHS])

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Giới thiệu
        </h1>
        <button
          type="button"
          className='w-8 aspect-square text-lg text-gray-400'
          onClick={() => {
            dispatch(setOpenModalSlice({
              open: true,
              type: 'GioiThieuModal',
              title: 'Cập nhật giới thiệu'
            }))
          }}
        >
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
      <div className='mt-4 w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-cake-candles"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Ngày sinh
            </p>
            <p className='font-bold text-black'>
              {dayjs(nhanVienHS.nv_ngaysinh, "YYYY-MM-DD").isValid()?moment(nhanVienHS.nv_ngaysinh,'YYYY-MM-DD').format('DD - MM - YYYY'):''}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-venus-mars"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Giới tính
            </p>
            <p className='font-bold text-black'>
              {nhanVienHS.nv_gender==1?'Nam':(nhanVienHS.nv_gender==0?'Nữ':'Khác')}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Học vấn
            </p>
            <p className='font-bold text-black'>
              {nhanVienHS.nv_hocvan}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-phone"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Liên hệ
            </p>
            <p className='font-bold text-black'>
              {nhanVienHS.nv_sdt_lienhe}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Địa chỉ thường trú
            </p>
            <p className='font-bold text-black'>
              {nhanVienHS.nv_diachithuongtru}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-user"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Loại Nhân Viên
            </p>
            <p className='font-bold text-black'>
              {nhanVienHS?.is_parttime === 0 ? "Full-time": "Part-time"}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400 md:col-span-2'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Địa chỉ tạm trú
            </p>
            <p className='font-bold text-black'>
              {nhanVienHS.nv_diachitamtru}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Ngày vào làm
            </p>
            <p className='font-bold text-black'>
              {dayjs(nhanVienHS.nv_ngayvaolam, "YYYY-MM-DD").isValid()?moment(nhanVienHS.nv_ngayvaolam,'YYYY-MM-DD').format('DD - MM - YYYY'):''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HoSoGioiThieu