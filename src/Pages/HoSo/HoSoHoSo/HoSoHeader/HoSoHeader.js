import { Popover } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux';

export default function HoSoHeader() {

  const { currentNhanVien } = useSelector(state => state.UserSlice);

  return (
    <div className='w-full bg-white border rounded-lg shadow-lg 2xl:sticky top-0 z-10'>
      <div className='w-full relative py-8 px-4'>
        <div className='w-full h-20 bg bg-slate-100 bg-gradient-to-b from-slate-100 to-gray-500 rounded-lg absolute top-0 left-0 z-0'></div>
        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-end gap-4 relative z-10'>
          <div
            className='flex flex-col 2xl:flex-row items-center lg:items-start 2xl:items-end gap-4'
          >
            <Popover
              arrow={false}
              placement='right'
              content={(
                <ul className='w-40'>
                  <li>
                    <button
                      type="button"
                      className='w-full px-2 py-1 rounded border border-transparent hover:bg-orange-100 hover:border-orange-400 text-left'
                    >
                      Xem
                    </button>
                  </li>
                  <li className='border-t'>
                    <button
                      type="button"
                      className='w-full px-2 py-1 rounded border border-transparent hover:bg-orange-100 hover:border-orange-400 text-left'
                    >
                      <label
                        htmlFor='avatar'
                        className='w-full block text-left rounded-md font-normal'
                      >
                        <input
                          id='avatar'
                          accept="image/*"
                          type="file"
                          name=""
                          className='hidden'
                        />
                        Đổi Ảnh
                      </label>
                    </button>
                  </li>
                </ul>
              )}
              trigger="hover"
            >
              <img
                className='border w-28 aspect-square rounded-full bg-orange-400 z-10'
                src={currentNhanVien?.nv_avatar ? currentNhanVien.nv_avatar : 'https://apihr.weos.vn/public/avatar/avatar.png'}
                alt=""
              />
            </Popover>
            <div className='text-left'>
              <h1 className='text-lg flex flex-wrap gap-x-1'>
                <strong>
                  {currentNhanVien?.nv_name}
                </strong>
                <span>
                  (ID: <span>{currentNhanVien?.nv_order}</span>)
                </span>
              </h1>
              <p className='flex flex-wrap gap-x-1'>
                <span>
                  Chức vụ:
                </span>
                <span>
                  {currentNhanVien?.nv_chucvu}
                </span>
              </p>
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <button
              type="button"
              className='px-4 py-1 rounded-md bg-orange-400 hover:bg-orange-500 text-white flex justify-center items-center gap-2'
            >
              <i className='fa-solid fa-download'></i>
              <span>
                Tải xuống
              </span>
            </button>
            <Popover
              title="Điều Chuyển Nhân Viên"
              trigger="click"
              placement='top'
            >
              <button className='px-4 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-black flex justify-center items-center gap-2'>
                <i className="fa-solid fa-right-left"></i>
                <span>
                  Điều chuyển
                </span>
              </button>
            </Popover>
            <Popover
              title="Thôi việc Nhân Viên"
              trigger="click"
              placement='leftBottom'
              overlayStyle={{
                width: "900px"
              }}
            >
              <button className='px-4 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white flex justify-center items-center gap-2'>
                <i className="fa-solid fa-x"></i>
                <span>
                  Thôi việc
                </span>
              </button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
