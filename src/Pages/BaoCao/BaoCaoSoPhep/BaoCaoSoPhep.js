import React, { useEffect, useState } from 'react';
import { FaPersonRunning, FaPersonSwimming, FaPersonWalkingLuggage, FaPlane, FaMugHot   } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";
import { localStorageService } from '../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { baoCaoService } from '../../../services/baoCaoService';


export default function BaoCaoSoPhep() {
  let token = localStorageService.getItem("token");
  let ngay = useSelector((state) => state.BaoCaoSlice.ngay);
  let [baoCao,setBaoCao] = useState([]);
  let [indexMenu,setIndexMenu] = useState(null);
  let [nvList,setNvList] = useState([]);
  useEffect(() => {
    baoCaoService.layThongKe(token,ngay).then((res) => {
      setBaoCao(res.data.content);
    }).catch((err) => {
      console.log(err);
    })
  },[ngay])
  let onHover = (index) => {
    setIndexMenu(index)
    let data = {
      ngay,
      id: index + 1
    }
    baoCaoService.layNhanVienXinPhep(token,data).then((res) => {
      setNvList(res.data.content);
    }).catch((err) => {
      console.log(err);
    })
  }
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
        case 6: format.icon = <FaMugHot  />;
                format.color = "text-yellow-500";
                format.name = "Nghỉ Khác";
                format.background = "bg-yellow-100";
                break;
      }
      let renderTenNV = (index) => {
        let key = "";
        switch (index + 1) {
          case 1: key = "ns_nhanvien_dvcc_xin_di_tre_nv_idTons_nhanvien"
            break;
          case 2: key = "ns_nhanvien_dvcc_xin_ve_som_nv_idTons_nhanvien"
            break;
          case 3: key = "ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien"
            break;
          case 4: key = "ns_nhanvien_dvcc_lich_cong_tac_nv_idTons_nhanvien"
            break;
          case 5: key = "ns_nhanvien_dvcc_lich_tang_ca_nv_idTons_nhanvien"
            break;
          case 6: key = "ns_nhanvien_dvcc_nghi_khac_nv_idTons_nhanvien"
            break;
          default:
            break;
        }
        return nvList.map((nv,index) => {
          return <p key={index}>- {nv[key]?.nv_name}</p>
        })
      }
      return (
          <div
          key={index}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={()=> setIndexMenu(null)}
          className='p-4 rounded-lg shadow-lg bg-white flex gap-4 relative'
          >
            <div className={`absolute bg-white w-full p-2 top-[112%] left-0 rounded-md border ${!((index == indexMenu) && (nvList.length > 0))  && "hidden "}`}>
              <div className='bg-white w-4 h-4 absolute -top-2 left-1/2 rotate-45 z-30'>

              </div>
              <div className="w-full">
                {renderTenNV(index)}
              </div>
            </div>
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
      className='w-full lg:grid lg:grid-cols-6 gap-4'
    >
      {renderBaoCao()}
    </div>
  )
}
