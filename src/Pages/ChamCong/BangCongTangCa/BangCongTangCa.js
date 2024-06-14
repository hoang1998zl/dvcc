import React, { useEffect, useRef, useState } from 'react'
import BangChamCongMenu from '../BangChamCong/BangChamCongMenu/BangChamCongMenu'
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { Input, Modal } from 'antd';
import { chamCongService } from '../../../services/chamCongService';
import { localStorageService } from '../../../services/localStorageService';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import icon_excel from '../../../issets/img/icon/excel.png'
import { isNull } from 'lodash';
import { toast } from 'react-toastify';

export default function BangCongTangCa() {
    let token = localStorageService.getItem("token");
    const tableRef = useRef(null);
    let [reload,setReload] = useState(0);
    const [bangCong,setBangCong] = useState([]);
    const [ngayCong,setNgayCong] = useState([]);
    const [date,setDate] = useState("");
    let [nhanVien,setNhanVien] = useState({});
    const [drag, setDrag] = useState(false);
    const [isOpenNhatKy, setIsOpenNhatKy] = useState(false);
    const [currentRow, setCurrentRow] = useState(0);
    let sunIndex = [];
    let satIndex = [];
    let day = 0;
    let month = useSelector(state => state.ChamCongSlice.month);
    let year = useSelector(state => state.ChamCongSlice.year);
    let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);
    let [baseFormat,setBaseFormat] = useState({
        gio_cong_thuan: null,
        he_so: null,
        tong_gio_cong: null
    })

    useEffect(() => {
        chamCongService.layBangCongTangCa(token,{month,year,danhmuc_id}).then((res) => {
            setBangCong(res.data.content)
        }).catch((err) => {
            console.log(err);
        })
    },[month,year,danhmuc_id,reload])
    let changeInput = (key,value,index) => {
        value = value.replace(/[^\d.-]/g, '');
        let clone = [...ngayCong];
        if(!isNull(value) && value !== ""){
          if(key == "gio_cong_thuan"){
            if(Number(value <= 0)){
              value = "0";  
            }
            if(isNaN(value)){
              value = "0";
            }
            clone[index].tong_gio_cong = Number(value) * Number(clone[index].he_so);
            clone[index].tong_gio_cong = clone[index].tong_gio_cong.toFixed(2);
          }
          if(key == "he_so"){
            if(Number(value < 1)){
              value = "1";  
            }
            if(Number(value > 3)){
              value = "3";  
            }
            if(isNaN(value)){
              value = "1";
            }
            clone[index].tong_gio_cong = Number(value) * Number(clone[index].gio_cong_thuan);
            clone[index].tong_gio_cong = clone[index].tong_gio_cong.toFixed(2);
          }
        }  
        clone[index][key] = value;
        setNgayCong(clone);
    }
    let changeInputCreate = (key,value) => {
        value = value.replace(/[^\d.-]/g, '');
        let clone = {...baseFormat};
        if(!isNull(value) && value !== ""){
          if(key == "gio_cong_thuan"){
            if(Number(value <= 0)){
              value = "0";  
            }
            if(isNaN(value)){
              value = "0";
            }
            clone.tong_gio_cong = Number(value) * Number(clone.he_so);
            clone.tong_gio_cong = clone.tong_gio_cong.toFixed(2);
          }
          if(key == "he_so"){
            if(Number(value < 1)){
              value = "1";  
            }
            if(Number(value > 3)){
              value = "3";  
            }
            if(isNaN(value)){
              value = "1";
            }
            clone.tong_gio_cong = Number(value) * Number(clone.gio_cong_thuan);
            clone.tong_gio_cong = clone.tong_gio_cong.toFixed(2);
          }
        }  
        clone[key] = value;
        setBaseFormat(clone);
    }
    const getChiTietNgay = (index,nv_id) => {
        index++;
        if(index < 10){
            index = "0" + index;
        }else{
            index = String(index);
        }
        chamCongService.layChiTietTangCa(token,{nv_id,ngay: year + "-" + month + "-" + index}).then((res) => {
            setNgayCong(res.data.content);
        }).catch((err) => {
            console.log(err);
        })
    }
    let createtangCa = (ngay) => {
        let data = {
            ngay,
            nv_id: nhanVien.nv_id,
            gio_cong_thuan: baseFormat.gio_cong_thuan,
            he_so: baseFormat.he_so,
            tong_gio_cong: baseFormat.tong_gio_cong
        }
        chamCongService.createTangCa(token,data).then((res) => {
            setReload(Date.now());
            toast.success("Cập nhật thành công!!!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
        }).catch((err) => {
            toast.error(err.response.data.content, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
            console.log(err);
        })
        setBaseFormat({
            gio_cong_thuan: null,
            he_so: null,
            tong_gio_cong: null
        })
        let indexNgay = moment(ngay,"YYYY-MM-DD").format("DD");
        indexNgay = Number(indexNgay) - 1;
        getChiTietNgay(indexNgay,nhanVien?.nv_id)
    }
    let updateTangCa = (index,nv_id,time) => {
        chamCongService.updateTangCa(token,ngayCong[index]).then((res) => {
            setReload(Date.now());
            toast.success("Cập nhật thành công!!!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
        }).catch((err) => {
            toast.error(err.response.data.content, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
            console.log(err);
        })
        let indexNgay = moment(time,"YYYY-MM-DD").format("DD");
        indexNgay = Number(indexNgay) - 1;
        getChiTietNgay(indexNgay,nv_id)
    }
    const handleOpenNhatKy = (bollean) => {
        setIsOpenNhatKy(bollean);
    };
    const handleStartX = (e, row, col) => {
        let iniMouse = e.clientX;
        let iniSize = document.getElementById(`${row}${col}`).offsetWidth;
        // console.log(`offsetWidth=${iniSize}`)
        setDrag({
            iniMouse: iniMouse,
            iniSize: iniSize
        })
    }
    const handleMoveX = (e, row, col) => {
        if (e.clientX) {
            let iniMouse = drag.iniMouse;
            let iniSize = drag.iniSize;
            let endMouse = e.clientX;
            let endSize = iniSize + (endMouse - iniMouse);
            document.getElementById(`${row}${col}`).style.width = `${endSize}px`;
        }
    }
    const handleStartY = (e, row, col) => {
        let iniMouse = e.clientY;
        let iniSize;
        if(row==-99&&col==-99){
            iniSize = e.target.previousElementSibling.offsetHeight;
        } else {
            iniSize = document.getElementById(`${row}${col}`).offsetHeight;
        }
        setDrag({
            iniMouse: iniMouse,
            iniSize: iniSize
        })
    }
    const handleMoveY = (e, row, col) => {
        if (e.clientY) {
            let iniMouse = drag.iniMouse;
            let iniSize = drag.iniSize;
            let endMouse = e.clientY;
            let endSize = iniSize + (endMouse - iniMouse);
            if(row==-99&&col==-99){
                e.target.previousElementSibling.style.height = `${endSize}px`;
            } else {
                document.getElementById(`${row}${col}`).style.height = `${endSize}px`;
            }
        }
    }
    const renderDay_ = () => {
        day = moment(year + "-" + month).daysInMonth();
        let array = [];
        for (let i = 1; i <= day; i++) {
            if (i < 10) {
                i = "0" + i;
                array.push(i);
            } else {
                array.push(String(i));
            }
        }
        return array.map((item, indexColumn) => {
            let date = moment(year + "-" + month + "-" + item).format('ddd');
            if (date == "Sun" || date == "CN") {
                sunIndex.push(indexColumn);
                return (
                    <td id={`-1${indexColumn}`} className='text-black bg-red-50 sticky top-0 z-30' style={{ borderRightColor: 'black' }}>
                        <p className='underline'>{item}</p>
                        <p>CN</p>
                        {renderSide(-1, indexColumn)}
                    </td>
                )
            } else if (date == "Sat" || date == "T7") {
                satIndex.push(indexColumn);
                return (
                    <td id={`-1${indexColumn}`} className='text-sky-400 bg-yellow-50 sticky top-0 z-30'>
                        <p className='underline'>{item}</p>
                        <p>T7</p>
                        {renderSide(-1, indexColumn)}
                    </td>
                )
            } if (date == "Mon" || date == "T2") {
                return (
                    <td id={`-1${indexColumn}`} className='sticky top-0 z-30'>
                        <p className='underline'>{item}</p>
                        <p>T2</p>
                        {renderSide(-1, indexColumn)}
                    </td>
                )
            } if (date == "Tue" || date == "T3") {
                return (
                    <td id={`-1${indexColumn}`} className='sticky top-0 z-30'>
                        <p className='underline'>{item}</p>
                        <p>T3</p>
                        {renderSide(-1, indexColumn)}
                    </td>
                )
            } if (date == "Wed" || date == "T4") {
                return (
                    <td id={`-1${indexColumn}`} className='sticky top-0 z-30'>
                        <p className='underline'>{item}</p>
                        <p>T4</p>
                        {renderSide(-1, indexColumn)}
                    </td>
                )
            } if (date == "Thu" || date == "T5") {
                return (
                    <td id={`-1${indexColumn}`} className='sticky top-0 z-30'>
                        <p className='underline'>{item}</p>
                        <p>T5</p>
                        {renderSide(-1, indexColumn)}
                    </td>
                )
            } else if (date == "Fri" || date == "T6") {
                return (
                    <td id={`-1${indexColumn}`} className='sticky top-0 z-30'>
                        <p className='underline'>{item}</p>
                        <p>T6</p>
                        {renderSide(-1, indexColumn)}
                    </td>
                )
            }

        })
    }
    const renderSide = (indexRow, indexColumn) => {
        return (
            <>
                <div className='sideRight'
                    draggable={true}
                    onDragStart={(e) => handleStartX(e, indexRow, indexColumn)}
                    onDrag={(e) => handleMoveX(e, indexRow, indexColumn)}
                ></div>
                <div className='sideBottom'
                    draggable={true}
                    onDragStart={(e) => handleStartY(e, indexRow, indexColumn)}
                    onDrag={(e) => handleMoveY(e, indexRow, indexColumn)}
                ></div>
            </>
        )
    }
    const renderTongGioCong = (ngayCong) => {
        let tongGioCong = 0;
        ngayCong?.map((item,index) => {
            if(item !== ""){
                tongGioCong+= Number(item);
            }
        })
        return <>
            <td>{tongGioCong}</td>
        </>
    }
    const renderBaoBao = () => {
        return bangCong?.map((item,index) => {
            return <tr key={index} className={`${currentRow == index ? 'bg-sky-200' : 'bg-white'}`}>
                <td>{item?.nhanVien?.nv_name}</td>
                {renderTongGioCong(item?.ngayCong)}
            </tr>
        })
    }
    const renderChiTietNgayCong = () => {
        if(ngayCong.length > 0){
            return ngayCong?.map((item,index) => {
                return <div key={index} className='w-full mb-2 p-2' style={{ gridTemplateColumns: 'auto 1fr', border: "1px solid #dddd" }}>
                    <p>
                        Từ <b>{item?.thoi_gian_bat_dau}</b> {moment(item?.ngay_bat_dau).format("ddd")}, <b>{moment(item?.ngay_bat_dau).format("DD/MM/YYYY")}</b> 
                    </p>
                    <p>
                        Đến <b>{item?.thoi_gian_ket_thuc}</b> {moment(item?.ngay_ket_thuc).format("ddd")}, <b>{moment(item?.ngay_ket_thuc).format("DD/MM/YYYY")}</b>
                    </p>
                    <div className='grid grid-cols-2 items-center'>
                        <div>
                            <p>Giờ Công Thuần: </p>
                        </div>
                        <div className='py-1'><Input onChange={(e) => changeInput(e.target.name,e.target.value,index)} name='gio_cong_thuan'  value={item?.gio_cong_thuan} /></div>
                        <div>
                            <p>Hệ Số: </p>
                        </div>
                        <div className='py-1'><Input onChange={(e) => changeInput(e.target.name,e.target.value,index)} name='he_so' value={item?.he_so} /></div>
                        <div>
                            <p>Tổng Giờ Công: </p>
                        </div>
                        <div className='py-1'><Input onChange={(e) => changeInput(e.target.name,e.target.value,index)} name='tong_gio_cong' value={item?.tong_gio_cong} /></div>
                        </div>
                        <div>
                            <button onClick={() => updateTangCa(index,item?.nv_id,item?.ngay_bat_dau)} className='bg-orange-500 text-white px-2 py-1 rounded-md mt-2'>Lưu</button>
                        </div>
                    </div>
            })
        }else{
            if(date == ""){
                return;
            }
            return <div className='w-full mb-2 p-2' style={{ gridTemplateColumns: 'auto 1fr', border: "1px solid #dddd" }}>
                <h1 className='uppercase font-bold text-lg'>{nhanVien?.nv_name}</h1>
                <p>{date + "/" + month +  "/" + year}</p>
                <div className='grid grid-cols-2 items-center'>
                        <div>
                            <p>Giờ Công Thuần: </p>
                        </div>
                        <div className='py-1'><Input onChange={(e) => changeInputCreate(e.target.name,e.target.value)} name='gio_cong_thuan' value={baseFormat?.gio_cong_thuan} /></div>
                        <div>
                            <p>Hệ Số: </p>
                        </div>
                        <div className='py-1'><Input onChange={(e) => changeInputCreate(e.target.name,e.target.value)} name='he_so' value={baseFormat?.he_so}/></div>
                        <div>
                            <p>Tổng Giờ Công: </p>
                        </div>
                        <div className='py-1'><Input onChange={(e) => changeInputCreate(e.target.name,e.target.value)} name='tong_gio_cong' value={baseFormat?.tong_gio_cong} /></div>
                        </div>
                        <div>
                            <button onClick={() => createtangCa(year + "-" + month + "-" + date)} className='bg-orange-500 text-white px-2 py-1 rounded-md mt-2'>Lưu</button>
                        </div>
            </div>
        }
        
    }
    const renderBangCong = () => {
        return bangCong?.map((item,index) => {
            return <tr key={index} className={`${currentRow == index ? 'bg-sky-200' : 'bg-white'} hover:cursor-pointer`} onClick={() => { setCurrentRow(index);document.getElementById('bcccTable').children[index].scrollIntoView({ behavior: "smooth", block: "center" }); }}>
                <td className={`${currentRow == index && 'bg-sky-300'}`}>{item?.nhanVien?.nv_name}</td>
                {
                    item?.ngayCong?.map((ngayCong,ind) => {
                        return  <td
                                    onClick={() => {
                                        getChiTietNgay(ind,item?.nhanVien?.nv_id);
                                        setDate(ind < 9 ? "0" + (ind + 1) : String(ind + 1));
                                        setNhanVien(item?.nhanVien);
                                    }}
                                    className='text-center cursor-pointer' key={ind}>{ngayCong}
                                </td>
                    })
                }
            </tr>
        })
    }
    const renderEmty = (number) => {
        let array = [];
        for(let i = 0; i < (7 - number); i++){
            let item = [];
            for(let j = 0; j <= day; j++){
                item.push(j);
            }
            array.push(item);
        }
        return array.map((item,index) => {
            return <tr key={index}>
                {item?.map((ngayCong,ind) => {
                    return <td className='text-transparent' key={ind}>{ngayCong}</td>
                })}    
            </tr>
        })
    }
    const renderBangCongExcel = () => {
        return bangCong?.map((item,index) => {
            return <tr key={index}>
                <td>{item?.nhanVien?.nv_name}</td>
                {
                    item?.ngayCong?.map((ngayCong,ind) => {
                        return <td className='text-center' key={ind}>{ngayCong}</td>
                    })
                }
                {
                    renderTongGioCong(item?.ngayCong)
                }
            </tr>
        })
    }
  return (
    <div className='w-full'>
        <div className='w-full p-2 lg:p-4 bg-white rounded-lg'>
            <BangChamCongMenu
                    handleOpenNhatKy={handleOpenNhatKy}
                />
            <div id='BangCongTangCa' className='w-full mt-2 h-[calc(calc(100vh-3rem-1rem-1rem)/2-2rem-3rem)] overflow-auto customScrollbar'>
                <table className='ChamCongTable'>
                    <thead>
                        <tr className='text-orange-400'>
                            <td id={`-1-1`} className='sticky left-0 top-0 z-40'>
                                <p>
                                    Nhân viên
                                </p>
                                {renderSide(-1, -1)}
                            </td>
                            {renderDay_()}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bangCong.length >= 7 ?
                            renderBangCong() : 
                            <>
                                {renderBangCong()}
                                {renderEmty(bangCong.length)}
                            </>
                        }
                        
                    </tbody>
                </table>
            </div>
            <div className='mt-2 hover:cursor-row-resize border-t border-b border-orange-200' style={{width:'100%',height:'4px'}}
                draggable={true}
                onDragStart={(e) => handleStartY(e, -99, -99)}
                onDrag={(e) => handleMoveY(e, -99, -99)}
            ></div>
        </div>
        <div
            className={`w-full lg:grid gap-4 mt-4`}
            style={{
                gridTemplateColumns: 'auto 1fr',
            }}>
            <div className='w-auto relative z-10 text-sm'>
                <div className='w-full h-full bg-white rounded-lg shadow-md p-2 lg:p-4 pr-0'>
                        <div className='w-full h-[calc(calc(100vh-3rem-1rem-1rem)/2-2rem-1rem)] pe-4 overflow-y-auto customScrollbar text-center'>
                            <h1 className='uppercase font-bold text-lg'>
                                {ngayCong[0]?.ns_nhanvien_dvcc_lich_tang_ca_nv_idTons_nhanvien?.nv_name}</h1>
                                <p>{ngayCong[0]?.ngay ? moment(ngayCong[0].ngay).format("DD/MM/YYYY"): ''}</p>
                            <div className='w-full gap-2 mt-4'>
                                <div>
                                    {renderChiTietNgayCong()}
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div id='BaoCaoChamCong' className='w-full h-full p-2 lg:p-4 bg-white rounded-lg'>
                    <div className='w-full h-10 mb-2 px-2 lg:px-4 flex items-center gap-2 lg:gap-4 bg-orange-400 rounded'>
                        <h1 className='flex-1 text-left text-lg text-white font-semibold uppercase'>
                            Báo cáo chấm công
                        </h1>

                        <DownloadTableExcel
                            filename={`BangCongTangCa-${month}-${year}`} sheet="sheet1"
                            currentTableRef={tableRef.current}>
                            <button
                                type="button"
                                className="w-7 h-7 p-1 rounded bg-white border mb-0.5 hover:mb-0 focus:outline-none"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.4) 0px 3px 8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.boxShadow = 'none';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.boxShadow = 'rgba(0, 0, 0, 0.4) 0px 3px 8px';
                                }}
                            >
                                <img
                                    className='w-full h-full object-contain'
                                    src={icon_excel}
                                    alt=""
                                />
                            </button>
                        </DownloadTableExcel>
                    </div>
                    <div className='w-full h-[calc(calc(100vh-3rem-1rem-1rem)/2-2rem-4rem)] overflow-auto customScrollbar'>
                        <table className='customTable w-max min-w-full lg:w-full text-center'>
                            <thead className='text-[12px]'>
                                <th>
                                    <div className="flex items-center">
                                        <p className="flex-1">Nhân viên</p>
                                    </div>
                                </th>
                                <th>
                                    Tổng giờ công
                                </th>
                            </thead>
                            <tbody id='bcccTable'>
                                {renderBaoBao()}
                            </tbody>
                        </table>
                    </div>
                </div>    
        </div>
        {/* bảng để xuất excel */}
        <div className='hidden'>
            <table ref={tableRef} className='w-full'>
                    <thead>
                        <tr className='text-orange-400'>
                            <td id={`-1-1`} className='sticky left-0 top-0 z-40'>
                                <p>
                                    Nhân viên
                                </p>
                                {renderSide(-1, -1)}
                            </td>
                            {renderDay_()}
                            <td>
                                Tổng giờ công
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {renderBangCongExcel()}
                    </tbody>
            </table>
        </div>
    </div>
  )
}
