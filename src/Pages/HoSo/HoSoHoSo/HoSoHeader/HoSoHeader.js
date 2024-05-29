import { DatePicker, Popconfirm, Popover, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { localStorageService } from '../../../../services/localStorageService';
import { nhanVienService } from '../../../../services/nhanVienService';
import { toast } from 'react-toastify';
import { chamCongService } from '../../../../services/chamCongService';
import dayjs from 'dayjs';
import moment from 'moment/moment';
import { setCurrentPhongBan } from '../../../../Redux-toolkit/reducer/PhongBanSlice';
import { setCurrentNhanVien } from '../../../../Redux-toolkit/reducer/UserSlice';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { setNhanVienHS } from '../../../../Redux-toolkit/reducer/HoSoNhanVienSlice';

export default function HoSoHeader() {
  let dispatch = useDispatch();
  const tableRef = useRef(null);
  let token = localStorageService.getItem('token');
  const { currentNhanVien } = useSelector(state => state.UserSlice);
  const reloadHS = useSelector(state => state.HoSoNhanVienSlice.reloadHS);
  let [nv,setNv] = useState({});
  let [phongBan, setPhongBan] = useState([]);
  let [reload,setReload] = useState();
  const [openDieuChuyen, setOpenDieuChuyen] = useState(false);
  const [openThoiViec, setOpenThoiViec] = useState(false);
  let [dieuChuyen, setDieuChuyen] = useState({
    danhmuc_id: null,
    date: moment().format('YYYY-MM-DD')
  });
  let [thoiViec, setThoiViec] = useState({
    thoiviec_reason: '',
    thoiviec_date: moment().format('YYYY-MM-DD'),
    thoiviec_note: '',
    thoiviec_file: null,
  });

  useEffect(() => {
    if(!currentNhanVien){
      return;
    }
    chamCongService.getPhongBan(token).then((res) => {
      setPhongBan(res.data.content);
    }).catch((err) => {
      console.log(err);
    })
    nhanVienService.getNhanVienTheoId(token, currentNhanVien).then((res) => {
      let clone = { ...dieuChuyen };
      clone.danhmuc_id = res.data?.content?.danhmuc_id;
      setDieuChuyen(clone);
      setNv(res.data?.content);
      dispatch(setNhanVienHS(res.data.content));
      renderTableToExport(res.data?.content);
    })
      .catch((err) => {
        console.log(err);
      });
  },[reload,currentNhanVien,reloadHS])
  const handleOpenChangeDieuChuyen = (newOpen) => {
    setOpenDieuChuyen(newOpen);
  };
  let handleDieuChuyen = () => {
    dieuChuyen['nv_id'] = currentNhanVien;
    nhanVienService.addDieuChuyen(token, dieuChuyen).then((res) => {
      if (res.data.flag != 'fail') {
        toast.success(res.data.content, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        dispatch(setCurrentPhongBan(dieuChuyen.danhmuc_id));
        setOpenDieuChuyen(false);
      } else {
        toast.error(res.data.content, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }
  let handleThoiViec = () => {
    thoiViec['nv_id'] = nv.nv_id;
    nhanVienService.addThoiViec(token, thoiViec, thoiViec.thoiviec_file).then((res) => {
      if (res.data.flag != 'fail') {
        setOpenThoiViec(false);
        dispatch(setCurrentPhongBan(null));
        dispatch(setCurrentNhanVien(null));
        toast.success(res.data.content, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
      } else {
        toast.error(res.data.content, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
      }
      
    })
      .catch((err) => {
        console.log(err);
      });
  }
  const checkNullValues = (obj, exception = null) => {
    for (let key in obj) {
      if (key == exception && key) {
        continue;
      }
      if (!obj[key]) {
        return false;
      }
    }
    return true;
  }
  let uploadCV = (e) => {
    nhanVienService.updateCV(token,nv.nv_id,e.target.files[0]).then((res) => {
      setReload(Date.now())
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }).catch((err) => {
      toast.error("Cập nhật thất bại!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      console.log(err);
      
    })
  }
  let updateAvatar = (e) => {
    nhanVienService.updateAvatar(token, nv.nv_id, e.target.files[0]).then((res) => {
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
  const addColumn = (field,value) => {
    const tdField = document.createElement('th');
    tdField.textContent = field;
    tableRef.current.children[0].children[0].appendChild(tdField);
    const tdValue = document.createElement('td');
    tdValue.textContent = value;
    tableRef.current.children[1].children[0].appendChild(tdValue);
  }
  const renderTableToExport = (dataNV) => {
    tableRef.current.children[0].children[0].innerHTML = '';
    tableRef.current.children[1].children[0].innerHTML = '';
    addColumn('Mã nhân viên',dataNV?.nv_code);
    addColumn('Phòng ban',dataNV?.ns_danhmuc_phongban.danhmuc_name);
    addColumn('Chức vụ',dataNV?.nv_chucvunew);
    addColumn('Giới tính',dataNV?.nv_gender == 1 ? 'Nam' : (dataNV?.nv_gender== 0 ? 'Nữ' : 'Khác'));
    addColumn('Họ tên',dataNV?.nv_name);
    addColumn('Ngày sinh',dayjs(dataNV?.nv_ngaysinh, "YYYY-MM-DD").isValid() ? moment(dataNV?.nv_ngaysinh, 'YYYY-MM-DD').format('DD-MM-YYYY') : '');
    addColumn('Số CMT/CCCD',dataNV?.nv_cmnd_number);
    addColumn('Ngày cấp',dayjs(dataNV?.nv_cmnd_ngaycap, "YYYY-MM-DD").isValid() ? moment(dataNV?.nv_cmnd_ngaycap, 'YYYY-MM-DD').format('DD-MM-YYYY') : '');
    addColumn('Nơi cấp',dataNV?.nv_cmnd_noicap);
    addColumn('Nơi ở hiện tại',dataNV?.nv_diachitamtru);
    addColumn('Liên hệ',dataNV?.nv_sdt_lienhe);
    addColumn('Email',dataNV?.nv_email);
    addColumn('Thời gian thử việc',dayjs(dataNV?.nv_ngayvaolam, "YYYY-MM-DD").isValid() ? moment(dataNV?.nv_ngayvaolam, 'YYYY-MM-DD').format('DD-MM-YYYY') : '');
    addColumn('Thời gian ký hợp đồng',dayjs(dataNV?.nv_ngaylvchinhthuc, "YYYY-MM-DD").isValid() ? moment(dataNV?.nv_ngaylvchinhthuc, 'YYYY-MM-DD').format('DD-MM-YYYY') : '');
    addColumn('BHXH',dataNV?.nv_masobhxh);
    addColumn('MST',dataNV?.nv_mst);
    addColumn('Hợp đồng lao động',dataNV?.nv_hopdong);
    addColumn('Ảnh CCCD mặt trước',dataNV?.nv_cmnd_truoc);
    addColumn('Ảnh CCCD mặt sau',dataNV?.nv_cmnd_sau);
    addColumn('Ảnh GPLX mặt trước',dataNV?.nv_gplx_truoc);
    addColumn('Ảnh GPLX mặt sau',dataNV?.nv_gplx_sau);
    const tdField1 = document.createElement('th');
    tdField1.rowSpan = '2';
    tdField1.textContent = 'Quá trình thăng tiến';
    tableRef.current.children[0].children[0].appendChild(tdField1);
    dataNV?.ns_nhanvien_lotrinhphattrien?.map((item)=>{
      if(item.type==1){
        addColumn(dayjs(item?.date, "YYYY-MM-DD").isValid() ? moment(item?.date, 'YYYY-MM-DD').format('DD-MM-YYYY') : 'Chưa cập nhật thời gian',item?.file_path?item?.file_path:'Chưa tải lên quyết định bổ nhiệm vị trí công tác');
      }
    })
    const tdField2 = document.createElement('th');
    tdField2.rowSpan = '2';
    tdField2.textContent = 'Quá trình công tác';
    tableRef.current.children[0].children[0].appendChild(tdField2);
    dataNV?.ns_nhanvien_lotrinhphattrien?.map((item)=>{
      if(item.type==2){
        addColumn(dayjs(item?.date, "YYYY-MM-DD").isValid() ? moment(item?.date, 'YYYY-MM-DD').format('DD-MM-YYYY') : 'Chưa cập nhật thời gian',item?.file_path?item?.file_path:'Chưa tải lên quyết định điều chuyển nơi công tác');
      }
    })
    const tdField3 = document.createElement('th');
    tdField3.rowSpan = '2';
    tdField3.textContent = 'Quan hệ gia đình';
    tableRef.current.children[0].children[0].appendChild(tdField3);
    dataNV?.ns_nhanvien_family?.map((item)=>{
      const field = ['Cha','Mẹ','Anh','Chị','Em','Vợ','Chồng','Con'];
      addColumn(field[item.type-1],item.name);
    })
  }
  let renderDieuChuyen = () => {
    return <div>
      <label className="block text-orange-400 font-bold text-md mb-2">
        Chọn Phòng ban:
      </label>
      <Select
        className="w-full"
        value={dieuChuyen.danhmuc_id}
        options={phongBan?.map((item, index) => { return { value: item?.danhmuc_id, label: item?.danhmuc_name } })}
        onChange={(value) => {
          let clone = { ...dieuChuyen };
          clone.danhmuc_id = value;
          setDieuChuyen(clone);
        }}
      />
      <label className="block text-orange-400 font-bold text-md mb-2">
        Ngày điều chuyển:
      </label>
      <DatePicker
        className="w-full"
        value={dayjs(dieuChuyen.date, "YYYY-MM-DD").isValid()?dayjs(dieuChuyen.date, "YYYY-MM-DD"):''}
        format="DD-MM-YYYY"
        locale={'viVN'}
        onChange={(date, dateString) => {
          let clone = { ...dieuChuyen };
          clone['date'] = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
          setDieuChuyen(clone);
        }}
      />
      <div className='w-full mt-4 text-right'>
        <button
          type='button'
          className={`bg-orange-400 text-white py-2 px-4 pe-7 relative rounded font-semibold ${!checkNullValues(dieuChuyen) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={!checkNullValues(dieuChuyen)}
          onClick={() => {
            handleDieuChuyen();
          }}
        >
          Đồng ý
          <div className='customTicket absolute -bottom-3 -right-2'></div>
        </button>
      </div>
    </div>
  }
  let renderThoiViec = () => {
    return <div>
      <label className="block text-orange-400 font-bold text-md mb-2">
        Lý do thôi việc (*):
      </label>
      <textarea
        style={{ border: "1px solid #d5d5d5", paddingLeft: "10px", paddingTop: "5px", minHeight: "100px" }}
        className="w-full"
        value={thoiViec?.thoiviec_reason}
        placeholder='Lý do thôi việc'
        onChange={(e) => {
          let clone = { ...thoiViec };
          clone.thoiviec_reason = e.target.value;
          setThoiViec(clone);
        }}
      />
      <label className="block text-orange-400 font-bold text-md mb-2">
        Ngày thôi việc chính thức (*):
      </label>
      <DatePicker
        className="w-full"
        value={dayjs(thoiViec.thoiviec_date, "YYYY-MM-DD").isValid()?dayjs(thoiViec.thoiviec_date, "YYYY-MM-DD"):''}
        format="DD-MM-YYYY"
        locale={'viVN'}
        onChange={(date, dateString) => {
          let clone = { ...dieuChuyen };
          clone['thoiviec_date'] = dateString ? moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
          setThoiViec(clone);
        }}
      />
      <label className="block text-orange-400 font-bold text-md mb-2">
        Ghi chú thôi việc:
      </label>
      <textarea
        style={{ border: "1px solid #d5d5d5", paddingLeft: "10px", paddingTop: "5px", minHeight: "100px" }}
        className="w-full"
        value={thoiViec?.thoiviec_note}
        placeholder='Ghi chú thôi việc'
        onChange={(e) => {
          let clone = { ...thoiViec };
          clone.thoiviec_note = e.target.value;
          setThoiViec(clone);
        }}
      />
      <label className="block text-orange-400 font-bold text-md mb-2">
        Đính kèm quyết định thôi việc đã được phê duyệt(*):
      </label>
      <label htmlFor='thoiViecFile' style={{ border: "1px solid", padding: " 4px 4px 4px 4px", backgroundColor: "lightgray" }}>
        <input type='file' id='thoiViecFile' title='Chọn file' className='hidden' onChange={(e) => {
          let clone = { ...thoiViec };
          clone.thoiviec_file = e.target.files[0];
          setThoiViec(clone);
        }} />Chọn file quyết định thôi việc (Tối đa 2Mb)
      </label>
      <label className="text-orange-400 font-semibold" style={{ marginLeft: '10px', fontStyle: 'italic' }}>{thoiViec.thoiviec_file?.name}</label>
      <div className='w-full mt-4 text-right'>
        <Popconfirm
          title="Xác nhận cho thôi việc nhân viên này?"
          okText="Xác nhận"
          cancelText="Huỷ"
          onConfirm={() => {
            handleThoiViec();
          }}
        >
          <button
            type='button'
            className={`bg-orange-400 text-white py-2 px-4 pe-7 relative rounded font-semibold ${!checkNullValues(thoiViec, 'thoiviec_note') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={!checkNullValues(thoiViec, 'thoiviec_note')}
          >
            Đồng ý
            <div className='customTicket absolute -bottom-3 -right-2'></div>
          </button>
        </Popconfirm>
      </div>
    </div>
  }
  return (
    <div className='w-full bg-white border rounded-lg shadow-lg 2xl:sticky top-0 z-10'>
      <div className='w-full relative py-8 px-4'>
        <div className='w-full h-20 bg bg-slate-100 bg-gradient-to-b from-slate-100 to-gray-500 rounded-lg absolute top-0 left-0 z-0'></div>
        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-end gap-4 relative z-10'>
          <div
            className='flex flex-col 2xl:flex-row items-center lg:items-start 2xl:items-end gap-4'
          >
            <Popover
              arrow={false}
              placement='right'
              content={(
                <ul className='w-40'>
                  <li>
                    <button
                      type="button"
                      onClick={() => window.open(nv?.nv_avatar)}
                      className='w-full px-2 py-1 rounded border border-transparent hover:bg-orange-100 hover:border-orange-400 text-left'
                    >
                      Xem
                    </button>
                  </li>
                  <li className='border-t'>
                    <button
                      type="button"
                      className='w-full px-2 py-1 rounded border border-transparent hover:bg-orange-100 hover:border-orange-400 text-left'
                    >
                      <label
                        htmlFor='avatar'
                        className='w-full block text-left rounded-md font-normal'
                      >
                        <input
                          id='avatar'
                          accept="image/*"
                          type="file"
                          name=""
                          className='hidden'
                          onChange={updateAvatar}
                        />
                        Đổi Ảnh
                      </label>
                    </button>
                  </li>
                </ul>
              )}
              trigger="hover"
            >
              <img
                className='border w-28 aspect-square rounded-full bg-orange-400 z-10'
                src={nv?.nv_avatar ? nv.nv_avatar : 'https://apihr.weos.vn/public/avatar/avatar.png'}
                alt=""
              />
            </Popover>
            <div className='text-left'>
              <h1 className='text-lg flex flex-wrap gap-x-1'>
                <strong>
                  {nv?.nv_name}
                </strong>
                <span>
                  (ID: <span>{nv?.nv_code}</span>)
                </span>
              </h1>
              <p className='flex flex-wrap gap-x-1'>
                <span>
                  Chức vụ:
                </span>
                <span>
                  {nv?.nv_chucvunew}
                </span>
              </p>
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <DownloadTableExcel
              filename={`Hồ sơ nhân sự - ${nv?.nv_name}`} sheet="sheet1"
              currentTableRef={tableRef.current}
            >
              <button
                type="button"
                className='w-40 px-4 py-1 rounded-md bg-orange-400 hover:bg-orange-500 text-white flex justify-center items-center gap-2'
              >
                <i className='fa-solid fa-download'></i>
                Hồ sơ nhân sự
              </button>
            </DownloadTableExcel>
            <Popover
                arrow={false}
                placement='right'
                content={(
                  <ul className='w-40'>
                    <li>
                      <button
                        type="button"
                        onClick={() => nv?.nv_cv?window.open(nv?.nv_cv):""}
                        className='w-full px-2 py-1 rounded border border-transparent hover:bg-orange-100 hover:border-orange-400 text-left'
                      >
                        Tải Xuống CV
                      </button>
                    </li>
                    <li className='border-t'>
                      <button
                        type="button"
                        className='w-full px-2 py-1 rounded border border-transparent hover:bg-orange-100 hover:border-orange-400 text-left'
                      >
                        <label
                          htmlFor='avatar'
                          className='w-full block text-left rounded-md font-normal'
                        >
                          <input
                            id='avatar'
                            type="file"
                            name=""
                            className='hidden'
                            onChange={uploadCV}
                          />
                          Đổi CV (Tối đa 2Mb)
                        </label>
                      </button>
                    </li>
                  </ul>
                )}
                trigger="click"
            >
                <button
                type="button"
                className='px-4 py-1 rounded-md bg-orange-400 hover:bg-orange-500 text-white flex justify-center items-center gap-2'
                >
                  <i className='fa-solid fa-download'></i>
                  <span>
                    CV nhân sự
                  </span>
                </button>
            </Popover>
            <Popover
              title="Điều Chuyển Nhân Viên"
              trigger="click"
              placement='top'
              content={renderDieuChuyen()}
              open={openDieuChuyen} onOpenChange={handleOpenChangeDieuChuyen}
            >
              <button className='px-4 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-black flex justify-center items-center gap-2'>
                <i className="fa-solid fa-right-left"></i>
                <span>
                  Điều chuyển
                </span>
              </button>
            </Popover>
            <Popover
              open={openThoiViec} onOpenChange={setOpenThoiViec}
              content={renderThoiViec()}
              title="Thôi việc Nhân Viên"
              trigger="click"
              placement='leftBottom'
              overlayStyle={{
                width: "900px"
              }}
            >
              <button className='px-4 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white flex justify-center items-center gap-2'>
                <i className="fa-solid fa-x"></i>
                <span>
                  Thôi việc
                </span>
              </button>
            </Popover>
          </div>
        </div>
      </div>
      <div className='hidden'>
        <table ref={tableRef} className='min-w-full relative'>
          <thead><tr></tr></thead>
          <tbody><tr></tr></tbody>
        </table>
      </div>
    </div>
  )
}
