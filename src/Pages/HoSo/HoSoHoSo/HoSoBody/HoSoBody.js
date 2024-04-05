import React from 'react'
import HoSoGioiThieu from './HoSoGioiThieu/HoSoGioiThieu'
import HoSoCCCD from './HoSoCCCD/HoSoCCCD'
import HoSoGPLX from './HoSoGPLX/HoSoGPLX'
import HoSoHopDong from './HoSoHopDong/HoSoHopDong'
import HoSoChungChi from './HoSoChungChi/HoSoChungChi'
import ModalComponent from '../../../../Components/Modal/ModalComponent'


export default function HoSoBody() {
  return (
    <div
      className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4 relative'
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
      <ModalComponent></ModalComponent>
    </div>
  )
}
