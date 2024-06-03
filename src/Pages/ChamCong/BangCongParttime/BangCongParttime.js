import React, { useRef, useState } from 'react'
import BangChamCongMenu from '../BangChamCong/BangChamCongMenu/BangChamCongMenu';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { chamCongService } from '../../../services/chamCongService';
import { localStorageService } from '../../../services/localStorageService';
import { Modal } from 'antd';
import { getPreciseDistance } from 'geolib';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import icon_excel from '../../../issets/img/icon/excel.png'

export default function BangCongParttime() {
    let token = localStorageService.getItem("token");
    const tableRef = useRef(null);
    let sunIndex = [];
    let satIndex = [];
    let day = 0;
    const [isOpenNhatKy, setIsOpenNhatKy] = useState(false);
    const [drag, setDrag] = useState(false);
    const [bangCong,setBangCong] = useState([]);
    const [ngayCong,setNgayCong] = useState([]);
    const [PreviewImage, setPreviewImage] = useState({ isOpen: false, url: '' });
    const [currentRow, setCurrentRow] = useState(0);
    let month = useSelector(state => state.ChamCongSlice.month);
    let year = useSelector(state => state.ChamCongSlice.year);
    let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);

    useEffect(() => {
        chamCongService.layBangCongParttime(token,{month,year,danhmuc_id}).then((res) => {
            setBangCong(res.data.content)
        }).catch((err) => {
            console.log(err);
        })
    },[month,year,danhmuc_id])
    const handlePreviewImage = (boolean, url) => {
        setPreviewImage({ isOpen: boolean, url: url });
    };
    const handleOpenNhatKy = (bollean) => {
        setIsOpenNhatKy(bollean);
    };
    const getChiTietNgay = (index,nv_id) => {

        index++;
        if(index < 10){
            index = "0" + index;
        }else{
            index = String(index);
        }
        chamCongService.layChiTietNgayCongPt(token,{nv_id,ngay: year + "-" + month + "-" + index}).then((res) => {
            setNgayCong(res.data.content);
        }).catch((err) => {
            console.log(err);
        })
    }
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
    const renderBangCong = () => {
        return bangCong?.map((item,index) => {
            return <tr key={index} className={`${currentRow == index ? 'bg-sky-200' : 'bg-white'} hover:cursor-pointer`} onClick={() => { setCurrentRow(index);document.getElementById('bcccTable').children[index].scrollIntoView({ behavior: "smooth", block: "center" }); }}>
                <td className={`${currentRow == index && 'bg-sky-300'}`}>{item?.nhanVien?.nv_name}</td>
                {
                    item?.ngayCong?.map((ngayCong,ind) => {
                        return <td onClick={() => getChiTietNgay(ind,item?.nhanVien?.nv_id)} className='text-center cursor-pointer' key={ind}>{ngayCong}</td>
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
    let tinhKhoangCach = (noiChamCong, truSo) => {
        const distanceInMeters = getPreciseDistance(
            noiChamCong,
            truSo
        );
        return distanceInMeters
    }
    const renderChiTietNgayCong = () => {
        return ngayCong?.map((item,index) => {
            return <div key={index} className='w-full mb-2 grid gap-4' style={{ gridTemplateColumns: 'auto 1fr' }}>
                <img
                className='w-20 h-20 rounded-full object-cover border cursor-pointer'
                src={item?.checkin_img ? item.checkin_img : 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png'}
                alt=""
                onClick={() => {
                    handlePreviewImage(true, item?.checkin_img ? item?.checkin_img : 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png')
                }}
            />
            <div className='self-center text-left'>
                <ul className='text-left'>
                    <li>
                        <strong className='text-orange-400'>
                            {item?.dvcc_ca_lam_viec?.name}
                        </strong>
                        - Giờ bắt đầu: <strong className='text-sky-400'>{item?.dvcc_ca_lam_viec?.gio_bat_dau}</strong>
                        - Giờ công chuẩn: <strong className='text-sky-400'>{item?.dvcc_ca_lam_viec?.gio_cong_chuan}</strong>
                    </li>
                    <li>
                        Giờ vào ca: <strong className='text-sky-400'>
                            {item?.checkin_time ? moment(item?.checkin_time).format("HH:mm:ss") : "Không chấm công"}
                        </strong>
                        - Địa Điểm: <strong className='text-sky-400'>
                            {item?.dvcc_chi_nhanh?.chi_nhanh_name}
                        </strong>
                    </li>
                    <li>
                        Khoảng cách: <strong className='text-sky-400'>
                            {item?.lat && item?.dvcc_chi_nhanh ? tinhKhoangCach({ latitude: item?.lat, longitude:item?.lng }, { latitude: item?.dvcc_chi_nhanh?.latitude, longitude: item?.dvcc_chi_nhanh?.longitude }) + "m"
                                : ""}
                        </strong>
                    </li>
                </ul>
            </div>
            </div>
        })
    }
    const renderTongGioCong = (ngayCong) => {
        let tongNgayCong = 0;
        let tongGioCong = 0;
        ngayCong?.map((item,index) => {
            if(item !== ""){
                tongNgayCong++;
                tongGioCong+= Number(item);
            }
        })
        return <>
            <td>{tongNgayCong}</td>
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
            <div id='BangCongParttime' className='w-full mt-2 h-[calc(calc(100vh-3rem-1rem-1rem)/2-2rem-3rem)] overflow-auto customScrollbar'>
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
                                {ngayCong[0]?.ns_nhanvien?.nv_name}</h1>
                                <p>{ngayCong[0]?.ngay ? moment(ngayCong[0].ngay).format("DD/MM/YYYY"): ''}</p>
                            <div className='w-full gap-2 mt-4'>
                                <div>
                                    {renderChiTietNgayCong()}
                                </div>
                            </div>
                            <Modal
                                open={PreviewImage.isOpen}
                                closeIcon={null}
                                footer={null}
                                onCancel={() => {
                                    handlePreviewImage(false, null)
                                }}
                            >
                                <div className='max-h-[90vh] px-10 py-4 bg-white rounded-lg relative'>
                                    <button
                                        className='w-7 h-7 rounded-full absolute -top-8 -right-10 text-xl flex justify-center items-center bg-orange-400 text-white'
                                        onClick={() => {
                                            handlePreviewImage(false, null)
                                        }}
                                    >
                                        <svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
                                    </button>
                                    <img className='w-full h-full object-contain rounded' src={PreviewImage?.url} alt="" />
                                </div>
                            </Modal>
                        </div>
                </div>
            </div>
            <div id='BaoCaoChamCong' className='w-full h-full p-2 lg:p-4 bg-white rounded-lg'>
                    <div className='w-full h-10 mb-2 px-2 lg:px-4 flex items-center gap-2 lg:gap-4 bg-orange-400 rounded'>
                        <h1 className='flex-1 text-left text-lg text-white font-semibold uppercase'>
                            Báo cáo chấm công
                        </h1>

                        <DownloadTableExcel
                            filename={`BangCongTheoCa-${month}-${year}`} sheet="sheet1"
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
                                        {/* <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg> */}
                                        <p className="flex-1">Nhân viên</p>
                                    </div>
                                </th>
                                <th>
                                    Ngày làm việc
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
                                Ngày làm việc
                            </td>
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
