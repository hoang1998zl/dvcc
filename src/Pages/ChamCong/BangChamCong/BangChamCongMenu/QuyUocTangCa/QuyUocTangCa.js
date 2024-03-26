import { Switch } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { chamCongService } from '../../../../../services/chamCongService';
import { localStorageService } from '../../../../../services/localStorageService';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

export default function QuyUocTangCa() {
  let [tangCa,setTangCa] = useState({});
  let [reload,setReload] = useState(0);
  let token = localStorageService.getItem("token");
  useEffect(() => {
    chamCongService.layCachTinhTangCa(token).then((res) => {
            setTangCa(res.data.content);
          })
          .catch((err) => {
           console.log(err);
          });
  },[reload])
  let updateTangCa = (data) => {
    chamCongService.suaCachTinhTangCa(token,data).then((res) => {
            setReload(Date.now());
            toast.success("Cập Nhật thành công!!!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000
            });
          })
          .catch((err) => {
           console.log(err);
          });
  }
  const debounceApi = useCallback(debounce((data) => updateTangCa(data), 1000), []);
  let changeInput = (value,key) => {
    if(key === "type"){
      value = Number(value);
    }else if(key === "tangca_congthuc"){
      value = value.replace(/[^\d.-]/g, '');
    }else if(key === "tangca_sotien"){
      value = value.replace(/\D/g, '');
    }
    let clone = {...tangCa};
    clone[key] = value;
    setTangCa(clone);
    debounceApi(clone);
  }
  return (
    <div className='w-full p-2 lg:p-4 bg-white rounded-lg shadow shadow-black border border-gray-300'>
      <div className='arrowTop'></div>
      <div
        className='text-orange-400 font-semibold pb-2 capitalize text-left border-b border-orange-400 bg-white sticky top-0 z-[3]'
      >
        <span className='flex-1 text-left'>Quy ước tăng ca</span>
      </div>

      <div className='mt-2 text-left'>
        <ul className='w-full ps-[20px] list-disc list-outside'>
          <li className='list-item'>
            <p className=''>
              1 nhân viên được làm tối đa 2 ca (ca chính + ca phụ)
            </p>
          </li>
          <li className='list-item'>
            <p className=''>
              Đơn giá tăng ca được tính như sau:
            </p>
          </li>
        </ul>
      </div>
      <div className='w-full mt-2'>
        <table className='customTable text-center'>
          <thead>
            <th>
              Áp Dụng
            </th>
            <th>
              Đơn giá
            </th>
            <th>
              Công thức
            </th>
          </thead>
          <tbody>
            <tr>
              <td>
                <Switch onChange={(value) => changeInput(value,"type")}
                  checked={tangCa?.type === 1 ? true : false}
                  style={{
                    backgroundColor: tangCa?.type ? "orange" : "gray"
                  }}
                />
              </td>
              <td>
                Hình thức 1
              </td>
              <td>
                <div className='flex justify-center items-center'>
                  <span>
                    1 giờ =
                  </span>
                  <input
                    onChange={(e) => changeInput(e.target.value,e.target.name)}
                    className='w-20 border
                    . text-center mx-1 rounded focus:outline-none'
                    type="text"
                    name="tangca_congthuc"
                    value={tangCa?.tangca_congthuc}
                  />
                  <span>Công</span>
                </div>
                <p>1 giờ công tăng ca = 1.25 giờ công thường <br /> (VD: 1h=0.25 công)</p>
              </td>
            </tr>
            <tr>
              <td>
                <Switch
                  onChange={(value) => changeInput(value,"type")}
                  style={{
                    backgroundColor: tangCa?.type ? "orange" : "gray"
                  }} checked={tangCa?.type === 0 ? true : false}
                />
              </td>
              <td>
                Hình thức 2
              </td>
              <td>
                <div className='flex justify-center items-center'>
                  <span>
                    1 giờ =
                  </span>
                  <input
                    onChange={(e) => changeInput(e.target.value,e.target.name)}
                    className='w-20 border
                    . text-center mx-1 rounded focus:outline-none'
                    type="text"
                    name="tangca_sotien"
                    value={Number(tangCa?.tangca_sotien).toLocaleString()}
                  />
                  <span>vnđ</span>
                </div>
                <p>(1 cột lương cuối tháng)</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

