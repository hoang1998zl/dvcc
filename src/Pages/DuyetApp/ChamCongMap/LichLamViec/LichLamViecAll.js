import moment from 'moment/moment';
import React, { useEffect, useRef, useState } from 'react'
import { localStorageService } from '../../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { dvccService } from '../../../../services/dvccService';
import { useReactToPrint } from 'react-to-print';

export default function LichLamViecAll() {
    moment.locale("vi");
    let pdfRef = useRef("");
    let [LLVList,setLLVList] = useState([]);
    let token = localStorageService.getItem("token");
    let duyetAppSlice = useSelector((state) => state.DuyetAppSlice);
    useEffect(() => {
        dvccService.layLLVUser(token,{
          nv_id: 0,
          ngay_bat_dau: duyetAppSlice.nam + "-" + duyetAppSlice.thang + "-" + duyetAppSlice.ngay,
          ngay_ket_thuc: duyetAppSlice.namKT + "-" + duyetAppSlice.thangKT + "-" + duyetAppSlice.ngayKT
            }).then((res) => {
                setLLVList(res.data?.content);
            })
            .catch((err) => {
               console.log(err);
            });
    },[duyetAppSlice])
    const handlePrint = useReactToPrint({
        content: () => pdfRef.current,
    });
    let renderLL = () => {
        let clone = [...LLVList];
        clone = clone.sort((a,b) => a?.ngay > b?.ngay ? 1 : -1);
        return clone?.map((llv,index) => {
            return <tr key={index}>
                <td>{index+1}</td>
                <td>{moment(llv?.ngay).format("ddd")}, {moment(llv?.ngay).format("DD/MM/YYYY")}</td>
                <td>{llv?.ns_nhanvien?.nv_name}</td>
                <td>
                    <p>
                        <b className='text-orange-400 mr-2'>{llv?.dvcc_ca_lam_viec?.name}</b>
                        Từ: {llv?.dvcc_ca_lam_viec?.gio_bat_dau} - {llv?.dvcc_ca_lam_viec?.gio_ket_thuc}
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
    <div  className='w-full my-2'>
        <div className='text-right mr-5'>
            <button onClick={handlePrint} type="button" className="text-orange-400 cursor-pointer text-xl relative">
                <i className="fa-solid fa-print"></i>
            </button>
        </div>
        <div ref={pdfRef} className='w-full my-2'>
            <table className='customTable'>
                <thead>
                    <td>STT</td>
                    <td>Ngày</td>
                    <td>Nhân Viên</td>
                    <td>Ca Làm Việc</td>
                    <td>Nơi Làm Việc</td>
                    <td>Ghi Chú</td>
                </thead>
                <tbody>
                    {renderLL()}
                </tbody>
            </table>
        </div>
        
    </div>
  )
}
