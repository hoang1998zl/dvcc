import React from 'react'

import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import { FaDownload, FaRegCircleXmark } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: '', //api upload
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

function ModalUploadExcel({
  showModal,
  handleOk,
  handleCancel,
}) {

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
              href="/"
              className='w-max flex justify-center items-center gap-2 px-10 py-2 rounded bg-slate-100 border border-gray-600 text-gray-800 cursor-pointer'
            >
              <FaDownload />
              <span>Download</span>
            </a>
          </div>
        </div>
        <div className='w-full h-full p-4 flex flex-col justify-center items-center gap-y-5'>
          <h1 className='uppercase font-bold text-2xl text-sky-400'>
            Upload dữ liệu
          </h1>

          <div className='flex-1 w-full flex flex-col justify-center items-center gap-4'>
            <Dragger {...props} className='w-full'>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
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