import React from 'react'
import { Modal } from 'antd';
import { FaCheckCircle } from 'react-icons/fa';
import { FaRegCircleXmark } from 'react-icons/fa6';


// const json = {
//   "status": "success",
//   "message": "Vui lòng xem trước dữ liệu",
//   "employeesData": [
//     {
//       "ma_nhan_vien": 1,
//       "phong_ban": "ACC",
//       "chuc_vu": "AM",
//       "gioi_tinh": "M",
//       "ho_ten": "Hoàng Huy Cảnh",
//       "ngay_sinh": "1978-04-01",
//       "so_cmtcccd": "064078001828",
//       "ngay_cap": "2021-04-29",
//       "noi_cap": "Cục cảnh sát ",
//       "noi_o_hien_tai": "200 đường số 9, Quận 7, TPHCM",
//       "lien_he": "0938056558",
//       "email": "laptrinhanbinh@gmail.com",
//       "thoi_gian_thu_viec": "2009-06-19",
//       "thoi_gian_ky_hop_dong": "2009-06-19"
//     },
//     {
//       "ma_nhan_vien": 2,
//       "phong_ban": "ACC",
//       "chuc_vu": "Staff",
//       "gioi_tinh": "F",
//       "ho_ten": "Nguyễn Bùi Thu Thảo",
//       "ngay_sinh": "2019-09-03",
//       "so_cmtcccd": "941327015622",
//       "ngay_cap": "2021-04-30",
//       "noi_cap": "Cục cảnh sát ",
//       "noi_o_hien_tai": "32/11 Phạm văn chiêu, Gò vấp, TP.HCM",
//       "lien_he": "0938056559",
//       "email": null,
//       "thoi_gian_thu_viec": "2009-07-06",
//       "thoi_gian_ky_hop_dong": "2009-07-06"
//     },
//     {
//       "ma_nhan_vien": 3,
//       "phong_ban": "ADM",
//       "chuc_vu": "SV",
//       "gioi_tinh": "F",
//       "ho_ten": "Lương Thị  Linh",
//       "ngay_sinh": "2012-10-15",
//       "so_cmtcccd": "930864782346",
//       "ngay_cap": "2021-05-01",
//       "noi_cap": "Cục cảnh sát ",
//       "noi_o_hien_tai": "96 An Dương Vương, Quận 5, TP.HCM",
//       "lien_he": "0938056560",
//       "email": null,
//       "thoi_gian_thu_viec": "2010-04-05",
//       "thoi_gian_ky_hop_dong": "2010-04-05"
//     }
//   ]
// }

export default function ModalShowDataUpload({
  showModal,
  handleOk,
  handleCancel,
  dataUploadFile
}) {

  const renderData = () => {

    return dataUploadFile?.employeesData?.map((item, index) => {
      return (
        <tr key={index}>
          <td className='p-2 border'>
            {item.ma_nhan_vien}
          </td>
          <td className='p-2 border'>
            {item.phong_ban}
          </td>
          <td className='p-2 border'>
            {item.chuc_vu}
          </td>
          <td className='p-2 border'>
            {item.gioi_tinh}
          </td>
          <td className='p-2 border'>
            {item.ho_ten}
          </td>
          <td className='p-2 border'>
            {item.ngay_sinh}
          </td>
          <td className='p-2 border'>
            {item.so_cmtcccd}
          </td>
          <td className='p-2 border'>
            {item.ngay_cap}
          </td>
          <td className='p-2 border'>
            {item.noi_cap}
          </td>
          <td className='p-2 border'>
            {item.noi_o_hien_tai}
          </td>
          <td className='p-2 border'>
            {item.lien_he}
          </td>
          <td className='p-2 border'>
            {item.email}
          </td>
          <td className='p-2 border'>
            {item.thoi_gian_thu_viec}
          </td>
          <td className='p-2 border'>
            {item.thoi_gian_ky_hop_dong}
          </td>
        </tr>
      )
    })
  }
  return (
    <Modal
      open={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1024}
      footer={false}
    >
      <h1 className='mt-5 mb-4 uppercase text-orange-500 text-2xl text-center font-bold'>
        {dataUploadFile?.message}
      </h1>
      <div className='w-full overflow-auto py-2'>
        <table className='w-max min-w-full'>
          <thead>
            <th className='p-2 border'>
              Mã nhân viên
            </th>
            <th className='p-2 border'>
              Phòng ban
            </th>
            <th className='p-2 border'>
              Chức vụ
            </th>
            <th className='p-2 border'>
              Giới tính
            </th>
            <th className='p-2 border'>
              Họ tên
            </th>
            <th className='p-2 border'>
              Ngày sinh
            </th>
            <th className='p-2 border'>
              Số CMT/CCCD
            </th>
            <th className='p-2 border'>
              Ngày cấp
            </th>
            <th className='p-2 border'>
              Nơi cấp
            </th>
            <th className='p-2 border'>
              Nơi ở hiện tại
            </th>
            <th className='p-2 border'>
              Liên hệ
            </th>
            <th className='p-2 border'>
              Email
            </th>
            <th className='p-2 border'>
              Thời gian thử việc
            </th>
            <th className='p-2 border'>
              Thời gian ký hợp đồng
            </th>
          </thead>
          <tbody>
            {renderData()}
          </tbody>
        </table>
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
