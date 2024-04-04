import React from 'react'
import BaoCaoSoPhep from './BaoCaoSoPhep/BaoCaoSoPhep'
import BaoCaoChart from './BaoCaoChart/BaoCaoChart'
import BaoCaoTuan from './BaoCaoTuan/BaoCaoTuan'
import BaoCaoOnline from './BaoCaoOnline/BaoCaoOnline'

export default function BaoCao() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4'>
      <BaoCaoOnline></BaoCaoOnline>
      <div
        className='w-full max-w-screen-xl mx-auto p-4 flex flex-col gap-4 col-span-3'
      >
        <BaoCaoSoPhep />
        <BaoCaoTuan></BaoCaoTuan>
        <BaoCaoChart />
      </div>
    </div>
    
  )
}
