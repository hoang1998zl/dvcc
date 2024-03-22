import { Input, Popover } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaRegBuilding } from "react-icons/fa";
import { localStorageService } from '../../../services/localStorageService';
import { cauHinhChungService } from '../../../services/cauHinhChungService';

export default function CongTy() {
  let token = localStorageService.getItem("token");
  let [company,setCompany] = useState({});
  let [reload,setReload] = useState(0);
  useEffect(() => {
    cauHinhChungService.layThongTinCongTy(token).then((res) => {
      setCompany(res.data.content);
      }).catch((err) => {
      console.log(err);
    })
  }, [reload])
  
  let changeInput = (e) => {
    let clone = {...company};
    clone[e.target.name] = e.target.value;
    setCompany(clone);
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
         <div className='w-max p-1 aspect-square border border-gray-300 rounded flex justify-center items-center'>
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
                className='border w-28 aspect-square bg-orange-400 z-10'
                src={company?.company_logo?company.company_logo:'https://apihr.weos.vn/public/avatar/avatar.png'}
                alt=""
              />
            </Popover>
        </div>
        <div className='w-full p-2 border border-gray-300 rounded lg:col-span-2 flex flex-col'>
                <div className='h-1/2'>
                    <h2>Tên Công Ty: </h2>
                    <Input onChange={changeInput} name='company_name' type='text' value={company?.company_name}></Input>
                </div>
                <div className='h-1/2'>
                    <h2>Slogan: </h2>
                    <Input onChange={changeInput} name='company_sologan' type='text' value={company?.company_sologan}></Input>
                </div>
        </div>
      </div>
    </div>
  )
}
