import React from 'react'
import HoSoHeader from './HoSoHeader/HoSoHeader'
import HoSoBody from './HoSoBody/HoSoBody'
import { useSelector } from 'react-redux';

export default function HoSoWrapper() {
  let {currentNhanVien} = useSelector(state => state.UserSlice);
  return (
    <div className='w-full flex flex-col gap-4 relative'>
      {
        !currentNhanVien && <div className='absolute w-full h-full bg-white opacity-70'>
        </div>
      }
      <HoSoHeader />
      <HoSoBody />
    </div>
  )
}
