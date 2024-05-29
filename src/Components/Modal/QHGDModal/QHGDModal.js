import { DatePicker, Input, Popconfirm, Radio, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setnhanVienUpdated } from '../../../Redux-toolkit/reducer/HoSoNhanVienSlice';
import dayjs from 'dayjs';
import moment from 'moment';
import { nhanVienService } from '../../../services/nhanVienService';
import { toast } from 'react-toastify';
import { localStorageService } from '../../../services/localStorageService';

function QHGDModal() {
  const dispatch = useDispatch();
  let token = localStorageService.getItem('token');

  let nhanVienHS = useSelector(state => state.HoSoNhanVienSlice.nhanVienHS);
  useEffect(()=>{
    // console.log(nhanVienUpdated)
  },[nhanVienHS])
  let nhanVienUpdated = useSelector(state => state.HoSoNhanVienSlice.nhanVienUpdated);
  let reloadHS = useSelector(state => state.HoSoNhanVienSlice.reloadHS);
  let curType = useSelector(state => state.HoSoNhanVienSlice.relaType);
  useEffect(() => {
    dispatch(setnhanVienUpdated(nhanVienHS));
  }, [nhanVienHS]);
  useEffect(() => {
    setRelaType(curType);
  }, [curType]);
  useEffect(() => {
    setAddNew(false);
  }, [reloadHS]);
  const [addNew, setAddNew] = useState(false);
  const [relaType, setRelaType] = useState(curType);
  const [newRecord, setNewRecord] = useState({})
  const resetNewRecord = () => {
    setNewRecord({
      type: Number(curType.charAt(0)),
      name: '',
      birthday: moment().format('YYYY-MM-DD'),
      phone: ''
    })
  }
  const relaOptions = [
    {value:1, label: 'Cha'},
    {value:2, label: 'Mẹ'},
    {value:3, label: 'Anh'},
    {value:4, label: 'Chị'},
    {value:5, label: 'Em'},
    {value:6, label: 'Vợ'},
    {value:7, label: 'Chồng'},
    {value:8, label: 'Con'}
  ];
  const changeInput = (idx,field,value) => {
    let cloneFamily = [...nhanVienUpdated.ns_nhanvien_family];
    let update = cloneFamily.map((item,index) => {
      if(index === idx){
        return {...item, [field]: value}
      }
      return item;
    })
    let clone = {...nhanVienUpdated};
    clone.ns_nhanvien_family = update;
    dispatch(setnhanVienUpdated(clone));
  }
  const handleDeleteQHGD = (idx) => {
    const removeUpdatedRecord = (index) => {
      let cloneFamily = [...nhanVienUpdated.ns_nhanvien_family];
      cloneFamily.splice(index,1);
      let clone = {...nhanVienUpdated};
      clone.ns_nhanvien_family = cloneFamily;
      dispatch(setnhanVienUpdated(clone));
    }
    let id = nhanVienUpdated.ns_nhanvien_family[idx].id;
    if(id > 0){
      nhanVienService.deleteQHGD(token, {id}).then((res) => {
        removeUpdatedRecord(idx);
        toast.success("Xóa thành công!!!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      })
        .catch((err) => {
          console.log(err);
        });
    } else {
      removeUpdatedRecord(idx);
      toast.success("Xóa thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }
  }
  const changeNewRecord = (field,value) => {
    let clone = {...newRecord};
    clone[field]=value;
    setNewRecord(clone);
  }
  const handleAddRecord = () => {
    let clone = {...nhanVienUpdated};
    let clone2 = {...newRecord};
    if(clone.ns_nhanvien_family && clone.ns_nhanvien_family.length > 0){
      let arr = [...clone.ns_nhanvien_family];
      arr.push(clone2);
      clone.ns_nhanvien_family = [...arr];
    } else {
      clone.ns_nhanvien_family = [clone2];
    }
    dispatch(setnhanVienUpdated(clone));
    setAddNew(false);
  }

  const renderQHGDItems = () => {
    if(nhanVienUpdated?.ns_nhanvien_family?.length > 0){
      return nhanVienUpdated?.ns_nhanvien_family.map((item, index) => {
        if(relaType.includes(String(item.type))){
          return (
            <div className='w-full border rounded-lg p-4 flex flex-col gap-2 relative'>
              <Popconfirm title='Xác nhận xóa mục này? CHÚ Ý: quá trình xóa sẽ thực hiện ngay lập tức!' okText="Xác nhận" cancelText="Huỷ" onConfirm={() => handleDeleteQHGD(index)}>
                <button
                  type='button'
                  className='w-6 aspect-square rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white font-bold text-base flex justify-center items-center cursor-pointer'
                >
                  <i className='fa-solid fa-x'></i>
                </button>
              </Popconfirm>
              <div className='flex items-center gap-4'>
                <p className='w-40'>
                  Quan hệ với nhân sự:
                </p>
                <Select
                  className='w-full flex-1'
                  options={relaOptions}
                  value={item.type}
                  onChange={(value)=>{
                    changeInput(index,'type',value);
                  }}
                />
              </div>
              <div className='flex items-center gap-4'>
                <p className='w-40'>
                  Họ và tên:
                </p>
                <Input
                  className='w-full flex-1'
                  value={item.name}
                  onChange={(e)=>{
                    changeInput(index,'name',e.target.value);
                  }}
                />
              </div>
              <div className='flex items-center gap-4'>
                <p className='w-40'>
                  Ngày sinh:
                </p>
                <DatePicker
                  className='w-full flex-1'
                  format={'DD-MM-YYYY'}
                  value={dayjs(item.birthday, "YYYY-MM-DD").isValid()?dayjs(item.birthday, "YYYY-MM-DD"):''}
                  onChange={(date, dateString) => {
                    let value = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                    changeInput(index,'birthday',value);
                  }}
                />
              </div>
              <div className='flex items-center gap-4'>
                <p className='w-40'>
                  Liên hệ:
                </p>
                <Input
                  className='w-full flex-1'
                  value={item.phone}
                  onChange={(e)=>{
                    changeInput(index,'phone',e.target.value);
                  }}
                />
              </div>
            </div>
          )
        }
      })
    }
  }
  return (
    <div>
      <div className='w-full'>
        <Radio.Group className='w-full grid grid-cols-1 md:grid-cols-2 gap-1'
        value={relaType}
        onChange={(e) => setRelaType(e.target.value)}>
          <Radio value={'12'}>Cha-Mẹ</Radio>
          <Radio value={'345'}>Anh-Chị-Em</Radio>
          <Radio value={'67'}>Vợ-Chồng</Radio>
          <Radio value={'8'}>Con</Radio>
        </Radio.Group>
      </div>

      <div className='w-full flex flex-col mt-4'>
        {renderQHGDItems()}
        {
          addNew == true && (
            <>
              <hr className='w-full my-4' />
              <div className='w-full border rounded-lg p-4 flex flex-col gap-2 relative'>
                <button
                  type='button'
                  className='w-6 aspect-square rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white font-bold text-base flex justify-center items-center cursor-pointer'
                  onClick={() => {
                    resetNewRecord();
                    setAddNew(false);
                  }}
                >
                  <i className='fa-solid fa-x'></i>
                </button>
                <div className='flex items-center gap-4'>
                  <p className='w-40'>
                    Quan hệ với nhân sự:
                  </p>
                  <Select
                    className='w-full flex-1'
                    options={relaOptions.map((item)=>{
                      if(relaType.includes(String(item.value))){
                        return item;
                      }
                    }).filter((value) => value)}
                    value={newRecord.type}
                    onChange={(value)=>{
                      changeNewRecord('type',value);
                    }}
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <p className='w-40'>
                    Họ và tên:
                  </p>
                  <Input
                    className='w-full flex-1'
                    value={newRecord.name}
                    onChange={(e)=>{
                      changeNewRecord('name',e.target.value);
                    }}
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <p className='w-40'>
                    Ngày sinh:
                  </p>
                  <DatePicker
                    className='w-full flex-1'
                    format={'DD-MM-YYYY'}
                    value={dayjs(newRecord.birthday, "YYYY-MM-DD").isValid()?dayjs(newRecord.birthday, "YYYY-MM-DD"):''}
                    onChange={(date, dateString) => {
                      let value = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                      changeNewRecord('birthday',value);
                    }}
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <p className='w-40'>
                    Liên hệ:
                  </p>
                  <Input
                    className='w-full flex-1'
                    value={newRecord.phone}
                    onChange={(e)=>{
                      changeNewRecord('phone',e.target.value);
                    }}
                  />
                </div>
                <div className='flex justify-end'>
                    <button
                      type='button'
                      className='w-[80px] px-6 py-1 rounded bg-orange-400 text-white flex justify-center items-center gap-4 font-bold'
                      onClick={() => {
                        handleAddRecord();
                      }}
                    >
                      <span>
                        Lưu
                      </span>
                    </button>
                </div>
              </div>
            </>
          )
        }
        <div className='mt-4'>
          <button
            type='button'
            className='px-6 py-1 rounded bg-orange-400 text-white flex justify-center items-center gap-4 font-bold'
            onClick={() => {
              resetNewRecord();
              setAddNew(true);
            }}
          >
            <i className='fa-solid fa-plus'></i>
            <span>
              Thêm
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QHGDModal