import React, { useEffect, useState } from 'react';
import { FaPersonRunning, FaPersonSwimming, FaPersonWalkingLuggage, FaPlane } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";
import { localStorageService } from '../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { baoCaoService } from '../../../services/baoCaoService';


export default function BaoCaoSoPhep() {
  let [reload,setReload] = useState(0);
  let token = localStorageService.getItem("token");
  let ngay = useSelector((state) => state.BaoCaoSlice.ngay);
  let [baoCao,setBaoCao] = useState([]);
  useEffect(() => {
    baoCaoService.layThongKe(token,ngay).then((res) => {
      setBaoCao(res.data.content);
    }).catch((err) => {
      console.log(err);
    })
  },[reload,ngay])
  const renderBaoCao = () => {
    return baoCao?.map((item, index) => {
      let format = {
        icon: "",
        color:"",
        name:"",
        background:""
      }
      switch(item?.bc_id){
        case 1: format.icon = <FaPersonRunning />;
                format.color = "text-sky-500";
                format.name = "Xin đi trễ";
                format.background = "bg-sky-100";
                break;
        case 2: format.icon = <FaPersonWalkingLuggage />;
                format.color = "text-purple-500";
                format.name = "Xin về sớm";
                format.background = "bg-purple-100";
                break;
        case 3: format.icon = <FaPersonSwimming />;
                format.color = "text-red-500";
                format.name = "Nghỉ phép";
                format.background = "bg-red-100";
                break;
        case 4: format.icon = <FaPlane />;
                format.color = "text-green-500";
                format.name = "Công tác";
                format.background = "bg-green-100";
                break;
        case 5: format.icon = <LuClock3 />;
                format.color = "text-orange-500";
                format.name = "Tăng ca";
                format.background = "bg-orange-100";
                break;
      }
      return (
        <div
          key={index}
          className='p-4 rounded-lg shadow-lg bg-white flex gap-4'
        >
          {/* {
            item.bc_id == 1 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-sky-100 text-sky-500 text-2xl`}
              >
                <FaPersonRunning />
              </div>
            )
          }
          {
            item.bc_id == 2 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-purple-100 text-purple-500 text-2xl`}
              >
                <FaPersonWalkingLuggage />
              </div>
            )
          }
          {
            item.bc_id == 3 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-red-100 text-red-500 text-2xl`}
              >
                <FaPersonSwimming />
              </div>
            )
          }
          {
            item.bc_id == 4 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-green-100 text-green-500 text-2xl`}
              >
                <FaPlane className='-rotate-45' />
              </div>
            )
          }
          {
            item.bc_id == 5 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-orange-100 text-orange-500 text-2xl relative`}
              >
                <LuClock3 />
              </div>
            )
          } */}
          <div
            className={`h-full aspect-square rounded-full flex justify-center items-center ${format.background} ${format.color} text-2xl relative`}
          >
              {format.icon}
          </div>
          <div
            className={`w-full flex-1 text-center`}
          >
            <p className='text-lg font-bold'>
              {item.bc_total}
            </p>
            <p className={`${format.color} text-sm font-semibold`}>
              {format.name}
            </p>
          </div>
        </div>
      )
    })
  };

  return (
    <div
    id='BaoCaoSoPhep'
      className='w-full lg:grid lg:grid-cols-5 gap-4'
    >
      {renderBaoCao()}
    </div>
  )
}
