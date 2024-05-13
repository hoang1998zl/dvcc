import React, { useState } from 'react'
import BangChamCongMenu from '../BangChamCong/BangChamCongMenu/BangChamCongMenu';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';

export default function BangCongParttime() {
    let sunIndex = [];
    let satIndex = [];
    let day = 0;
    const [isOpenNhatKy, setIsOpenNhatKy] = useState(false);
    const [drag, setDrag] = useState(false);
    let month = useSelector(state => state.ChamCongSlice.month);
    let year = useSelector(state => state.ChamCongSlice.year);

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
  return (
    <div className='w-full'>
        <div className='w-full p-2 lg:p-4 bg-white rounded-lg'>
            <BangChamCongMenu
                    handleOpenNhatKy={handleOpenNhatKy}
                />
            <div id='BangCongParttime' className='w-full mt-2'>
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
                        <tbody></tbody>
                </table>
            </div>
            
        </div>
    </div>
  )
}
