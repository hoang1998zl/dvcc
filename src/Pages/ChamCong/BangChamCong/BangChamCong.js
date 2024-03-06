import React from 'react'
import BangChamCongMenu from './BangChamCongMenu/BangChamCongMenu'
import BangChamCongTable from './BangChamCongTable/BangChamCongTable'

export default function BangChamCong() {
  return (
    <div
      className='w-full bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2'
    >
      <BangChamCongMenu />
      <BangChamCongTable />
    </div>
  )
}
