import React, { useState } from "react";
import LuongChinh from "../../BangLuongTong/LuongChinh/LuongChinh";
import moment from "moment";
import SelectPhongBan from "../../../GlobalComp/SelectPhongBan";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function BangNhapLieu() {
  let [year,setYear] = useState(moment().format('YYYY'));
  let [month,setMonth] = useState(moment().format("MM"));

  return (
    <div id='bangLuongTong'>
      <div className='w-full '>
        <div className='bg-white p-2 rounded-lg'>
          <div className="w-full flex justify-start items-center gap-x-2">
            <div className="w-full lg:w-60">
              <SelectPhongBan />
            </div>
            <p className="font-semibold">Tháng - Năm:</p>
            <DatePicker
              picker='month'
              value={dayjs(year+'-'+month)}
              format="MM-YYYY"
              onChange={(date, dateString) => {
                if(dateString){
                  setYear(moment(dateString, 'MM-YYYY').format('YYYY'));
                  setMonth(moment(dateString, 'MM-YYYY').format('MM'));
                } else {
                  setYear(moment().format('YYYY'));
                  setMonth(moment().format('MM'))
                }
              }}
            />
          </div>
          <div className='bangLuongTab'>
            <LuongChinh fMonth={month} fYear={year} ></LuongChinh>
          </div>
          <p className="italic text-left mt-4">
            <strong className="underline">Ghi chú:</strong> <br />
            Bảng nhập liệu của tháng hiện hành sẽ học từ tháng gần nhất
          </p>
        </div>
      </div>
    </div>
  )
}