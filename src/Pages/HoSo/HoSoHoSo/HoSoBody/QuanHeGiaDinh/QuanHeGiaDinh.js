import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalSlice } from '../../../../../Components/Modal/ModalSlice';
import { setRelaType } from '../../../../../Redux-toolkit/reducer/HoSoNhanVienSlice';
import dayjs from 'dayjs';
import moment from 'moment';

function QuanHeGiaDinh() {

  const dispatch = useDispatch();

  let nhanVienHS = useSelector(state => state.HoSoNhanVienSlice.nhanVienHS);
  let relaType = useSelector(state => state.HoSoNhanVienSlice.relaType);
  useEffect(()=>{
    // console.log(nhanVienHS)
  },[nhanVienHS])
  const [tabNameQHGD, setTabNameQHGD] = useState('ChaMe');

  const ListQHGD = [
    {
      id: 'ChaMe',
      name: 'Cha-mẹ',
      type: '12'
    },
    {
      id: 'AnhChiEm',
      name: 'Anh-Chị-Em',
      type: '345'
    },
    {
      id: 'VoChong',
      name: 'Vợ-Chồng',
      type: '67'
    },
    {
      id: 'ConCai',
      name: 'Con',
      type: '8'
    }
  ];

  const QHGD = ['Cha','Mẹ','Anh','Chị','Em','Vợ','Chồng','Con'];

  const renderListQHGD = () => {
    return ListQHGD?.map((item,index) => {
      return (
        <button
        key={index}
          type="button"
          className={`font-semibold text-left px-2 py-1 rounded border ${tabNameQHGD == item.id ? 'border-orange-400 bg-orange-100 text-orange-400' : 'border-transparent bg-transparent text-black'}`}
          onClick={() => {
            setTabNameQHGD(item.id);
            dispatch(setRelaType(item.type));
          }}
        >
          {item.name}
        </button>
      )
    })
  };

  const renderQHGD = (type) => {
    let flag = 0;
    if(nhanVienHS?.ns_nhanvien_family?.length > 0){
      return nhanVienHS?.ns_nhanvien_family?.map((item, index) => {
        if(String(type).includes(String(item.type))){
          flag = 1;
          return (
            <div key={index} className='w-full'>
              <p className='text-gray-400 font-bold flex items-center gap-2'>
                <i className='fa-solid fa-star text-xl'></i>
                <span>
                  Quan hệ:
                </span>
                <span className='text-orange-400'>
                  {QHGD[item.type-1]}
                </span>
              </p>
              <ul className='ps-12 text-gray-400'>
                <li>
                  <p>
                    <span>Họ và tên: </span>
                    <strong className='text-black'>
                      {item.name}
                    </strong>
                  </p>
                </li>
                <li>
                  <p>
                    <span>Ngày sinh: </span>
                    <strong className='text-black'>
                      {dayjs(item.birthday, "YYYY-MM-DD").isValid()?moment(item.birthday,'YYYY-MM-DD').format('DD - MM - YYYY'):''}
                    </strong>
                  </p>
                </li>
                <li>
                  <p>
                    <span>Liên hệ: </span>
                    <strong className='text-black'>
                      {item.phone}
                    </strong>
                  </p>
                </li>
              </ul>
            </div>
          )
        }
        if(flag === 0 && index === (nhanVienHS?.ns_nhanvien_family.length - 1)){
          return (
            <div className='w-full'>
              <p>
                Không có quan hệ nào
              </p>
            </div>
          )
        }
      });
    } else {
      return (
        <div className='w-full'>
          <p>
            Không có quan hệ nào
          </p>
        </div>
      )
    }
  };

  return (
    <div className='w-full bg-white rounded-lg shadow-lg text-left flex justify-between items-start'>
      <div className='w-max p-4'>
        <h1 className='text-orange-400 font-bold text-lg mb-4'>
          Quan hệ gia đình
        </h1>
        <div className='w-full grid grid-cols-1'>
          {renderListQHGD()}
        </div>
      </div>
      <div className='border-l border-orange-400 flex-1 h-max min-h-full flex items-start gap-4 p-4'>
        <div className='flex-1'>
          <div className='w-full grid gap-y-4'>
            {renderQHGD(relaType)}
          </div>
        </div>
        <button
          type="button"
          className='w-8 aspect-square text-lg text-gray-400'
          onClick={() => {
            dispatch(setOpenModalSlice({
              open: true,
              type: 'QHGDModal',
              title: 'Cập nhật quan hệ gia đình'
            }))
          }}
        >
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
    </div>
  )
}

export default QuanHeGiaDinh