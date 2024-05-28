import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaArrowUpRightDots, FaRegClock } from "react-icons/fa6";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { Modal, Switch, Tooltip } from 'antd';
import { cauHinhChungService } from '../../../services/cauHinhChungService';
import { localStorageService } from '../../../services/localStorageService';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

export default function ThoiGianChamCong() {

  let [reload, setReload] = useState(0);
  let inputRef = useRef(null);
  const [gioLamViec, setGioLamViec] = useState([]);
  let token = localStorageService.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PopupContent, setPopupContent] = useState(null);

  useEffect(() => {
    cauHinhChungService.layGioCong(token).then((res) => {
      setGioLamViec(res.data.content);
    })
      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  let handleCreateUpdateGioCong = (e, id) => {
    if(e.target.value == ""){
      return
    }
    let data = {
      id
    };
    if (e.target.name == "hanhChinh") {
      data.loai_ca = 0;
    } else if (e.target.name == "theoCa") {
      data.loai_ca = 1;
    }
    if (e.target.id == "gio_bat_dau" || e.target.id == "gio_ket_thuc" || e.target.id == "tang_ca_vao" || e.target.id == "tang_ca_ra") {
      e.target.value += ":00"
    }
    data[e.target.id] = e.target.value;
    // if(data.gio_cong_chuan){
    //     data.gio_cong_chuan = Number(data.gio_cong_chuan)
    // }
    // if(data.tang_ca_gio_cong){
    //     data.tang_ca_gio_cong = Number(data.tang_ca_gio_cong)
    // }
    cauHinhChungService.createUpdateGioCong(token, data).then((res) => {
      setReload(Date.now());
      inputRef.current.value = "";
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    })
      .catch((err) => {
        console.log(err);
      });
  }
  const debounceApi = useCallback(debounce((e, id) => handleCreateUpdateGioCong(e, id), 2000), [])
  let changeInput = (e, index, id) => {
    let clone = { ...gioLamViec };
    if (!clone.hanhChinh) {
      clone.hanhChinh = {
        name: "Hành Chính",
        gio_bat_dau: "",
        gio_ket_thuc: "",
        loai_ca: 0,
        gio_cong_chuan: "",
      }
    }
    if (!clone.tangCa) {
      clone.tangCa = {
        gio_bat_dau: "",
        gio_ket_thuc: "",
        loai_ca: 1,
        gio_cong_chuan: "",
      }
    }
    if (e.target.name == "theoCa") {
      clone[e.target.name][index][e.target.id] = e.target.value
    } else {
      clone[e.target.name][e.target.id] = e.target.value;
    }
    setGioLamViec(clone);
    debounceApi(e, id)
  }
  let handleDeleteCaLamViec = (e, id) => {
    let data = {
      id,
      ca_status: Number(e)
    }
    cauHinhChungService.createUpdateGioCong(token, data).then((res) => {
      setReload(Date.now());
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    })
      .catch((err) => {
        console.log(err);
      });
  }
  // const renderCaLamViec = () => {
  //   return gioLamViec?.theoCa?.map((ca, index) => {
  //     return (
  //       <div
  //         key={index}
  //         className='w-full flex justify-center items-center gap-2 text-gray-800'
  //       >
  //         <FaRegClock
  //           className='text-gray-300 text-2xl'
  //         />
  //         <div className='flex-1'>
  //           <p
  //             className='text-gray-700 line-clamp-1 text-sm'
  //           >
  //             {ca?.name}
  //           </p>
  //           <p
  //             className='font-bold line-clamp-1 -mt-1'
  //           >
  //             {moment(ca?.gio_bat_dau, "HH:mm:ss").format("HH:mm")} - {moment(ca?.gio_ket_thuc, "HH:mm:ss").format("HH:mm")}
  //           </p>
  //         </div>
  //         <Switch
  //           name="theoCa"
  //           checked={ca?.ca_status}
  //           onChange={(e) => {
  //             handleDeleteCaLamViec(e, ca?.id);
  //           }}
  //           style={{
  //             backgroundColor: ca?.ca_status ? "orange" : "gray"
  //           }}
  //         />
  //       </div>
  //     );
  //   })
  // };

  const renderCaLamViec = () => {
    return gioLamViec?.theoCa?.map((ca,index) => {
      return <tr key={index}>
        <td>
          <Switch
               name="theoCa"
               checked={ca?.ca_status}
               onChange={(e) => {
                 handleDeleteCaLamViec(e, ca?.id);
               }}
               style={{
                 backgroundColor: ca?.ca_status ? "orange" : "gray"
               }}
             />
        </td>
        <td>
          <p className='text-gray-700 line-clamp-1 text-sm'>{ca?.name}</p>
          <p
            className='font-bold line-clamp-1 -mt-1'
            >
                      {
                        ca?.gio_bat_dau
                          ? moment(ca?.gio_bat_dau, "HH:mm:ss").format("HH:mm")
                          : '00:00:00'
                      }
                      <span className='mx-2'>-</span>
                      {
                        ca?.gio_ket_thuc
                          ? moment(ca?.gio_ket_thuc, "HH:mm:ss").format("HH:mm")
                          : '00:00:00'
                      }
                      <span className='mx-2'> | </span>
                      {
                        ca?.gio_cong_chuan
                          ? ca?.gio_cong_chuan + "h/ca"
                          : ''
                      }
          </p>
        </td>
        {/* <td>
          <p className='text-transparent line-clamp-1 text-sm'>aaa</p>
          <p
            className='font-bold line-clamp-1 -mt-1'
            >
                        {
                          ca?.tang_ca_vao
                            ? moment(ca?.tang_ca_vao, "HH:mm:ss").format("HH:mm")
                            : '00:00:00'
                        }
                        <span className='mx-2'>-</span>
                        {
                          ca?.tang_ca_ra
                            ? moment(ca?.tang_ca_ra, "HH:mm:ss").format("HH:mm")
                            : '00:00:00'
                        }
                        <span className='mx-2'> | </span>
                      {
                        ca?.tang_ca_gio_cong
                          ? ca?.tang_ca_gio_cong + "h/ngày"
                          : ''
                      }
          </p>
        </td> */}
      </tr>
    })
  }
  let renderCaLamViecTable = () => {
    return gioLamViec.theoCa?.map((ca, index) => {
      return <tr className='cursor-pointer' key={index}>
        <td>
          <Switch
            name="theoCa"
            checked={ca?.ca_status}
            onChange={(e) => {
              handleDeleteCaLamViec(e, ca?.id);
            }}
            style={{
              backgroundColor: ca?.ca_status ? "orange" : "gray"
            }}
          />
        </td>
        <td>
          <input
            onChange={(e) => changeInput(e, index, ca?.id ? ca.id : 0)}
            onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, ca?.id ? ca.id : 0) }}
            className='w-full text-left bg-transparent focus:outline-none px-2 py-1 focus:border-b'
            type="text"
            name="theoCa"
            id="name"
            value={ca?.name}
          />
        </td>
        <td className='text-center'>
          <input
            onChange={(e) => changeInput(e, index, ca?.id ? ca.id : 0)}
            onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, ca?.id ? ca.id : 0) }}
            className='w-full text-center bg-transparent focus:outline-none px-2 py-1'
            type="time"
            name='theoCa'
            id='gio_bat_dau'
            value={ca?.gio_bat_dau}
          />
        </td>
        <td>
          <input
            onChange={(e) => changeInput(e, index, ca?.id ? ca.id : 0)}
            onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, ca?.id ? ca.id : 0) }}
            type="time"
            className='w-full text-center bg-transparent focus:outline-none px-2 py-1'
            name='theoCa'
            id='gio_ket_thuc'
            value={ca?.gio_ket_thuc}
          />
        </td>
        <td className='text-center'>
          <input
            onChange={(e) => changeInput(e, index, ca?.id ? ca.id : 0)}
            onKeyDown={(e) => {
              (e.key == "Enter") && handleCreateUpdateGioCong(e, ca?.id ? ca.id : 0)
            }}
            type="text"
            className='text-center w-11 focus:outline-none focus:border-b-[1px] focus:border-black bg-transparent'
            name='theoCa'
            id="gio_cong_chuan"
            value={ca.gio_cong_chuan ? ca.gio_cong_chuan : ""}
          />Giờ/Ca
        </td>
        {/* <td className='text-center'>
          <input
            onChange={(e) => changeInput(e, index, ca?.id ? ca.id : 0)}
            onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, ca?.id ? ca.id : 0) }}
            className='w-full text-center bg-transparent focus:outline-none px-2 py-1'
            type="time"
            name='theoCa'
            id='tang_ca_vao'
            value={ca?.tang_ca_vao}
          />
        </td>
        <td className='text-center'>
          <input
            onChange={(e) => changeInput(e, index, ca?.id ? ca.id : 0)}
            onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, ca?.id ? ca.id : 0) }}
            className='w-full text-center bg-transparent focus:outline-none px-2 py-1'
            type="time"
            name='theoCa'
            id='tang_ca_ra'
            value={ca?.tang_ca_ra}
          />
        </td>
        <td className='text-center'>
          <input
            onChange={(e) => changeInput(e, index, ca?.id ? ca.id : 0)}
            onKeyDown={(e) => {
              (e.key == "Enter") && handleCreateUpdateGioCong(e, ca?.id ? ca.id : 0)
            }}
            type="text"
            className='text-center w-11 focus:outline-none focus:border-b-[1px] focus:border-black bg-transparent'
            name='theoCa'
            id="tang_ca_gio_cong"
            value={ca.tang_ca_gio_cong ? ca.tang_ca_gio_cong : ""}
          />Giờ/Ngày
        </td> */}
      </tr >
    })
  }
  return (
    <div className='w-full flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col gap-2'>
      <h1
        className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg'
      >
        <FaRegClock />
        <strong>
          Thời gian chấm công
        </strong>
      </h1>

      {/* <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2'>

        <div className='self-center w-full flex flex-col items-center gap-4 px-4'>
          <div className='w-full flex justify-start lg:justify-center items-center gap-2 text-gray-800'>
            <BsFillBriefcaseFill
              className='text-gray-300 text-2xl'
            />
            <div>
              <p
                className='text-gray-700 line-clamp-1 text-sm'
              >
                Hành chính
              </p>
              <p
                className='font-bold line-clamp-1 -mt-1'
              >
                {
                  gioLamViec.hanhChinh?.gio_bat_dau
                    ? moment(gioLamViec.hanhChinh?.gio_bat_dau, "HH:mm:ss").format("HH:mm")
                    : '00:00'
                }
                <span className='mx-2'>-</span>
                {
                  gioLamViec.hanhChinh?.gio_ket_thuc
                    ? moment(gioLamViec.hanhChinh.gio_ket_thuc, "HH:mm:ss").format("HH:mm")
                    : '00:00'
                }
              </p>
            </div>
          </div>
          <div className='w-full flex justify-start lg:justify-center items-center gap-2 text-gray-800'>
            <FaArrowUpRightDots
              className='text-gray-300 text-2xl'
            />
            <div>
              <p
                className='text-gray-700 line-clamp-1 text-sm'
              >
                Tăng Ca
              </p>
              <p
                className='font-bold line-clamp-1 -mt-1'
              >
                {
                  gioLamViec.hanhChinh?.tang_ca_vao
                    ? moment(gioLamViec.hanhChinh?.tang_ca_vao, "HH:mm:ss").format("HH:mm")
                    : '00:00:00'
                }
                <span className='mx-2'>-</span>
                {
                  gioLamViec.hanhChinh?.tang_ca_ra
                    ? moment(gioLamViec.hanhChinh?.tang_ca_ra, "HH:mm:ss").format("HH:mm")
                    : '00:00:00'
                }
              </p>
            </div>
          </div>
        </div>

        <div className='self-center w-full flex flex-col items-center gap-4 px-4 lg:border-l border-gray-800'>
          {renderCaLamViec()}
        </div>

      </div> */}
      <table className='customTable w-full'>
        <thead>
          <th></th>
          <th>Giờ Làm Việc</th>
          {/* <th>Tăng Ca</th> */}
        </thead>
        <tbody>
          {
            gioLamViec?.hanhChinh ?
              <tr>
                <td></td>
                <td>
                  <p className='text-gray-700 line-clamp-1 text-sm'>{gioLamViec?.hanhChinh?.name}</p>
                  <p
                      className='font-bold line-clamp-1 -mt-1'
                    >
                      {
                        gioLamViec.hanhChinh?.gio_bat_dau
                          ? moment(gioLamViec.hanhChinh?.gio_bat_dau, "HH:mm:ss").format("HH:mm")
                          : '00:00:00'
                      }
                      <span className='mx-2'>-</span>
                      {
                        gioLamViec.hanhChinh?.gio_ket_thuc
                          ? moment(gioLamViec.hanhChinh?.gio_ket_thuc, "HH:mm:ss").format("HH:mm")
                          : '00:00:00'
                      }
                      <span className='mx-2'> | </span>
                      {
                        gioLamViec.hanhChinh?.gio_cong_chuan
                          ? gioLamViec.hanhChinh?.gio_cong_chuan + "h/ca"
                          : ''
                      }
                  </p>
                </td>
                {/* <td>
                    <p className='text-transparent line-clamp-1 text-sm'>aaa</p>
                    <p
                        className='font-bold line-clamp-1 -mt-1'
                      >
                        {
                          gioLamViec.hanhChinh?.tang_ca_vao
                            ? moment(gioLamViec.hanhChinh?.tang_ca_vao, "HH:mm:ss").format("HH:mm")
                            : '00:00:00'
                        }
                        <span className='mx-2'>-</span>
                        {
                          gioLamViec.hanhChinh?.tang_ca_ra
                            ? moment(gioLamViec.hanhChinh?.tang_ca_ra, "HH:mm:ss").format("HH:mm")
                            : '00:00:00'
                        }
                        <span className='mx-2'> | </span>
                      {
                        gioLamViec.hanhChinh?.tang_ca_gio_cong
                          ? gioLamViec.hanhChinh?.tang_ca_gio_cong + "h/ngày"
                          : ''
                      }
                  </p>
                </td> */}
              </tr>
            : ""
          }
          {
            renderCaLamViec()
          }
        </tbody>
      </table>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className='w-1/3 h-10 mx-auto rounded-full bg-slate-100 font-bold hover:bg-orange-400 hover:text-white'
      >
        Cập nhật
      </button>
      <Modal open={isModalOpen} footer={""} onCancel={handleCancel} width={"70%"}>
        <div className='overflow-auto'>
          <table className='customTable w-full'>
            <thead className='sticky top-0 z-10'>
              <th className='w-20 text-left'></th>
              <th className='text-left w-40'><p className='px-2'>Tên ca</p></th>
              <th className='text-center'>Giờ vào</th>
              <th className='text-center'>Giờ ra</th>
              <th className='text-center'>Giờ công chuẩn</th>
              {/* <th className='text-center'>Tăng ca vào</th>
              <th className='text-center'>Tăng Ca ra</th>
              <th className='text-center'>Giờ công tăng ca</th> */}
            </thead>
            <tbody>
              <tr>
                <td><i className='fa-solid fa-briefcase text-orange-400 text-xl'></i></td>
                <td className='text-left'><p className='px-2'>{gioLamViec?.hanhChinh?.name}</p></td>
                <td>
                  <input
                    onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)}
                    onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0) }}
                    type="time" className='text-center w-full rounded focus-within:outline-none px-2 py-1 bg-transparent'
                    name='hanhChinh' id="gio_bat_dau" value={gioLamViec.hanhChinh?.gio_bat_dau} />
                </td>
                <td>
                  <input
                    onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)}
                    onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0) }}
                    type="time" className='text-center w-full rounded focus-within:outline-none px-2 py-1 bg-transparent'
                    name='hanhChinh' id='gio_ket_thuc' value={gioLamViec.hanhChinh?.gio_ket_thuc ? gioLamViec.hanhChinh?.gio_ket_thuc : ""} />
                </td>
                <td className='text-center'>
                  <input
                    onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)}
                    onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0) }}
                    type="text" className='text-center w-11 focus:outline-none focus:border-b-[1px] focus:border-black bg-transparent'
                    name='hanhChinh' id="gio_cong_chuan" value={gioLamViec.hanhChinh?.gio_cong_chuan ? gioLamViec.hanhChinh?.gio_cong_chuan : ""} />Giờ/Ca
                </td>
                {/* <td>
                  <input
                    onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)}
                    onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0) }}
                    type="time" className='text-center w-full rounded focus-within:outline-none px-2 py-1 bg-transparent'
                    name='hanhChinh' id="tang_ca_vao" value={gioLamViec.hanhChinh?.tang_ca_vao ? gioLamViec.hanhChinh?.tang_ca_vao : ""} />
                </td> */}
                {/* <td>
                  <input
                    onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)}
                    type="time" className='text-center w-full rounded focus-within:outline-none px-2 py-1 bg-transparent'
                    name='hanhChinh' id='tang_ca_ra' value={gioLamViec.hanhChinh?.tang_ca_ra ? gioLamViec.hanhChinh?.tang_ca_ra : ""} />
                </td> */}
                {/* <td className='text-center'>
                  <input
                    onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)}
                    onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0) }}
                    type="text" className='text-center w-11 focus:outline-none focus:border-b-[1px] focus:border-black bg-transparent'
                    name='hanhChinh' id="tang_ca_gio_cong" value={gioLamViec.hanhChinh?.tang_ca_gio_cong ? gioLamViec.hanhChinh?.tang_ca_gio_cong : ""} />Giờ/Ngày
                </td> */}
              </tr>
              {renderCaLamViecTable()}
              <tr className='addRow'>
                <td>
                  <i className='fa-solid fa-plus text-lg text-orange-400'></i>
                </td>
                <td>
                  <Tooltip title="Nhấn Enter Để Lưu">
                    <input
                      ref={inputRef}
                      placeholder='Ca mới...'
                      onKeyDown={(e) => { (e.key == "Enter") && e.target.blur() }}
                      className='w-full min-w-0 text-left bg-transparent focus:outline-none px-2 py-1 focus:border-b'
                      type="text"
                      name="theoCa"
                      id="name"
                      onFocus={() => {
                        setIsPopupOpen(true);
                        setPopupContent('Nhập tên ca');
                      }}
                      onBlur={(e) => {
                        setIsPopupOpen(false);
                        setPopupContent(null);
                        handleCreateUpdateGioCong(e, 0);
                      }}
                    />
                  </Tooltip>
                </td>
                <td>
                  {/* <input onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)} onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0) }} type="time" className='text-center w-full rounded focus-within:outline-none px-2 bg-transparent' name='hanhChinh' id="gio_bat_dau" value={gioLamViec.hanhChinh?.gio_bat_dau} /> */}
                </td>
                <td>
                  {/* <input onChange={(e) => changeInput(e, 0, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0)} onKeyDown={(e) => { (e.key == "Enter") && handleCreateUpdateGioCong(e, gioLamViec.hanhChinh?.id ? gioLamViec.hanhChinh.id : 0) }} type="time" className='text-center w-full rounded focus-within:outline-none px-2 bg-transparent' name='hanhChinh' id='gio_ket_thuc' value={gioLamViec.hanhChinh?.gio_ket_thuc ? gioLamViec.hanhChinh?.gio_ket_thuc : ""} /> */}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}
