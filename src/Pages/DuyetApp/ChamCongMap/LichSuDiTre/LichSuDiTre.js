import { Input, Pagination, Popconfirm } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { localStorageService } from '../../../../services/localStorageService';
import { useDispatch, useSelector } from 'react-redux';
import { dvccService } from '../../../../services/dvccService';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { setReloadMany } from '../../../../Redux-toolkit/reducer/ChamCongSlice';

export default function LichSuDiTre() {
    moment.locale("vi");
    let focusRef = useRef("");
    let dispatch = useDispatch();
    let token = localStorageService.getItem("token");
    let reloadMany = useSelector(state => state.ChamCongSlice.reloadMany);
    let duyetAppSlice = useSelector((state) => state.DuyetAppSlice);
    let [lyDoTuChoi,setLyDoTuChoi] = useState("");
    let [somTreList,setSomTreList] = useState([]);
    let [somTreListClone,setSomTreListClone] = useState([]);
    let [current,setCurrent] = useState(0);
    let [totalPage,setTotalPage] = useState(0);
    let [reload,setReload] = useState(0);

    useEffect(() => {
        dvccService.getDiTreUser(token,{
            nv_id: duyetAppSlice.nv_id,
            ngay_bat_dau: duyetAppSlice.nam + "-" + duyetAppSlice.thang + "-" + duyetAppSlice.ngay,
            ngay_ket_thuc: duyetAppSlice.namKT + "-" + duyetAppSlice.thangKT + "-" + duyetAppSlice.ngayKT
          }).then((res) => {
          setSomTreList(res.data.content);
          setTotalPage(res.data?.content?.length)
          setSomTreListClone(res.data.content);
        })
        .catch((err) => {
         console.log(err);
        });
    },[reload,reloadMany])
    let changePage = (page) => {
        setCurrent(page - 1);
        focusRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    let handleSort = (value,type) => {
        let array = [...somTreListClone];
        if(value === "nhanvien"){
          if(type === "az"){
            array = array.sort((a,b) => a?.ns_nhanvien_dvcc_xin_di_tre_nv_idTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_xin_di_tre_nv_idTons_nhanvien?.nv_name ? 1 : -1)
          }else{
            array = array.sort((a,b) => a?.ns_nhanvien_dvcc_xin_di_tre_nv_idTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_xin_di_tre_nv_idTons_nhanvien?.nv_name ? -1 : 1)
          }
        } else if(value === "thoigian"){
          if(type === "az"){
            array = array.sort((a,b) => a?.ngay_bat_dau > b?.ngay_bat_dau ? 1 : -1)
          }else{
            array = array.sort((a,b) => a?.ngay_bat_dau > b?.ngay_bat_dau ? -1 : 1)
          }
        } else if(value === "nguoiduyet"){
          if(type === "az"){
            array = array.sort((a,b) => a?.ns_nhanvien_dvcc_xin_di_tre_nguoi_duyetTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_xin_di_tre_nguoi_duyetTons_nhanvien?.nv_name ? 1 : -1)
          }else{
            array = array.sort((a,b) => a?.ns_nhanvien_dvcc_xin_di_tre_nguoi_duyetTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_xin_di_tre_nguoi_duyetTons_nhanvien?.nv_name ? -1 : 1)
          }
        }
        setSomTreList(array);
    }
    let handleDuyet = (id) => {
        let data = {id};
        dvccService.duyetDiTre(token,data).then((res) => {
            dispatch(setReloadMany(Date.now()));
            setReload(Date.now());
            toast.success("Duyệt đi trễ thành công!", {
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
    let handleTuChoi = (id) => {
        let data = {id, ly_do_tu_choi: lyDoTuChoi};
          dvccService.tuChoiDiTre(token,data).then((res) => {
            setReload(Date.now());
            dispatch(setReloadMany(Date.now()));
            toast.success("Từ chối đi trễ thành công!", {
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
    let handleNhacNho = (nv_id,type) => {
        let data = {};
        if(type == "nhacnho"){
          data = {
            nv_id,
            tieuDe: "Đi Trễ/ Về Sớm",
            noiDung: "Quản trị viên nhắc nhở bạn thực hiện duyệt xin phép đi trễ / về sớm!"
          }
        }else{
          data = {
            nv_id,
            tieuDe: "Đi Trễ/ Về Sớm",
            noiDung: "Quản trị viên nhắc nhở bạn đã xin phép nhiều lần!"
          }
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
    let renderStatus = (status,id,nguoiduyet,nhanvien) => {
        switch (status){
          case 1: return <div className='flex flex-wrap justify-center items-center gap-2 lg:gap-4'>
                <Popconfirm title="Xác Nhận Từ Chối?" okType='danger'
                  description={<div className='flex items-center'>
                                <p className='w-36'>Lý Do Từ Chối: </p>
                                <Input value={lyDoTuChoi} onChange={(e) => setLyDoTuChoi(e.target.value)} />
                              </div>}
                  onOpenChange={() => setLyDoTuChoi("")}
                  okText="Từ Chối" cancelText=" Huỷ"
                  onConfirm={() => handleTuChoi(id)}>
                  <button
                    type="button"
                    className='min-w-[90px] px-4 py-1.5 rounded-full bg-red-600 text-white'
                  >
                    Từ chối
                  </button>
                </Popconfirm>
                
                <Popconfirm title="Xác Nhận Duyệt?" okText="Duyệt" cancelText=" Huỷ" onConfirm={() => handleDuyet(id)}>
                  <button
                    type="button"
                    className='min-w-[90px] px-4 py-1.5 rounded-full bg-sky-400 text-white'
                  >
                    Duyệt
                  </button>
                </Popconfirm>
                <Popconfirm title="Gửi Nhắc Nhở Đến Người Xin Phép" okText="Gửi" cancelText=" Huỷ" onConfirm={() => handleNhacNho(nhanvien,"canhcao")}>
                  <button
                    type="button"
                    className='min-w-[90px] px-4 py-1.5 rounded-full bg-yellow-400 text-white'
                  >
                    Cảnh cáo
                  </button>
                </Popconfirm>
                <Popconfirm title="Gửi Nhắc Nhở Đến Người Duyệt?" okText="Gửi" cancelText=" Huỷ" onConfirm={() => handleNhacNho(nguoiduyet,"nhacnho")}>
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
    let renderSomTre = () => {
        return somTreList?.slice(current*4,current*4 + 4)?.map((somTre,index) => {
          return <tr key={index} className='addRow'>
              <td>{current*4 + index + 1}</td>
              <td className='relative'>
                <div className='flex gap-2 items-center py-2'>
                  <img
                    className='w-10 h-10 rounded-full'
                    src={somTre?.ns_nhanvien_dvcc_xin_di_tre_nv_idTons_nhanvien?.nv_avatar}
                    alt=""
                  />
                  <p className='w-max flex-1 text-left'>
                    <strong>{somTre?.ns_nhanvien_dvcc_xin_di_tre_nv_idTons_nhanvien?.nv_name} </strong>
                  </p>
                  <p className='text-right'>
                    <p className='text-orange-400 font-semibold'>{moment(somTre?.thoigian).format("HH:mm")}</p>
                    <p>{moment(somTre?.thoigian).format("ddd")}, {moment(somTre?.thoigian).format("DD/MM/YYYY")}</p>
                  </p>
                </div>
              </td>
              <td className='relative'>
                <p>
                  {somTre?.gio_di_tre}
                </p>
                <span
                  className='text-xs absolute bottom-1 right-1'
                >
                  {moment(somTre?.ngay).format("ddd")}, {moment(somTre?.ngay).format("DD/MM/YYYY")}
                </span>
              </td>
              <td>
                <p className=''>
                  {somTre?.ly_do}
                </p>
              </td>
              <td className='relative min-w-[230px]'>
                <p>{somTre?.ns_nhanvien_dvcc_xin_di_tre_nguoi_duyetTons_nhanvien?.nv_name}</p>
              </td>
              <td>
                {renderStatus(somTre?.status,somTre?.id,somTre?.nguoi_duyet,somTre?.nv_id)}
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
            <svg onClick={() => handleSort("nhanvien","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
            <p className='flex-1 mx-2'>Xin phép của nhân viên</p>
            <svg onClick={() => handleSort("nhanvien","za")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
          </div>
        </th>
        <th>
          <div className='flex items-center'>
            <svg onClick={() => handleSort("thoigian","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
            <p className='flex-1 mx-2'>
              Ngày làm việc
            </p>
            <svg onClick={() => handleSort("thoigian","za")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
          </div>
        </th>
        <th>
          Lý do
        </th>
        <th>
          <div className='flex items-center'>
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
            <p className='flex-1 mx-2'>
              Người duyệt App
            </p>
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
          </div>
        </th>
        <th>
          Quản lý Thao Tác
        </th>
      </thead>
      <tbody>
        {renderSomTre()}
      </tbody>
    </table >
    <Pagination onChange={changePage} style={{width: "100%", marginTop: "1rem"}} pageSize={4} defaultCurrent={1} total={totalPage} />
    </>
  )
}
