import { DatePicker, Input, Select } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setnhanVienUpdated } from '../../../Redux-toolkit/reducer/HoSoNhanVienSlice';
import { nhanVienService } from '../../../services/nhanVienService';
import { localStorageService } from '../../../services/localStorageService';

function GioiThieuModal() {
  let dispatch = useDispatch();
  const { currentNhanVien } = useSelector(state => state.UserSlice);
  let nhanVienUpdated = useSelector(state => state.HoSoNhanVienSlice.nhanVienUpdated);
  let token = localStorageService.getItem('token');

  useEffect(()=>{
    if(!currentNhanVien){
      return;
    }
    nhanVienService.getNhanVienTheoId(token, currentNhanVien).then((res) => {
      dispatch(setnhanVienUpdated(res.data?.content));
    })
      .catch((err) => {
        console.log(err);
      });
  },[currentNhanVien])
  let changeInput = (field, value) => {
    let clone = { ...nhanVienUpdated };
    clone[field] = value;
    dispatch(setnhanVienUpdated(clone));
  }
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='w-full flex flex-col gap-2 md:col-span-2'>
        <p className='font-bold text-gray-400'>
          Chức vụ
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated?.nv_chucvunew}
          onChange={(e) => {
            changeInput('nv_chucvunew',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <p className='font-bold text-gray-400'>
          Ngày sinh
        </p>
        <DatePicker
          className='w-full'
          value={dayjs(nhanVienUpdated?.nv_ngaysinh, "YYYY-MM-DD").isValid()?dayjs(nhanVienUpdated?.nv_ngaysinh, "YYYY-MM-DD"):''}
          format={'DD-MM-YYYY'}
          onChange={(date, dateString) => {
            let value = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            changeInput('nv_ngaysinh',value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <p className='font-bold text-gray-400'>
          Giới tính
        </p>
        <Select
          className='w-full'
          options={[
            {
              label: 'Nam',
              value: 1
            },
            {
              label: 'Nữ',
              value: 0
            },
            {
              label: 'Khác',
              value: 2
            }
          ]}
          value={nhanVienUpdated?.nv_gender}
          onChange={(value) => {
            changeInput('nv_gender',value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <p className='font-bold text-gray-400'>
          Học vấn
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated?.nv_hocvan}
          onChange={(e) => {
            changeInput('nv_hocvan',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <p className='font-bold text-gray-400'>
          Liên hệ
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated?.nv_sdt_lienhe}
          onChange={(e) => {
            changeInput('nv_sdt_lienhe',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2 md:col-span-2'>
        <p className='font-bold text-gray-400'>
          Địa chỉ thường trú
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated?.nv_diachithuongtru}
          onChange={(e) => {
            changeInput('nv_diachithuongtru',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2 md:col-span-2'>
        <p className='font-bold text-gray-400'>
          Địa chỉ tạm trú
        </p>
        <Input
          className='w-full'
          value={nhanVienUpdated?.nv_diachitamtru}
          onChange={(e) => {
            changeInput('nv_diachitamtru',e.target.value);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <p className='font-bold text-gray-400'>
          Ngày vào làm
        </p>
        <DatePicker
          className='w-full'
          value={dayjs(nhanVienUpdated?.nv_ngayvaolam, "YYYY-MM-DD").isValid()?dayjs(nhanVienUpdated?.nv_ngayvaolam, "YYYY-MM-DD"):''}
          format={'DD-MM-YYYY'}
          onChange={(date, dateString) => {
            let value = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            changeInput('nv_ngayvaolam',value);
          }}
        />
      </div>
    </div>
  )
}

export default GioiThieuModal