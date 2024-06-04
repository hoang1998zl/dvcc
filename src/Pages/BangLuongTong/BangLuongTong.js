import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment/moment';
import SelectPhongBan from "../../GlobalComp/SelectPhongBan";
import { setCurrentMenu, setCTLflag } from '../../Redux-toolkit/reducer/MenuSlice'

import icon_excel from '../../issets/img/icon/excel.png'
import icon_pdf from '../../issets/img/PDF-icon.png'
import { useReactToPrint } from 'react-to-print';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { macroLuongService } from '../../services/macroLuongService';
import { localStorageService } from '../../services/localStorageService';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import {  toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function BangLuongTong() {
  let token = localStorageService.getItem("token");
  let dispatch = useDispatch();
  let [year,setYear] = useState(moment().format('YYYY'));
  let [month,setMonth] = useState(moment().format("MM"));
  let [bangLuongList, setBangLuongList] = useState({});
  let sum = 0;
  let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);
  const componentRef = useRef();
  const bangLuongRef = useRef();
  let [isPrint, setIsPrint] = useState(false);
  let [nvIndex,setNVIndex] = useState(0);
  const [classify,setClassify] = useState([]);

  useEffect(() => {
    let data = {
      danhmuc_id,
      fMonth:month,
      fYear:year
    }
    macroLuongService.getBangLuong(token, data).then((res) => {
      console.log(res.data);
      setBangLuongList(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [month,year,danhmuc_id]);
  useEffect(()=>{
    let tmp = [];
    for(let i = 1;i<10;i++){
      tmp?.push([]);
    };
    bangLuongList?.columns?.map((item,index)=>{
      tmp[item.cot_type]?.push({index,cot_name:item.cot_name});
    });
    setClassify(tmp);
  },[bangLuongList]);
  const sortBangLuong = (type) => {
    let clone = {...bangLuongList};
    if(type=='asc'){
      clone.rows.sort((a, b) =>  a.nv_name.localeCompare(b.nv_name));
    } else {
      clone.rows.sort((a, b) =>  b.nv_name.localeCompare(a.nv_name));
    }
    setBangLuongList(clone);
  }
  const handlePrintBL = useReactToPrint({
    content: () => bangLuongRef.current,
  });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleSendEmail = async (index) => {
    let list = [];
    if(index>=0){
      list.push(index);
    } else {
      bangLuongList?.rows.map((item,ind)=>{
        list.push(ind);
      })
    }
    if(list.length>0){
      list.map((itm)=>{
        const nv_id = bangLuongList?.rows[itm]?.nv_id;
        const subject = 'Bảng lương tháng '+month+'/'+year;
        const componentHTML = renderToString(renderPayslip(itm));
        macroLuongService.sendBangLuongToEmail(token, {nv_id,subject,componentHTML}).then((res) => {
          if(list.length===1){
            if(res.data.processStatus==nv_id){
              toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
              });
            } else {
              toast.error(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
              });
            }
          }
        }).catch((err) => {
          console.log(err);
        });
      })
    }
    if(!(index>=0)){
      toast.success('Đã gửi đến email toàn bộ nhân viên!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000
      });
    }
  }
  const renderPayslip = (index) => {
    return(classify.length>0 && bangLuongList?.rows?.length>0?
      <>
        <div style={{width:'98%'}}>
          <div style={{width: '100%',clear: 'both',marginBottom: '10px'}}>
            <div style={{width: '100%'}}>
              <p
                style={{width:'100%',textTransform: 'uppercase',fontWeight: 'bold',fontSize: '18px',margin: '10px 0',textAlign: 'center'}}>
                <span>phiếu lương</span>
              </p>
              <div style={{width: '100%',border: '1px solid #38bdf8',fontSize: '12px'}}>
                <p style={{margin:'4px',textAlign: 'left'}}>
                  <span>
                    Tên NV
                  </span>
                  <b style={{float:'right'}}>
                    {bangLuongList?.rows[index]?.nv_name}
                  </b>
                </p>
                <p style={{margin:'4px',textAlign: 'left'}}>
                  <span>
                    Mã NV:
                  </span>
                  <b style={{float:'right'}}>
                    {bangLuongList?.rows[index]?.nv_order}
                  </b>
                </p>
                <p style={{margin:'4px',textAlign: 'left'}}>
                  <span>Chức vụ</span>
                  <b style={{float:'right'}}>
                    {bangLuongList?.rows[index]?.nv_chucvunew}
                  </b>
                </p>
              </div>
            </div>
            <div style={{width: '100%'}}>
              <p
                style={{width:'100%',textTransform: 'uppercase',fontWeight: 'bold',fontSize: '18px',margin: '10px 0',textAlign: 'center',color: 'red',}}>
              </p>
              <div style={{width: '100%',border: '1px solid #38bdf8',fontSize: '12px',clear:'both',}}>
                <p style={{margin:'4px',textAlign: 'left'}}>
                  <span>
                    Kỳ lương
                  </span>
                  <span style={{float:'right'}}>
                    {month}/{year}
                  </span>
                </p>
                <p style={{margin:'4px',textAlign: 'left'}}>
                  <span>
                    Ngày thanh toán
                  </span>
                  <span style={{float:'right'}}>
                    {moment().format('DD-MM-YYYY')}
                  </span>
                </p>
                {classify[9]?.map((item)=>{
                  return(
                    <p style={{margin:'4px'}}>
                      <span>
                        {item.cot_name}
                      </span>
                      <span style={{float:'right'}}>
                        {bangLuongList?.rows[index]?.result[item.index]}
                      </span>
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{width:'100%',clear: 'both',marginBottom: '10px',}}>
            <div style={{width:'100%',border:'1px solid #000',marginBottom: '10px',}}>
              <div style={{width: '100%',color: '#fff',backgroundColor: '#38bdf8',}}>
                <b style={{fontSize: '12px',padding: '6px 4px',display:'block',textAlign: 'left'}}>
                  <span>
                    Các khoản thu nhập
                  </span>
                  <span style={{float:'right'}}>
                    (VNĐ)
                  </span>
                </b>
              </div>
              <div style={{clear: 'both',}}>
                {classify[1]?.map((item)=>{
                  return(
                    <div style={{fontSize: '12px',padding: '4px',clear: 'both',textAlign: 'left'}}>
                      <span>
                        {item.cot_name}
                      </span>
                      <span style={{float:'right'}}>
                        {new Intl.NumberFormat('EN-US').format(bangLuongList?.rows[index]?.result[item.index])}
                      </span>
                    </div>
                  );
                })}
                {classify[2]?.map((item)=>{
                  return(
                    <div style={{fontSize: '12px',padding: '4px',clear: 'both',textAlign: 'left'}}>
                      <span>
                        {item.cot_name}
                      </span>
                      <span style={{float:'right'}}>
                        {new Intl.NumberFormat('EN-US').format(bangLuongList?.rows[index]?.result[item.index])}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{width: '100%',color: '#000',backgroundColor: '#ccc',}}>
                {classify[5]?.map((item)=>{
                  return(
                    <b style={{fontSize: '12px',padding: '4px',clear: 'both',display:'block',textAlign: 'left'}}>
                      <span>
                          {item.cot_name}
                      </span>
                      <span style={{float:'right'}}>
                        {new Intl.NumberFormat('EN-US').format(bangLuongList?.rows[index]?.result[item.index])}
                      </span>
                    </b>
                  );
                })}
              </div>
            </div>
            <div style={{width:'100%',border:'1px solid #000',clear: 'both',marginBottom: '10px',}}>
              <div style={{width: '100%',color: '#fff',backgroundColor: '#38bdf8',}}>
                <b style={{fontSize: '12px',padding: '6px 4px',display:'block',textAlign: 'left'}}>
                  <span>
                    Các khoản khấu trừ
                  </span>
                  <span style={{float:'right'}}>
                    (VNĐ)
                  </span>
                </b>
              </div>
              {classify[3]?.map((item)=>{
                return(
                  <div style={{fontSize: '12px',margin: '4px',clear: 'both',textAlign: 'left'}}>
                    <span>
                        {item.cot_name}
                    </span>
                    <span style={{float:'right'}}>
                      {new Intl.NumberFormat('EN-US').format(bangLuongList?.rows[index]?.result[item.index])}
                    </span>
                  </div>
                );
              })}
              {classify[6]?.map((item)=>{
                return(
                  <div style={{width: '100%',color: '#000',backgroundColor: '#ccc',}}>
                    <b style={{fontSize: '12px',padding: '4px',clear: 'both',display:'block',textAlign: 'left'}}>
                      <span>
                          {item.cot_name}
                      </span>
                      <span style={{float:'right'}}>
                        {new Intl.NumberFormat('EN-US').format(bangLuongList?.rows[index]?.result[item.index])}
                      </span>
                    </b>
                  </div>
                );
              })}
            </div>
            <div style={{width: '100%',color: '#fff',backgroundColor: '#38bdf8',border: '1px solid #000',marginBottom: '10px',}}>
              <b style={{fontSize: '12px',padding: '4px',clear: 'both',display:'block',textAlign: 'left'}}>
                <span>
                  Lương thực lãnh
                </span>
                <span style={{float:'right'}}>
                  {new Intl.NumberFormat('EN-US').format(bangLuongList?.rows[index]?.result[bangLuongList?.rows[index]?.result.length-1])}
                </span>
              </b>
            </div>
          </div>
          <div style={{width:'100%',clear: 'both',marginBottom: '10px',}}>
            <table style={{width: '100%',border: '1px solid #000',fontSize: '12px',}} cellspacing="0">
              <thead style={{width: '100%',color: '#fff',backgroundColor: '#38bdf8',fontStyle: 'italic',}}>
                <th style={{borderBottom: '1px solid #000',padding: '4px',textAlign: 'left',}}>
                  Thông tin liên quan khác
                </th>
                <th style={{borderBottom: '1px solid #000',padding: '4px',textAlign: 'right',}}>
                  (VNĐ)
                </th>
              </thead>
              <tbody>
                {classify[4]?.map((item)=>{
                  return(
                    <tr>
                      <td style={{padding: '4px',textAlign: 'left',}}>
                        {item.cot_name}
                      </td>
                      <td style={{padding: '4px',textAlign: 'right',}}>
                        {new Intl.NumberFormat('EN-US').format(bangLuongList?.rows[index]?.result[item.index])}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>:''
    )
  }
  let renderBangLuongTong = () => {
    return (
      <div id='bangLuongTong'>
        <div className="w-full mb-4 flex justify-between items-center gap-x-2 border border-orange-400 bg-white px-4 py-2 rounded-lg shadow-md">
          <div className="flex justify-between items-center gap-x-2">
            <p className="font-semibold">Tháng-năm:</p>
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
            <div className="w-full lg:w-60">
              <SelectPhongBan />
            </div>
          </div>
        </div>
        <div className='w-full grid grid-cols-1 gap-4'>
          <div className='w-full bg-white px-4 py-4 rounded-lg shadow-md'>
            <div className='w-full flex justify-end items-center mb-[-1.5rem]'>
              <div className='flex items-center gap-x-2'>
                <button
                  type="button"
                  className='w-7 h-7 rounded bg-white text-base text-sky-400 outline outline-1 outline-sky-400 hover:text-white hover:bg-sky-400 cursor-pointer'
                  onClick={()=> {
                    dispatch(setCTLflag(true));
                    dispatch(setCurrentMenu(7));
                  }}
                >
                  <i className='fa-regular fa-pen-to-square'></i>
                </button>
                <DownloadTableExcel
                  filename={`Bảng lương tháng ${month+'.'+year} - ${bangLuongList?.namePB ? bangLuongList?.namePB : ''}`}
                  sheet="1"
                  currentTableRef={bangLuongRef.current}
                >
                  <button
                    type="button"
                    className='w-7 h-7 rounded bg-white p-1'
                  >
                    <img className='w-full' src={icon_excel} alt="" />
                  </button>
                </DownloadTableExcel>
                
                <button
                  type="button"
                  className='w-7 h-7 rounded bg-white p-1'
                  onClick={()=>{handlePrintBL()}}
                >
                  <img className='h-full' src={icon_pdf} alt="" />
                </button>
              </div>
            </div>
            <div ref={bangLuongRef}>
              <div className='mb-2'>
                <h1 className='flex-1 text-left text-orange-400 font-semibold text-lg uppercase'>
                  <span className='ms-4 underline'>
                    {bangLuongList?.namePB}
                  </span>
                </h1>
              </div>
              <div className='bangLuongTab w-full overflow-y-auto rounded'>
                <table className='w-max min-w-full customTable'>
                  <thead className='leading-8'>
                    <th className='w-16'>
                      STT
                    </th>
                    <th className='px-2'>
                      <div className='flex items-center'>
                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-left text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"
                          onClick={()=>sortBangLuong('asc')}
                        ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 21h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                        <p className='flex-1'>
                          Tên nhân viên
                        </p>
                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="hover:text-orange-500 float-right text-xl cursor-pointer active:text-sky-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"
                        onClick={()=>sortBangLuong('desc')}
                        ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4"></path><path d="M19 10h-4l4 -7h-4"></path><path d="M4 15l3 3l3 -3"></path><path d="M7 6v12"></path></svg>
                      </div>
                    </th>
                    {bangLuongList?.columns?.map((cot)=>{
                      return <th>{cot.cot_name}</th>
                    })}
                    <th>Thực Lãnh</th>
                    <th className='w-16'>In</th>
                    <th className='w-16'>Gửi email</th>
                  </thead>
                  <tbody>
                    {bangLuongList?.rows?.map((row,index)=>{
                      return <tr>
                        <td>{index+1}</td>
                        <td className='text-left'><p className='px-2'>{row.nv_name}</p></td>
                        {row.result?.length>0 ? row.result?.map((value,idx)=>{
                          if(idx==row.result?.length-1 && row.result?.length!=bangLuongList?.columns.length){
                            sum += Number(value);
                          };
                          return <td>{new Intl.NumberFormat('EN-US').format(value)}</td>
                        }) : <td className='abc1'>0</td>}
                        {(row.result?.length==bangLuongList?.columns.length && row.result?.length != 0?<td className='abc'>0</td>:'')}
                        <td><button type="button" onClick={() => { setNVIndex(index);setIsPrint(true); }}><i className='fa-solid fa-print text-base text-red-600'></i></button></td>
                        <td><button type="button" onClick={() => { handleSendEmail(index); }}><i className='fa-solid fa-envelope text-base text-red-600'></i></button></td>
                      </tr>
                    })}
                    <tr className='text-lg'>
                      <td colSpan={bangLuongList?.columns?.length+2} className='font-bold text-orange-400 uppercase'>Tổng cộng:</td>
                      <td className='font-bold'>
                        {new Intl.NumberFormat('EN-US').format(sum)}
                      </td>
                      <td colSpan={2}>
                      <button title='Gửi email cho toàn bộ nhân viên' type="button" onClick={() => { handleSendEmail(); }}><i className='fa-solid fa-envelope text-base text-red-600'></i></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id='taoBangLuong' className='w-full p-4'>
      {renderBangLuongTong()}
      <div className='relative' style={{ display: isPrint?'block':'none'}}>
        <div className='w-screen h-screen bg-black bg-opacity-30 fixed top-0 left-0 z-[60] cursor-pointer' onClick={() => { setIsPrint(false) }}>
        </div>
        <div className={`${isPrint == true ? "w-full md:w-1/2 lg:w-1/3" : 'w-0'} fixed top-0 bottom-0 right-0 z-[100] bg-white shadow-lg`} style={{ transition: 'all 1s ease-in' }}>
          <button type="button" className='w-8 h-8 absolute top-4 right-[calc(100%-1rem)] translate-x-full border bg-white rounded-full z-[100]'>
            <i className='fa-solid fa-xmark text-2xl text-red-500 cursor-pointer' onClick={() => { setIsPrint(false) }}></i>
          </button>
          <div className='relative mx-auto px-4'>
            <div className='w-full text-right'>
              <button type="button"
                className='bg-green-400 text-white rounded px-5 py-1 my-4 text-base cursor-pointer'
                onClick={() => {
                  handlePrint()
                  setIsPrint(false)
                }}
              >
                In
              </button>
            </div>
            <div ref={componentRef}>
              {renderPayslip(nvIndex)}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div >
  )
}
