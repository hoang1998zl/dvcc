import React, { useEffect, useState } from 'react'
import '../../../../issets/css/customTable.css'
import { useSelector } from 'react-redux';
import { localStorageService } from '../../../../services/localStorageService';
import { dvccService } from '../../../../services/dvccService';
import { toast } from 'react-toastify';
import moment from 'moment/moment';

export default function ViTriNhanVien() {
  const [toaDo, setToaDo] = useState({ lat: 10.7797907, lng: 106.694148 });
  let token = localStorageService.getItem("token");
  let duyetAppSlice = useSelector((state) => state.DuyetAppSlice);
  let [dinhViList,setDinhViList] = useState([]);
  useEffect(() => {
    dvccService.layDinhVi(token,{
      nv_id: duyetAppSlice.nv_id,
      ngay_bat_dau: duyetAppSlice.nam + "-" + duyetAppSlice.thang + "-" + duyetAppSlice.ngay,
      ngay_ket_thuc: duyetAppSlice.namKT + "-" + duyetAppSlice.thangKT + "-" + duyetAppSlice.ngayKT
    }).then((res) => {
            setDinhViList(res.data.content);
            let value = {
              lat: res.data.content[0]?.lat,
              lng: res.data.content[0]?.lng
            }
            setToaDo(value)
          })
          .catch((err) => {
            if(duyetAppSlice.nv_id){
              toast.error(err?.response?.data?.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
              });
            }
          });
  },[duyetAppSlice])
  const renderContent = () => {
    return dinhViList.map((item) => {
      return (
        <tr
          key={item?.cham_cong_id}
          className='addRow cursor-pointer hover:bg-orange-100'
          onClick={()=> {setToaDo({lat: item?.lat,lng: item?.lng})}}
        >
          <td>
            {moment(item?.thoi_gian).format("HH:mm:ss DD/MM/YYYY")}
          </td>
          <td>
            {item?.dvcc_chi_nhanh?.chi_nhanh_name}
          </td>
        </tr>
      )
    })
  }
  let handleSort = (type) => {
    let array = [...dinhViList];
    if(type === "az"){
      array = array.sort((a,b) => a?.thoi_gian > b?.thoi_gian ? 1 : -1);
    }else{
      array = array.sort((a,b) => a?.thoi_gian > b?.thoi_gian ? -1 : 1)
    }
    setDinhViList(array);
  }
  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4'>
      <div className='w-full h-64 rounded-lg shadow-md'>
        <div className='w-full h-full relative border border-red-400 rounded-lg'>
          <iframe
            title='map'
            src={`https://maps.google.com/maps?q=${toaDo.lat},${toaDo.lng}&output=embed&z=14`}
            style={{ border: 0, width: "100%", height: "100%", borderRadius: "0.5rem", zIndex: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" className='rounded-lg shadow'
          >
          </iframe>
          <div
            className='w-full bg-white rounded-lg px-4 py-4 absolute bottom-0 left-0 right-0 z-[1]'
          >

          </div>
        </div>
      </div>
      <div className='overflow-x-auto lg:col-span-3'>
        <table className='customTable  w-max min-w-full'>
          <thead>
            <th>
              <div className='flex items-center'>
                <svg onClick={() => handleSort("za")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                <p className='flex-1 mx-2'>
                  Thời gian
                </p>
                <svg onClick={() => handleSort("az")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
              </div>
            </th>
            <th>Địa điểm</th>
          </thead>
          <tbody>
            {renderContent()}
          </tbody>
        </table>
      </div >
    </div >
  )
}
