import { Select } from 'antd'
import React from 'react'

export default function DuyetPhep() {
  return (

    <div
      className='w-full flex flex-col gap-2'
    >
      <p>
        Duyệt đi trễ:
      </p>
      <Select
        mode="multiple"
        allowClear
        className='w-full'
        placeholder="Chọn nhân viên"
        options={[]}
      />
      <p>
        Duyệt nghỉ phép:
      </p>
      <Select
        mode="multiple"
        allowClear
        className='w-full'
        placeholder="Chọn nhân viên"
        options={[]}
      />
      <p>
        Duyệt công tác:
      </p>
      <Select
        mode="multiple"
        allowClear
        className='w-full'
        placeholder="Chọn nhân viên"
        options={[]}
      />
    </div>
  )
}
