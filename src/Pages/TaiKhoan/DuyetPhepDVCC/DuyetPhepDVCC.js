import React from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'

export default function DuyetPhepDVCC() {
  return (
    <div className='w-full flex flex-col'>
        <h1
            className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg pl-4 pt-2'>
        <FaRegCircleCheck />
            <strong>
                Người Duyệt App Định Vị Chấm Công
            </strong>
        </h1>
        <div className='w-full border border-gray-300 rounded-lg h-full m-2'>

        </div>
    </div>
  )
}
