import { Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FiDownload } from "react-icons/fi";
import { FaPen } from "react-icons/fa6";
import { useSelector } from 'react-redux';

export default function HoSoChungChi() {

  const { currentNhanVien } = useSelector(state => state.UserSlice);

  const items = [
    {
      key: '1',
      label: (
        <button
          type='button'
          className='min-w-40 flex items-center gap-2'
        >
          <div
            className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
          >
            <FiDownload />
          </div>
          <span>
            Tải xuống
          </span>
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button
          type='button'
          className='min-w-40 flex items-center gap-2'
        >
          <div
            className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
          >
            <FaPen />
          </div>
          <span>
            Cập nhật
          </span>
        </button>
      ),
    },
  ];

  const renderChungChi = () => {
    return currentNhanVien?.nv_chungchi?.map((chungchi, index) => {
      if (chungchi.chungchi_status == 1) {
        return (
          <div
            key={index}
            className='w-full rounded border border-gray-300 aspect-video p-1 relative flex justify-center items-center cursor-pointer'
          >
            <img
              className='w-full h-full object-contain object-center rounded'
              src={chungchi.chungchi_hinhanh}
              alt=''
            />
            {renderContextMenu(chungchi.chungchi_id)}
          </div>
        )
      }
    })
  };

  const renderContextMenu = () => {
    return (
      <div>

      </div>
    )
  };

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left flex flex-col gap-4'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Chứng chỉ
        </h1>

        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <button
            type='button'

          >
            <BsThreeDots
              className='text-lg'
            />
          </button>
        </Dropdown>
      </div>

      <div
        className='w-full grid grid-cols-2 gap-4'
      >
        {renderChungChi()}
      </div>
    </div>
  )
}
