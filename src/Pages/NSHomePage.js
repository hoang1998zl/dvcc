import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Components/Header/Header';
import Loading from '../Components/Loading/Loading';
import { setHeaderHeight, setMainHeight } from '../Redux-toolkit/reducer/PageSlice';
import CauHinhChung from './CauHinhChung/CauHinhChung';
import HoSo from './HoSo/HoSo';
import ChamCong from './ChamCong/ChamCong';
import DuyetApp from './DuyetApp/DuyetApp';
import BaoCao from './BaoCao/BaoCao';

export default function NSHomePage() {

  let dispatch = useDispatch();


  const { currentMenu } = useSelector(state => state.MenuSlice);
  const { loading } = useSelector(state => state.PageSlice);


  useEffect(() => {
    dispatch(setHeaderHeight(document.getElementById('Header').offsetHeight));
    dispatch(setMainHeight(document.getElementById('NSHomePage').offsetHeight));

    window.addEventListener('resize', () => {
      dispatch(setHeaderHeight(document.getElementById('Header').offsetHeight));
      dispatch(setMainHeight(document.getElementById('NSHomePage').offsetHeight));
    })

    return () => {
      window.removeEventListener('resize', () => {
        dispatch(setHeaderHeight(document.getElementById('Header').offsetHeight));
        dispatch(setMainHeight(document.getElementById('NSHomePage').offsetHeight));
      })
    }
  }, [dispatch]);

  let renderContent = (currentMenu) => {
    switch (currentMenu) {
      case 1: return <BaoCao />;
      case 2: return <CauHinhChung />;
      case 3: return <HoSo />;
      case 4: return <DuyetApp />;
      case 5: return <ChamCong />;
      default: return <BaoCao />;
    }
  }

  return (
    <div
      id='NSHomePage'
      className='h-screen flex flex-col relative bg-[#eceff8]'
    >

      <Header />

      <div
        id='NSHomePage'
        className='w-full'
      >
        {renderContent(currentMenu)}
      </div>

      {
        loading && <Loading />
      }
    </div>
  )
}