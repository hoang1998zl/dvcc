import React, { useEffect, useState } from 'react'
import BangChamCong from './BangChamCong/BangChamCong'
import { useSelector } from 'react-redux';
import ChamCongDetail from './ChamCongDetail/ChamCongDetail';
import BaoCaoChamCong from './BaoCaoChamCong/BaoCaoChamCong';

export default function ChamCong() {

  const { mainHeight } = useSelector(state => state.PageSlice);

  const [BangChamCongHeight, setBangChamCongHeight] = useState(0);

  useEffect(() => {
    setBangChamCongHeight(document.getElementById('ChamCongTable').offsetHeight);

    window.addEventListener('resize', () => {
      setBangChamCongHeight(document.getElementById('ChamCongTable').offsetHeight);
    })

    return () => {
      window.removeEventListener('resize', () => {
        setBangChamCongHeight(document.getElementById('ChamCongTable').offsetHeight);
      })
    }
  }, [])

  return (
    <div
      id='chamCong'
      className='w-full p-4 flex flex-col gap-4'
      style={{
        height: `calc(${mainHeight}px - 3rem)`,
      }}
    >
      <BangChamCong />
      <div
        className='w-full flex gap-4'
        style={{
          '@media (min-width: 786px)': {
            height: `calc((${mainHeight}px - 3rem) - ${BangChamCongHeight}px - 2rem)`,
          }
        }}
      >
        <ChamCongDetail />
        <BaoCaoChamCong />
      </div>
    </div>
  )
}
