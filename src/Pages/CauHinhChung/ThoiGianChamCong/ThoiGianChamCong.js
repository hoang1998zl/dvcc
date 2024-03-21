import React, { useEffect, useState } from 'react';
import { FaArrowUpRightDots, FaRegClock } from "react-icons/fa6";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { Switch } from 'antd';
import { cauHinhChungService } from '../../../services/cauHinhChungService';
import { localStorageService } from '../../../services/localStorageService';
import moment from 'moment/moment';

export default function ThoiGianChamCong() {

  let [reload,setReload] = useState(0);
  const [gioLamViec, setGioLamViec] = useState([]);
  let token = localStorageService.getItem("token");

  useEffect(() => {
      cauHinhChungService.layGioCong(token).then((res) => {
        setGioLamViec(res.data.content);
      })
      .catch((err) => {
          console.log(err);
      });
  }, [reload]);

  const renderCaLamViec = () => {
    return gioLamViec?.theoCa?.map((ca, index) => {
      return (
        <div
          key={index}
          className='w-full flex justify-center items-center gap-2 text-gray-800'
        >
          <FaRegClock
            className='text-gray-300 text-2xl'
          />
          <div className='flex-1'>
            <p
              className='text-gray-700 line-clamp-1 text-sm'
            >
              {ca?.name}
            </p>
            <p
              className='font-bold line-clamp-1 -mt-1'
            >
              {moment(ca?.gio_bat_dau,"HH:mm:ss").format("HH:mm")} - {moment(ca?.gio_ket_thuc,"HH:mm:ss").format("HH:mm")}
            </p>
          </div>
          <Switch
            name="theoCa"
            checked={ca?.ca_status}
            style={{
              backgroundColor: ca?.ca_status ? "orange" : "gray"
            }}
          />
        </div>
      );
    })
  };

  return (
    <div className='w-full bg-white rounded-lg shadow-md p-4 flex flex-col gap-2'>
      <h1
        className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg'
      >
        <FaRegClock />
        <strong>
          Thời gian chấm công
        </strong>
      </h1>

      <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2'>

        <div className='self-center w-full flex flex-col items-center gap-4 px-4'>
          <div className='w-full flex justify-center items-center gap-2 text-gray-800'>
            <BsFillBriefcaseFill
              className='text-gray-300 text-2xl'
            />
            <div>
              <p
                className='text-gray-700 line-clamp-1 text-sm'
              >
                Hành chính
              </p>
              <p
                className='font-bold line-clamp-1 -mt-1'
              >
                {
                  gioLamViec.hanhChinh?.gio_bat_dau
                    ? moment(gioLamViec.hanhChinh?.gio_bat_dau,"HH:mm:ss").format("HH:mm")
                    : '00:00'
                }
                <span className='mx-2'>-</span>
                {
                  gioLamViec.hanhChinh?.gio_ket_thuc
                    ? moment(gioLamViec.hanhChinh.gio_ket_thuc,"HH:mm:ss").format("HH:mm")
                    : '00:00'
                }
              </p>
            </div>
          </div>
          <div className='w-full flex justify-center items-center gap-2 text-gray-800'>
            <FaArrowUpRightDots
              className='text-gray-300 text-2xl'
            />
            <div>
              <p
                className='text-gray-700 line-clamp-1 text-sm'
              >
                Tăng Ca
              </p>
              <p
                className='font-bold line-clamp-1 -mt-1'
              >
                {
                  gioLamViec.hanhChinh?.tang_ca_vao
                    ? moment(gioLamViec.hanhChinh?.tang_ca_vao,"HH:mm:ss").format("HH:mm") 
                    : '00:00:00'
                }
                <span className='mx-2'>-</span>
                {
                  gioLamViec.hanhChinh?.tang_ca_ra
                    ? moment(gioLamViec.hanhChinh?.tang_ca_ra,"HH:mm:ss").format("HH:mm")
                    : '00:00:00'
                }
              </p>
            </div>
          </div>
        </div>

        <div className='self-center w-full flex flex-col items-center gap-4 px-4 lg:border-l border-gray-800'>
          {renderCaLamViec()}
        </div>

      </div>

      <button
        type="button"
        className='w-1/3 h-10 mx-auto rounded-full bg-slate-100 font-bold'
      >
        Cập nhật
      </button>
    </div>
  )
}
