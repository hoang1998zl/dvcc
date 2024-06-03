import { DatePicker, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import dayjs from 'dayjs';
import { setnhanVienUpdated } from '../../../Redux-toolkit/reducer/HoSoNhanVienSlice';
import { nhanVienService } from '../../../services/nhanVienService';
import { toast } from 'react-toastify';
import { setReloadHS } from '../../../Redux-toolkit/reducer/HoSoNhanVienSlice';
import { localStorageService } from '../../../services/localStorageService';

function LTPTModal() {
  const dispatch = useDispatch();
  let nhanVienHS = useSelector(state => state.HoSoNhanVienSlice.nhanVienHS);
  let nhanVienUpdated = useSelector(state => state.HoSoNhanVienSlice.nhanVienUpdated);
  const { currentNhanVien } = useSelector(state => state.UserSlice);
  const reloadHS = useSelector(state => state.HoSoNhanVienSlice.reloadHS);
  const token = localStorageService.getItem('token');
  let [year,setYear] = useState(moment().format('YYYY'));
  const [addQTTT, setAddQTTT] = useState(false);
  const [addQTCT, setAddQTCT] = useState(false);
  useEffect(() => {
    if (!currentNhanVien) {
      return;
    }
    dispatch(setnhanVienUpdated(nhanVienHS));
    setAddQTTT(false);
    setAddQTCT(false);
  }, [currentNhanVien, reloadHS]);
  const changeInput = (idx,field,value) => {
    let cloneLTPT = [...nhanVienUpdated.ns_nhanvien_lotrinhphattrien];
    let update = cloneLTPT.map((item,index) => {
      if(index === idx){
        return {...item, [field]: value}
      }
      return item;
    })
    let clone = {...nhanVienUpdated};
    clone.ns_nhanvien_lotrinhphattrien = update;
    dispatch(setnhanVienUpdated(clone));
  }
  const [newRecord, setNewRecord] = useState({})
  const resetNewRecord = () => {
    setNewRecord({
      type: 1,
      date: moment().format('YYYY-MM-DD'),
      position: '',
      note: '',
    })
  }
  const changeNewRecord = (field,value) => {
    let clone = {...newRecord};
    clone[field]=value;
    setNewRecord(clone);
  }
  const handleAddRecord = (type) => {
    let clone = {...nhanVienUpdated};
    let clone2 = {...newRecord};
    clone2.type = type;
    setYear(moment(clone2.date).format('YYYY'));
    if(clone.ns_nhanvien_lotrinhphattrien && clone.ns_nhanvien_lotrinhphattrien.length > 0){
      let arr = [...clone.ns_nhanvien_lotrinhphattrien];
      arr.push(clone2);
      clone.ns_nhanvien_lotrinhphattrien = [...arr];
    } else {
      clone.ns_nhanvien_lotrinhphattrien = [clone2];
    }
    dispatch(setnhanVienUpdated(clone));
    setAddQTTT(false);
    setAddQTCT(false);
  }
  let uploadLTPT = (e,id) => {
    nhanVienService.updateLTPT(token,id,e.target.files[0]).then((res) => {
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      dispatch(setReloadHS(Date.now()));
    }).catch((err) => {
      toast.error("Cập nhật thất bại!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      console.log(err);
    })
  }
  const render = (type) => {
    return nhanVienUpdated?.ns_nhanvien_lotrinhphattrien?.map((item, index)=>{
      if(new Date(item.date).getFullYear() === Number(year) && item.type === type){
        let element = 
        <>
          {index>0?
            (<hr className='w-full my-2' />):''
            }
          <div className='w-full grid grid-cols-1 md:grid-cols-2 items-center gap-y-2 gap-x-4 mb-0'>
            <div className='flex items-center gap-2'>
              <p className='w-[120px]'>
                Thời điểm:
              </p>
              <DatePicker
                className='w-full flex-1'
                value={dayjs(item.date,"YYYY-MM-DD").isValid()?dayjs(item.date,"YYYY-MM-DD"):''}
                format="DD-MM-YYYY"
                onChange={(date,dateString) => {
                  let value = dateString?moment(dateString,'DD-MM-YYYY').format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
                  changeInput(index,'date',value);
                }}
              />
            </div>
            <div className='flex items-center gap-2'>
              <p className='w-[120px]'>
                {type===1?'Chức vụ':'Vị trí'}
              </p>
              <Input
                className='w-full flex-1'
                value={item.position}
                onChange={(e)=>{
                  changeInput(index,'position',e.target.value);
                }}
              />
            </div>
            {type===2?
              (<div className='flex items-center gap-2 md:col-span-2'>
                <p className='w-[120px]'>
                  Nội dung công tác:
                </p>
                <Input
                  className='w-full flex-1'
                  value={item.note}
                  onChange={(e)=>{
                    changeInput(index,'note',e.target.value);
                  }}
                />
              </div>):''
            }
            {item.id>0?
              (<div className='flex items-center gap-2 md:col-span-2'>
                <p className='w-[500px]'>
                  <strong>Quyết định {type===1?'bổ nhiệm vị trí công tác':'điều chuyển nơi công tác'}:</strong>
                </p>
                <button type="button" className="w-full flex-1 px-2 py-1 rounded border hover:bg-orange-100 hover:border-orange-400">
                  <label className="w-full block rounded-md font-normal text-center cursor-pointer">
                    <i className='fa-solid fa-upload'></i>
                    <input type="file" className="hidden" onChange={(e)=>{uploadLTPT(e,item.id)}}/> Cập nhật
                  </label>
                </button>
              </div>):''
            }
          </div>
        </>
        return element;
      }
    })
  }

  return (
    <div className='grid grid-cols-1 gap-2 mt-4'>
      <div className='flex items-center gap-2'>
        <p>
          Chọn năm:
        </p>
        <DatePicker
          picker='year'
          value={dayjs(year)}
          onChange={(date, dateString) => {
            let value = dateString ? moment(dateString, 'YYYY').format('YYYY') : moment().format('YYYY');
            setYear(value);
          }}
        />
      </div>
      <p>Quá trình thăng tiến:</p>
      <div className='w-full ps-10'>
        {render(1)}
        {
          addQTTT == true && (
            <>
              <hr className='w-full my-2' />
              <div className='w-full grid grid-cols-1 md:grid-cols-2 items-center gap-y-2 gap-x-4'>
                <div className='flex items-center gap-2'>
                  <p className='w-[120px]'>
                    Thời điểm:
                  </p>
                  <DatePicker
                    className='w-full flex-1'
                    format={'DD-MM-YYYY'}
                    value={dayjs(newRecord.date, "YYYY-MM-DD").isValid()?dayjs(newRecord.date, "YYYY-MM-DD"):''}
                    onChange={(date, dateString) => {
                      let value = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                      changeNewRecord('date',value);
                    }}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <p className='w-[120px]'>
                    Chức vụ:
                  </p>
                  <Input
                    className='w-full flex-1'
                    value={newRecord.position}
                    onChange={(e)=>{
                      changeNewRecord('position',e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className='flex justify-end'>
                <button
                  type='button'
                  className='w-[80px] px-6 py-1 rounded bg-orange-400 text-white flex justify-center items-center gap-4 font-bold mt-2'
                  onClick={() => {
                    handleAddRecord(1);
                  }}
                >
                  <span>
                    Lưu
                  </span>
                </button>
              </div>
            </>
          )
        }
        <button
          type='button'
          className='px-6 py-1 mt-4 rounded bg-orange-400 text-white font-bold flex justify-center items-center gap-4'
          onClick={() => {
            resetNewRecord();
            setAddQTCT(false);
            setAddQTTT(true);
          }}
        >
          <i className='fa-solid fa-plus'></i>
          <span>Thêm</span>
        </button>
      </div>
      <p>Quá trình công tác:</p>
      <div className='w-full ps-10'>
      {render(2)}
        {
          addQTCT == true && (
            <>
              <hr className='w-full my-2' />
              <div className='w-full grid grid-cols-1 md:grid-cols-2 items-center gap-y-2 gap-x-4'>
                <div className='flex items-center gap-2'>
                  <p className='w-[120px]'>
                    Năm công tác:
                  </p>
                  <DatePicker
                    className='w-full flex-1'
                    format={'DD-MM-YYYY'}
                    value={dayjs(newRecord.date, "YYYY-MM-DD").isValid()?dayjs(newRecord.date, "YYYY-MM-DD"):''}
                    onChange={(date, dateString) => {
                      let value = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                      changeNewRecord('date',value);
                    }}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <p className='w-[120px]'>
                    Vị trí:
                  </p>
                  <Input
                    className='w-full flex-1'
                    value={newRecord.position}
                    onChange={(e)=>{
                      changeNewRecord('position',e.target.value);
                    }}
                  />
                </div>
                <div className='flex items-center gap-2 md:col-span-2'>
                  <p className='w-[120px]'>
                    Nội dung công tác:
                  </p>
                  <Input
                    className='w-full flex-1'
                    value={newRecord.note}
                    onChange={(e)=>{
                      changeNewRecord('note',e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className='flex justify-end'>
                <button
                  type='button'
                  className='w-[80px] px-6 py-1 rounded bg-orange-400 text-white flex justify-center items-center gap-4 font-bold mt-2'
                  onClick={() => {
                    handleAddRecord(2);
                  }}
                >
                  <span>
                    Lưu
                  </span>
                </button>
              </div>
            </>
          )
        }
        <button
          type='button'
          className='px-6 py-1 mt-4 rounded bg-orange-400 text-white font-bold flex justify-center items-center gap-4'
          onClick={() => {
            resetNewRecord();
            setAddQTTT(false);
            setAddQTCT(true);
          }}
        >
          <i className='fa-solid fa-plus'></i>
          <span>Thêm</span>
        </button>
      </div>
    </div>
  )
}

export default LTPTModal