import { Dropdown } from 'antd'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FiDownload } from "react-icons/fi";
import { FaPen } from "react-icons/fa6";

export default function HoSoHopDong() {

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
            <FaPen />
          </div>
          <span>
            Cập nhật
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
            <FiDownload />
          </div>
          <span>
            Tải xuống
          </span>
        </button>
      ),
    },
  ];

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left flex flex-col gap-4'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Hợp đồng lao động
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
      <div className='w-full'>
        <p>
          <span>
            Loại hợp đồng:
          </span>
          <strong className='mx-1'>
            Có thời hạn
          </strong>
          <span>
            (05-05-2024)
          </span>
        </p>
      </div>
      <div className='w-full 2xl:w-3/4 mx-auto border border-gray-300 rounded relative p-1'>
        <img
          className='w-full object-contain object-center rounded'
          src="https://cdn.thuvienphapluat.vn/uploads/laodongtienluong/20230301/DVM/2303/mau-hdld.png"
          alt=""
        />
      </div>
    </div>
  )
}
