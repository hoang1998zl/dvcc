import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { chamCongService } from '../../../../services/chamCongService';
import { localStorageService } from '../../../../services/localStorageService';

export default function NhatKyChinhSua() {
  let token = localStorageService.getItem("token");
  let [fDay,setFDay] = useState("01");
  let [fMonth,setFMonth] = useState(moment().format("MM"));
  let [fYear,setFYear] = useState(moment().format("YYYY"));
  let [lDay,setlDay] = useState(moment().endOf("months").format("DD"));
  let [lMonth,setLMonth] = useState(moment().format("MM"));
  let [lYear,setLYear] = useState(moment().format("YYYY"));
  let [logList,setLogList] = useState([]);
  let [cloneLogList,setCloneLogList] = useState([]);

  useEffect(() => {
    chamCongService.layLogBangCong(token,{
      ngay_bat_dau: fYear + "-" + fMonth + "-" + fDay,
      ngay_ket_thuc: lYear + "-" + lMonth + "-" + lDay
    }).then((res) => {
            setLogList(res.data?.content);
            setCloneLogList(res.data.content);
          })
          .catch((err) => {
           console.log(err);
          });
  },[fDay,fMonth,fYear,lDay,lMonth,lYear])
  let changeSearch = (value) => {
    let array = [];
    cloneLogList.map((clone) => {
      if(clone?.ns_nhanvien_bangluongchinh?.ns_nhanvien?.nv_name?.toLowerCase().includes(value.toLowerCase())){
        array.push(clone);
      }
    });
    setLogList(array);
  }
  let handleSort = (value,type) => {
    let array = [...logList];
    if(value === "nhanvien"){
      if(type === "az"){
        array = array.sort((a,b) => a?.ns_nhanvien_bangluongchinh?.ns_nhanvien?.nv_name > b?.ns_nhanvien_bangluongchinh?.ns_nhanvien?.nv_name ? 1 : -1)
      }else{
        array = array.sort((a,b) => a?.ns_nhanvien_bangluongchinh?.ns_nhanvien?.nv_name > b?.ns_nhanvien_bangluongchinh?.ns_nhanvien?.nv_name ? -1 : 1)
      }
    } else if(value === "thoigian"){
      if(type === "az"){
        array = array.sort((a,b) => a?.log_field > b?.log_field ? 1 : -1)
      }else{
        array = array.sort((a,b) => a?.log_field > b?.log_field ? -1 : 1)
      }
    } else if(value === "thoidiem"){
      if(type === "az"){
        array = array.sort((a,b) => a?.log_time > b?.log_time ? 1 : -1)
      }else{
        array = array.sort((a,b) => a?.log_time > b?.log_time ? -1 : 1)
      }
    }
    setLogList(array);
  }
  const renderDay = () => {
    const lstDay = []
    for (let i = 1; i <= 31; i++) {
      lstDay.push(i < 10 ? "0" + i : String(i));
    }
    return lstDay?.map((item) => {
      return (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      )
    })
  }
  const renderMonth = () => {
    const lstMonth = []
    for (let i = 1; i <= 12; i++) {
      lstMonth.push(i < 10 ? "0" + i : String(i));
    }
    return lstMonth?.map((item) => {
      return (
        <option
          key={item}
          value={String(item)}
        >
          {item}
        </option>
      )
    })
  }
  const renderYear = () => {
    const lstYear = []
    for (let i = 2023; i <= 2027; i++) {
      lstYear.push(i)
    }
    return lstYear?.map((item) => {
      return (
        <option
          key={item}
          value={String(item)}
        >
          {item}
        </option>
      )
    })
  }
  let renderLog = () => {
    return logList.map((log,index) => {
      return <tr className='addRow'>
      <td className='hidden md:table-cell text-center'>{index + 1}</td>
      <td className='text-left'>
        <p>{log?.ns_nhanvien_bangluongchinh?.ns_nhanvien?.nv_name}</p>
        {log?.log_field === "phep_dauthang" ? <p className='md:hidden'>Phép Tháng Trước</p>: <p className='md:hidden'>{log?.log_field.slice(1)}/{log?.ns_nhanvien_bangluongchinh?.fMonth}/{log?.ns_nhanvien_bangluongchinh?.fYear} </p>}
      </td>
      {log?.log_field === "phep_dauthang" ? <td className='hidden md:table-cell'>Phép Đầu Tháng</td> : 
      <td className='hidden md:table-cell'>{log?.log_field === "phep_dauthang" ? "Phép Tháng Trước" : log?.log_field.slice(1)}/{log?.ns_nhanvien_bangluongchinh?.fMonth}/{log?.ns_nhanvien_bangluongchinh?.fYear}</td>}
      <td>{log?.log_oldvalue == "null" ? "" : log?.log_oldvalue}</td>
      <td>{log?.log_newvalue == "null" ? "" : log?.log_newvalue}</td>
      <td className='hidden md:table-cell'><p className='line-clamp-3'>{log?.chu_thich}</p></td>
      {/* <td className='hidden md:table-cell'>emaildemo@gmail.com</td> */}
      <td className='hidden md:table-cell'>{moment(log?.log_time).format("HH:mm:ss DD/MM/YYYY")}</td>
    </tr>
    })
  }
  return (
    <div className='w-full p-2 lg:p-4 rounded-lg bg-white shadow-md'>
      <div className='w-full h-10 mb-2 px-2 lg:px-4 flex justify-center items-center gap-2 lg:gap-4 bg-orange-100 text-orange-400 rounded uppercase'>
        <h1 className='text-lg uppercase'>
          Nhật ký chỉnh sửa chấm công
        </h1>
      </div>
      <div className='w-full h-10 px-2 lg:px-4 flex items-center gap-2 lg:gap-4 bg-gray-100 rounded uppercase'>
        {/* <h1 className='w-max basis-[max-content] text-lg text-orange-400 uppercase'>
          Nhật ký sửa chấm công
        </h1> */}
        <div className='flex-1 flex items-center gap-10'>
          <div className='relative flex-1 md:max-w-[16rem] w-full'>
            <input
              type='text' onChange={(e) => changeSearch(e.target.value)}
              placeholder='Nhập tên nhân viên'
              className='min-w-0 w-full py-1 border pl-10 pr-4 bg-white rounded-full focus:outline-none'
            />
            <button
              type="button"
              className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600'
            >
              <i className='fa-solid fa-magnifying-glass'></i>
            </button>
          </div>
          <div className='hidden lg:flex items-center gap-2'>
            <div className='flex items-center gap-2'>
              <select value={fDay} onChange={(e) => setFDay(e.target.value)} className='w-16 min-w-0 py-1 px-2 bg-white rounded text-center focus:outline-none text-gray-600'>
                {renderDay()}
              </select>
              <select value={fMonth} onChange={(e) => setFMonth(e.target.value)} className='w-16 min-w-0 py-1 px-2 bg-white rounded text-center focus:outline-none text-gray-600'>
                {renderMonth()}
              </select>
              <select value={fYear} onChange={(e) => setFYear(e.target.value)} className='w-full lg:w-24 min-w-0 py-1 px-2 bg-white rounded text-center focus:outline-none text-gray-600'>
                {renderYear()}
              </select>
            </div>
            <p className='text-white'>-</p>
            <div className='flex items-center gap-2'>
              <select value={lDay} onChange={(e) => setlDay(e.target.value)} className='w-16 min-w-0 py-1 px-2 bg-white rounded text-center focus:outline-none text-gray-600' defaultValue={31}>
                {renderDay()}
              </select>
              <select value={lMonth} onChange={(e) => setLMonth(e.target.value)} className='w-16 min-w-0 py-1 px-2 bg-white rounded text-center focus:outline-none text-gray-600'>
                {renderMonth()}
              </select>
              <select value={lYear} onChange={(e) => setLYear(e.target.value)} className='w-full lg:w-24 min-w-0 py-1 px-2 bg-white rounded text-center focus:outline-none text-gray-600'>
                {renderYear()}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full overflow-x-auto mt-2'>
        <table className='customTable w-max min-w-full lg:w-full'>
          <thead>
            <th className='hidden md:table-cell'>
              Stt
            </th>
            <th className='text-left'>
              <div className='flex items-center'>
                <svg onClick={() => handleSort("nhanvien","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                  <p className='flex-1 mx-2'>tên <span className='hidden md:inline'>Nhân viên</span></p>
                <svg onClick={() => handleSort("nhanvien","za")}
                  stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>  
              </div>
            </th>
            <th className='hidden md:table-cell'>
              <div className='flex items-center'>
                <svg onClick={() => handleSort("thoigian","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                  <p className='flex-1 mx-2'>
                    Ngày
                  </p>
                <svg onClick={() => handleSort("thoigian","za")}
                  stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>  
              </div>
            </th>
            <th>trước</th>
            <th>sau</th>
            <th className='w-52 hidden md:table-cell'>Ghi chú</th>
            {/* <th className='hidden md:table-cell'>Người sửa</th> */}
            <th className='hidden md:table-cell'>
              <div className='flex items-center'>
                <svg onClick={() => handleSort("thoidiem","az")} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 16v3a2 2 0 0 1 -2 2h-1.5"></path></svg>
                  <p className='flex-1 mx-2'>
                    Thời điểm sửa
                  </p>
                <svg onClick={() => handleSort("thoidiem","za")}
                  stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path><path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2z"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 5v3a2 2 0 0 1 -2 2h-1.5"></path></svg>  
              </div>
            </th>
          </thead>
          <tbody>
            {renderLog()}
          </tbody>
        </table>
      </div >
    </div >
  )
}
