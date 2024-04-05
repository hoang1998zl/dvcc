import { Input, Popover } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaRegBuilding } from "react-icons/fa";
import { localStorageService } from '../../../services/localStorageService';
import { cauHinhChungService } from '../../../services/cauHinhChungService';
import { toast } from 'react-toastify';

export default function CongTy() {
  let token = localStorageService.getItem("token");
  let [company, setCompany] = useState({});
  let [reload, setReload] = useState(0);
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
        <div className='w-full h-full p-4 border border-gray-300 rounded flex justify-center items-center'>
          <Popover
            arrow={false}
            placement='right'
            content={(
              <ul className='w-40'>
                <li>
                  <button
                    type="button"
                    onClick={() => window.open(company?.company_logo)}
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
                        onChange={(e) => updateLogo(e.target.files[0])}
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
              className='border w-full aspect-square bg-orange-400 z-10'
              src={company?.company_logo ? company.company_logo : 'https://apihr.weos.vn/public/avatar/avatar.png'}
              alt=""
            />
          </Popover>
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
