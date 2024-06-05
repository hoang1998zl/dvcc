import React, { useEffect, useState } from 'react'
import BangChamCong from './BangChamCong/BangChamCong'
import { useSelector } from 'react-redux';
import BangCongParttime from './BangCongParttime/BangCongParttime';
import BangCongTangCa from './BangCongTangCa/BangCongTangCa';
// import ChamCongDetail from './ChamCongDetail/ChamCongDetail';
// import BaoCaoChamCong from './BaoCaoChamCong/BaoCaoChamCong';

export default function ChamCong() {

  const { mainHeight } = useSelector(state => state.PageSlice);

  let chamCong = useSelector(state => state.ChamCongSlice.chamCong);

  const [BangChamCongHeight, setBangChamCongHeight] = useState(0);

  useEffect(() => {
    setBangChamCongHeight(document.getElementById('ChamCongTable')?.offsetHeight);

    window.addEventListener('resize', () => {
      setBangChamCongHeight(document.getElementById('ChamCongTable')?.offsetHeight);
    })

    return () => {
      window.removeEventListener('resize', () => {
        setBangChamCongHeight(document.getElementById('ChamCongTable')?.offsetHeight);
      })
    }
  }, [])

  let renderContent = () => {
    switch (chamCong) {
      case 0: return <BangChamCong />
      case 1: return <BangCongParttime></BangCongParttime>
      case 2: return <BangCongTangCa/>
      default: <BangChamCong />
        break;
    }
  }
  return (
    <div
      id='chamCong'
      className='w-full p-4 flex flex-col gap-4'
      // style={{
      //   height: `calc(${mainHeight}px - 3rem)`,
      // }}
    >
      {
        renderContent()
      }
      
      {/* <div
        className='w-full flex gap-4'
        style={{
          '@media (minWidth: 786px)': {
            height: `calc((${mainHeight}px - 3rem) - ${BangChamCongHeight}px - 2rem)`,
          }
        }}
      >
        <ChamCongDetail />
        <BaoCaoChamCong />
      </div> */}
    </div>
  )
}
