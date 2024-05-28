import moment from 'moment/moment';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { chamCongService } from '../../../services/chamCongService';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { localStorageService } from '../../../services/localStorageService';
import { debounce } from 'lodash';
import { setNhanVien } from '../../../Redux-toolkit/reducer/ChamCongSlice';
import '../../../issets/css/customTable.css';
import BangCongMenu from './BangChamCongMenu/BangChamCongMenu';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import icon_excel from '../../../issets/img/icon/excel.png'
import { Modal, Popover } from 'antd';
// import NhatKyChinhSua from '../../../DuyetApp/NhatKyChinhSua/NhatKyChinhSua';
import { getPreciseDistance } from 'geolib';

export default function BangChamCong() {
    const tableRef = useRef(null);
    let dispatch = useDispatch();
    let sunIndex = [];
    let satIndex = [];
    let day = 0;
    let token = localStorageService.getItem("token");
    let month = useSelector(state => state.ChamCongSlice.month);
    let year = useSelector(state => state.ChamCongSlice.year);
    let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);
    let reloadMany = useSelector(state => state.ChamCongSlice.reloadMany);
    let [reload, setReload] = useState(0);
    let [bangCong, setBangCong] = useState([]);
    let [anhChamCong, setAnhChamCong] = useState({vao:[],ra:[]});
    let [log, setLog] = useState([]);
    let [isOpenNote, setIsOpenNote] = useState(false);
    let [indexNote, setIndexNote] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [PreviewImage, setPreviewImage] = useState({ isOpen: false, url: '' });
    const handlePreviewImage = (boolean, url) => {
        setPreviewImage({ isOpen: boolean, url: url });
    };
    const [isOpenNhatKy, setIsOpenNhatKy] = useState(false);
    const handleOpenNhatKy = (bollean) => {
        setIsOpenNhatKy(bollean);
    };
    useEffect(() => {
        chamCongService.getBangCong(token, { timekeepingTime: year + "-" + month, danhmuc_id }).then((res) => {
            setBangCong(res.data.content);
        })
            .catch((err) => {
                console.log(err);
            });
    }, [month, year, danhmuc_id, reload, reloadMany])
    let updateBangCong = (e, luong_id) => {
        let data = {
            luong_id,
            field: e.target.id,
            value: e.target.value
        }
        chamCongService.updateBangCong(token, data).then((res) => {
            setReload(Date.now());
            toast.success("Cập nhật thành công!!!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
        })
            .catch((err) => {
                toast.error(err.response.data.content, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
                console.log(err);
            });
    }
    let tinhKhoangCach = (noiChamCong, truSo) => {
        const distanceInMeters = getPreciseDistance(
            noiChamCong,
            truSo
        );
        return distanceInMeters
    }
    const debounceApi = useCallback(debounce((e, luong_id) => updateBangCong(e, luong_id), 1000), [])
    let changeInput = (e, index, luong_id) => {
        let clone = [...bangCong];
        clone[index][e.target.id] = e.target.value;
        setBangCong(clone);
        debounceApi(e, luong_id)
    }
    let getAnhChamCong = (nv_id, day) => {
        let newDay = day < 9 ? "0" + (day + 1) : String(day + 1);
        let data = {
            nv_id,
            ngay: year + "-" + month + "-" + newDay
        }
        chamCongService.layAnhChamCong(token, data).then((res) => {
            setAnhChamCong(res.data.content);
        })
            .catch((err) => {
                console.log(err);
            });
    }
    let getNhatKy = (index, ngayCong, ind) => {
        let noteIndex = index < 9 ? "note_d0" + (index + 1) : "note_d" + (index + 1);
        let dateIndex = index < 9 ? "d0" + (index + 1) : "d" + (index + 1);
        let data = {
            luong_id: ngayCong?.luong_id,
            field: dateIndex
        }
        chamCongService.getNhatKy(token, data).then((res) => {
            setLog(res.data.content);
        })
            .catch((err) => {
                console.log(err);
            });
        setIndexNote({
            index: index,
            ngayCong: ngayCong,
            noteIndex: noteIndex,
            dateIndex: dateIndex,
            ind: ind
        })
        setTimeout(() => {
            setIsOpenNote(true)
        }, 150);
    }
    const renderChamCong = () => {
        return bangCong.map((ngayCong, index) => {
            return <tr>
                <td className='sticky left-0 z-10 bg-white cursor-pointer text-left' onClick={() => { dispatch(setNhanVien(ngayCong?.luong_nv_id)) }}>
                    <p className='line-clamp-1 w-full uppercase'>{ngayCong?.ns_nhanvien?.nv_name ? ngayCong?.ns_nhanvien?.nv_name : "Tên Nhân Viên"}</p>
                </td>
                <td className=''><input onKeyDown={(e) => { (e.key == "Enter") && updateBangCong(e, ngayCong?.luong_id) }} onChange={(e) => changeInput(e, index, ngayCong?.luong_id)} id="ngay_chuan" className='w-full bg-transparent text-center' type="text" value={ngayCong?.ngay_chuan ? ngayCong.ngay_chuan : ""} /></td>

                <td>{ngayCong?.tong_cong}</td>
                <td>{ngayCong?.tong_ngaylamviec}</td>
                <td>{ngayCong?.tong_giocong}</td>
                <td>{ngayCong?.tong_L}</td>
                <td>{ngayCong?.gio_nghile}</td>
                <td>{ngayCong?.tong_P}</td>
                <td>{ngayCong?.gio_nghiphep}</td>
                <td>{ngayCong?.tong_khongphep}</td>
                <td>{Number(ngayCong?.gio_nghile) + Number(ngayCong?.gio_nghiphep)}</td>
                <td>{Number(ngayCong.tong_giocong) + Number(ngayCong?.gio_nghile) + Number(ngayCong?.gio_nghiphep)}</td>
                <td>
                    {year + "-" + month == moment().format("YYYY-MM") ? 
                        <input onKeyDown={(e) => { (e.key == "Enter") && updateBangCong(e, ngayCong?.luong_id) }} onChange={(e) => changeInput(e, index, ngayCong?.luong_id)} id="phep_dauthang" className='w-full bg-transparent text-center' type="text" value={ngayCong?.phep_dauthang ? ngayCong.phep_dauthang : ""} />
                    :ngayCong?.phep_dauthang
                    }
                </td>
                <td>{ngayCong?.phep_congthem}</td>
                <td>{ngayCong?.phep_conlai}</td>
            </tr>
        })
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
    const [currentRow, setCurrentRow] = useState(0);
    const handleEdit = (type, indexRow, indexColumn) => {
        if (type == 0) {
            document.getElementById(`btn_${indexRow}_${indexColumn}`).classList.add('hidden');
            document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].classList.remove('hidden');
            document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].style.borderColor = 'blue';
            document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].focus();
        } else {
            document.getElementById(`btn_${indexRow}_${indexColumn}`).classList.remove('hidden');
            document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].classList.add('hidden');
            document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].style.borderColor = 'transparent';
        }
    }
    const handleKeyButton = (e, arraylenght, indexRow, indexColumn) => {
        if (e.key == "Enter") {
            handleEdit(0, indexRow, indexColumn)
        } else if (e.key == "ArrowUp") {
            document.getElementById(`btn_${indexRow == 0 ? indexRow : indexRow - 1}_${indexColumn}`)?.focus();
        } else if (e.key == "ArrowDown") {
            document.getElementById(`btn_${indexRow < `${bangCong.length > 6 ? bangCong.length - 1 : 6}` ? indexRow + 1 : indexRow}_${indexColumn}`)?.focus();
        } else if (e.key == "ArrowLeft") {
            document.getElementById(`btn_${indexRow}_${indexColumn < 0 ? indexColumn : indexColumn - 1}`)?.focus();
        } else if (e.key == "ArrowRight") {
            console.log(indexColumn < arraylenght - 1 ? indexColumn + 1 : indexColumn);
            document.getElementById(`btn_${indexRow}_${indexColumn < arraylenght - 1 ? indexColumn + 1 : indexColumn}`)?.focus();
        }
    }
    const get2WordLast = (str) => {
        return str?.split(' ').slice(-2).join(' ');
    }
    const renderPopoverContent = () => {
        return (
            <div className='w-80 flex flex-col items-center justify-center'>
                <div className='w-full h-10 flex justify-center items-center uppercase bg-orange-400 text-white font-semibold rounded'>
                    {
                        get2WordLast(indexNote?.ngayCong.ns_nhanvien.nv_name)
                    } - Ngày {indexNote?.index < 9 ? `0${indexNote?.index + 1}` : indexNote?.index + 1}/{month}/{year}
                </div>
                <div className='w-full flex gap-2 py-2 px-4'>
                    <p>
                        Ghi chú:
                    </p>
                    <textarea
                        type="text"
                        name=""
                        id={indexNote?.noteIndex}
                        className='flex-1 w-full border border-gray-300 focus:outline-none rounded py-1 px-2 resize-none'
                        onChange={(e) => {
                            changeInput(e, indexNote?.ind, indexNote?.ngayCong?.luong_id)
                        }}
                        // value={indexNote?.ngayCong == undefined ? "" : indexNote?.ngayCong[indexNote?.noteIndex]}
                        value={indexNote?.ngayCong[indexNote?.noteIndex] ? indexNote?.ngayCong[indexNote?.noteIndex] : ""}
                        rows={3}
                    ></textarea>
                </div>
            </div>
        )
    }

    const renderEmpty = () => {
        let emptyArray = [];
        for (let i = 0; i < 7 - bangCong.length; i++) {
            emptyArray.push('');
        }
        let state = -1;
        if (bangCong.length != 0) {
            state = 7 - bangCong.length;
        }

        return emptyArray?.map((row, rowIndex) => {
            let array = [];
            for (let i = 1; i <= day; i++) {
                array.push('');
            }
            return (
                <tr
                    key={rowIndex}
                    className={`${currentRow == rowIndex + state + 1 ? '' : 'addRow'} cursor-pointer`}
                    onClick={() => { setCurrentRow(rowIndex + state + 1) }}
                >
                    <td className={`${currentRow == rowIndex + state + 1 ? 'bg-sky-300' : 'bg-white'}`} style={{ padding: '0 0 0 4px' }}>
                        <button
                            id={`btn_${rowIndex}_-1`}
                            className='line-clamp-1 w-full h-full bg-transparent rounded-none border border-transparent focus:outline-none focus:after:bg-blue-600 text-left px-1.5 py-0.5'
                            onKeyUp={(e) => {
                                handleKeyButton(e, state + 2, rowIndex, -1)
                            }}
                            onFocus={() => {
                                document.getElementById(`btn_${rowIndex}_-1`).style.borderColor = 'blue';
                                setCurrentRow(rowIndex);
                            }}
                            onBlur={() => {
                                document.getElementById(`btn_${rowIndex}_-1`).style.borderColor = 'transparent';
                            }}
                        >
                        </button>
                    </td>
                    {
                        array?.map((ngay, columnIndex) => {
                            if (sunIndex.includes(columnIndex)) {
                                return (
                                    <td
                                        id={`${rowIndex + state + 1}${columnIndex}`}
                                        className={`${currentRow == rowIndex + state + 1 ? 'bg-sky-200' : 'bg-red-50'} topRightPopup`}
                                        style={{ borderRightColor: 'black' }}
                                    >
                                        <button
                                            id={`btn_${rowIndex + state + 1}_${columnIndex}`}
                                            type="button"
                                            className={`w-full h-full absolute top-0 left-0 bg-transparent rounded-none text-center border border-transparent focus:outline-none focus:after:bg-blue-600`}
                                            onDoubleClick={() => {
                                                handleEdit(0, rowIndex + state + 1, columnIndex)
                                            }}
                                            onKeyUp={(e) => {
                                                handleKeyButton(e, array.length, rowIndex + state + 1, columnIndex)
                                            }}
                                            onFocus={() => {
                                                let index = rowIndex + state + 1;
                                                document.getElementById(`btn_${index}_${columnIndex}`).style.borderColor = 'blue';
                                                setCurrentRow(rowIndex + state + 1);
                                            }}
                                            onBlur={() => {
                                                let index = rowIndex + state + 1;
                                                document.getElementById(`btn_${index}_${columnIndex}`).style.borderColor = 'transparent';
                                            }}
                                        >
                                        </button>
                                        <input
                                            id={columnIndex < 9 ? `d0${columnIndex + 1}` : `d${columnIndex + 1}`}
                                            type="text"
                                            name={`input_${rowIndex + state + 1}_${columnIndex}`}
                                            value={''}
                                            className='min-w-0 w-full bg-transparent h-full absolute top-0 left-0 text-center hidden border border-transparent focus:outline-none'
                                            onKeyUp={(e) => {
                                                if (e.key == "Enter") {
                                                    document.getElementsByName(`input_${rowIndex + state + 1}_${columnIndex}`)[0].blur();
                                                    document.getElementById(`btn_${rowIndex + state + 1 < 6 ? rowIndex + state + 1 + 1 : rowIndex + state + 1}_${columnIndex}`).focus();
                                                }
                                            }}
                                            onBlur={() => {
                                                handleEdit(1, rowIndex + state + 1, columnIndex)
                                            }}
                                        />
                                        {renderSide(rowIndex + state + 1, columnIndex)}
                                    </td>
                                )
                            } else if (satIndex.includes(columnIndex)) {
                                return (
                                    <td
                                        id={`${rowIndex + state + 1}${columnIndex}`}
                                        className={`${currentRow == rowIndex + state + 1 ? 'bg-sky-200' : 'bg-yellow-50'} topRightPopup`}
                                    >
                                        <button
                                            id={`btn_${rowIndex + state + 1}_${columnIndex}`}
                                            type="button"
                                            className={`w-full h-full absolute top-0 left-0 bg-transparent rounded-none text-center border border-transparent focus:outline-none focus:after:bg-blue-600`}
                                            onDoubleClick={() => {
                                                handleEdit(0, rowIndex + state + 1, columnIndex)
                                            }}
                                            onKeyUp={(e) => {
                                                handleKeyButton(e, array.length, rowIndex + state + 1, columnIndex)
                                            }}
                                            onFocus={() => {
                                                let index = rowIndex + state + 1;
                                                document.getElementById(`btn_${index}_${columnIndex}`).style.borderColor = 'blue';
                                                setCurrentRow(rowIndex + state + 1);
                                            }}
                                            onBlur={() => {
                                                let index = rowIndex + state + 1;
                                                document.getElementById(`btn_${index}_${columnIndex}`).style.borderColor = 'transparent';
                                            }}
                                        >
                                        </button>
                                        <input
                                            id={columnIndex < 9 ? `d0${columnIndex + 1}` : `d${columnIndex + 1}`}
                                            type="text"
                                            name={`input_${rowIndex + state + 1}_${columnIndex}`}
                                            value={''}
                                            className='min-w-0 w-full bg-transparent h-full absolute top-0 left-0 text-center hidden border border-transparent focus:outline-none'
                                            onKeyUp={(e) => {
                                                if (e.key == "Enter") {
                                                    document.getElementsByName(`input_${rowIndex + state + 1}_${columnIndex}`)[0].blur();
                                                    document.getElementById(`btn_${rowIndex + state + 1 < 6 ? rowIndex + state + 1 + 1 : rowIndex + state + 1}_${columnIndex}`).focus();
                                                }
                                            }}
                                            onBlur={() => {
                                                handleEdit(1, rowIndex + state + 1, columnIndex)
                                            }}
                                        />
                                        {renderSide(rowIndex + state + 1, columnIndex)}
                                    </td>
                                )
                            } else {
                                return (
                                    <td
                                        id={`${rowIndex + state + 1}${columnIndex}`}
                                        className={`${currentRow == rowIndex + state + 1 ? 'bg-sky-200' : ''} topRightPopup`}
                                    >
                                        <button
                                            id={`btn_${rowIndex + state + 1}_${columnIndex}`}
                                            type="button"
                                            className={`w-full h-full absolute top-0 left-0 bg-transparent rounded-none text-center border border-transparent focus:outline-none focus:after:bg-blue-600`}
                                            onDoubleClick={() => {
                                                handleEdit(0, rowIndex + state + 1, columnIndex)
                                            }}
                                            onKeyUp={(e) => {
                                                handleKeyButton(e, array.length, rowIndex + state + 1, columnIndex)
                                            }}
                                            onFocus={() => {
                                                let index = rowIndex + state + 1;
                                                document.getElementById(`btn_${index}_${columnIndex}`).style.borderColor = 'blue';
                                                setCurrentRow(rowIndex + state + 1);
                                            }}
                                            onBlur={() => {
                                                let index = rowIndex + state + 1;
                                                document.getElementById(`btn_${index}_${columnIndex}`).style.borderColor = 'transparent';
                                            }}
                                        >
                                        </button>
                                        <input
                                            id={columnIndex < 9 ? `d0${columnIndex + 1}` : `d${columnIndex + 1}`}
                                            type="text"
                                            name={`input_${rowIndex + state + 1}_${columnIndex}`}
                                            value={''}
                                            className='min-w-0 w-full bg-transparent h-full absolute top-0 left-0 text-center hidden border border-transparent focus:outline-none'
                                            onKeyUp={(e) => {
                                                if (e.key == "Enter") {
                                                    document.getElementsByName(`input_${rowIndex + state + 1}_${columnIndex}`)[0].blur();
                                                    document.getElementById(`btn_${rowIndex + state + 1 < 6 ? rowIndex + state + 1 + 1 : rowIndex + state + 1}_${columnIndex}`).focus();
                                                }
                                            }}
                                            onBlur={() => {
                                                handleEdit(1, rowIndex + state + 1, columnIndex)
                                            }}
                                        />
                                        {renderSide(rowIndex + state + 1, columnIndex)}
                                    </td>
                                )
                            }
                        })
                    }
                </tr>
            )
        })
    }

    const renderChamTron = (note,value) => {
        if(note != ""){
            if(note.includes("Không có thời gian")){
                return "topRightPopup_Green";
            }else{
                return "HasNote";
            }
        }else{
            if(value !== null && value !== ""){
                return "topRightPopup_Blue";
            }else{
                return "";
            }
        }
    }
    const table = () => {
        return (
            <div className='w-full h-[calc(calc(100vh-3rem-1rem-1rem)/2-2rem-3rem)] overflow-auto customScrollbar'>
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
                            bangCong.map((ngayCong, indexRow) => {
                                let array = [];
                                for (let i = 1; i <= day; i++) {
                                    let key = "d" + (i < 10 ? "0" + i : i);
                                    let key2 = "note_d" + (i < 10 ? "0" + i : i);
                                    array.push({ day: ngayCong[key], note: ngayCong[key2] ? ngayCong[key2] : "" });
                                }
                                let arraylenght = array.length
                                return <tr
                                    onClick={() => setCurrentRow(indexRow)}
                                    className={`${currentRow == indexRow ? '' : 'addRow'}`}
                                >
                                    <td
                                        id={`${indexRow}-1`}
                                        className={`${currentRow == indexRow ? 'bg-sky-300' : 'bg-white'} sticky left-0 z-30`}
                                        style={{ padding: '0 0 0 4px' }}
                                    >
                                        <button
                                            id={`btn_${indexRow}_-1`}
                                            className='line-clamp-1 w-full h-full bg-transparent rounded-none border border-transparent focus:outline-none focus:after:bg-blue-600 text-left px-1.5 py-0.5'
                                            onKeyUp={(e) => {
                                                handleKeyButton(e, arraylenght, indexRow, -1)
                                            }}
                                            onFocus={() => {
                                                document.getElementById(`btn_${indexRow}_-1`).style.borderColor = 'blue';
                                                setCurrentRow(indexRow);
                                            }}
                                            onBlur={() => {
                                                document.getElementById(`btn_${indexRow}_-1`).style.borderColor = 'transparent';
                                            }}
                                        >
                                            {ngayCong?.ns_nhanvien?.nv_name ? ngayCong?.ns_nhanvien?.nv_name : "Nhân Viên"}
                                        </button>
                                        {renderSide(indexRow, -1)}
                                    </td>
                                    {
                                        array.map((item, indexColumn) => {
                                            if (sunIndex.includes(indexColumn)) {
                                                return (
                                                    <Popover
                                                        trigger={'click'}
                                                        content={renderPopoverContent()}
                                                        arrow={false}
                                                        placement='bottomRight'
                                                        overlayInnerStyle={{
                                                            marginTop: '10px',
                                                            padding: "0",
                                                            borderRadius: "0.25rem",
                                                            boxShadow: 'rgba(0, 0, 0, 0.4) 0px 3px 8px'
                                                        }}
                                                    >
                                                        <td
                                                            id={`${indexRow}${indexColumn}`}
                                                            className={`${currentRow == indexRow ? 'bg-sky-200' : 'bg-red-50'} topRightPopup topLeftPopup ${renderChamTron(item?.note,item?.day)}`}
                                                            style={{ borderRightColor: 'black' }}
                                                        >
                                                            <button
                                                                id={`btn_${indexRow}_${indexColumn}`}
                                                                type="button"
                                                                className={`w-full h-full absolute top-0 left-0 bg-transparent rounded-none text-center border border-transparent focus:outline-none focus:after:bg-blue-600`}
                                                                onDoubleClick={() => {
                                                                    handleEdit(0, indexRow, indexColumn)
                                                                }}
                                                                onKeyUp={(e) => {
                                                                    handleKeyButton(e, arraylenght, indexRow, indexColumn)
                                                                }}
                                                                onFocus={() => {
                                                                    document.getElementById(`btn_${indexRow}_${indexColumn}`).style.borderColor = 'blue';
                                                                    setCurrentRow(indexRow);
                                                                    getNhatKy(indexColumn, ngayCong, indexRow)
                                                                }}
                                                                onClick={() => getAnhChamCong(ngayCong?.luong_nv_id, indexColumn)}
                                                                onBlur={() => {
                                                                    document.getElementById(`btn_${indexRow}_${indexColumn}`).style.borderColor = 'transparent';
                                                                }}
                                                            >
                                                                {item.day}
                                                            </button>
                                                            <input
                                                                id={indexColumn < 9 ? `d0${indexColumn + 1}` : `d${indexColumn + 1}`}
                                                                type="text"
                                                                name={`input_${indexRow}_${indexColumn}`}
                                                                value={item.day ? item.day : ""}
                                                                className='min-w-0 w-full bg-transparent h-full absolute top-0 left-0 text-center hidden border border-transparent focus:outline-none'
                                                                onKeyUp={(e) => {
                                                                    if (e.key == "Enter") {
                                                                        document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].blur();
                                                                        document.getElementById(`btn_${indexRow < bangCong.length - 1 ? indexRow + 1 : indexRow}_${indexColumn}`).focus();
                                                                        updateBangCong(e, ngayCong?.luong_id)
                                                                    }
                                                                }}
                                                                onChange={(e) => changeInput(e, indexRow, ngayCong?.luong_id)}
                                                                onBlur={() => {
                                                                    handleEdit(1, indexRow, indexColumn)
                                                                }}
                                                            />
                                                            {renderSide(indexRow, indexColumn)}
                                                        </td>
                                                    </Popover>
                                                )
                                            } else if (satIndex.includes(indexColumn)) {
                                                return (
                                                    <Popover
                                                        trigger={'click'}
                                                        content={renderPopoverContent()}
                                                        arrow={false}
                                                        placement='bottomRight'
                                                        overlayInnerStyle={{
                                                            marginTop: '10px',
                                                            padding: "0",
                                                            borderRadius: "0.25rem",
                                                            boxShadow: 'rgba(0, 0, 0, 0.4) 0px 3px 8px'
                                                        }}
                                                    >
                                                        <td
                                                            className={`${currentRow == indexRow ? 'bg-sky-200' : 'bg-yellow-50'} topRightPopup topLeftPopup ${renderChamTron(item?.note,item?.day)}`}
                                                            id={`${indexRow}${indexColumn}`}
                                                        >
                                                            <button
                                                                id={`btn_${indexRow}_${indexColumn}`}
                                                                type="button"
                                                                className={`w-full h-full absolute top-0 left-0 bg-transparent rounded-none text-center border border-transparent focus:outline-none focus:after:bg-blue-600`}
                                                                onDoubleClick={() => {
                                                                    handleEdit(0, indexRow, indexColumn)
                                                                }}
                                                                onKeyUp={(e) => {
                                                                    handleKeyButton(e, arraylenght, indexRow, indexColumn)
                                                                }}
                                                                onFocus={() => {
                                                                    document.getElementById(`btn_${indexRow}_${indexColumn}`).style.borderColor = 'blue';
                                                                    setCurrentRow(indexRow);
                                                                    getNhatKy(indexColumn, ngayCong, indexRow)
                                                                }}
                                                                onClick={() => getAnhChamCong(ngayCong?.luong_nv_id, indexColumn)}
                                                                onBlur={() => {
                                                                    document.getElementById(`btn_${indexRow}_${indexColumn}`).style.borderColor = 'transparent';
                                                                }}
                                                            >
                                                                {item.day}
                                                            </button>
                                                            <input
                                                                id={indexColumn < 9 ? `d0${indexColumn + 1}` : `d${indexColumn + 1}`}
                                                                type="text"
                                                                name={`input_${indexRow}_${indexColumn}`}
                                                                value={item.day ? item.day : ""}
                                                                className='min-w-0 w-full bg-transparent h-full absolute top-0 left-0 text-center hidden border border-transparent focus:outline-none'
                                                                onKeyUp={(e) => {
                                                                    if (e.key == "Enter") {
                                                                        document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].blur();
                                                                        document.getElementById(`btn_${indexRow < bangCong.length - 1 ? indexRow + 1 : indexRow}_${indexColumn}`).focus();
                                                                        updateBangCong(e, ngayCong?.luong_id)
                                                                    }
                                                                }}
                                                                onChange={(e) => changeInput(e, indexRow, ngayCong?.luong_id)}
                                                                onBlur={() => {
                                                                    handleEdit(1, indexRow, indexColumn)
                                                                }}
                                                            />
                                                            {renderSide(indexRow, indexColumn)}
                                                        </td>
                                                    </Popover>
                                                )
                                            } else {
                                                return (
                                                    <Popover
                                                        trigger={'click'}
                                                        content={renderPopoverContent()}
                                                        arrow={false}
                                                        placement='bottomRight'
                                                        overlayInnerStyle={{
                                                            marginTop: '10px',
                                                            padding: "0",
                                                            borderRadius: "0.25rem",
                                                            boxShadow: 'rgba(0, 0, 0, 0.4) 0px 3px 8px'
                                                        }}
                                                    >
                                                        <td
                                                            className={`${currentRow == indexRow ? 'bg-sky-200' : ''} topRightPopup topLeftPopup ${renderChamTron(item?.note,item?.day)}`}
                                                            id={`${indexRow}${indexColumn}`}
                                                        >
                                                            <button
                                                                id={`btn_${indexRow}_${indexColumn}`}
                                                                type="button"
                                                                className={`w-full h-full absolute top-0 left-0 bg-transparent rounded-none text-center border border-transparent focus:outline-none focus:after:bg-[blue]`}
                                                                onDoubleClick={() => {
                                                                    handleEdit(0, indexRow, indexColumn)
                                                                }}
                                                                onKeyUp={(e) => {
                                                                    handleKeyButton(e, arraylenght, indexRow, indexColumn)
                                                                }}
                                                                onFocus={() => {
                                                                    document.getElementById(`btn_${indexRow}_${indexColumn}`).style.borderColor = 'blue';
                                                                    setCurrentRow(indexRow);
                                                                    getNhatKy(indexColumn, ngayCong, indexRow)
                                                                }}
                                                                onClick={() => getAnhChamCong(ngayCong?.luong_nv_id, indexColumn)}
                                                                onBlur={() => {
                                                                    document.getElementById(`btn_${indexRow}_${indexColumn}`).style.borderColor = 'transparent';
                                                                }}
                                                            >
                                                                {item.day}
                                                            </button>
                                                            <input
                                                                id={indexColumn < 9 ? `d0${indexColumn + 1}` : `d${indexColumn + 1}`}
                                                                type="text"
                                                                name={`input_${indexRow}_${indexColumn}`}
                                                                value={item.day ? item.day : ""}
                                                                className='min-w-0 w-full bg-transparent h-full absolute top-0 left-0 text-center hidden border border-transparent focus:outline-none'
                                                                onKeyUp={(e) => {
                                                                    if (e.key == "Enter") {
                                                                        document.getElementsByName(`input_${indexRow}_${indexColumn}`)[0].blur();
                                                                        document.getElementById(`btn_${indexRow < bangCong.length - 1 ? indexRow + 1 : indexRow}_${indexColumn}`).focus();
                                                                        updateBangCong(e, ngayCong?.luong_id)
                                                                    }
                                                                }}
                                                                onChange={(e) => changeInput(e, indexRow, ngayCong?.luong_id)}
                                                                onBlur={() => {
                                                                    handleEdit(1, indexRow, indexColumn)
                                                                }}
                                                            />
                                                            {renderSide(indexRow, indexColumn)}
                                                        </td>
                                                    </Popover>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            })
                        }
                        {
                            bangCong.length < 7 && renderEmpty()
                        }
                    </tbody>
                </table>
            </div >
        )
    }
    const [drag, setDrag] = useState(false);
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
        let iniSize = document.getElementById(`${row}${col}`).offsetHeight;
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
            document.getElementById(`${row}${col}`).style.height = `${endSize}px`;
        }
    }

    let renderLichSuVaoCa = () => {
        return anhChamCong?.vao?.map((vao,index) => {
            return <div className='w-full mb-2 grid gap-4' style={{ gridTemplateColumns: 'auto 1fr' }}>
            <img
                className='w-20 h-20 rounded-full object-cover border cursor-pointer'
                src={vao.hinhanh ? vao?.hinhanh : 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png'}
                alt=""
                onClick={() => {
                    handlePreviewImage(true, vao?.hinhanh ? vao?.hinhanh : 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png')
                }}
            />
            <div className='self-center text-left'>
                <ul className='text-left'>
                    <li>
                        Vào ca: <strong className='text-sky-400'>{vao?.thoi_gian ? moment(vao?.thoi_gian).format("HH:mm") : ""}</strong>
                    </li>
                    <li>
                        Địa điểm: <strong className='text-sky-400'>{vao?.dvcc_chi_nhanh?.chi_nhanh_name}</strong>
                    </li>
                    <li>
                        Khoảng cách: <strong className='text-sky-400'>
                            {vao?.lat && vao?.dvcc_chi_nhanh ? tinhKhoangCach({ latitude: vao?.lat, longitude:vao?.lng }, { latitude: vao?.dvcc_chi_nhanh?.latitude, longitude: vao?.dvcc_chi_nhanh?.longitude }) + "m"
                                : ""}
                        </strong>
                    </li>
                </ul>
            </div>
        </div>
        })
    }
    let renderLichSuRaCa = () => {
        return anhChamCong?.ra?.map((ra,index) => {
            return <div className='w-full mb-2 grid gap-4' style={{ gridTemplateColumns: 'auto 1fr' }}>
            <img
                className='w-20 h-20 rounded-full object-cover border cursor-pointer'
                src={ra.hinhanh ? ra?.hinhanh : 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png'}
                alt=""
                onClick={() => {
                    handlePreviewImage(true, ra?.hinhanh ? ra?.hinhanh : 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png')
                }}
            />
            <div className='self-center text-left'>
                <ul className='text-left'>
                    <li>
                        Ra ca: <strong className='text-sky-400'>{ra?.thoi_gian ? moment(ra?.thoi_gian).format("HH:mm") : ""}</strong>
                    </li>
                    <li>
                        Địa điểm: <strong className='text-sky-400'>{ra?.dvcc_chi_nhanh?.chi_nhanh_name}</strong>
                    </li>
                    <li>
                        Khoảng cách: <strong className='text-sky-400'>
                            {ra?.lat && ra?.dvcc_chi_nhanh ? tinhKhoangCach({ latitude: ra?.lat, longitude:ra?.lng }, { latitude: ra?.dvcc_chi_nhanh?.latitude, longitude: ra?.dvcc_chi_nhanh?.longitude }) + "m"
                                : ""}
                        </strong>
                    </li>
                </ul>
            </div>
        </div>
        })
    }
    return (
        <div className='w-full'>
            <div className='w-full p-2 lg:p-4 bg-white rounded-lg'>
                <BangCongMenu
                    handleOpenNhatKy={handleOpenNhatKy}
                />
                <div id='ChamTay' className='w-full mt-2'>
                    {table()}
                </div>
            </div>

            <div
                className={`w-full lg:grid gap-4 mt-4`}
                style={{
                    gridTemplateColumns: 'auto 1fr',
                }}
            >
                <div className='w-auto relative z-10 text-sm'>
                    <div className='w-full h-full bg-white rounded-lg shadow-md p-2 lg:p-4 pr-0'>
                        <div className='w-full h-[calc(calc(100vh-3rem-1rem-1rem)/2-2rem-1rem)] pe-4 overflow-y-auto customScrollbar text-center'>
                            <h1 className='uppercase font-bold text-lg'>
                                {anhChamCong?.vao[0]?.ns_nhanvien?.nv_name}</h1>
                                <p>{anhChamCong?.vao[0]?.thoi_gian ? moment(anhChamCong?.vao[0]?.thoi_gian).format("DD/MM/YYYY"): ''}</p>
                            <div className='w-full grid grid-cols-2 gap-2 mt-4'>
                                <div>
                                    {renderLichSuVaoCa()}
                                </div>
                                <div>
                                    {renderLichSuRaCa()}
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
                            filename={`BangCong-${month}`} sheet="sheet1"
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
                        <table className='customTable w-max min-w-full lg:w-full text-center relative'>
                            <thead className='text-[12px] sticky top-0 z-20'>
                                <th>
                                    <div class="flex items-center">
                                        {/* <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg> */}
                                        <p class="flex-1">Nhân viên</p>
                                    </div>
                                </th>
                                <th>
                                    Ngày công chuẩn
                                </th>
                                <th>
                                    Tổng ngày công
                                </th>
                                <th>
                                    Ngày làm việc
                                </th>
                                <th>
                                    Giờ công
                                </th>
                                <th>
                                    Ngày Nghỉ Lễ
                                </th>
                                <th>
                                    Giờ Nghỉ Lễ
                                </th>
                                <th>
                                    Ngày Nghỉ Phép
                                </th>
                                <th>
                                    Giờ Nghỉ Phép
                                </th>
                                <th>
                                    Nghỉ Không Phép
                                </th>
                                <th>
                                    Tổng Giờ Nghỉ
                                </th>
                                <th>
                                    Tổng Giờ Công
                                </th>
                                <th>
                                    Phép Tháng Trước
                                </th>
                                <th>
                                    Phép Cộng Thêm
                                </th>
                                <th>
                                    Phép Còn Lại
                                </th>
                            </thead>
                            <tbody>
                                {renderChamCong()}
                            </tbody>
                        </table>
                    </div>
                    <Modal
                        open={isModalOpen}
                        cancelText={<p>Đóng<i className='fa-solid fa-xmark ms-1 -mb-1'></i></p>}
                        cancelButtonProps={{ style: { backgroundColor: 'rgb(34, 197, 94)', color: 'white' }, hover: { backgroundColor: 'rgb(22, 163, 74)', color: 'white' } }}
                        okButtonProps={{ style: { display: 'none' } }}
                        onCancel={() => setIsModalOpen(false)}
                    >
                        <img src="" alt="" className='w-[20rem] h-[35rem] object-contain mx-auto' />
                    </Modal>
                </div>
            </div>
            <div className={`fixed bottom-2 lg:bottom-4 right-2 lg:right-8 z-[1000]`}>
                <div className='relative'>
                    <button
                        type='button'
                        className='w-12 h-12 bg-green-400 text-white rounded-full flex lg:hidden justify-center items-center text-xl relative focus:outline-none'
                        onClick={() => setIsOpenNhatKy(!isOpenNhatKy)}
                    >
                        <i className="fa-solid fa-file"></i>
                    </button>

                    <div className={`${isOpenNhatKy ? 'w-[calc(100vw-1rem)] lg:w-[calc(100vw-3rem)] h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-4.5rem-4rem)] p-4 border-gray-300 shadow-md opacity-100' : 'w-0 p-0 border-none shadow-none opacity-0'} 
                     border rounded-md bg-white absolute bottom-14 right-0  delay-75 duration-300 transition-all ease-linear`}>
                        <button
                            className='hidden lg:block absolute top-0 right-0 bg-red-500 rounded-full text-white w-7 h-7 translate-x-1/2 -translate-y-1/2 cursor-pointer'
                            onClick={() => setIsOpenNhatKy(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        {/* <NhatKyChinhSua /> */}
                    </div>
                </div>
            </div>
            {/* xuất excel */}
            <div className='hidden'>
                <table ref={tableRef} className='min-w-full relative'>
                    <thead>
                        <tr className='text-lg font-semibold text-center'>Bảng Công Tháng {month}/{year}</tr>
                        <tr>
                            <th>Nhân Viên</th>
                            {
                                renderDay_()
                            }
                            <th>
                                Ngày công chuẩn
                            </th>
                            <th>
                                Tổng ngày công
                            </th>
                            <th>
                                Ngày làm việc
                            </th>
                            <th>
                                Giờ công
                            </th>
                            <th>
                                Ngày Nghỉ Lễ
                            </th>
                            <th>
                                Giờ Nghỉ Lễ
                            </th>
                            <th>
                                Ngày Nghỉ Phép
                            </th>
                            <th>
                                Giờ Nghỉ Phép
                            </th>
                            <th>
                                Nghỉ Không Phép
                            </th>
                            <th>
                                Giờ Công Nghỉ
                            </th>
                            <th>
                                Tổng Giờ Công
                            </th>
                            <th>
                                Phép Tháng Trước
                            </th>
                            <th>
                                Phép Cộng Thêm
                            </th>
                            <th>
                                Phép Còn Lại
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bangCong?.map((item, index) => {
                                let array = [];
                                for (let i = 1; i <= day; i++) {
                                    let key = i < 10 ? "d0" + i : "d" + i;
                                    array.push(item[key]);
                                }
                                return <tr>
                                    <td>{item?.ns_nhanvien?.nv_name}</td>
                                    {array?.map(ngayCong => {
                                        return <td>{ngayCong}</td>
                                    })}
                                    <td>{item?.ngay_chuan}</td>
                                    <td>{item?.tong_cong}</td>
                                    <td>{item?.tong_ngaylamviec}</td>
                                    <td>{item?.tong_giocong}</td>
                                    <td>{item?.tong_L}</td>
                                    <td>{item?.gio_nghile}</td>
                                    <td>{item?.tong_P}</td>
                                    <td>{item?.gio_nghiphep}</td>
                                    <td>{item?.tong_khongphep}</td>
                                    <td>{Number(item?.gio_nghile) + Number(item?.gio_nghiphep)}</td>
                                    <td>{Number(item?.tong_giocong) + Number(item?.gio_nghile) + Number(item?.gio_nghiphep)}</td>
                                    <td>{item?.phep_dauthang}</td>
                                    <td>{item?.phep_congthem}</td>
                                    <td>{item?.phep_conlai}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
