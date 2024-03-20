import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { chiNhanhService } from '../../../services/chiNhanhService';
import { localStorageService } from '../../../services/localStorageService';

export default function ChiNhanh() {

  let token = localStorageService.getItem("token");
  let [reload,setReload] = useState(0);
  const [chiNhanh, setChiNhanh] = useState([]);
  const [toaDo, setToaDo] = useState({
    lat: "",
    lng: ""
  });

  useEffect(() => {
    chiNhanhService.getChiNhanh(token).then((res) => {
      setChiNhanh(res.data.content);
      setToaDo({lat: res.data.content[0]?.latitude,lng: res.data.content[0]?.longitude});
    }).catch((err) => {
      console.log(err);
    })
  }, [reload]);

  const handleChangeChiNhanh = (index) => {
    setToaDo({
      lat: chiNhanh[index]?.latitude,
      lng: chiNhanh[index]?.longitude
    });
  }

  const renderChiNhanh = () => {
    return chiNhanh?.map((item, index) => {
      return (
        <div
          key={index}
          className='w-full flex justify-start items-center gap-2 cursor-pointer hover:bg-slate-100 py-1 px-2 rounded-lg'
          onClick={() => {
            handleChangeChiNhanh(index);
          }}
        >
          <FaLocationDot
            className='text-gray-400 text-lg'
          />
          <div className='flex-1'>
            <p className='text-gray-400 line-clamp-1 text-sm'>
              {item?.chi_nhanh_name}
            </p>
            <p className='font-semibold line-clamp-1'>
              {item?.chi_nhanh_address}
            </p>
          </div>
        </div>
      )
    })
  }

  return (
    <div
      id='chiNhanh'
      className='w-full bg-white rounded-lg shadow-md lg:h-[calc(100vh-5.125rem)]'
    >
      <div className='h-1/2 rounded-t-lg'>
        <iframe
          title='map'
          src={`https://maps.google.com/maps?q=${toaDo.lat},${toaDo.lng}&output=embed&z=14`}
          style={{ border: 0, width: "100%", height: "100%" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade" className='rounded-lg shadow'
        ></iframe>
      </div>

      <div className='w-full h-1/2 flex flex-col justify-between gap-4 p-4'>
        <h1
          className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg'
        >
          <FaLocationDot />
          <strong>
            Địa điểm làm việc
          </strong>
        </h1>
        <div className='w-full h-[calc((100vh-5.125rem)/2-5.5rem)] ps-4 pe-2 overflow-y-scroll flex flex-col justify-start items-start customScrollbar'>
          {renderChiNhanh()}
        </div>
        <button
          type="button"
          className='w-1/3 h-10 mx-auto rounded-full bg-slate-100 font-bold hover:bg-orange-400 hover:text-white'
        >
          Cập nhật
        </button>
      </div>

    </div>
  )
}
