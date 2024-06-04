import React, { useEffect, useRef, useState } from 'react'
import '../../../../issets/css/customTable.css'
import { dvccService } from '../../../../services/dvccService';
import { localStorageService } from '../../../../services/localStorageService';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Pagination, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import { toast } from 'react-toastify';
import { setReloadMany } from '../../../../Redux-toolkit/reducer/ChamCongSlice';

export default function LichSuNghiPhep() {
  moment.locale("vi");
  let dispatch = useDispatch();
  let focusRef = useRef("");
  let token = localStorageService.getItem("token");
  let reloadMany = useSelector(state => state.ChamCongSlice.reloadMany);
  let duyetAppSlice = useSelector((state) => state.DuyetAppSlice);
  let [lyDoTuChoi,setLyDoTuChoi] = useState("");
  let [phepNghiList,setPhepNghiList] = useState([]);
  let [phepNghiListClone,setPhepNghiListClone] = useState([]);
  let [reload,setReload] = useState(0);
  let [totalPage,setTotalPage] = useState(0);
  let [current,setCurrent] = useState(0);
  useEffect(() => {
      dvccService.getNghiPhepUser(token,{
        nv_id: duyetAppSlice.nv_id,
        ngay_bat_dau: duyetAppSlice.nam + "-" + duyetAppSlice.thang + "-" + duyetAppSlice.ngay,
        ngay_ket_thuc: duyetAppSlice.namKT + "-" + duyetAppSlice.thangKT + "-" + duyetAppSlice.ngayKT
      }).then((res) => {
              setPhepNghiList(res.data.content);
              setTotalPage(res.data?.content?.length)
              setPhepNghiListClone(res.data.content);
            })
            .catch((err) => {
             console.log(err);
            });
  },[reload,reloadMany,duyetAppSlice])

  let changePage = (page) => {
    setCurrent(page - 1);
    focusRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  let handleSort = (value,type) => {
      let array = [...phepNghiListClone];
      if(value === "nhanvien"){
        if(type === "az"){
          array = array.sort((a,b) => a?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_name ? 1 : -1)
        }else{
          array = array.sort((a,b) => a?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_name ? -1 : 1)
        }
      } else if(value === "thoigian"){
        if(type === "az"){
          array = array.sort((a,b) => a?.ngay_bat_dau > b?.ngay_bat_dau ? 1 : -1)
        }else{
          array = array.sort((a,b) => a?.ngay_bat_dau > b?.ngay_bat_dau ? -1 : 1)
        }
      } else if(value === "nguoiduyet"){
        if(type === "az"){
          array = array.sort((a,b) => a?.ns_nhanvien_dvcc_phep_nghi_nguoi_duyetTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_name ? 1 : -1)
        }else{
          array = array.sort((a,b) => a?.ns_nhanvien_dvcc_phep_nghi_nguoi_duyetTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_name ? -1 : 1)
        }
      }
      setPhepNghiList(array);
  }
  let handleDuyetPhep = (id) => {
      let data = {id};
      dvccService.duyetPhep(token,data).then((res) => {
              setReload(Date.now());
              dispatch(setReloadMany(Date.now()));
              toast.success("Duyệt nghỉ phép thành công!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
              });
            })
            .catch((err) => {
              setReload(Date.now());
              toast.error(err?.response?.data?.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
              });
            });
  }
  let handleNhacNho = (nv_id) => {
    let data = {
      nv_id,
      tieuDe: "Nghỉ Phép",
      noiDung: "Quản trị viên nhắc nhở bạn thực hiện duyệt phép!"
    }
    dvccService.nhacNho(data).then((res) => {
            toast.success("Gửi nhắc nhở thành công!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000
            });
          })
          .catch((err) => {
            toast.error("Gửi nhắc nhở thất bại!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000
            });
          });
  }
  let handleTuChoiPhep = (id) => {
    let data = {id, ly_do_tu_choi: lyDoTuChoi};
    dvccService.tuChoiPhep(token,data).then((res) => {
            setReload(Date.now());
            dispatch(setReloadMany(Date.now()));
            toast.success("Từ Chối nghỉ phép thành công!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000
            });
          })
          .catch((err) => {
            setReload(Date.now());
            toast.error(err?.response?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000
            });
          });
  }
  let renderStatus = (status,id,nv_id) => {
    switch (status){
      case 1: return <div className='flex flex-wrap lg:flex-col 2xl:flex-row justify-center items-center gap-2 lg:gap-4'>
            <Popconfirm title="Xác Nhận Từ Chối Nghỉ Phép?"
              description={<div className='flex items-center'>
                              <p className='w-36'>Lý Do Từ Chối: </p>
                              <Input value={lyDoTuChoi} onChange={(e) => setLyDoTuChoi(e.target.value)} />
                            </div>}
              onOpenChange={() => setLyDoTuChoi("")}
              okText="Từ Chối" cancelText=" Huỷ" onConfirm={() => handleTuChoiPhep(id)}>
              <button
                type="button"
                className='min-w-[90px] px-4 py-1.5 rounded-full bg-red-600 text-white'
              >
                Từ chối
              </button>
            </Popconfirm>
            
            <Popconfirm title="Xác Nhận Duyệt Nghỉ Phép?" okText="Duyệt" cancelText=" Huỷ" onConfirm={() => handleDuyetPhep(id)}>
              <button
                type="button"
                className='min-w-[90px] px-4 py-1.5 rounded-full bg-sky-400 text-white'
              >
                Duyệt
              </button>
            </Popconfirm>
            <Popconfirm title="Gửi Nhắc Nhở Đến Người Duyệt Nghỉ Phép?" okText="Gửi" cancelText=" Huỷ" onConfirm={() => handleNhacNho(nv_id)}>
              <button
                type="button"
                className='min-w-[90px] px-4 py-1.5 rounded-full bg-blue-400 text-white'
              >
                Gửi lại
              </button>
            </Popconfirm>
            
          </div>
      case 2: return <div className='flex flex-wrap lg:flex-col 2xl:flex-row justify-center items-center gap-2 lg:gap-4'>
            <button disabled
              type="button"
              className='min-w-[90px] px-4 py-1.5 rounded-full bg-gray-200 text-green-500 font-semibold'
            >
              Đã Duyệt
            </button>
        </div>
      case 3: return <div className='flex flex-wrap lg:flex-col 2xl:flex-row justify-center items-center gap-2 lg:gap-4'>
            <button disabled
              type="button"
              className='min-w-[90px] px-4 py-1.5 rounded-full bg-gray-200 text-red-500 font-semibold'
            >
              Đã Từ Chối
            </button>
        </div>
      case 4: return <div className='flex flex-wrap lg:flex-col 2xl:flex-row justify-center items-center gap-2 lg:gap-4'>
            <button disabled
              type="button"
              className='min-w-[90px] px-4 py-1.5 rounded-full bg-gray-200 text-red-500 font-semibold'
            >
          Đã Quá Hạn
            </button>
        </div>
    }
  }
  let renderPhepNghi = () => {
    return phepNghiList?.slice(current*4,current*4 + 4)?.map((phep,index) => {
      return <tr className='addRow'>
      <td>{current*4 + index + 1}</td>
      <td className='relative'>
        <div className='flex gap-2 items-center py-2'>
          <img
            className='w-10 h-10 rounded-full'
            src={phep?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_avatar}
            alt=""
          />
          <p className='w-max flex-1 text-left'>
            <strong>{phep?.ns_nhanvien_dvcc_phep_nghi_nv_idTons_nhanvien?.nv_name} </strong>
            <span>đã xin <b>{phep?.loai_nghi_phep == 0 ? "Nghỉ Không Phép" : "Nghỉ Có Phép"}</b></span>
          </p>
          <p className='text-right'>
            <p className='text-orange-400 font-semibold'>{moment(phep?.thoigian).format("HH:mm")}</p>
            <p>{moment(phep?.thoigian).format("ddd")}, {moment(phep?.thoigian).format("DD/MM/YYYY")}</p>
          </p>
        </div>
      </td>
      <td>
        <p>
          Từ Ca <span className='text-red-400 font-semibold'>{phep?.ca_bat_dau}</span> {moment(phep?.ngay_bat_dau).format("ddd")}, <b>{moment(phep?.ngay_bat_dau).format("DD/MM/YYYY")}</b>
        </p>
        <p>
          Đến Ca <span className='text-red-400 font-semibold'>{phep?.ca_ket_thuc}</span> {moment(phep?.ngay_ket_thuc).format("ddd")}, <b>{moment(phep?.ngay_ket_thuc).format("DD/MM/YYYY")}</b>
        </p>
        <p>
          <span className='text-red-400 font-semibold'>{phep?.tong_ngay_nghi}</span> Ngày
        </p>
      </td>
      <td>
        <p className='line-clamp-1'>
          {phep?.ly_do}
        </p>
      </td>
      <td className='relative min-w-[230px]'>
        <p>{phep?.ns_nhanvien_dvcc_phep_nghi_nguoi_duyetTons_nhanvien?.nv_name}</p>
        {/* <span className='w-max text-xs absolute bottom-1 right-1'>
          Đã nhận lúc <span className='border border-gray-300 rounded-full w-4 h-4 inline-block'>1</span>: 07:30 - 01/01/2023
        </span> */}
      </td>
      <td>
        {renderStatus(phep?.phepnghi_status,phep?.id,phep?.nguoi_duyet)}
      </td>
    </tr>
    })
  }
  return (
    <>
    <table ref={focusRef} className='customTable'>
      <thead>
        <th>
          Stt
        </th>
        <th>
          <div className='flex items-center'>
            <svg onClick={() => handleSort("nhanvien","az")}
             stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
            <p className='flex-1 mx-2'>Xin phép của nhân viên</p>
            <svg onClick={() => handleSort("nhanvien","za")}
             stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
          </div>
        </th>
        <th>
          <div className='flex items-center'>
            <svg onClick={() => handleSort("thoigian","az")}
             stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
            <p className='flex-1 mx-2'>
              Thời gian nghỉ
            </p>
            <svg onClick={() => handleSort("thoigian","za")}
             stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
          </div>
        </th>
        <th>
          Lý do
        </th>
        <th>
          <div className='flex items-center'>
            <svg onClick={() => handleSort("nguoiduyet","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
            <p className='flex-1 mx-2'>
              Người duyệt App
            </p>
            <svg onClick={() => handleSort("nguoiduyet","za")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
          </div>
        </th>
        <th>
          quản lý Thao Tác
        </th>
      </thead>
      <tbody>
        {renderPhepNghi()}
      </tbody>
    </table>
    <Pagination onChange={changePage} style={{width: "100%", marginTop: "1rem"}} pageSize={4} defaultCurrent={1} total={totalPage} />
    </>
  )
}
