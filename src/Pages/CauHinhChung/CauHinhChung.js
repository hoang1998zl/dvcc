import React, { useEffect, useState } from 'react'
import ChiNhanh from './ChiNhanh/ChiNhanh'
import { useSelector } from 'react-redux';
import UserOnline from './UserOnline/UserOnline';
import DuyetPhep from './DuyetPhep/DuyetPhep';
import ThoiGianChamCong from './ThoiGianChamCong/ThoiGianChamCong';
import CongTy from './CongTy/CongTy';

export default function CauHinhChung() {

  const { mainHeight } = useSelector(state => state.PageSlice);

  const [leftHeight, setLeftHeight] = useState(0);
  const [rightHeight, setRightHeight] = useState(0);

  useEffect(() => {

    setLeftHeight(document.getElementById('chiNhanh')?.offsetHeight);
    setRightHeight(document.getElementById('CauHinhChung__right')?.offsetHeight);

    window.addEventListener('resize', () => {
      setLeftHeight(document.getElementById('chiNhanh')?.offsetHeight);
      setRightHeight(document.getElementById('CauHinhChung__right')?.offsetHeight);
    })

    return () => {
      window.removeEventListener('resize', () => {
        setLeftHeight(document.getElementById('chiNhanh')?.offsetHeight);
        setRightHeight(document.getElementById('CauHinhChung__right')?.offsetHeight);
      })
    }

  }, []);

  return (
    <div
      id='cauHinhChung'
      className='w-full flex justify-center p-4'
      style={{
        // height: `calc(${mainHeight}px - 3rem)`,
      }}
    >
      <div className='w-full 2xl:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <ChiNhanh />
        <div
          id='CauHinhChung__right'
          className={`w-full flex flex-col gap-4 customScrollbar`}
          style={{
            justifyContent: rightHeight > leftHeight ? 'flex-start' : 'space-between',
            overflowY: 'auto',
            '@media (min-width: 1024px)': {
              maxHeight: leftHeight,
            }
          }}
        >
          {/* <UserOnline /> */}
          {/* <DuyetPhep /> */}
          <CongTy></CongTy>
          <ThoiGianChamCong />
        </div>
      </div>
    </div>
  )
}
