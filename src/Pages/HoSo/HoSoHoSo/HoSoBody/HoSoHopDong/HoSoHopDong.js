import { DatePicker, Dropdown, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FiDownload } from "react-icons/fi";
import { FaPen } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { localStorageService } from '../../../../../services/localStorageService';
import { nhanVienService } from '../../../../../services/nhanVienService';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import dayjs from 'dayjs';

export default function HoSoHopDong() {
  const { currentNhanVien } = useSelector(state => state.UserSlice);
  let token = localStorageService.getItem('token');
  let [nv,setNV] = useState({});
  let [reload,setReload] = useState(0);
  useEffect(()=>{
    if(!currentNhanVien){
      return;
    }
    nhanVienService.getNhanVienTheoId(token, currentNhanVien).then((res) => {
      setNV(res.data?.content);
    })
      .catch((err) => {
        console.log(err);
      });
  },[currentNhanVien,reload])
  let changeHopDong = (e) => {
    nhanVienService.updateHopDong(token, nv.nv_id, e.target.files[0]).then((res) => {
      setReload(Date.now())
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    })
      .catch((err) => {
        toast.error("Cập nhật thất bại!!!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      });
  }
  const handleUpdateNV = (field, value) => {
    let clone = {...nv};
    clone[field] = value;
    nhanVienService.updateNhanVienField(token, nv.nv_id, field, value).then((res) => {
      setReload(Date.now())
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    })
      .catch((err) => {
        console.log(err);
      });
  }
  const items = [
    {
      key: '1',
      label: (
        <button
          type='button'
          className='min-w-40 flex items-center gap-2'
        >
          <label htmlFor='nv_cmnd_sau' className='w-full block text-left rounded-md font-normal'>
            <input
              type="file"
              id="nv_cmnd_sau"
              className='hidden'
              name=""
              onChange={changeHopDong}
              />
              <div className='flex'>
                <div
                  className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
                  >
                  <FaPen />
                </div>
                <span className='ml-2'>
                  Cập nhật (File tối đa 2 Mb)
                </span>
              </div>
          </label>
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button
          type='button'
          className='min-w-40 flex items-center gap-2'
          onClick={() => {
            if(nv.nv_hopdong){
              window.open(nv.nv_hopdong)
            }else{
              toast.error("Không tìm thấy file hợp đồng!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
              });
            }
          }}
        >
          <div
            className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
          >
            <FiDownload />
          </div>
          <span>
            Tải xuống
          </span>
        </button>
      ),
    },
  ];

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left flex flex-col gap-4'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Hợp đồng lao động
        </h1>

        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <button
            type='button'

          >
            <BsThreeDots
              className='text-lg'
            />
          </button>
        </Dropdown>
      </div>
      <div className='w-full flex'>
        <span>
          Ngày ký hợp đồng:
        </span>
        <div className='ml-3 font-medium'>
          <DatePicker
            value={dayjs(nv.nv_ngaykyhopdong,"YYYY-MM-DD").isValid()?dayjs(nv.nv_ngaykyhopdong,"YYYY-MM-DD"):''}
            format="DD-MM-YYYY"
            onChange={(date,dateString) => {
              let value = dateString?moment(dateString,'DD-MM-YYYY').format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
              handleUpdateNV('nv_ngaykyhopdong',value);
            }}
          />
        </div>
      </div>
      <div className='w-full flex'>
        <span>
            Loại hợp đồng:
        </span>
        <div className='ml-3 font-medium'>
          <Radio.Group  value={nv.nv_loai_hopdong} buttonStyle='solid'
            onChange={(e) => {
                handleUpdateNV('nv_loai_hopdong',e.target.value);
            }}>
            <Radio value={0}>Không thời hạn</Radio>
            <Radio value={1}>Có thời hạn</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className='w-full flex'>
        <span>
          Ngày hết hạn:
        </span>
        <div className='ml-3 font-medium'>
          <DatePicker
            disabled={nv.nv_loai_hopdong===0?true:false}
            value={dayjs(nv.nv_thoihan_hopdong,"YYYY-MM-DD").isValid()?dayjs(nv.nv_thoihan_hopdong,"YYYY-MM-DD"):''}
            format="DD-MM-YYYY"
            onChange={(date,dateString) => {
              let value = dateString?moment(dateString,'DD-MM-YYYY').format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
              handleUpdateNV('nv_thoihan_hopdong',value);
            }}
          />
        </div>
      </div>
      <div className='w-full 2xl:w-3/4 mx-auto border border-gray-300 rounded relative p-1'>
        <img
          onClick={() => {
            if(nv.nv_hopdong){
              window.open(nv.nv_hopdong)
            }else{
              toast.error("Không tìm thấy file hợp đồng!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
              });
            }
          }}
          className='w-full object-contain object-center rounded'
          src="https://cdn.thuvienphapluat.vn/uploads/laodongtienluong/20230301/DVM/2303/mau-hdld.png"
          alt=""
        />
      </div>
    </div>
  )
}
