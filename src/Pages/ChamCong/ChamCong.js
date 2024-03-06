import React from 'react'
import BangChamCong from './BangChamCong/BangChamCong'
import { useSelector } from 'react-redux';

export default function ChamCong() {

  const { mainHeight } = useSelector(state => state.PageSlice);

  return (
    <div
      id='chamCong'
      className='w-full p-4'
      style={{
        height: `calc(${mainHeight}px - 3rem)`,
      }}
    >
      <BangChamCong />
    </div>
  )
}
