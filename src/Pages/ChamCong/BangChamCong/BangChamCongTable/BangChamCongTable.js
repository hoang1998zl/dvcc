import moment from 'moment';
import React, { useLayoutEffect, useState } from 'react'

import chamcongjson from '../../../../issets/json/ChamCong.json'

export default function BangChamCongTable() {

  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(3);
  const [year, setYear] = useState(2024);

  const [currentSelect, setCurrentSelect] = useState({
    x: 0,
    y: 0
  });

  useLayoutEffect(() => {
    setDay(moment(year + "-" + month).daysInMonth());
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

    return array.map((item) => {
      let date = moment(year + "-" + month + "-" + item).format('ddd');

      if (date == "Sun" || date == "CN") {
        return (
          <td className={``}>
            <p className='underline'>{item}</p>
            <p>CN</p>
          </td>
        )
      } else if (date == "Sat" || date == "T7") {
        return (
          <td className={``}>
            <p className='underline'>{item}</p>
            <p>T7</p>
          </td>
        )
      }
      if (date == "Mon" || date == "T2") {
        return (
          <td className={``}>
            <p className='underline'>{item}</p>
            <p>T2</p>
          </td>
        )
      } if (date == "Tue" || date == "T3") {
        return (
          <td className={``}>
            <p className='underline'>{item}</p>
            <p>T3</p>
          </td>
        )
      } if (date == "Wed" || date == "T4") {
        return (
          <td className={``}>
            <p className='underline'>{item}</p>
            <p>T4</p>
          </td>
        )
      } if (date == "Thu" || date == "T5") {
        return (
          <td className={``}>
            <p className='underline'>{item}</p>
            <p>T5</p>
          </td>
        )
      } else if (date == "Fri" || date == "T6") {
        return (
          <td className={``}>
            <p className='underline'>{item}</p>
            <p>T6</p>
          </td>
        )
      }
    })
  };

  const renderTable = () => {
    return chamcongjson?.map((item, rowIndex) => {
      return (
        <tr
          key={rowIndex}
          className={`${currentSelect.y == (rowIndex + 1) && 'bg-sky-50 currentSelectedRow'}`}
        >
          <td
            id={`col0_row${rowIndex + 1}`}
            className={`cursor-pointer`}
            style={{
              outlineColor: (currentSelect.y == (rowIndex + 1) && currentSelect.x == 0) && '#000'
            }}
            onClick={() => {
              setCurrentSelect({
                x: 0,
                y: rowIndex + 1
              });
            }}
          >
            <button
              type="button"
              className='w-full h-full focus:outline-none'
              onKeyDown={(e) => {
                if (e.key == "ArrowUp") {
                  setCurrentSelect({
                    x: 0,
                    y: currentSelect.y <= 0 ? 0 : currentSelect.y - 1
                  });
                } else if (e.key == "ArrowDown") {
                  setCurrentSelect({
                    x: 0,
                    y: (currentSelect.y >= chamcongjson.length) ? currentSelect.y : currentSelect.y + 1
                  });
                }
              }}
            >
              {item?.nv_name}
            </button>
          </td>
        </tr >
      )
    })
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
