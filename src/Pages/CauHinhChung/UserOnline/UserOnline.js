import React from 'react';
import { FaGlobe } from "react-icons/fa6";
import working from '../../../issets/img/working.png';

export default function UserOnline() {
  return (
    <div className='w-full bg-white rounded-lg shadow-md p-4 flex flex-col gap-2'>
      <h1
        className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg'
      >
        <FaGlobe />
        <strong>
          Online
        </strong>
      </h1>
      <div
        className='w-full grid grid-cols-2 lg:grid-cols-3 gap-4'
      >
        <div className='w-full flex justify-center items-center gap-2 text-green-400'>
          <img
            className='w-6'
            src={working}
            alt=''
          />
          <div>
            <p
              className='text-gray-900 line-clamp-1 text-sm'
            >
              Hành chính
            </p>
            <p
              className='font-semibold line-clamp-1 -mt-1'
            >
              15 nhân sự
            </p>
          </div>
        </div>
        <div className='w-full flex justify-center items-center gap-2 text-green-400'>
          <img
            className='w-6'
            src={working}
            alt=''
          />
          <div>
            <p
              className='text-gray-900 line-clamp-1 text-sm'
            >
              Hành chính
            </p>
            <p
              className='font-semibold line-clamp-1 -mt-1'
            >
              15 nhân sự
            </p>
          </div>
        </div>
        <div className='w-full flex justify-center items-center gap-2 text-green-400'>
          <img
            className='w-6'
            src={working}
            alt=''
          />
          <div>
            <p
              className='text-gray-900 line-clamp-1 text-sm'
            >
              Hành chính
            </p>
            <p
              className='font-semibold line-clamp-1 -mt-1'
            >
              15 nhân sự
            </p>
          </div>
        </div>
        <div className='w-full flex justify-center items-center gap-2 text-green-400'>
          <img
            className='w-6'
            src={working}
            alt=''
          />
          <div>
            <p
              className='text-gray-900 line-clamp-1 text-sm'
            >
              Hành chính
            </p>
            <p
              className='font-semibold line-clamp-1 -mt-1'
            >
              15 nhân sự
            </p>
          </div>
        </div>
        <div className='w-full flex justify-center items-center gap-2 text-green-400'>
          <img
            className='w-6'
            src={working}
            alt=''
          />
          <div>
            <p
              className='text-gray-900 line-clamp-1 text-sm'
            >
              Hành chính
            </p>
            <p
              className='font-semibold line-clamp-1 -mt-1'
            >
              15 nhân sự
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
