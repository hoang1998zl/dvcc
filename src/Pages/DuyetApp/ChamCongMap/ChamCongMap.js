import React, { useEffect, useState } from 'react'
import ViTriNhanVien from './ViTriNhanVien/ViTriNhanVien';
import LichSuVaoCa from './LichSuVaoCa/LichSuVaoCa';
import LichSuNghiPhep from './LichSuNghiPhep/LichSuNghiPhep';
import LichSuCongTac from './LichSuCongTac/LichSuCongTac';
import { localStorageService } from '../../../services/localStorageService';
import { nhanVienService } from '../../../services/nhanVienService';
import CharacterReplace from '../../../GlobalFunction/CharacterReplace';
import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setNam, setNamKT, setNgay, setNgayKT, setNhanVien, setThang, setThangKT } from "../../../Redux-toolkit/reducer/DuyetAppSlice"
import LichSuTangCa from './LichSuTangCa/LichSuTangCa';
import LichLamViec from './LichLamViec/LichLamViec';
import LichSuDiTre from './LichSuDiTre/LichSuDiTre';
import LichSuVeSom from './LichSuVeSom/LichSuVeSom';
import LichSuNghiKhac from './LichSuNghiKhac/LichSuNghiKhac';

const filterOption = (input, option) => CharacterReplace(option?.label ?? '').includes(CharacterReplace(input));
export default function ChamCongMap() {
  let token = localStorageService.getItem("token");
  let dispatch = useDispatch();
  let duyetAppSlice = useSelector((state) => state.DuyetAppSlice);
  let [NVList, setNVList] = useState([]);
  useEffect(() => {
    nhanVienService.getAllNhanVien(token).then((res) => {
      setNVList(res.data.content);
      if (!duyetAppSlice.nv_id) {
        dispatch(setNhanVien(res.data?.content[0]?.nv_id))
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  const renderDay = () => {
    const lstDay = []
    for (let i = 1; i <= 31; i++) {
      let day = i < 10 ? "0" + i : String(i);
      lstDay.push(day)
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
      let month = i < 10 ? "0" + i : String(i);
      lstMonth.push(month)
    }
    return lstMonth?.map((item) => {
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
  const renderYear = () => {
    const lstYear = []
    for (let i = 2020; i <= 2025; i++) {
      lstYear.push(String(i))
    }
    return lstYear?.map((item) => {
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
  let renderNvOptions = () => {
    let array = [{
      value: -1,
      label: "Tất Cả"
    }];
    NVList.map((user) => {
      let item = {
        value: user?.nv_id,
        label: user?.nv_name,
      }
      array.push(item);
    })
    return array;
  }
  let changeNhanVien = (value) => {
    dispatch(setNhanVien(value));
  }
  let changeDate = (value, name) => {
    switch (name) {
      case "ngay": return dispatch(setNgay(value));
      case "thang": return dispatch(setThang(value));
      case "nam": return dispatch(setNam(value));
      case "ngayKT": return dispatch(setNgayKT(value));
      case "thangKT": return dispatch(setThangKT(value));
      case "namKT": return dispatch(setNamKT(value));
    }
  }
  const tab = [
    {
      id: 1,
      name: 'Vị trí nhân viên'
    },
    {
      id: 2,
      name: 'Lịch sử vào ca'
    },
    {
      id: 7,
      name: 'Xin đi trễ'
    },
    {
      id: 8,
      name: 'Xin về sớm'
    },
    {
      id: 4,
      name: 'Xin nghỉ phép'
    },
    {
      id: 3,
      name: 'Xin công tác'
    },
    {
      id: 5,
      name: 'Xin tăng ca'
    },
    {
      id: 9,
      name: 'Xin nghỉ khác'
    },
    {
      id: 6,
      name: 'Lịch làm việc'
    },
  ];
  const [currentTab, setCurrentTab] = useState(1);
  const renderTab = () => {
    return tab.map((item) => {
      return (
        <button
          key={item.id}
          type="button"
          className={`h-10 px-1 rounded-full text-center focus:outline-none ${currentTab == item.id ? 'bg-orange-100 text-orange-400' : 'bg-transparent text-gray-600'}`}
          onClick={() => setCurrentTab(item.id)}
        >
          {item.name}
        </button>
      )
    })
  }

  const renderContent = () => {
    switch (currentTab) {
      case 1:
        return <ViTriNhanVien />
      case 2:
        return <LichSuVaoCa />
      case 3:
        return <LichSuCongTac />
      case 4:
        return <LichSuNghiPhep />
      case 5:
        return <LichSuTangCa />
      case 6:
        return <LichLamViec />
      case 7:
        return <LichSuDiTre />
      case 8:
        return <LichSuVeSom />
      case 9:
        return <LichSuNghiKhac />
      default:
        return <ViTriNhanVien />
    }
  }

  return (
    <div className='w-full bg-white rounded-lg p-2 lg:p-4'>
      <div className='lg:col-span-3 px-4 pb-4 rounded-lg shadow-md'>
        <div
          className='w-full flex flex-col lg:flex-row items-center gap-2 mb-2'
        >
          <div className='relative flex-1 w-full'>
            <Select value={duyetAppSlice.nv_id} filterOption={filterOption} options={renderNvOptions()} showSearch onChange={changeNhanVien} className="w-full bg-transparent rounded focus:outline-none" placeholder="Chọn Nhân Viên">
            </Select>
          </div>
          <div className='flex flex-col lg:flex-row items-center gap-2'>
            <div className='flex items-center gap-2'>
              <select name='ngay' onChange={(e) => changeDate(e.target.value, e.target.name)} value={duyetAppSlice.ngay} className='w-16 min-w-0 h-9 px-2 bg-slate-100 rounded text-center focus:outline-none text-gray-600'>
                {renderDay()}
              </select>
              <select name='thang' onChange={(e) => changeDate(e.target.value, e.target.name)} value={duyetAppSlice.thang} className='w-16 min-w-0 h-9 px-2 bg-slate-100 rounded text-center focus:outline-none text-gray-600'>
                {renderMonth()}
              </select>
              <select name='nam' onChange={(e) => changeDate(e.target.value, e.target.name)} value={duyetAppSlice.nam} className='w-24 min-w-0 h-9 px-2 bg-slate-100 rounded text-center focus:outline-none text-gray-600'>
                {renderYear()}
              </select>
            </div>
            <p>Đến</p>
            <div className='flex items-center gap-2'>
              <select name='ngayKT' onChange={(e) => changeDate(e.target.value, e.target.name)} value={duyetAppSlice.day} KT className='w-16 min-w-0 h-9 px-2 bg-slate-100 rounded text-center focus:outline-none text-gray-600' defaultValue={31}>
                {renderDay()}
              </select>
              <select name='thangKT' onChange={(e) => changeDate(e.target.value, e.target.name)} value={duyetAppSlice.thangKT} className='w-16 min-w-0 h-9 px-2 bg-slate-100 rounded text-center focus:outline-none text-gray-600'>
                {renderMonth()}
              </select>
              <select name='namKT' onChange={(e) => changeDate(e.target.value, e.target.name)} value={duyetAppSlice.namKT} className='w-24 min-w-0 h-9 px-2 bg-slate-100 rounded text-center focus:outline-none text-gray-600'>
                {renderYear()}
              </select>
            </div>
          </div>
        </div>
        <div className='w-full border border-gray-300 rounded-lg p-2'>
          <div className='w-full overflow-x-auto'>
            <div className='w-max lg:w-full p-1 border border-orange-400 rounded-full mb-2 flex lg:grid grid-cols-9 gap-2'>
              {renderTab()}
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
