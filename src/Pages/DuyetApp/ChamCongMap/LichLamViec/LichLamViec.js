import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { localStorageService } from '../../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { dvccService } from '../../../../services/dvccService';
import { Input, Modal, Pagination, Popconfirm, Select } from 'antd';
import { toast } from 'react-toastify';
import CharacterRepalce from '../../../../GlobalFunction/CharacterReplace';
import { useReactToPrint } from 'react-to-print';
import LichLamViecAll from './LichLamViecAll';

const filterOption = (input, option) =>
    CharacterRepalce((option?.label ?? '').toLowerCase()).includes(CharacterRepalce(input.toLowerCase()));

export default function LichLamViec() {
    moment.locale("vi");
    let focusRef = useRef("");
    let pdfRef = useRef("");
    let token = localStorageService.getItem("token");
    let reloadMany = useSelector(state => state.ChamCongSlice.reloadMany);
    let [lyDoTuChoi,setLyDoTuChoi] = useState("");
    let [openMenu,setOpenMenu] = useState(false);
    let [LLVList,setLLVList] = useState([]);
    let [LLVListClone,setLLVListClone] = useState([]);
    let [reload,setReload] = useState(0);
    let [totalPage,setTotalPage] = useState(0);
    let [current,setCurrent] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let duyetAppSlice = useSelector((state) => state.DuyetAppSlice);
    useEffect(() => {
        dvccService.layLLVUser(token,{
          nv_id: duyetAppSlice.nv_id,
          ngay_bat_dau: duyetAppSlice.nam + "-" + duyetAppSlice.thang + "-" + duyetAppSlice.ngay,
          ngay_ket_thuc: duyetAppSlice.namKT + "-" + duyetAppSlice.thangKT + "-" + duyetAppSlice.ngayKT
        }).then((res) => {
                setLLVList(res.data?.content);
                setTotalPage(res.data?.content?.length)
                setLLVListClone(res.data?.content);
              })
              .catch((err) => {
               console.log(err);
              });
    },[reload,reloadMany,duyetAppSlice])
    const handlePrint = useReactToPrint({
        content: () => pdfRef.current,
    });
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    let handleSort = (value,type) => {
        let array = [...LLVListClone];
        if(value === "nhanvien"){
          if(type === "az"){
            array = array.sort((a,b) => a?.ns_nhanvien?.nv_name > b?.ns_nhanvien?.nv_name ? 1 : -1)
          }else{
            array = array.sort((a,b) => a?.ns_nhanvien?.nv_name > b?.ns_nhanvien?.nv_name ? -1 : 1)
          }
        } else if(value === "thoigian"){
          if(type === "az"){
            array = array.sort((a,b) => a?.dvcc_ca_lam_viec.name > b?.dvcc_ca_lam_viec.name ? 1 : -1)
          }else{
            array = array.sort((a,b) => a?.dvcc_ca_lam_viec.name > b?.dvcc_ca_lam_viec.name ? -1 : 1)
          }
        } else if(value === "nguoiduyet"){
          if(type === "az"){
            array = array.sort((a,b) => a?.ns_nhanvien_dvcc_lich_lam_viec_dang_ky_nguoi_duyetTons_nhanvien?.nv_name > b?.ns_nhanvien_dvcc_lich_lam_viec_dang_ky_nguoi_duyetTons_nhanvien?.nv_name ? 1 : -1)
          }else{
            array = array.sort((a,b) => a?.ns_nhanvien_dvcc_lich_lam_viec_dang_ky_nguoi_duyetTons_nhanvienv?.nv_name > b?.ns_nhanvien_dvcc_lich_lam_viec_dang_ky_nguoi_duyetTons_nhanvien?.nv_name ? -1 : 1)
          }
        }
        else if(value === "diadiem"){
            if(type === "az"){
              array = array.sort((a,b) => a?.dvcc_chi_nhanh_dvcc_lich_lam_viec_dang_ky_diadiemTodvcc_chi_nhanh?.chi_nhanh_name > b?.dvcc_chi_nhanh_dvcc_lich_lam_viec_dang_ky_diadiemTodvcc_chi_nhanh?.chi_nhanh_name ? 1 : -1)
            }else{
              array = array.sort((a,b) => a?.dvcc_chi_nhanh_dvcc_lich_lam_viec_dang_ky_diadiemTodvcc_chi_nhanhv?.chi_nhanh_name > b?.dvcc_chi_nhanh_dvcc_lich_lam_viec_dang_ky_diadiemTodvcc_chi_nhanh?.chi_nhanh_name ? -1 : 1)
            }
          }
        setLLVList(array);
    }
    let changePage = (page) => {
        setCurrent(page - 1);
        focusRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    let handleHuyCa = (id) => {
        dvccService.huyCaLamViec(token,{id,ly_do_tu_choi: lyDoTuChoi}).then((res) => {
            setReload(Date.now());
            toast.success("Hủy ca thành công!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
            });
        }).catch((err) => {
        console.log(err);
        })
    }
    let renderLLV = () => {
        return LLVList?.slice(current*10, current*10 + 10)?.map((llv,index) => {
            return <tr className='addRow'>
            <td>{current*10 + index + 1}</td>
            <td className='relative'>
                <div className='flex gap-2 items-center py-2'>
                    <img
                        className='w-10 h-10 rounded-full'
                        src={llv?.ns_nhanvien?.nv_avatar}
                        alt=""
                    />
                    <p className='w-max flex-1 text-left'>
                        <strong>{llv?.ns_nhanvien?.nv_name} </strong>
                    </p>
                    <p className='text-right'>
                        <p className='text-orange-400 font-semibold'>{moment(llv?.thoigian).format("HH:mm")}</p>
                        <p>{moment(llv?.thoigian).format("ddd")}, {moment(llv?.thoigian).format("DD/MM/YYYY")}</p>
                    </p>
                </div>
            </td>
            <td>
                <p>
                <b className='text-orange-400 mr-2'>{llv?.dvcc_ca_lam_viec?.name}</b>
                Từ: {llv?.dvcc_ca_lam_viec?.gio_bat_dau} - {llv?.dvcc_ca_lam_viec?.gio_ket_thuc}
                </p>
                <p>
                    {moment(llv?.ngay).format("ddd")}, {moment(llv?.ngay).format("DD/MM/YYYY")} 
                </p>
            </td>
            <td>
                <p className='line-clamp-1'>
                {llv?.dvcc_chi_nhanh_dvcc_lich_lam_viec_dang_ky_diadiemTodvcc_chi_nhanh?.chi_nhanh_name}
                </p>
            </td>
            <td>
                <p className='line-clamp-1'>
                {llv?.ghi_chu}
                </p>
            </td>
            <td className='relative min-w-[230px]'>
                <p>{llv?.ns_nhanvien_dvcc_lich_lam_viec_dang_ky_nguoi_duyetTons_nhanvien?.nv_name}</p>
            </td>
            <td>
                <Popconfirm
                description={<div className='flex items-center'>
                                <p className='w-36'>Lý Do Hủy: </p>
                                <Input value={lyDoTuChoi} onChange={(e) => setLyDoTuChoi(e.target.value)} />
                            </div>}
                onOpenChange={() => setLyDoTuChoi("")}
                title="Xác Nhận Hủy Ca làm Việc?" okType='danger' okText="Hủy Ca" cancelText="Cancel" onConfirm={() => handleHuyCa(llv?.id)}>
                    <button className='px-2 py-1 bg-red-500 text-white font-medium rounded'>Hủy Ca</button>
                </Popconfirm>
            </td>
        </tr>
        })
    }
    let renderLLVPdf = () => {
        let clone = [...LLVList];
        clone = clone.sort((a,b) => a?.ngay > b?.ngay ? 1 : -1);
        return clone?.map((llv,index) => {
            return <tr className='addRow'>
            <td>{index + 1}</td>
            <td>
              <p>
                <b className='text-orange-400 mr-2'>{llv?.dvcc_ca_lam_viec?.name}</b>
                Từ: {llv?.dvcc_ca_lam_viec?.gio_bat_dau} - {llv?.dvcc_ca_lam_viec?.gio_ket_thuc}
              </p>
              <p>
                  {moment(llv?.ngay).format("ddd")}, {moment(llv?.ngay).format("DD/MM/YYYY")} 
              </p>
            </td>
            <td>
              <p className='line-clamp-1'>
                {llv?.dvcc_chi_nhanh_dvcc_lich_lam_viec_dang_ky_diadiemTodvcc_chi_nhanh?.chi_nhanh_name}
              </p>
            </td>
            <td>
              <p className='line-clamp-1'>
                {llv?.ghi_chu}
              </p>
            </td>
          </tr>
          })
    }
    return (
        <>
            <table ref={focusRef} className='customTable '>
                <thead>
                    <th>
                        Stt
                    </th>
                    <th>
                        <div className='flex items-center'>
                            <svg onClick={() => handleSort("nhanvien","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                            <p className='flex-1 mx-2'>Nhân viên</p>
                            <svg onClick={() => handleSort("nhanvien","za")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                        </div>
                    </th>
                    <th>
                        <div className='flex items-center'>
                            <svg onClick={() => handleSort("thoigian","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                            <p className='flex-1 mx-2'>
                            Ca làm việc
                            </p>
                            <svg onClick={() => handleSort("thoigian","za")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                        </div>
                    </th>
                    <th>
                        <div className='flex items-center'>
                            <svg onClick={() => handleSort("diadiem","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                            <p className='flex-1 mx-2'>
                            Nơi làm việc
                            </p>
                            <svg onClick={() => handleSort("diadiem","za")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                        </div>
                    </th>
                    <th>
                        Ghi chú
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
                        <button onClick={() => setOpenMenu(!openMenu)} type="button" className="text-orange-400 cursor-pointer text-xl relative">
                            <i className="fa-solid fa-print"></i>
                            {openMenu && <div onMouseLeave={() => setOpenMenu(false)} className='absolute rounded bg-white p-2 shadow-md w-64 z-10 top-0 right-full text-black text-base font-normal'>
                                <p onClick={handlePrint} className='hover:bg-orange-300 py-1 rounded'>In Lịch Làm Việc</p>
                                <p onClick={showModal} className='hover:bg-orange-300 py-1 rounded'>Xem Lịch Làm Tất Cả Nhân Viên</p>
                            </div>}
                        </button>
                    </th>
                </thead>
                <tbody>
                    {
                        duyetAppSlice.nv_id == -1 ? <div>
                            <p className='text-lg font-normal'>Để xem tất cả lịch làm bấm vào nút <span className='text-orange-400 text-xl'><i className="fa-solid fa-print"></i></span> chọn Xem Lịch Làm Tất Cả Nhân Viên </p>
                        </div>
                        : renderLLV()
                    }
                    
                </tbody>
            </table>
            <Pagination onChange={changePage} style={{width: "100%", marginTop: "1rem"}} pageSize={10} defaultCurrent={1} total={totalPage} />
            {/* in pdf lịch làm việc */}
            <div className='hidden'>
                <div className='py-2' ref={pdfRef}>
                    <h2 className='text-center text-xl font-medium mb-2'>
                        Lịch Làm Việc {LLVList[0]?.ns_nhanvien?.nv_name}
                    </h2>
                <table className='customTable '>
                    <thead>
                        <th>
                            Stt
                        </th>
                        <th>
                            <div className='flex items-center'>
                                <p className='flex-1 mx-2'>
                                Ca làm việc
                                </p>
                            </div>
                        </th>
                        <th>
                            <div className='flex items-center'>
                                <p className='flex-1 mx-2'>
                                Nơi làm việc
                                </p>
                            </div>
                        </th>
                        <th>
                            Ghi chú
                        </th>
                    </thead>
                    <tbody>
                        {renderLLVPdf()}
                    </tbody>
                </table>
                </div>
            
            </div>
            <Modal open={isModalOpen} width={"90%"} footer={""} onCancel={handleCancel}>
                <LichLamViecAll></LichLamViecAll>
            </Modal>
        </>
  )
}
