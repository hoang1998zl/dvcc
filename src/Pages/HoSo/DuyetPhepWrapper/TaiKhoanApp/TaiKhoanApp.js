import { Input, Select } from 'antd'
import React, { useEffect, useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Switch } from 'antd';
import { useSelector } from 'react-redux';

export default function TaiKhoanApp() {

  const { mainHeight } = useSelector((state) => state.PageSlice);

  const [loaiLamViec, setLoaiLamViec] = useState([]);
  const [optionsGioLamViec, setOptionsGioLamViec] = useState([]);
  const [checkedTKA, setCheckedTKA] = useState(true);

  const handleChangeLoaiLamViec = (value) => {
    setLoaiLamViec(value);
  };

  useEffect(() => {
    if (loaiLamViec == 'hanhchinh') {
      setOptionsGioLamViec([
        {
          value: 'hanhchinh',
          label: 'Hành chính: 08:30:00-17:00:00'
        },
        {
          value: 'tangca',
          label: 'Tang ca: 17:30:00-23:00:00'
        }
      ])
    }

    if (loaiLamViec == 'theoca') {
      setOptionsGioLamViec([
        {
          value: 'ca1',
          label: 'Ca 1: 08:30:00-11:00:00'
        },
        {
          value: 'ca2',
          label: 'Ca 2: 11:00:00-16:00:00'
        },
        {
          value: 'ca3',
          label: 'Ca 3: 16:00:00-21:00:00'
        }
      ])
    }
  }, [loaiLamViec]);

  return (
    <div
      className='w-full flex flex-col gap-2 pe-1 overflow-y-auto customScrollbar'
      style={{
        maxHeight: `calc(${mainHeight}px - 3rem - 9rem - 4rem)`,
      }}
    >
      <p>
        Tài khoản App định vị:
      </p>
      <p
        className='italic text-red-500 text-xs'
      >
        Có thể dùng sđt để đăng nhập App
      </p>
      <Input
        className='w-full px-2 py-1 border rounded'
        placeholder='Nhập tên tài khoản'
      />
      <p>
        Mật khẩu:
      </p>
      <Input.Password
        className='w-full px-2 py-1 border rounded'
        placeholder='Nhập mật khẩu'
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <p>
        Làm việc tại:
      </p>
      <Select
        mode="multiple"
        allowClear
        className='w-full'
        placeholder="Chọn chi nhánh"
        options={[]}
      />
      <p>
        Làm việc theo:
      </p>
      <Select
        className='w-full'
        placeholder="Chọn loại thời gian"
        onChange={(e) => {
          handleChangeLoaiLamViec(e);
        }}
        options={[
          {
            value: 'hanhchinh',
            label: 'Hành Chính',
          },
          {
            value: 'theoca',
            label: 'Theo Ca',
          }
        ]}
      />
      <p>
        Giờ làm việc:
      </p>
      <Select
        id='gioLamViec'
        mode="multiple"
        allowClear
        className='w-full'
        placeholder="Chọn chi nhánh"
        options={optionsGioLamViec}
      />
      <div
        className='w-full flex items-start gap-2'
      >
        <p>
          Chụp ảnh khi chấm công:
        </p>

        <Switch
          name="checkedTKA"
          checked={checkedTKA}
          onClick={() => {
            setCheckedTKA(!checkedTKA);
          }}
          style={{
            backgroundColor: checkedTKA == true ? "orange" : "gray"
          }}
        />
      </div>

      <button
        type="button"
        className='w-max ms-auto px-6 py-1.5 mt-2 rounded bg-orange-400 text-white font-semibold'
      >
        Lưu
      </button>
    </div>
  )
}
