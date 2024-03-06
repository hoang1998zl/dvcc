import React, { useState } from 'react'
import TaiKhoanApp from './TaiKhoanApp/TaiKhoanApp'
import DuyetPhep from './DuyetPhep/DuyetPhep'

export default function DuyetPhepWrapper() {

  const [openTaiKhoanApp, setOpenTaiKhoanApp] = useState(true);
  const [openDuyetPhep, setOpenDuyetPhep] = useState(false);

  return (
    <div className='w-full flex flex-col gap-4'>
      <div
        className='w-full bg-white rounded-lg shadow-lg p-4 border flex flex-col gap-4 text-sm'
      >
        <button
          type="button"
          className='w-full h-10 bg-orange-400 text-white text-center flex justify-center items-center rounded-lg focus:outline-none text-lg font-semibold'
          onClick={()=>{
            setOpenTaiKhoanApp(!openTaiKhoanApp);
            setOpenDuyetPhep(false);
          }}
        >
          Tài Khoản App
        </button>
        {
          openTaiKhoanApp &&
          <TaiKhoanApp />
        }
      </div>
      <div
        className='w-full bg-white rounded-lg shadow-lg p-4 border flex flex-col gap-4 text-sm'
      >
        <button
          type="button"
          className='w-full h-10 bg-orange-400 text-white text-center flex justify-center items-center rounded-lg focus:outline-none text-lg font-semibold'
          onClick={()=>{
            setOpenDuyetPhep(!openDuyetPhep);
            setOpenTaiKhoanApp(false);
          }}
        >
          Duyệt phép
        </button>
        {
          openDuyetPhep &&
          <DuyetPhep />
        }
      </div>
    </div>
  )
}
