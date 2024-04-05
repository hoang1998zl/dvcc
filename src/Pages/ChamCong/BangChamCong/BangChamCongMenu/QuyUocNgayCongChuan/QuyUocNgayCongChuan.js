import React, { useCallback, useEffect, useState } from 'react'
import { localStorageService } from '../../../../../services/localStorageService';
import { chamCongService } from '../../../../../services/chamCongService';
import '../../../../../issets/css/customTable.css';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { setReloadMany } from '../../../../../Redux-toolkit/reducer/ChamCongSlice';

export default function QuyUocNgayCongChuan() {
  let dispatch = useDispatch();
  let token = localStorageService.getItem("token");
  let [fMonth,setFMonth] = useState(moment().format("MM"));
  let [fYear,setFYear] = useState(moment().format("YYYY"));
  let [reload,setReload] = useState(0);
  let [ngayCongList,setNgayCongList] = useState([]);
  useEffect(() => {
    chamCongService.getNCC(token,{fMonth,fYear}).then((res) => {
            setNgayCongList(res.data.content);
          })
          .catch((err) => {
           console.log(err);
          });
  },[fMonth,fYear,reload])

  let updateNCC = (clone) => {
    let data = {
      fMonth,
      fYear,
      danhmuc_id: clone.danhmuc_id,
      value: clone?.ns_nhanvien_bangluongchinh[0]?.ngay_chuan
    }
    chamCongService.updateNCC(token,data).then((res) => {
              setReload(Date.now());
              dispatch(setReloadMany(Date.now()));
              toast.success("Cập Nhật Thành Công!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            })
          })
          .catch((err) => {
           console.log(err);
          });
  }
  const debounceApi = useCallback(debounce((clone) => updateNCC(clone), 1000), [])
  let changeInput = (value,index) => {
    let clone = [...ngayCongList];
    try {
      clone[index].ns_nhanvien_bangluongchinh[0].ngay_chuan = value;
    } catch (error) {
      toast.error("Vui lòng tạo nhân viên cho phòng ban này trước!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
    });
    return;
    }
    debounceApi(clone[index]);
    setNgayCongList(clone);
  }
  let renderYear = () => {
    let array = [];
    for(let i = -4; i < 1; i++){
        let year = moment().add(i,'years').format("YYYY");
        array.push(year);
    }
    return array.map((item) => {
      return <option value={item}>{item}</option>
    })
  }
  let renderContent = () => {
    return ngayCongList?.map((ngayCong, index) => {
      return (
        <tr key={index}>
          <td className='text-left'>{ngayCong?.danhmuc_name}</td>
          <td>
            <input onChange={(e) => changeInput(e.target.value,index)}
              className='w-24 text-center py-1 border rounded focus:outline-none'
              type="text"
              value={ngayCong?.ns_nhanvien_bangluongchinh[0]?.ngay_chuan ? ngayCong?.ns_nhanvien_bangluongchinh[0]?.ngay_chuan : ""}
            />
          </td>
        </tr>
      )
    })
  }

  return (
    <div className='w-full p-2 lg:p-4 bg-white rounded-lg shadow shadow-black border border-gray-300'>
      <div className='arrowTop'></div>
      <div
        className='text-orange-400 font-semibold pb-2 capitalize text-left border-b border-orange-400 bg-white sticky top-0 z-[3]'
      >
        <span className='flex-1 text-left'>Quy ước ngày công chuẩn</span>
      </div>

      <div className='mt-2 text-left'>
        <p>
          - Ngày công chuẩn là số ngày làm việc thực tế trong tháng của công ty (tùy tháng)
        </p>
        <p>
          - Ngày công chuẩn không áp dụng vào toàn công ty do tính đặc thù công việc của từng bộ phận khác nhau. Ngày công chuẩn chỉ được nhập 1 lần duy nhất vào mỗi tháng!
        </p>
      </div>
      <div className='my-2 flex justify-end items-center gap-x-4'>
        <p className='w-max:'>
          Tháng áp dụng
        </p>

        <select value={fMonth} onChange={(e) => setFMonth(e.target.value)}
          className='w-24 text-center py-1 border rounded focus:outline-none'
        >
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
          <option value="04">04</option>
          <option value="05">05</option>
          <option value="06">06</option>
          <option value="07">07</option>
          <option value="08">08</option>
          <option value="09">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <select value={fYear} onChange={(e) => setFYear(e.target.value)}
          className='w-24 text-center py-1 border rounded focus:outline-none'
        >
          {/* viết kiểu này rồi qua năm 2024 vào code thêm value 2024 rồi build lại hả? */}
          {/* <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option> */}
          {
            renderYear()
          }
        </select>
      </div>
      <div className='w-full mt-2'>
        <table className='customTable text-center'>
          <thead>
            <th>
              Văn phòng
            </th>
            <th>
              Ngày công chuẩn
            </th>
          </thead>
          <tbody>
            {renderContent()}
          </tbody>
        </table>
      </div>
    </div>
  )
}
