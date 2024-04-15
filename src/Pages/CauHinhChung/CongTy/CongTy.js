import { Input, Popover } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaRegBuilding } from "react-icons/fa";
import { localStorageService } from '../../../services/localStorageService';
import { cauHinhChungService } from '../../../services/cauHinhChungService';
import { toast } from 'react-toastify';
import { FaPen, FaUser } from 'react-icons/fa6';

export default function CongTy() {
  let token = localStorageService.getItem("token");
  let [company, setCompany] = useState({});
  let [reload, setReload] = useState(0);
  let [openContext,setOpenContext] = useState(false);
  useEffect(() => {
    cauHinhChungService.layThongTinCongTy(token).then((res) => {
      setCompany(res.data.content);
    }).catch((err) => {
      console.log(err);
    })
  }, [reload])

  let changeInput = (e) => {
    let clone = { ...company };
    clone[e.target.name] = e.target.value;
    setCompany(clone);
  }

  let updateLogo = (files) => {
    cauHinhChungService.updateLogo(token, files).then((res) => {
      setReload(Date.now());
      toast.success("Cập Nhật Thành Công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }).catch((err) => {
      console.log(err);
    })
  }
  let handleUpdateCongTy = () => {
    cauHinhChungService.updateCongTy(token, company).then((res) => {
      setReload(Date.now());
      toast.success("Cập Nhật Thành Công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }).catch((err) => {
      console.log(err);
    })
  }
  return (
    <div className='w-full bg-white rounded-lg shadow-md p-4 flex flex-col gap-2'>
      <h1
        className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg'
      >
        <FaRegBuilding />
        <strong>
          Thông Tin Công Ty
        </strong>
      </h1>
      <div className='w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-2'>
        <div 
          onMouseLeave={() => setOpenContext(false)}
          onMouseEnter={() => setOpenContext(true)}
          className='w-full h-full p-4 border border-gray-300 rounded flex justify-center items-center relative'>
          {
            openContext && <><div className=' absolute w-full h-full bg-black/50'></div>
            <div
          className='w-40 border shadow-lg rounded bg-white z-10 p-1 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        >
          <ul>
            <li>
              <button
                type="button"
                className='w-full px-2 py-1 rounded border border-transparent hover:bg-slate-100 hover:border-orange-400 text-left flex items-center gap-2'
                onClick={() => window.open(company?.company_logo)}
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
                  <label htmlFor='avatar' className='w-full block text-left rounded-md font-normal'>
                    <input
                      type="file"
                      id="avatar"
                      className='hidden'
                      accept="image/*"
                      name=""
                      onChange={(e) => updateLogo(e.target.files[0])}
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
          }
          <img
              className='border w-full aspect-square bg-orange-400'
              src={company?.company_logo ? company.company_logo : 'https://apihr.weos.vn/public/avatar/avatar.png'}
              alt=""
            />
        </div>
        <div className='w-full h-full p-2 border border-gray-300 rounded lg:col-span-2 flex flex-col justify-around'>
          <div className='w-full'>
            <h2>Tên Công Ty: </h2>
            <Input onChange={changeInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur()
                }
              }}
              onBlur={handleUpdateCongTy}
              name='company_name'
              type='text' value={company?.company_name}></Input>
          </div>
          <div className='w-full'>
            <h2>Slogan: </h2>
            <Input onChange={changeInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur()
                }
              }}
              onBlur={handleUpdateCongTy}
              name='company_sologan'
              type='text' value={company?.company_sologan}></Input>
          </div>
        </div>
      </div>
    </div>
  )
}
