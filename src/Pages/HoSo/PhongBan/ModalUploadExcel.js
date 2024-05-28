import React from 'react'

import { InboxOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { FaDownload, FaRegCircleXmark } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { localStorageService } from '../../../services/localStorageService';

const { Dragger } = Upload;


function ModalUploadExcel({
  showModal,
  handleOk,
  handleCancel,
  setFile
}) {

  const props = {
    name: 'file',
    headers: {
      'Content-type': 'multipart/form-data',
      'Authorization': localStorageService.getItem("token"),
    },
    beforeUpload: (file) => {
      return false;
    },
    onChange(info) {
      setFile(info);
    },
  };

  return (
    <Modal
      open={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1024}
      footer={false}
    >
      <div className='w-full grid grid-cols-2'>
        <div className='w-full h-full p-4 border-r border-gray-300 flex flex-col justify-center items-center gap-y-5'>
          <h1 className='uppercase font-bold text-2xl text-sky-400'>
            Tải dữ liệu mẫu
          </h1>

          <div className='flex-1 w-full flex flex-col justify-center items-center gap-4'>
            <a
              href="https://apihr.weos.vn/public/excel/employee-data-file-example.xlsx"
              className='w-max flex justify-center items-center gap-2 px-10 py-2 rounded bg-slate-100 border border-gray-600 text-gray-800 cursor-pointer'
            >
              <FaDownload />
              <span>Tải xuống</span>
            </a>
          </div>
        </div>
        <div className='w-full h-full p-4 flex flex-col justify-center items-center gap-y-5'>
          <h1 className='uppercase font-bold text-2xl text-sky-400'>
            Tải dữ liệu lên
          </h1>

          <div className='flex-1 w-full flex flex-col justify-center items-center gap-4'>
            <Dragger {...props} multiple="false" maxCount={1} className='w-full'>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Bấm vào hoặc kéo thả file vào khu vực này để tải lên</p>
            </Dragger>
          </div>
        </div>
      </div>

      <div className='w-full mt-4 flex justify-end gap-4'>
        <button
          type="button"
          className='px-6 py-2 rounded flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 text-gray-600 border'
          onClick={handleCancel}
        >
          <FaRegCircleXmark />
          <strong>Hủy</strong>
        </button>
        <button
          type="button"
          className='px-6 py-2 rounded flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white border'
          onClick={handleOk}
        >
          <FaCheckCircle />
          <strong>Xác nhận</strong>
        </button>
      </div>
    </Modal>
  )
}

export default ModalUploadExcel