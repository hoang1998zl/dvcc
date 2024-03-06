import { Dropdown, Select } from 'antd'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FiDownload } from "react-icons/fi";
import { FaPen } from "react-icons/fa6";

export default function BangChamCongMenu() {
  return (
    <div
      className='w-full h-10 bg-orange-400 flex justify-between gap-2 items-center px-4 py-0.5 text-white font-semibold rounded'
    >
      <div className='h-full flex items-center gap-2'>
        <p
          className='text-lg uppercase'
        >
          Chấm công
        </p>

        <Select
          className='w-48'
          placeholder="Chọn phòng ban"
          options={[]}
        />

        <Select
          className='w-16 text-center'
          placeholder="01"
          options={[]}
        />

        <Select
          className='w-24 text-center'
          placeholder="2024"
          options={[]}
        />
      </div>
      <div>
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <button
                    type='button'
                    className='min-w-40 flex items-center gap-2'
                  >
                    <span>
                      Nhật ký
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
                    <span>
                      Quy ước tăng ca
                    </span>
                  </button>
                ),
              },
            ],
          }}
          placement='bottomRight'
          trigger={['click']}
          arrow
        >
          <button
            type='button'
          >
            <div
              className='w-8 aspect-square rounded border border-transparent hover:border-white flex justify-center items-center text-white text-xl'
            >
              <BsThreeDots />
            </div>
          </button>
        </Dropdown>

      </div>
    </div>
  )
}
