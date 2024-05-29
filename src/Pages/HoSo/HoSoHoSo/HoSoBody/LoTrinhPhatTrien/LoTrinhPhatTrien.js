import { Collapse } from 'antd'
import React, { useEffect, useState } from 'react'
import { CaretRightOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalSlice } from '../../../../../Components/Modal/ModalSlice';
import moment from 'moment/moment';

function LoTrinhPhatTrien() {

  const dispatch = useDispatch();
  let nhanVienHS = useSelector(state => state.HoSoNhanVienSlice.nhanVienHS);
  const [timeLine, setTimeLine] = useState([]);
  useEffect(()=>{
    setTimeLine([...new Set(nhanVienHS?.ns_nhanvien_lotrinhphattrien?.map(item => new Date(item.date).getFullYear()))].sort((a, b) => a - b));
  },[nhanVienHS]);
  
  const renderItemsList = (year, type) => {
    const arrayB = nhanVienHS?.ns_nhanvien_lotrinhphattrien.filter(item => new Date(item.date).getFullYear() === year && item.type === type);
    return arrayB?.map((item)=>{
      return (
        <li>
          <p className='w-full flex flex-1'>
            <span className='w-[100px] text-orange-400 mr-2'>
              {moment(item.date).format('DD-MM-YYYY')}
            </span>
            <span className='w-[200px]'>
              {item.position}
            </span>
            {item.file_path?
              (<a href={item.file_path} className="w-max flex justify-center items-center rounded bg-slate-100 text-gray-800 cursor-pointer"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path></svg><span className='pl-1'>Tải quyết định</span></a>)
              :''
            }
          </p>
        </li>
      )
    })
  }
  const itemsChildNew = (idx,year) => {
    return [
      {
        key: idx+'1',
        label: <strong className='text-gray-400'>
          <i className='fa-solid fa-arrow-up-right-dots'></i>
          <span className='ml-2'>
            Quá trình thăng tiến
          </span>
        </strong>,
        children: <ul className='ps-6'>
          {renderItemsList(year,1)}
      </ul>
      },
      {
        key: idx+'2',
        label: <strong className='text-gray-400'>
          <i className='fa-solid fa-plane -rotate-45'></i>
          <span className='ml-2'>
            Quá trình công tác
          </span>
        </strong>,
        children: <ul className='ps-6'>
          {renderItemsList(year,2)}
        </ul>
      }
    ]
  }
  let itemsNew = timeLine?.map((item, index) => {
    return {
      key: index,
      label: <strong>Năm {item}</strong>,
      children: <Collapse
        bordered={false}
        defaultActiveKey={[String(index)+'1', String(index)+'2']}
        expandIconPosition={'end'}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={itemsChildNew(String(index),item)}
      />,
    }
  })

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Lộ trình phát triển
        </h1>
        <button
          type="button"
          className='w-8 aspect-square text-lg text-gray-400'
          onClick={() => {
            dispatch(setOpenModalSlice({
              open: true,
              type: 'LTPTModal',
              title: 'Cập nhật lộ trình phát triển',
              width: 700
            }))
          }}
        >
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
      <Collapse
        bordered={false}
        defaultActiveKey={timeLine?.map((item, index)=>{return index})}
        expandIconPosition={'end'}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={itemsNew}
      />
    </div>
  )
}

export default LoTrinhPhatTrien