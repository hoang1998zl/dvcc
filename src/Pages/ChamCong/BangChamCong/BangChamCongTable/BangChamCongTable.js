import moment from 'moment';
import React, { useLayoutEffect, useState } from 'react'

import chamcongjson from '../../../../issets/json/ChamCong.json'

export default function BangChamCongTable() {

  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(3);
  const [year, setYear] = useState(2024);
  const [emptyArray, setEmptyArray] = useState([]);

  const [currentSelect, setCurrentSelect] = useState({
    x: 0,
    y: 0
  });

  useLayoutEffect(() => {
    setDay(moment(year + "-" + month).daysInMonth());


    chamcongjson?.length < 7 && setEmptyArray(new Array(7 - (chamcongjson?.length || 0)).fill(null));
  }, [])

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
      let date = moment(year + "-" + month + "-" + item).format('ddd');

      return (
        <td
          id={`col${columnIndex + 1}_row0`}
          key={columnIndex}
          className={`text-center`}
        >
          <p className='underline'>{item}</p>
          <p>
            {(date === "Sun" || date === "CN") && "CN"}
            {(date === "Sat" || date === "T7") && "T7"}
            {(date === "Mon" || date === "T2") && "T2"}
            {(date === "Tue" || date === "T3") && "T3"}
            {(date === "Wed" || date === "T4") && "T4"}
            {(date === "Thu" || date === "T5") && "T5"}
            {(date === "Fri" || date === "T6") && "T6"}
          </p>
        </td>
      )
    })
  };

  const renderTable = () => {
    if (chamcongjson?.length >= 7) {

      return chamcongjson?.map((item, rowIndex) => {
        return (
          <tr
            key={rowIndex}
            className={`${currentSelect?.y === rowIndex + 1 ? 'currentSelectedRow' : ''}`}
          >
            <td
              id={`col0_row${rowIndex + 1}`}
              className={`cursor-pointer`}
              style={{
                boxShadow: `${(currentSelect?.x === 0 && currentSelect?.y === rowIndex + 1) ? 'inset 0px 0px 0px 2px orange' : ' '}`
              }}
              onClick={() => {
                setCurrentSelect({
                  x: 0,
                  y: rowIndex + 1
                })
              }}
            >
              <button
                type="button"
                className={`w-full h-full focus:outline-none`}
                onClick={() => {
                  setCurrentSelect({
                    x: 0,
                    y: rowIndex + 1
                  })
                }}
              >
                {item?.nv_name}
              </button>
            </td>
            {renderChamCong(item, rowIndex)}
          </tr>
        )
      });

    }

    else {
      return <>
        {
          chamcongjson?.map((item, rowIndex) => {
            return (
              <tr
                key={rowIndex}
                className={`${currentSelect?.y === rowIndex + 1 ? 'currentSelectedRow' : ''}`}
              >
                <td
                  id={`col0_row${rowIndex + 1}`}
                  className={`cursor-pointer`}
                  onClick={() => {
                    setCurrentSelect({
                      x: 0,
                      y: rowIndex + 1
                    })
                  }}
                >
                  <button
                    type="button"
                    className={`w-full h-full focus:outline-none`}
                    style={{
                      boxShadow: `${(currentSelect?.x === 0 && currentSelect?.y === rowIndex + 1) ? 'inset 0px 0px 0px 2px orange' : ''}`
                    }}
                    onClick={() => {
                      setCurrentSelect({
                        x: 0,
                        y: currentSelect?.y <= chamcongjson?.length ? currentSelect?.y + 1 : currentSelect?.y
                      })
                    }}
                  >
                    {item?.nv_name}
                  </button>
                </td>
                {renderChamCong(item, rowIndex)}
              </tr>
            )
          })
        }
        {
          emptyArray.map((item, emptyIndex) => {
            return (
              <tr
                key={emptyIndex}
                className={`${currentSelect?.y === emptyIndex + 1 + chamcongjson?.length ? 'currentSelectedRow' : ''}`}
              >
                <td
                  id={`col0_row${emptyIndex + 1 + chamcongjson?.length}`}
                  className='cursor-pointer'
                  onClick={() => {
                    setCurrentSelect({
                      x: 0,
                      y: emptyIndex + 1 + chamcongjson?.length
                    })
                  }}
                >
                  <button
                    type="button"
                    className={`focus:outline-none w-full h-full`}
                    style={{
                      boxShadow: `${(currentSelect?.x === 0 && currentSelect?.y === emptyIndex + 1 + chamcongjson?.length) ? 'inset 0px 0px 0px 2px orange' : ''}`
                    }}
                    onClick={() => {
                      setCurrentSelect({
                        x: 0,
                        y: emptyIndex + 1 + chamcongjson?.length
                      })
                    }}></button>
                </td>
                {renderChamCong(item, emptyIndex + chamcongjson?.length)}
              </tr>
            )
          })
        }
      </>
    }
  }

  const renderChamCong = (chamcong, rowIndex) => {
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
          key={columnIndex}
          id={`col${columnIndex + 1}_row${rowIndex}`}
          style={{
            boxShadow: `${(currentSelect?.x === columnIndex + 1 && currentSelect?.y === rowIndex + 1) ? 'inset 0px 0px 0px 2px orange' : ''}`
          }}
          onClick={() => {
            setCurrentSelect({
              x: columnIndex + 1,
              y: rowIndex + 1
            })
          }}
        >
          <button
            type="button"
            className='focus:outline-none'
          >

          </button>
        </td>
      )
    })
  }

  return (
    <table
      id='ChamCongTable'
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
  )
}
