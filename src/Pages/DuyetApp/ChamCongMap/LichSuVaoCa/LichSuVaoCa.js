import React, { useEffect, useState } from 'react'
import '../../../../issets/css/customTable.css'
import { Modal } from 'antd';
import { localStorageService } from '../../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { dvccService } from '../../../../services/dvccService';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import { getPreciseDistance } from 'geolib';

export default function LichSuVaoCa() {
  let token = localStorageService.getItem("token");
  let duyetAppSlice = useSelector((state) => state.DuyetAppSlice);
  let [dinhViList,setDinhViList] = useState([]);
  let [img,setimg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dvccService.layDinhVi(token,{
      nv_id: duyetAppSlice.nv_id,
      ngay_bat_dau: duyetAppSlice.nam + "-" + duyetAppSlice.thang + "-" + duyetAppSlice.ngay,
      ngay_ket_thuc: duyetAppSlice.namKT + "-" + duyetAppSlice.thangKT + "-" + duyetAppSlice.ngayKT
    }).then((res) => {
            setDinhViList(res.data.content);
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
  const showModal = () => {
    setIsModalOpen(true);
  };
  let handleSort = (type,value) => {
    let array = [...dinhViList];
    if(value == "thoigian"){
      if(type === "az"){
        array = array.sort((a,b) => a?.thoi_gian > b?.thoi_gian ? 1 : -1);
      }else{
        array = array.sort((a,b) => a?.thoi_gian > b?.thoi_gian ? -1 : 1)
      }
    }else{
      if(type === "az"){
        array = array.sort((a,b) => a?.ns_nhanvien?.nv_name > b?.ns_nhanvien?.nv_name ? 1 : -1);
      }else{
        array = array.sort((a,b) => a?.ns_nhanvien?.nv_name > b?.ns_nhanvien?.nv_name ? -1 : 1)
      }
    }
    setDinhViList(array);
  }
  let tinhKhoangCach = (noiChamCong,truSo) => {
    const distanceInMeters = getPreciseDistance(
      noiChamCong,
      truSo
    );
    return distanceInMeters
  }
  const renderContent = () => {
    return dinhViList.map((dinhVi,index) => {
      if(dinhVi?.loai == "TD"){{
        return;
      }}
      return (
        <>
          <tr className='addRow notHover'>
            <td>
              <div className='flex gap-2 items-center py-2'>
                <img
                  className='w-10 h-10 rounded-full'
                  src={dinhVi?.ns_nhanvien?.nv_avatar}
                  alt=""
                />
                <p className='w-max flex-1 text-left'>
                  <strong>{dinhVi?.ns_nhanvien?.nv_name} </strong>
                </p>
              </div>
            </td>
            <td >
              {moment(dinhVi?.thoi_gian).format("HH:mm DD/MM/YYYY")}
            </td>
            <td>
              {dinhVi?.loai == "VAO" ? "Vào" : "Ra"}
            </td>
            {/* <td>
              {moment(dinhVi?.thoi_gian).format("HH:mm")}
            </td> */}
            <td >
              {dinhVi?.dvcc_chi_nhanh?.chi_nhanh_name}
              <p>Khoảng cách: <span>{tinhKhoangCach({latitude:dinhVi?.lat ? dinhVi?.lat : 0,longitude:dinhVi?.lng ? dinhVi?.lng : 0},{latitude:dinhVi?.dvcc_chi_nhanh?.latitude ? dinhVi?.dvcc_chi_nhanh?.latitude : 0,longitude:dinhVi?.dvcc_chi_nhanh?.longitude ? dinhVi?.dvcc_chi_nhanh?.longitude : 0})}</span>m</p>
            </td>
            <td onClick={() => { showModal(); setimg(dinhVi?.hinhanh ? dinhVi?.hinhanh : "") }}>
              <img
                className='w-[70px] h-[100px] rounded-md border border-gray-300 mx-auto object-cover cursor-pointer'
                src={dinhVi?.hinhanh}
                alt=""
              />
            </td>
          </tr>
          {/* <tr className='rowSpan notHover'>
            <td>
              {item.carau}
            </td>
            <td>
              {item.thoigianra}
            </td>
          </tr> */}
        </>
      )
    })
  }
  return (
    <div style={{maxHeight:"400px"}}
      className='w-full overflow-x-auto customScrollbar'
    >
      <table className='customTable min-w-full w-max text-center' >
        <thead>
          <th>
            <div className='flex items-center'>
              <svg onClick={() => handleSort("az","nhanvien")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
              <p className='flex-1 mx-2'>
                Nhân Viên
              </p>
              <svg onClick={() => handleSort("za","nhanvien")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
            </div>
          </th>
          <th>
            <div className='flex items-center'>
              <svg onClick={() => handleSort("az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
              <p className='flex-1 mx-2'>
                Thời gian
              </p>
              <svg onClick={() => handleSort("za")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
            </div>
          </th>
          <th>
            Ca
          </th>
          {/* <th>
            T/gian
          </th> */}
          <th>
            Địa điểm
          </th>
          <th>
            Hình ảnh
          </th>
        </thead>
        <tbody>
          {renderContent()}
        </tbody>
      </table>
      <Modal
        open={isModalOpen}
        cancelText={<p>Đóng<i className='fa-solid fa-xmark ms-1 -mb-1'></i></p>}
        cancelButtonProps={{ style: { backgroundColor: 'green', color: 'white', } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setIsModalOpen(false)}
      >
        <img src={img} alt="" className='w-[20rem] h-[35rem] object-contain mx-auto' />
      </Modal>
    </div>
  )
}
