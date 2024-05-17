import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { localStorageService } from '../../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { dvccService } from '../../../../services/dvccService';
import { Input, Pagination, Popconfirm, Select } from 'antd';
import { toast } from 'react-toastify';
import CharacterRepalce from '../../../../GlobalFunction/CharacterReplace';
import { cauHinhChungService } from '../../../../services/cauHinhChungService';
import { chiNhanhService } from '../../../../services/chiNhanhService';

const filterOption = (input, option) =>
    CharacterRepalce((option?.label ?? '').toLowerCase()).includes(CharacterRepalce(input.toLowerCase()));
export default function DangKyCa() {
    moment.locale("vi");
    let focusRef = useRef("");
    let token = localStorageService.getItem("token");
    let reloadMany = useSelector(state => state.ChamCongSlice.reloadMany);
    let [LLVList,setLLVList] = useState([]);
    let [LLVListClone,setLLVListClone] = useState([]);
    let [NVList,setNVList] = useState([]);
    let [reload,setReload] = useState(0);
    let [totalPage,setTotalPage] = useState(0);
    let [current,setCurrent] = useState(0);
    let [caLamViec, setCaLamViec] = useState([]);
    let [chiNhanh, setChiNhanh] = useState([]);
    let [baseFormat,setBaseFormat] = useState({
        nv_id_array: [],
        ca_lam_viec_id: null,
        ghi_chu: null,
        diadiem: null,
        ngay: moment().format("YYYY-MM-DD")
    })
    useEffect(() => {
        dvccService.getLLV(token).then((res) => {
                setLLVList(res.data?.content);
                setTotalPage(res.data?.content?.length)
                setLLVListClone(res.data?.content);
              })
              .catch((err) => {
               console.log(err);
            });
        dvccService.getNhanVienPT(token).then((res) => {
                setNVList(res.data.content);
            }).catch((err) => {
                console.log(err);
            })
        cauHinhChungService.getCaLamViec(token).then((res) => {
                setCaLamViec(res.data.content);
              })
                .catch((err) => {
                console.log(err);
            });
        chiNhanhService.getChiNhanh(token).then((res) => {
                setChiNhanh(res.data.content);
                }).catch((err) => {
                console.log(err);
            });
    },[reload,reloadMany])
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
        let renderSelectNV = () => {
            let array = [];
            NVList?.map((nv) => {
            array.push({
                value: nv?.nv_id,
                label: <p>{nv?.nv_name}</p>
            })
            })
            return array;
        }
        let renderCaLamViecSelect = () => {
            let array = [];
            caLamViec?.map((item) => {
              array.push({
                value: item?.id,
                label: <p>{item?.name}: {moment(item?.gio_bat_dau,"HH:mm:ss").format("HH:mm")}-{moment(item?.gio_ket_thuc,"HH:mm:ss").format("HH:mm")}</p>
              })
            })
            return array;
        }
        let renderChiNhanhSelect = () => {
            let array = [];
            chiNhanh?.map((item) => {
              array.push({
                value: item?.chi_nhanh_id,
                label: <p>{item?.chi_nhanh_name}</p>
              })
            })
            return array;
        }
        let handleThemCaLV = () => {
            if(baseFormat.nv_id_array.length == 0){
                return toast.error("Vui lòng chọn nhân viên!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                    });
            }
            if(baseFormat.ca_lam_viec_id == null){
                return toast.error("Vui lòng chọn ca làm việc!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                    });
            }
            dvccService.themCaLamViec(token,baseFormat).then((res) => {
                setBaseFormat({
                    nv_id_array: [],
                    ca_lam_viec_id: null,
                    ghi_chu: null,
                    diadiem: null,
                    ngay: moment().format("YYYY-MM-DD")
                });
                setReload(Date.now());
                toast.success("Thêm ca thành công!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                    });
            }).catch((err) => {
                toast.error(err?.response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                    });
            })
        }
        let handleDuyetLLV = (id) => {
            let data = {id};
            dvccService.duyetLLV(token,data).then((res) => {
                    setReload(Date.now());
                    toast.success("Duyệt ca thành công!", {
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
        let handleTuChoiLLV = (id) => {
            let data = {id};
            dvccService.tuChoiLLV(token,data).then((res) => {
                    setReload(Date.now());
                    toast.success("Từ chối ca thành công!", {
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
        let changeBaseFormat = (value,field) => {
            let clone = {...baseFormat};
            clone[field] = value;
            setBaseFormat(clone);
        }
        let renderStatus = (status,id) => {
            switch (status){
              case 1: return <div className='flex flex-wrap lg:flex-col 2xl:flex-row justify-center items-center gap-2 lg:gap-4'>
                    <Popconfirm title="Xác Nhận Từ Chối Ca làm Việc?" okText="Từ Chối" cancelText=" Huỷ" onConfirm={() => handleTuChoiLLV(id)}>
                      <button
                        type="button"
                        className='min-w-[90px] px-4 py-1.5 rounded-full bg-red-600 text-white'
                      >
                        Từ chối
                      </button>
                    </Popconfirm>
                    
                    <Popconfirm title="Xác Nhận Duyệt Ca Làm Việc?" okText="Duyệt" cancelText=" Huỷ" onConfirm={() => handleDuyetLLV(id)}>
                      <button
                        type="button"
                        className='min-w-[90px] px-4 py-1.5 rounded-full bg-sky-400 text-white'
                      >
                        Duyệt
                      </button>
                    </Popconfirm>
                </div>
            }
        }
        let renderLLV = () => {
            return LLVList?.slice(current*4, current*4 + 4)?.map((llv,index) => {
              return <tr className='addRow'>
              <td>{current*4 + index + 1}</td>
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
                {/* <span className='w-max text-xs absolute bottom-1 right-1'>
                  Đã nhận lúc <span className='border border-gray-300 rounded-full w-4 h-4 inline-block'>1</span>: 07:30 - 01/01/2023
                </span> */}
              </td>
              <td>
                {renderStatus(llv?.status,llv?.id)}
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
                            <svg onClick={() => handleSort("nhanvien","az")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                            <p className='flex-1 mx-2'>Nhân viên</p>
                            <svg onClick={() => handleSort("nhanvien","za")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                        </div>
                    </th>
                    <th>
                        <div className='flex items-center'>
                            <svg onClick={() => handleSort("thoigian","az")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                            <p className='flex-1 mx-2'>
                            Ca làm việc
                            </p>
                            <svg onClick={() => handleSort("thoigian","za")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                        </div>
                    </th>
                    <th>
                        <div className='flex items-center'>
                            <svg onClick={() => handleSort("diadiem","az")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                            <p className='flex-1 mx-2'>
                            Nơi làm việc
                            </p>
                            <svg onClick={() => handleSort("diadiem","za")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                        </div>
                    </th>
                    <th>
                        Ghi chú
                    </th>
                    <th>
                        <div className='flex items-center'>
                            <svg onClick={() => handleSort("nguoiduyet","az")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                            <p className='flex-1 mx-2'>
                            Người duyệt App
                            </p>
                            <svg onClick={() => handleSort("nguoiduyet","za")} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                        </div>
                    </th>
                    <th>
                        Quản lý Thao Tác
                    </th>
                </thead>
                <tbody>
                    {renderLLV()}
                    <tr>
                        <td className='text-center'><i className='fa-solid fa-plus text-lg text-orange-400'></i></td>
                        <td>
                            <Select
                                className='w-full'
                                options={renderSelectNV()}
                                onChange={(e) => changeBaseFormat(e, "nv_id_array")}
                                optionFilterProp="children"
                                value={baseFormat?.nv_id_array}
                                mode='multiple'
                                filterOption={filterOption}
                                showSearch
                                placeholder={<p className=' text-base'>Chọn Nhân Viên</p>} />
                        </td>
                        <td>
                            <Select
                                className='w-full'
                                options={renderCaLamViecSelect()}
                                onChange={(e) => changeBaseFormat(e, "ca_lam_viec_id")}
                                optionFilterProp="children"
                                value={baseFormat?.ca_lam_viec_id}
                                filterOption={filterOption}
                                showSearch
                                placeholder={<p className=' text-base'>Chọn Ca Làm Việc</p>} />
                        </td>
                        <td>
                            <Select
                                className='w-full'
                                onChange={(e) => changeBaseFormat(e, "diadiem")}
                                value={baseFormat?.diadiem}
                                showSearch
                                placeholder="Chọn nơi làm việc"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                options={renderChiNhanhSelect()}
                            />
                        </td>
                        <td>
                            <Input onChange={(e) => changeBaseFormat(e.target.value, "ghi_chu")}
                                name='ghichu'
                                type='text' value={baseFormat?.ghi_chu}>
                            </Input>
                        </td>
                        <td></td>
                        <td>
                            <button
                                type="button"
                                onClick={handleThemCaLV}
                                className='min-w-[90px] px-4 py-1.5 rounded-full bg-orange-400 text-white font-medium'
                                >
                                Thêm Ca
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination onChange={changePage} style={{width: "100%", marginTop: "1rem"}} pageSize={4} defaultCurrent={1} total={totalPage} />
        </>
    )
}
