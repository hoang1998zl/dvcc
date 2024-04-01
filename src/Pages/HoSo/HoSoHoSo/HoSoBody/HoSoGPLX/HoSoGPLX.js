import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaUser } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { localStorageService } from '../../../../../services/localStorageService';
import { nhanVienService } from '../../../../../services/nhanVienService';
import { toast } from 'react-toastify';

export default function HoSoGPLX() {

  const { currentNhanVien } = useSelector(state => state.UserSlice);
  let token = localStorageService.getItem('token');
  let [nv,setNV] = useState({});
  let [reload,setReload] = useState(0);
  const [currentContextMenu, setCurrentContextMenu] = useState({
    open: false,
    type: "",
  });
  useEffect(()=>{
    if(!currentNhanVien){
      return;
    }
    nhanVienService.getNhanVienTheoId(token, currentNhanVien).then((res) => {
      setNV(res.data?.content);
    })
      .catch((err) => {
        console.log(err);
      });
  },[currentNhanVien,reload])

  let changeGPLX = (e) => {
    let type = 0;
    if(currentContextMenu.type == "mattruoc"){
      type = 0;
    }else{
      type = 1;
    }
    nhanVienService.updateGPLX(token, nv.nv_id, e.target.files[0], type).then((res) => {
      setReload(Date.now())
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    })
      .catch((err) => {
        console.log(err);
      });
  }
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
                  currentContextMenu.type === "mattruoc" && (window.open(nv?.nv_gplx_truoc) && setCurrentContextMenu({ open: false, type: "" }));
                  currentContextMenu.type === "matsau" && (window.open(nv?.nv_gplx_sau) && setCurrentContextMenu({ open: false, type: "" }));
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
              
                <button
                  type="button"
                  className='w-full px-2 py-1 rounded border border-transparent hover:bg-slate-100 hover:border-orange-400 text-left flex items-center gap-2'
                >
                  <label htmlFor='nv_cmnd_sau' className='w-full block text-left rounded-md font-normal'>
                    <input
                      type="file"
                      id="nv_cmnd_sau"
                      className='hidden'
                      name=""
                      onChange={changeGPLX}
                    />
                    <div className='flex'>
                      <div
                      className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
                      >
                        <FaPen />
                      </div>
                      <span className='ml-2'>
                        Cập nhật
                      </span>
                    </div>
                  </label>
                </button>
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
              src={nv?.nv_gplx_truoc}
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
              src={nv?.nv_gplx_sau}
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
