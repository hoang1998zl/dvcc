import React, { useEffect, useState } from 'react';
import { DatePicker, Modal, Popconfirm, Select } from 'antd';
import moment from 'moment/moment';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';
import { localStorageService } from '../../../services/localStorageService';
import '../../../issets/css/customTable.css'
import { macroLuongService } from '../../../services/macroLuongService';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

export default function CongThucLuong() {
  let token = localStorageService.getItem("token");
  let [httlList, setHttlList] = useState([]);
  let [cotList, setCotList] = useState([]);
  let [danhmucIndex, setDanhmucIndex] = useState(0);
  let [editedValue, setEditedValue] = useState({index:-1, value:'1'});
  let [isEditing, setIsEditing] = useState(false);
  let [reload, setReload] = useState(0);
  let [year,setYear] = useState(moment().format('YYYY'));
  let [month, setMonth] = useState(moment().format("MM"));
  let [newHTTL, setNewHTTL] = useState({});
  let [httlDanhMucTarget, setHttlDanhMucTarget] = useState(0);
  let [httlDanhMucTargetName, setHttlDanhMucTargetName] = useState('');
  let [httlYearTarget, setHttlYearTarget] = useState(moment().format('YYYY'));
  let [httlMonthTarget, setHttlMonthTarget] = useState(moment().format('MM'));
  let [httlMonthYearTarget, setHttlMonthYearTarget] = useState(moment().format('MM-YYYY'));
  let reloadPage = useSelector(state => state.MacroLuongSlice.reloadPage);

  //Cũ
  const [open, setOpen] = useState(false);
  const [showThuTuCotContent, setShowThuTuCotContent] = useState(null);
  //
  useEffect(() => {
    setEditedValue({index:-1, value:''});
    setIsEditing(false);
    macroLuongService.getCot(token).then((res) => {
      setCotList(res.data.data);
      })
      .catch((err) => {
          console.log(err);
      });
    let data = {
      fMonth: month,
      fYear: year
    }
    macroLuongService.getHTTL(token, data).then((res) => {
      setHttlList(res.data.data);
      setHttlDanhMucTarget(res.data.data[0].danhmuc_id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reload,reloadPage,month,year]);
  useEffect(()=>{
    if(cotList[0]&&(!(newHTTL?.danhmuc_id) || newHTTL.danhmuc_id<=0)){
      resetNewHTTL();
    }
  }, [cotList,reloadPage]);
  useEffect(()=>{
    let clone = {...newHTTL};
    clone.fMonth = month;
    clone.fYear = year;
    setNewHTTL(clone);
  }, [month,year]);
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setOpen(false);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode == 13) {
        e.target.blur();
    }
  };
  let resetNewHTTL = () => {
    setNewHTTL({
      danhmuc_id: 0,
      fMonth: month,
      fYear: year,
      data:{
        cot_id: cotList[0].cot_id,
        httl_type: 2,
        httl_thutuhienthi: 1,
        httl_heso: 1,
        httl_id: 0,
        status: 1
      }
    });
  }
  let setValueNewHTTL = (danhmuc_id,httl_thutuhienthi,httl_type=null) => {
    let clone = {...newHTTL};
    clone.danhmuc_id = danhmuc_id;
    if(httl_type && clone?.data?.httl_type){
      clone.data.httl_type = httl_type;
    }
    if(clone?.data?.httl_thutuhienthi){
      clone.data.httl_thutuhienthi = httl_thutuhienthi;
    }
    setNewHTTL(clone);
  }
  const handleDeleleHTTL = async(httl_id, type) => {
    let data;
    if(type==1){
      data = [...httlList[danhmucIndex].ns_bangluong_hienthi_tinhluong[0]];
    } else {
      data = [...httlList[danhmucIndex].ns_bangluong_hienthi_tinhluong[1]];
    }
    let newData = data.filter((item) => item.httl_id !== httl_id);
    newData = newData.map((item,index)=>{
      item.httl_thutuhienthi = index+1;
      return item;
    });
    let sentData = {
      danhmuc_id: httlList[danhmucIndex].danhmuc_id,
      fMonth: month,
      fYear: year,
      httl_type: type,
      data: newData
    }
    await macroLuongService.upsertHTTL(token, sentData).then((res) => {
      if(!res.data.updatedData?.status){
        let mes = 'Bỏ cột ' + (showThuTuCotContent == 1?'hiển thị':'tính lương') + ' thành công';
        toast.success(mes, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000
        });
      } else {
        toast.error(res.data.updatedData.content, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
      }
    })
    .catch((err) => {
        console.log(err);
    });
    setReload(Date.now());
  }
  const handleCreateHTTL = async() => {
    let clone = {...newHTTL};
    if(clone.data.httl_heso){
      clone.data.httl_heso = Number(clone.data.httl_heso);
    }
    await macroLuongService.addHTTL(token,clone).then((res) => {
      if(!res.data.newData?.status){
        let mes = 'Thêm cột ' + (showThuTuCotContent == 1?'hiển thị':'tính lương') + ' thành công';
        toast.success(mes, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000
        });
      } else {
        toast.error(res.data.newData.content, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
    setReload(Date.now());
  }
  const handleUpdateHTTL = async(index, type, value, field) => {
    let data;
    if(type==1){
      data = [...httlList[danhmucIndex].ns_bangluong_hienthi_tinhluong[0]];
    } else {
      data = [...httlList[danhmucIndex].ns_bangluong_hienthi_tinhluong[1]];
    }
    if(field=='httl_heso' && data[index][field] == value){
      setIsEditing(false);
      return;
    }
    data[index][field] = value;
    let sentData = {
      danhmuc_id: httlList[danhmucIndex].danhmuc_id,
      fMonth: month,
      fYear: year,
      httl_type: type,
      data: data
    }
    await macroLuongService.upsertHTTL(token, sentData).then((res) => {
      if(!res.data.updatedData?.status){
        let mes = 'Cập nhật cột ' + (showThuTuCotContent == 1?'hiển thị':'tính lương') + ' thành công';
        toast.success(mes, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000
        });
      } else {
        toast.error(res.data.updatedData.content, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
      }
    })
    .catch((err) => {
        console.log(err);
    });
    setReload(Date.now());
  }  
  const handleCopyHTTL = async() => {
    let data = {
      target_id: httlDanhMucTarget,
      danhmuc_id: newHTTL.danhmuc_id,
      fMonth: httlMonthTarget,
      fYear: httlYearTarget,
      httl_type: showThuTuCotContent
    };
    await macroLuongService.copyHTTL(token,data).then((res) => {
      if(!res.data.newData?.status){
        let mes = 'Sao chép cột ' + (showThuTuCotContent == 1?'hiển thị':'tính lương') + ' của phòng ' + httlDanhMucTargetName + ' tháng ' + httlMonthYearTarget + ' thành công';
        toast.success(mes, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000
        });
      } else {
        toast.error(res.data.newData.content, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
    setReload(Date.now());
  }

  let renderMucLuong = () => {
    return httlList?.map((item, index) => {
      return <tr>
        <td width={"30%"} className='text-left px-2'>{item?.danhmuc_name}</td>
        <td 
          className='cursor-pointer'
          onClick={() => {
            if(item){
              setValueNewHTTL(item.danhmuc_id,item.ns_bangluong_hienthi_tinhluong[0]?.length+1,1);
              setDanhmucIndex(index);
            }
            showModal(true);
            setShowThuTuCotContent(1);
          }}
        >
          <p 
            className='w-full min-w-0 px-2 py-1 text-left'>
            {
              item.ns_bangluong_hienthi_tinhluong[0]?.map((itm,idx) => itm.ns_bangluong_cot.cot_name+(idx+1<item.ns_bangluong_hienthi_tinhluong[0].length?" => ":""))
            }
          </p>
        </td>
        <td
          className='cursor-pointer'
          onClick={() => {
            if(item){
              setValueNewHTTL(item.danhmuc_id,item.ns_bangluong_hienthi_tinhluong[1]?.length+1,2);
              setDanhmucIndex(index);
            }
            showModal(true);
            setShowThuTuCotContent(2);
          }}
        >
          <p
            className='w-full min-w-0 px-2 py-1 text-left'
          >
            {
              item.ns_bangluong_hienthi_tinhluong[1]?.map((itm,idx) => (itm.httl_type==3?" - ":(itm.httl_type==2&&idx>0?" + ":""))+(itm.httl_heso==1?itm.ns_bangluong_cot.cot_name:(itm.httl_heso+' x ('+itm.ns_bangluong_cot.cot_name+')')))
            }
          </p>
        </td>
      </tr>
    })
  }

  return (
    <div id='taoCongThuc' className='p-4 bg-white rounded-lg shadow-md'>
      <div className="w-full flex justify-end items-center gap-x-2 mb-2">
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
      <div className='w-full mx-auto'>
        <h2 className='font-bold text-lg uppercase mb-2 text-orange-400'>Cấu trúc hiển thị và công thức tính lương của phòng ban</h2>
        <div className='w-full overflow-x-auto'>
          <table className='customTable text-center'>
            <thead className='leading-8'>
              <th className='px-2 text-left'>Phòng Ban</th>
              <th className='px-2 text-left'>Thứ tự các cột hiển thị trong lương</th>
              <th className='px-2 text-left'>Công thức tính cột "THỰC LÃNH"</th>
            </thead>
            <tbody>
              {renderMucLuong()}
            </tbody>
          </table>
        </div>
        <p className="italic text-left mt-4">
          <strong className="underline">Ghi chú:</strong> <br />
          Bảng cấu trúc của tháng hiện hành sẽ học từ tháng gần nhất
        </p>
      </div>
      <Modal
        open={open}
        onCancel={handleCancel}
        title={showThuTuCotContent == 1 ? <p className='text-lg pe-4'>Thứ tự cột hiển thị trong bảng lương</p> : <p className='text-lg pe-4'>Cột thực lãnh được tính theo tổng của các cột dưới đây</p>}
        footer={[]}
        width={600}
      >
        {
          showThuTuCotContent == 1 ?
            <>
              <table className='customTable w-full text-center'>
                <thead className='leading-8'>
                  <th className='px-2'>
                    STT
                  </th>
                  <th>Xóa</th>
                  <th className='px-2'>Tên Cột</th>
                </thead>
                <tbody>
                  {httlList[danhmucIndex].ns_bangluong_hienthi_tinhluong[0].map((item,index)=>{
                    return(
                    <tr>
                      <td>{index+1}</td>
                      <td>
                        <Popconfirm
                          title="Xác nhận bỏ hiển thị cột này trong bảng lương?"
                          okText="Xác nhận"
                          cancelText="Huỷ"
                          onConfirm={() => {
                            handleDeleleHTTL(item?.httl_id, item?.httl_type);
                          }}
                        >
                          <button type="button" className="px-1 rounded bg-orange-400 text-white cursor-pointer">
                          <i className='fa-solid fa-trash-alt'></i>
                          </button>
                        </Popconfirm>
                      </td>
                      <td>
                        <Select
                          className='w-full'
                          value={item.cot_id}
                          options={
                            cotList?.map((itm)=>{
                              return {value:itm.cot_id, label:itm.cot_name}
                            })
                          } 
                          onChange={(value)=>{
                            handleUpdateHTTL(index, item?.httl_type,value,'cot_id');
                          }}
                        />
                      </td>
                    </tr>
                    )
                  })}
                  <tr>
                    <td>
                      <button
                            type='button'
                            className={`text-sky-400 cursor-pointer`}
                            onClick={handleCreateHTTL}
                        >
                            <SaveIcon></SaveIcon>
                        </button>
                    </td>
                    <td></td>
                    <td>
                      <Select
                        className='w-full'
                        value={newHTTL.data?.cot_id?newHTTL.data?.cot_id:cotList[0]?.cot_id}
                        options={
                          cotList?.map((itm)=>{
                            return {value:itm.cot_id, label:itm.cot_name}
                          })
                        } 
                        onChange={(value)=>{
                          let clone = {...newHTTL};
                          clone.data.cot_id = value;
                          setNewHTTL(clone);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
            : showThuTuCotContent == 2 ?
            <>
              <table className='customTable w-full text-center'>
                <thead className='leading-8'>
                  <th className='px-2'>
                    STT
                  </th>
                  <th>Xóa</th>
                  <th className='px-2'>Cộng/Trừ</th>
                  <th className='px-2'>Hệ số</th>
                  <th className='px-2'>Tên Cột</th>
                </thead>
                <tbody>
                  {httlList[danhmucIndex].ns_bangluong_hienthi_tinhluong[1].map((item,index)=>{
                    return(
                    <tr>
                      <td>{index+1}</td>
                      <td>
                        <Popconfirm
                          title="Xác nhận không tính cột này vào thực lãnh?"
                          okText="Xác nhận"
                          cancelText="Huỷ"
                          onConfirm={() => {
                            handleDeleleHTTL(item?.httl_id, item?.httl_type);
                          }}
                        >
                          <button type="button" className="px-1 rounded bg-orange-400 text-white cursor-pointer">
                          <i className='fa-solid fa-trash-alt'></i>
                          </button>
                        </Popconfirm>
                      </td>
                      <td>
                        <Select
                          className='w-full'
                          value={item?.httl_type}
                          options={[{value:2, label:"+"},{value:3, label:"-"}]
                          } 
                          onChange={(value)=>{
                            handleUpdateHTTL(index, item?.httl_type,value,'httl_type');
                          }}
                        />
                      </td>
                      <td>
                        <input className='text-center' value={editedValue.index==index?editedValue.value:item.httl_heso} 
                          disabled={isEditing&&editedValue.index!=index}
                          onClick={()=>{
                            setIsEditing(true)
                            let clone = {...editedValue};
                            clone.index = index;
                            clone.value = String(item.httl_heso);
                            setEditedValue(clone);
                          }}
                          onChange={(e)=>{
                            let clone = {...editedValue};
                            clone.value = e.target.value;
                            setEditedValue(clone);
                          }}
                          onKeyDown={(e) => handleKeyDown(e)}
                          onBlur={()=>{handleUpdateHTTL(index, item?.httl_type,Number(editedValue.value),'httl_heso');}}
                        />
                      </td>
                      <td>
                        <Select
                          className='w-full'
                          value={item?.cot_id}
                          options={
                            cotList?.map((itm)=>{
                              return {value:itm.cot_id, label:itm.cot_name}
                            })
                          }
                          onChange={(value)=>{
                            handleUpdateHTTL(index, item?.httl_type,value,'cot_id');
                          }}
                        />
                      </td>
                    </tr>
                    )
                  })}
                  <tr>
                    <td>
                      <button
                            type='button'
                            className={`text-sky-400 cursor-pointer`}
                            onClick={handleCreateHTTL}
                        >
                            <SaveIcon></SaveIcon>
                        </button>
                    </td>
                    <td></td>
                    <td>
                      <Select
                        className='w-full'
                        value={newHTTL?.data?.httl_type}
                        options={[{value:2, label:"+"},{value:3, label:"-"}]
                        } 
                        onChange={(value)=>{
                          let clone = {...newHTTL};
                          clone.data.httl_type = value;
                          setNewHTTL(clone);
                        }}
                      />
                    </td>
                    <td>
                      <input className='text-center' value={newHTTL?.data?.httl_heso} disabled={isEditing&&editedValue.index!=-1} 
                        onClick={()=>{setIsEditing(true)}}
                        onChange={(e)=>{
                          let clone = {...newHTTL};
                          clone.data.httl_heso = e.target.value;
                          setNewHTTL(clone);
                        }}
                      />
                    </td>
                    <td>
                      <Select
                        className='w-full'
                        value={newHTTL.data?.cot_id?newHTTL.data?.cot_id:cotList[0]?.cot_id}
                        options={
                          cotList?.map((itm)=>{
                            return {value:itm.cot_id, label:itm.cot_name}
                          })
                        } 
                        onChange={(value)=>{
                          let clone = {...newHTTL};
                          clone.data.cot_id = value;
                          setNewHTTL(clone);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
              : <></>
        }
        {httlList[danhmucIndex]?.ns_bangluong_hienthi_tinhluong[showThuTuCotContent-1]?.length < 1 ? 
        <>
          <div className='flex mt-4'><i className='w-[60%]'>{showThuTuCotContent == 1 ? '** Sao chép hiển thị lương từ phòng ban: ': '** Sao chép công thức tính lương từ phòng ban: '}</i> 
            <Select
              className='w-[40%]'
              value={httlDanhMucTarget}
              options={
                httlList?.map((itm)=>{
                  return {value:itm.danhmuc_id, label:itm.danhmuc_name}
                })
              } 
              onChange={(value,e)=>{
                setHttlDanhMucTarget(value);
                setHttlDanhMucTargetName(e.label);
              }}
            />
          </div>
          <div className='flex mt-4'><i className='w-[60%]'>** Tháng muốn sao chép: </i> 
            <DatePicker
              className='w-[40%]'
              picker='month'
              value={dayjs(httlYearTarget+'-'+httlMonthTarget)}
              format="MM-YYYY"
              onChange={(date, dateString) => {
                if(dateString){
                  setHttlYearTarget(moment(dateString, 'MM-YYYY').format('YYYY'));
                  setHttlMonthTarget(moment(dateString, 'MM-YYYY').format('MM'));
                  setHttlMonthYearTarget(dateString);
                } else {
                  setHttlYearTarget(moment().format('YYYY'));
                  setHttlMonthTarget(moment().format('MM'));
                  setHttlMonthYearTarget(moment().format('MM-YYYY'));
                }
              }}
            />
          </div>
          <button
            type="button"
            className='px-4 py-1 rounded-md bg-orange-400 hover:bg-orange-500 text-white flex justify-center items-center gap-2'
            onClick={()=> handleCopyHTTL()}
          >
            <i className='fa-solid fa-copy'></i>
            <span>
              Sao chép
            </span>
          </button>
        </>:''}
      </Modal>
    </div>
  )
}