import { Tooltip } from "antd";
import React from "react";
import '../../../../issets/css/tooltip.css'

export default function BangCongGuide() {

  const guildTable = [
    {
      title: 'Đi làm',
      value: "1",
    },
    {
      title: 'Nghỉ lễ',
      value: "L",
    },
    {
      title: "Nghỉ có phép",
      value: "P",
    },
    {
      title: "Làm buổi sáng_chiều nghỉ có phép",
      value: "0.5_0.5P",
    },
    {
      title: "Sáng nghỉ có phép_chiều đi làm",
      value: "0.5P_0.5",
    },
    {
      title: "Nghỉ không phép",
      value: "K",
    },
    {
      title: "Sáng nghỉ có phép_Chiều nghỉ không phép",
      value: "0.5P_0.5K",
    },
    {
      title: "Sáng nghỉ không phép_Chiều nghỉ có phép",
      value: "0.5K_0.5P",
    },
    {
      title: "Sáng nghỉ không phép_Chiều đi làm",
      value: "0.5K_0.5",
    },
    {
      title: "Sáng đi làm_Chiều nghỉ không phép",
      value: "0.5_0.5K",
    }
  ]

  return (
    // <Tooltip
    //   title={content}
    //   placement="bottomRight"
    //   className="shadow"
    //   trigger={"hover"}
    //   color="white"
    //   mouseLeaveDelay={0.3}
    //   overlayStyle={{
    //     maxWidth: "unset",
    //   }}
    //   overlayInnerStyle={{
    //     padding: "0",
    //   }}
    //   overlayClassName='custom-tooltip'
    // >
    //   <button
    //     type="button"
    //     className="w-full px-4 py-1 text-left focus:outline-none hover:bg-slate-100 rounded"
    //   >
    //     Quy ước tăng ca
    //   </button>
    // </Tooltip>
    <div className="w-full">
      <h1
        className="text-center bg-orange-400 font-bold py-1 uppercase text-white text-lg rounded-t-lg"
      >
        Bảng quy ước
      </h1>
      <div
        className="text-black grid"
        style={{
          gridTemplateColumns: "repeat(3, auto)",
        }}
      >
        {guildTable.map((item, index) => (
          <div
            key={index}
            className="w-full flex"
          >
            <p
              className="w-full text-left border border-orange-400 bg-sky-100 px-1 py-1.5"
            >
              {item?.title}
            </p>
            <p
              className={`text-center border border-orange-400 bg-white px-1 py-1.5 ${index % 3 == 0 ? 'w-12' : index % 3 == 1 ? 'w-12' : 'w-24'}`}
            >
              {item?.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}