import moment from 'moment';
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { DownloadTableExcel } from 'react-export-table-to-excel';

import chamcongjson from '../../../issets/json/ChamCong.json'

export default function BangLuongTable() {
  const tableRef = useRef(null);

  const { headerHeight } = useSelector(state => state.PageSlice);

  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState();

  const [dataChamCong, setDataChamCong] = useState([]);

  useLayoutEffect(() => {
    setYear(moment().year());
    setMonth(moment().month());
    setDay(moment(year + "-" + month).daysInMonth());
    setDataChamCong(chamcongjson[0]);
  }, [year, month]);

  const renderDay = () => {
    let array = [];


    for (let i = 1; i <= day; i++) {
      if (i < 10) {
        i = "0" + i;
        array.push(i);
      } else {
        array.push(String(i));
      }
    }

    return array.map((item, columnIndex) => {
      return (
        <td
          id={`col${columnIndex + 1}_row0`}
          key={columnIndex}
          className={`text-center`}
        >
          <p>{item}</p>
        </td>
      )
    })
  };

  const renderChamCong = (chamcong) => {
    let array = [];

    for (let i = 1; i <= day; i++) {
      if (i < 10) {
        i = "0" + i;
        array.push(i);
      } else {
        array.push(String(i));
      }
    }

    return array.map((item, columnIndex) => {
      return (
        <td
          id={`col${columnIndex + 1}_row0`}
          key={columnIndex}
          className={`text-center`}
        >
          {
            chamcong?.map((x) => {
              return (
                x.ngay === Number(item) && x.chamcong_code
              )
            })
          }
        </td>
      )
    })
  }

  const renderTable = () => {
    return (
      <tr>
        <td
          id={`col0_row0`}
          className='cursor-pointer'
        >
          <button type='button'>
            {dataChamCong.nv_name}
          </button>
        </td>
        {renderChamCong(dataChamCong.chamcong_ngay)}
      </tr>
    )
  };

  return (
    <div
      className='w-full h-screen bg-white border border-orange-400 p-4 rounded-b rounded-e overflow-y-auto customScrollbar'
      style={{
        height: `calc(100vh - ${headerHeight}px - 5rem)`
      }}
    >
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
          {/* <img
            className='w-full h-full object-contain'
            src={icon_excel}
            alt=""
          /> */}

          Excel
        </button>
      </DownloadTableExcel>
      <table
        id='ChamCongTable'
        ref={tableRef}
        className='w-full text-sm'
      >
        <thead>
          <tr>
            <td
              id={`col0_row0`}
            >
              Tên nhân viên
            </td>
            {renderDay()}
          </tr>
        </thead>
        <tbody>
          {renderTable()}
        </tbody>
      </table>

      <table
        id='ChamCongTable'
        className='w-full text-sm mt-8'
      >
        <thead>
          <tr>
            <th>Nhân Viên</th>
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
              Nghỉ Lễ
            </th>
            <th>
              Nghỉ Phép
            </th>
            <th>
              Nghỉ Không Phép
            </th>
            <th>
              Tổng Nghỉ
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
      </table>
    </div>
  )
}
