import React, { useEffect, useState } from 'react';
import { Select, Input  } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { localStorageService } from '../../services/localStorageService';
import {  toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { setDanhMuc } from '../../Redux-toolkit/reducer/ChamCongSlice';
import { chamCongService } from '../../services/chamCongService';

const filterOption = (input, option) =>
  (option?.key ?? '').toLowerCase().includes(input.toLowerCase());
export default function ThongBaoNoiBo() {
  let token = localStorageService.getItem("token");
  let dispatch = useDispatch();
  let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);
  const [pbList, setPbList] = useState([]);
  const { TextArea } = Input;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    chamCongService.getPhongBan(token).then((res) => {
        setPbList(res.data.content);
        if(danhmuc_id == 0){
          dispatch(setDanhMuc(-1));
        }
    })
        .catch((err) => {
            console.log(err);
        });
  }, [])
  let changePhongBan = (e) => {
    dispatch(setDanhMuc(e));
  }
  const sendNoti = () => {
    if(title.length<1){
      return toast.error('Tiêu đề không được để trống', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }
    if(content.length<10){
      return toast.error('Nội dung phải chứa ít nhất 10 ký tự', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }
    chamCongService.sendThongBaoNoiBo(token,{title,content,danhmuc_id}).then((res) => {
      toast.success("Gửi thông báo thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      setTitle('');
      setContent('');
    }).catch((err) => {
      toast.error(err.response.data.content, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      console.log(err);
    })
  }
  let renderOption = () => {
    let array = [{
      value: -1,
      label: <p className='text-black'>Tất Cả</p>,
      key: -1
    }];
    pbList.map((pb) => {
        let item = {
            value: pb?.danhmuc_id,
            label: <p className='text-black'>{pb?.danhmuc_name}</p>,
            key: pb?.danhmuc_name
        }
        array.push(item);
    })
    return array
  }
  let renderBangLuongTong = () => {
    return (
      <div id='bangLuongTong'>
        <div className="w-full mb-4 flex justify-between items-center gap-x-2 border border-orange-400 bg-white px-4 py-2 rounded-lg shadow-md">
          <div className="flex justify-between items-center gap-x-2">
            <p className="font-semibold">Chọn phòng ban cần thông báo:</p>
            <div className="w-full lg:w-60">
              <Select
                className='w-48'
                value={danhmuc_id == 0 ? null : danhmuc_id}
                showSearch
                filterOption={filterOption}
                placeholder="Chọn phòng ban"
                onChange={changePhongBan}
                options={renderOption()}
              />
            </div>
          </div>
        </div>
        <div className='w-full grid grid-cols-1 gap-4'>
          <div className='w-full bg-white px-4 py-4 rounded-lg shadow-md'>
            <div className='mb-2'>
              <h1 className='flex-1 text-left text-orange-400 font-semibold text-lg'>
                <span className='ms-4'>
                  Tiêu đề:
                </span>
              </h1>
            </div>
            <div className='bangLuongTab w-full overflow-y-auto rounded'>
              <Input className='w-full' value={title} onInput={(e)=>setTitle(e.target.value)}/>
            </div>
            <div className='mb-2'>
              <h1 className='flex-1 text-left text-orange-400 font-semibold text-lg'>
                <span className='ms-4'>
                  Nội dung thông báo:
                </span>
              </h1>
            </div>
            <div className='bangLuongTab w-full overflow-y-auto rounded'>
              <TextArea rows={4} value={content} onInput={(e)=>setContent(e.target.value)}/>
            </div>
            <button
              type="button"
              className='mt-3 px-4 py-1 rounded text-white bg-orange-400 hover:bg-orange-600 h-8 mr-5 float-end'
              onClick={()=> sendNoti()}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id='taoBangLuong' className='w-full p-4'>
      {renderBangLuongTong()}
      <ToastContainer></ToastContainer>
    </div >
  )
}
