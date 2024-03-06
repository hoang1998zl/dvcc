import React from 'react'
import HoSoGioiThieu from './HoSoGioiThieu/HoSoGioiThieu'
import HoSoCCCD from './HoSoCCCD/HoSoCCCD'
import HoSoGPLX from './HoSoGPLX/HoSoGPLX'
import HoSoHopDong from './HoSoHopDong/HoSoHopDong'
import HoSoChungChi from './HoSoChungChi/HoSoChungChi'

export default function HoSoBody() {
  return (
    <div
      className='w-full grid grid-cols-1 xl:grid-cols-2 gap-4'
    >
      <div className='flex flex-col gap-4'>
        <HoSoGioiThieu />
        <HoSoCCCD />
        <HoSoGPLX />
      </div>
      <div className='flex flex-col gap-4'>
        <HoSoHopDong />
        <HoSoChungChi />
      </div>
    </div>
  )
}
