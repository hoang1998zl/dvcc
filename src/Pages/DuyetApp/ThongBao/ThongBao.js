import React, { useEffect, useState } from 'react'
import { dvccService } from '../../../services/dvccService';
import { localStorageService } from '../../../services/localStorageService';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadMany, setTabApp } from '../../../Redux-toolkit/reducer/ChamCongSlice';
import { setNewNoti } from '../../../Redux-toolkit/reducer/DuyetAppSlice';

export default function ThongBao({
  haveFooterMenu
}) {
  let dispatch = useDispatch();
  let token = localStorageService.getItem("token");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [reload,setReload] = useState(0);
  const [thongBao,setThongBao] = useState({});
  let newNoti = useSelector(state => state.DuyetAppSlice.newNoti);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowWidth])

  useEffect(() => {
    windowWidth >= 1024 ? setIsMobile(false) : setIsMobile(true);
  }, [windowWidth])

  useEffect(() => {
    dvccService.getTotal(token).then((res) => {
            setThongBao(res.data.content);
            let total = 0;
            total = res.data?.content?.nghiPhep + res.data?.content?.diTre + res.data?.content?.veSom + res.data?.content?.congTac + res.data?.content?.tangCa + res.data?.content?.dangKyCa;
            dispatch(setNewNoti(total));
          })
          .catch((err) => {
           console.log(err);
          });
  },[reload])
  let autoReload = () => {
    setTimeout(() => {
      setReload(Date.now());
    },[60000])
  }
  return (
    <>
      {
        isMobile == true ?
          <div className={`fixed ${haveFooterMenu ? 'bottom-20' : 'bottom-4'} right-4 z-[1000]`}>
            <div className='relative'>
              <button
                type='button'
                className='w-12 h-12 bg-orange-400 text-white rounded-full flex justify-center items-center text-xl relative focus:outline-none'
                onClick={() => setIsShow(!isShow)}
              >
                <i className="fa-solid fa-bell"></i>
                <div className='w-5 absolute -right-1 -top-1 text-[10px] leading-[10px] flex justify-center items-center aspect-square bg-red-700 rounded-full'>
                  {newNoti}
                </div>
              </button>

              <div className={`${isShow == true ? 'w-[230px] p-4 border-gray-300 shadow-md opacity-100' : 'w-0 p-0 border-none shadow-none opacity-0'} border rounded-md bg-white absolute bottom-14 right-0  delay-75 duration-300 transition-all ease-linear`}>

                <ul className='w-full text-left'>
                  <li onClick={() => {
                    dispatch(setTabApp(2));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                    <div className='w-7 text-xl text-center text-sky-400'>
                      <i className="fa-regular fa-calendar-days"></i>
                    </div>
                    <p className='w-full flex-1 line-clamp-2'>
                      hiện có <strong className='text-sky-400'>{thongBao?.nghiPhep}</strong> đơn nghỉ phép mới cần duyệt
                    </p>
                  </li>
                  <li onClick={() => {
                    dispatch(setTabApp(1));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                    <div className='w-7 text-xl text-center text-sky-400'>
                      <i className="fa-solid fa-person-running"></i>
                    </div>
                    <p className='w-full flex-1 line-clamp-2'>
                      hiện có <strong className='text-sky-400'>{thongBao?.diTre}</strong> đơn xin đi trễ mới cần duyệt
                    </p>
                  </li>
                  <li onClick={() => {
                    dispatch(setTabApp(3));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                    <div className='w-7 text-xl text-center text-yellow-400'>
                      <i className="fa-solid fa-person-walking-luggage"></i>
                    </div>
                    <p className='w-full flex-1 line-clamp-2'>
                      hiện có <strong className='text-sky-400'>{thongBao?.congTac}</strong> lịch đăng ký công tác mới cần duyệt
                    </p>
                  </li>
                  <li onClick={() => {
                    dispatch(setTabApp(1));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                    <div className='w-7 text-xl text-center text-blue-600'>
                      <i className="fa-solid fa-person-walking-dashed-line-arrow-right"></i>
                    </div>
                    <p className='w-full flex-1 line-clamp-2'>
                      hiện có <strong className='text-sky-400'>{thongBao?.veSom}</strong> đơn xin về sớm mới cần duyệt
                    </p>
                  </li>
                  <li onClick={() => {
                    dispatch(setTabApp(5));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                    <div className='w-7 text-xl text-center text-blue-600'>
                      <i className="fa-solid fa-chart-mixed"></i>
                    </div>
                    <p className='w-full flex-1 line-clamp-2'>
                      hiện có <strong className='text-sky-400'>{thongBao?.tangCa}</strong> đơn xin tăng ca mới cần duyệt
                    </p>
                  </li>
                  <li onClick={() => {
                    dispatch(setTabApp(4));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                    <div className='w-7 text-xl text-center text-green-500'>
                      <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <p className='w-full flex-1 line-clamp-2'>
                      hiện có <strong className='text-sky-400'>{thongBao?.dangKyCa}</strong> ca đăng ký mới cần duyệt
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          :
          <div className='w-full p-4 bg-white rounded-lg shadow-md z-[2]'>
            <div
              className='text-orange-400 font-semibold pb-2 capitalize text-left border-b border-orange-400 bg-white sticky top-0 z-[3]'
            >
              <span className='flex-1 text-left'>Thông báo</span>
            </div>
            <div className='w-full mt-2 max-h-[40vh] overflow-y-auto'>
              <ul className='w-full text-left'>
                <li onClick={() => {
                    dispatch(setTabApp(2));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                  <div className='w-7 text-xl text-center text-sky-400'>
                    <i className="fa-regular fa-calendar-days"></i>
                  </div>
                  <p className='w-full flex-1 line-clamp-2'>
                    hiện có <strong className='text-sky-400'>{thongBao?.nghiPhep}</strong> đơn nghỉ phép mới cần duyệt
                  </p>
                </li>
                <li onClick={() => {
                    dispatch(setTabApp(1));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                  <div className='w-7 text-xl text-center text-sky-400'>
                    <i className="fa-solid fa-person-running"></i>
                  </div>
                  <p className='w-full flex-1 line-clamp-2'>
                    hiện có <strong className='text-sky-400'>{thongBao?.diTre}</strong> đơn xin đi trễ mới cần duyệt
                  </p>
                </li>
                <li onClick={() => {
                    dispatch(setTabApp(3));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                  <div className='w-7 text-xl text-center text-yellow-400'>
                    <i className="fa-solid fa-person-walking-luggage"></i>
                  </div>
                  <p className='w-full flex-1 line-clamp-2'>
                    hiện có <strong className='text-sky-400'>{thongBao?.congTac}</strong> lịch đăng ký công tác mới cần duyệt
                  </p>
                </li>
                <li onClick={() => {
                    dispatch(setTabApp(1));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                  <div className='w-7 text-xl text-center text-blue-600'>
                    <i className="fa-solid fa-person-walking-dashed-line-arrow-right"></i>
                  </div>
                  <p className='w-full flex-1 line-clamp-2'>
                    hiện có <strong className='text-sky-400'>{thongBao?.veSom}</strong> đơn xin về sớm mới cần duyệt
                  </p>
                </li>
                <li onClick={() => {
                    dispatch(setTabApp(5));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                  <div className='w-7 text-xl text-center text-yellow-400'>
                    <i class="fa-solid fa-arrow-up-right-dots"></i>
                  </div>
                  <p className='w-full flex-1 line-clamp-2'>
                    hiện có <strong className='text-sky-400'>{thongBao?.tangCa}</strong> đơn xin tăng ca mới cần duyệt
                  </p>
                </li>
                <li onClick={() => {
                    dispatch(setTabApp(4));
                    dispatch(setReloadMany(Date.now()));
                  }} className='w-full flex gap-x-2 my-1 cursor-pointer'>
                    <div className='w-7 text-xl text-center text-green-500'>
                      <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <p className='w-full flex-1 line-clamp-2'>
                      hiện có <strong className='text-sky-400'>{thongBao?.dangKyCa}</strong> ca đăng ký mới cần duyệt
                    </p>
                  </li>
              </ul>
            </div>
          </div>
      }
      {autoReload()}
    </>
  )
}
