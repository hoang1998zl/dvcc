import { Form, Input } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalSlice } from '../../../../../Components/Modal/ModalSlice';

function HoSoSoBHXH() {
  const dispatch = useDispatch();

  let nhanVienHS = useSelector(state => state.HoSoNhanVienSlice.nhanVienHS);
  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Sổ BHXH
        </h1>
        <button
          type="button"
          className='w-8 aspect-square text-lg text-gray-400'
          onClick={() => {
            dispatch(setOpenModalSlice({
              open: true,
              type: 'BHXHModal',
              title: 'Cập nhật Bảo hiểm xã hội'
            }))
          }}
        >
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
      <Form
        className='mt-4'
        name="basic"
        labelWrap={true}
        labelCol={{
          span: 10
        }}
        autoComplete="off"
      >
        <Form.Item
          className='2xl:mb-2'
          label={<p className='font-semibold'>Mã số BHXH</p>}
          labelAlign='left'
          name="masobhxh"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
        >
          <p className='font-bold text-black'>
            {nhanVienHS.nv_masobhxh}
          </p>
        </Form.Item>
        <Form.Item
          className='2xl:mb-2'
          label={<p className='font-semibold'>Lương đóng BHXH</p>}
          labelAlign='left'
          name="luongdongbhxh"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
        >
          <p className='font-bold text-black'>
            {nhanVienHS.nv_luongdongbhxh}
          </p>
        </Form.Item>
        <Form.Item
          className='2xl:mb-2'
          label={<p className='font-semibold'>Công ty đóng</p>}
          labelAlign='left'
          name="congtydong"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
        >
          <p className='font-bold text-black'>
            {nhanVienHS.nv_bhxh_congtydong}
          </p>
        </Form.Item>
        <Form.Item
          className='2xl:mb-2'
          label={<p className='font-semibold'>Nhân viên đóng</p>}
          labelAlign='left'
          name="nhansudong"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
        >
          <p className='font-bold text-black'>
            {nhanVienHS.nv_bhxh_nhanviendong}
          </p>
        </Form.Item>
      </Form>
    </div>
  )
}

export default HoSoSoBHXH