import dayjs from 'dayjs'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'

export default function HoSoGioiThieu() {

  const { currentNhanVien } = useSelector(state => state.UserSlice);

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left flex flex-col gap-4'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Giới thiệu
        </h1>
        <button
          type="button"
          className='w-8 aspect-square text-lg text-gray-400'
          onClick={() => {
            // dispatch(setOpenModalSlice({
            //   open: true,
            //   type: 'GioiThieuModal',
            //   title: 'Cập nhật giới thiệu'
            // }))
          }}
        >
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4'>
        <div className='flex items-center gap-4 text-gray-400'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-cake-candles"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Ngày sinh
            </p>
            <p className='font-bold text-black'>
              {dayjs(currentNhanVien?.nv_ngaysinh, "YYYY-MM-DD").isValid() ? moment(currentNhanVien?.nv_ngaysinh, 'YYYY-MM-DD').format('DD - MM - YYYY') : ''}
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
              {currentNhanVien?.nv_gender == 1 ? 'Nam' : (currentNhanVien?.nv_gender == 0 ? 'Nữ' : 'Khác')}
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
              {currentNhanVien?.nv_hocvan}
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
              {currentNhanVien?.nv_sdt_lienhe}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400 md:col-span-2 lg:col-span-1 2xl:col-span-2'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Địa chỉ thường trú
            </p>
            <p className='font-bold text-black'>
              {currentNhanVien?.nv_diachithuongtru}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 text-gray-400 md:col-span-2 lg:col-span-1 2xl:col-span-2'>
          <div className='w-12 aspect-square flex justify-center items-center text-3xl'>
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-base'>
              Địa chỉ tạm trú
            </p>
            <p className='font-bold text-black'>
              {currentNhanVien?.nv_diachitamtru}
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
              {dayjs(currentNhanVien?.nv_ngayvaolam, "YYYY-MM-DD").isValid() ? moment(currentNhanVien?.nv_ngayvaolam, 'YYYY-MM-DD').format('DD - MM - YYYY') : ''}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
