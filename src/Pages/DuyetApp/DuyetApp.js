import React from 'react'
import HoatDongTrenApp from './HoatDongTrenApp/HoatDongTrenApp';
import ChamCongMap from './ChamCongMap/ChamCongMap';
import ThongBao from './ThongBao/ThongBao';

export default function DuyetApp() {

  return (
    <div id='chamCong' className='w-full p-4 pb-16 lg:pb-0 text-sm'>
      <div
        className={`w-full lg:grid  flex-row-reverse gap-4`}
        style={{
          gridTemplateColumns: '230px 1fr',
        }}
      >
        <div className='w-[230px] relative z-10'>
          <div className='w-full max-h-[calc(100vh-3rem-2rem)] flex flex-col gap-4 justify-start sticky top-0 overflow-y-auto'>
            <ThongBao />
          </div>
        </div>
        <div className={`w-full`}>
          <div className='w-full flex flex-col gap-2 lg:gap-4'>
            <HoatDongTrenApp />
            <ChamCongMap />
          </div>
        </div>
      </div>
    </div>
  )
}
