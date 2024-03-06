import React from 'react'
import BaoCaoSoPhep from './BaoCaoSoPhep/BaoCaoSoPhep'
import BaoCaoChart from './BaoCaoChart/BaoCaoChart'

export default function BaoCao() {
  return (
    <div
      className='w-full max-w-screen-xl mx-auto p-4 flex flex-col gap-4'
    >
      <BaoCaoSoPhep />
      <BaoCaoChart />
    </div>
  )
}
