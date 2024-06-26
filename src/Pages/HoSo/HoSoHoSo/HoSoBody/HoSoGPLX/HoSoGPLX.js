import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { FaUser } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";

export default function HoSoGPLX() {

  const { currentNhanVien } = useSelector(state => state.UserSlice);

  const [currentContextMenu, setCurrentContextMenu] = useState({
    open: false,
    type: "",
  });


  const renderContextMenu = () => {
    return (
      <>
        <div className='w-full h-full absolute top-0 left-0 z-[1] bg-black/50 rounded'></div>
        <div
          className='w-40 border shadow-lg rounded bg-white z-10 p-1 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          onMouseLeave={() => setCurrentContextMenu({ open: false, type: "" })}
        >
          <ul>
            <li>
              <button
                type="button"
                className='w-full px-2 py-1 rounded border border-transparent hover:bg-slate-100 hover:border-orange-400 text-left flex items-center gap-2'
                onClick={() => {
                  currentContextMenu.type === "mattruoc" && (window.open(currentNhanVien?.nv_cmnd_truoc) && setCurrentContextMenu({ open: false, type: "" }));
                  currentContextMenu.type === "matsau" && (window.open(currentNhanVien?.nv_cmnd_sau) && setCurrentContextMenu({ open: false, type: "" }));
                }}
              >
                <div
                  className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
                >
                  <FaUser />
                </div>
                <span>
                  Xem
                </span>
              </button>
            </li>
            <li className='border-t'>
              <label htmlFor='nv_cmnd_sau' className='w-full block text-left rounded-md font-normal'>
                <button
                  type="button"
                  className='w-full px-2 py-1 rounded border border-transparent hover:bg-slate-100 hover:border-orange-400 text-left flex items-center gap-2'
                >
                  <input
                    type="file"
                    id="nv_cmnd_sau"
                    className='hidden'
                    name=""
                  />
                  <div
                    className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
                  >
                    <FaPen />
                  </div>
                  <span>
                    Cập nhật
                  </span>
                </button>
              </label>
            </li>
          </ul>
        </div>
      </>
    )
  };

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left flex flex-col gap-4'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Giấy phép lái xe
        </h1>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-x-4'>
        <div
          className='flex flex-col items-center gap-y-2 relative'
        >
          <p className='font-bold'>
            Mặt trước
          </p>
          <div
            className='w-full rounded border border-gray-300 aspect-video p-1 relative'
            onMouseLeave={() => {
              setCurrentContextMenu({
                open: true,
                type: '',
              })
            }}
          >
            <img
              id='gplx_image_mattruoc'
              className='w-full h-full object-contain object-center rounded'
              src={currentNhanVien?.nv_cmnd_truoc}
              alt=""
              onClick={() => {
                setCurrentContextMenu({
                  open: true,
                  type: '',
                })
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setCurrentContextMenu({
                  open: true,
                  type: 'mattruoc',
                })
              }}
            />
            {(currentContextMenu.open == true && currentContextMenu.type == 'mattruoc') && renderContextMenu()}
          </div>
        </div>
        <div className='flex flex-col items-center gap-y-2 relative'>
          <p className='font-bold'>
            Mặt sau
          </p>
          <div
            className='w-full rounded border border-gray-300 aspect-video p-1 relative'
            onMouseLeave={() => {
              setCurrentContextMenu({
                open: true,
                type: '',
              })
            }}
          >
            <img
              id='gplx_image_matsau'
              className='w-full h-full object-contain object-center rounded'
              src={currentNhanVien?.nv_cmnd_sau}
              alt=""
              onClick={() => {
                setCurrentContextMenu({
                  open: true,
                  type: '',
                })
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setCurrentContextMenu({
                  open: true,
                  type: 'matsau',
                })
              }}
            />
            {(currentContextMenu.open == true && currentContextMenu.type == 'matsau') && renderContextMenu()}
          </div>
        </div>
      </div>
    </div>
  )
}
