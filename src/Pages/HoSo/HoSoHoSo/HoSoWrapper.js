import React from 'react'
import HoSoHeader from './HoSoHeader/HoSoHeader'
import HoSoBody from './HoSoBody/HoSoBody'

export default function HoSoWrapper() {
  return (
    <div className='w-full flex flex-col gap-4'>
      <HoSoHeader />
      <HoSoBody />
    </div>
  )
}
