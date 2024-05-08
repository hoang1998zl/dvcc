import React, { useEffect, useState } from 'react';
import { folderSVG, folderClosedSVG } from '../../../issets/svg/svg'
import { FaSearch } from 'react-icons/fa';
import { FaCaretDown } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPhongBan } from '../../../Redux-toolkit/reducer/PhongBanSlice';
import { setCurrentNhanVien } from '../../../Redux-toolkit/reducer/UserSlice';
import { chamCongService } from '../../../services/chamCongService';
import { localStorageService } from '../../../services/localStorageService';
import { toast } from 'react-toastify';
import { Popconfirm } from 'antd';
import CharacterRepalce from '../../../GlobalFunction/CharacterReplace'
import ModalUploadExcel from './ModalUploadExcel';
import ModalShowDataUpload from './ModalShowDataUpload';

export default function PhongBan() {

  let token = localStorageService.getItem("token");
  let isUpdate = false;
  const dispatch = useDispatch();

  const { currentPhongBan } = useSelector(state => state.PhongBanSlice);
  const { currentNhanVien } = useSelector(state => state.UserSlice);
  let [reload, setReload] = useState(0);

  const [listPhongBan, setListPhongBan] = useState([]);
  let [cloneListPhongBan, setCloneListPhongBan] = useState([]);
  const [addPhongBanRow, setAddPhongBanRow] = useState(false);
  const [addNhanVienRow, setAddNhanVienRow] = useState({
    open: false,
    phongban_id: 0,
  });


  useEffect(() => {
    chamCongService.getPhongBanNhanVien(token).then((res) => {
      setListPhongBan(res.data.content);
      setCloneListPhongBan(res.data.content);
      if (!currentPhongBan) {
        dispatch(setCurrentPhongBan(res.data.content[0].danhmuc_id));
      }
      if (!currentNhanVien) {
        dispatch(setCurrentNhanVien(res.data.content[0].ns_nhanvien[0]?.nv_id));
      }
    }).catch((err) => {
      console.log(err)
    })
  }, [reload, currentPhongBan]);

  // các hàm change input
  let searchUser = (e) => {
    if (e.target.value == "") {
      setListPhongBan(cloneListPhongBan);
      dispatch(setCurrentPhongBan(cloneListPhongBan[0].danhmuc_id))
      dispatch(setCurrentNhanVien(cloneListPhongBan[0].ns_nhanvien[0].nv_id))
      return;
    }
    let array = [];
    cloneListPhongBan?.map((phongBan) => {
      let isFound = false;
      let nhanVienList = [];
      phongBan.ns_nhanvien?.map((nhanVien) => {
        if (CharacterRepalce(nhanVien?.nv_name.toLowerCase()).includes(CharacterRepalce(e.target.value.toLowerCase()))) {
          nhanVienList.push(nhanVien);
          isFound = true;
        }
      })
      if (isFound) {
        let data = {
          danhmuc_id: phongBan.danhmuc_id,
          danhmuc_name: phongBan.danhmuc_name,
          ns_nhanvien: nhanVienList
        }
        array.push(data);
      }
    })
    // chỗ này không dùng hàm hanldeChangeCurrentPB vì hàm setListPhongBan sẽ chạy chậm hơn gây ra lỗi select nv đầu tiên tìm thấy
    setListPhongBan(array);
    if (array[0]) {
      if (array[0].ns_nhanvien[0]) {
        dispatch(setCurrentPhongBan(array[0].danhmuc_id));
        dispatch(setCurrentNhanVien(array[0].ns_nhanvien[0].nv_id));
      }
    }
  }
  let changeInputPB = (e, indexPB) => {
    let array = [...listPhongBan];
    array[indexPB].danhmuc_name = e.target.value;
    setListPhongBan(array);
  }
  let changeInputNV = (indexPB, indexNV, e) => {
    let array = [...listPhongBan];
    array[indexPB].ns_nhanvien[indexNV].nv_name = e.target.value;
    setListPhongBan(array);
  }
  // gọi api tạo hoặc cập nhật tên phòng ban
  let handleCreateUpdatePB = (e, danhmuc_id) => {
    if (e.target.value == "") {
      toast.error("Vui Lòng Nhập Tên Phòng Ban!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      }); return;
    }
    if (isUpdate) {
      // đổi tên
      chamCongService.doiTenPhongBan(token, danhmuc_id, e.target.value).then((res) => {
        setReload(Date.now());
      })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // tạo mới
      chamCongService.taoPhongBan(token, e.target.value).then((res) => {
        setReload(Date.now());
        e.target.value = "";
      })
        .catch((err) => {
          console.log(err);
        });
    }
    toast.success("Cập nhật thành công!!!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  }
  // gọi api tạo hoặc update tên nhân viên
  let handleCreateUpdateNV = (e, PBId, NVId) => {
    if (e.target.value == "") {
      toast.error("Vui Lòng Nhập Tên Nhân Viên!!!", {
        position: toast.POSITION.TOP_RIGHT
      }); return;
    }
    if (isUpdate) {
      // đổi tên
      chamCongService.renameNhanVien(token, e.target.value, NVId).then((res) => {
        setReload(Date.now());
      })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // tạo mới
      chamCongService.taoNhanVien(token, PBId, e.target.value).then((res) => {
        setReload(Date.now());
        dispatch(setCurrentNhanVien(res.data.content.nv_id))
        handleCloseAddNhanVien();
      })
        .catch((err) => {
          console.log(err);
        });
    }
    toast.success("Cập nhật thành công!!!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  }
  // gọi api xóa phòng ban
  let handleDeletePB = (danhmuc_id) => {
    chamCongService.xoaPhongBan(token, danhmuc_id).then((res) => {
      setReload(Date.now());
    })
      .catch((err) => {
        console.log(err);
      });
    toast.success("Xoá Phòng Ban Thành Công!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  }
  // gọi api xóa nhân viên
  let handleDeleteNV = (idNv) => {
    chamCongService.xoaNhanVien(token, idNv).then((res) => {
      setReload(Date.now());
    })
      .catch((err) => {
        console.log(err);
      });
    toast.success("Xoá Nhân Viên Thành Công!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  }
  const handleChangeCurrentPhongBan = (danhmuc_id, indexPB) => {
    dispatch(setCurrentPhongBan(danhmuc_id));
    if (listPhongBan[indexPB]) {
      if (listPhongBan[indexPB].ns_nhanvien[0]) {
        dispatch(setCurrentNhanVien(listPhongBan[indexPB].ns_nhanvien[0].nv_id));
      }
    } else {
      dispatch(setCurrentNhanVien(null));
    }
  }

  const handleContextMenu = (e, type, id, index) => {
    e.preventDefault();
    if (type === 'phongban') {
      document.querySelectorAll('[id^="ContextMenu_"]').forEach(item => {
        item.classList.add('hidden');
      });
      document.getElementById(`ContextMenu_PB_${id}`).classList.toggle('hidden');
      handleChangeCurrentPhongBan(id, index);
    }

    if (type === 'nhanvien') {
      document.querySelectorAll('[id^="ContextMenu_"]').forEach(item => {
        item.classList.add('hidden');
      });
      document.getElementById(`ContextMenu_NV_${id}`).classList.toggle('hidden');
    }
  };

  const handleCloseContextMenu = (type, id) => {
    type === 'phongban' && document.getElementById(`ContextMenu_PB_${id}`).classList.add('hidden');

    type === 'nhanvien' && document.getElementById(`ContextMenu_NV_${id}`).classList.add('hidden');
  };
  // cái này để xử lý hiện ô nhập PB
  const handleAddPhongBan = () => {
    setAddPhongBanRow(true);
    dispatch(setCurrentPhongBan(null));
    setTimeout(() => {
      document.querySelector('#PhongBan_AddRow input').focus();
    }, 500);
  }
  const handleRenamePhongBan = (danhmuc_id) => {
    setTimeout(() => {
      document.querySelector(`#PhongBan_${danhmuc_id} input`).readOnly = false;
      document.querySelector(`#PhongBan_${danhmuc_id} input`).classList.add('border', 'rounded', 'px-1', 'py-0.5');
      document.querySelector(`#PhongBan_${danhmuc_id} input`).focus();
    }, 500);
  }
  const handleRenameNhanVien = (danhmuc_id, nv_id) => {
    setTimeout(() => {
      document.querySelector(`#NV_PhongBan_${danhmuc_id}_${nv_id} input`).readOnly = false;
      document.querySelector(`#NV_PhongBan_${danhmuc_id}_${nv_id} input`).classList.add('border', 'rounded', 'px-1', 'py-0.5');
      document.querySelector(`#NV_PhongBan_${danhmuc_id}_${nv_id} input`).focus();
    }, 500);
  }
  const handleUpdateNamePhongBan = (e) => {
    setTimeout(() => {
      e.target.readOnly = true;
      e.target.classList.remove('border', 'rounded', 'px-1', 'py-0.5');
    }, 500);
  }
  const handleUpdateNameNhanVien = (e) => {
    setTimeout(() => {
      e.target.readOnly = true;
    }, 500);
  }

  const handleAddNhanVien = (phongban_id) => {
    setAddNhanVienRow({
      open: true,
      phongban_id: phongban_id
    });
    setTimeout(() => {
      document.querySelector('#NhanVien_AddRow input').focus();
    }, 500);
  };

  const handleCloseAddNhanVien = () => {
    setAddNhanVienRow({
      open: false,
      phongban_id: null
    });
  }

  const renderPhongBan = () => {
    return listPhongBan?.map((phongban, indexPB) => {
      return (
        <div
          key={indexPB}
          className='w-full relative'
        >
          <div
            id={`PhongBan_${phongban?.danhmuc_id}`}
            className='w-full h-8 flex items-center bg-white z-[1] relative'
            onClick={() => {
              handleChangeCurrentPhongBan(phongban.danhmuc_id, indexPB);
            }}
            onContextMenu={(e) => {
              handleContextMenu(e, 'phongban', phongban.danhmuc_id, indexPB);
            }}
          >
            <FaCaretDown
              className={`text-xs transition-all duration-100 delay-75 ease-linear ${currentPhongBan === phongban?.danhmuc_id ? '' : '-rotate-90'}`}
            />
            <div className='w-8 flex justify-center items-center'>
              {
                currentPhongBan === phongban?.danhmuc_id
                  ? folderSVG
                  : folderClosedSVG
              }
            </div>
            <input
              className='w-full flex-1 focus:outline-none bg-transparent cursor-pointer'
              readOnly
              type="text"
              name=""
              value={phongban?.danhmuc_name}
              onChange={(e) => changeInputPB(e, indexPB)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              onBlur={(e) => {
                if (e.target.readOnly) {
                  return;
                }
                isUpdate = true;
                handleUpdateNamePhongBan(e);
                handleCreateUpdatePB(e, phongban.danhmuc_id)
              }}
            />
          </div>

          <div
            id={`ContextMenu_PB_${phongban.danhmuc_id}`}
            className='w-full absolute top-8 bg-white z-10 rounded shadow-lg border p-1 flex flex-col hidden'
            onMouseLeave={() => {
              handleCloseContextMenu('phongban', phongban.danhmuc_id);
            }}
          // đã chuyển hàm onclick handleCloseContextMenu đi vào từng button. Tránh lỗi popconfim
          >
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleAddNhanVien(phongban.danhmuc_id);
                handleCloseContextMenu('phongban', phongban.danhmuc_id);
              }}
            >
              Thêm nhân viên
            </button>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleAddPhongBan();
                handleCloseContextMenu('phongban', phongban.danhmuc_id);
              }}
            >
              Thêm phòng ban
            </button>
            <Popconfirm
              title="Xoá Phòng Ban"
              description="Xác Nhận Xoá Phòng Ban Này?"
              okText="Đồng Ý"
              cancelText="Huỷ Bỏ"
              onConfirm={() => {
                handleCloseContextMenu('phongban', phongban.danhmuc_id);
                handleDeletePB(phongban?.danhmuc_id)
              }}
            >
              <button
                type='button'
                className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              >
                Xóa phòng ban
              </button>
            </Popconfirm>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleRenamePhongBan(phongban.danhmuc_id);
                handleCloseContextMenu('phongban', phongban.danhmuc_id);
              }}
            >
              Đổi tên
            </button>
          </div>

          {renderNhanVien(phongban, indexPB)}

          {
            addNhanVienRow.open && addNhanVienRow.phongban_id == phongban.danhmuc_id && (
              <div
                id='NhanVien_AddRow'
                className={`w-full ps-7 h-7 ${currentPhongBan == phongban.danhmuc_id ? 'flex' : 'hidden'} items-center gap-2`}
              >
                <div
                  className='w-3 h-full border-l border-b border-gray-900 -translate-y-1/2'
                  style={{
                    borderBottomStyle: 'dashed',
                  }}
                ></div>
                <input
                  className='w-full flex-1 focus:outline-none bg-transparent cursor-pointer border rounded px-1 py-0.5'
                  type="text"
                  name=""
                  placeholder='Nhập tên nhân viên...'
                  onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                      e.target.blur();
                    }
                  }}
                  onBlur={(e) => {
                    isUpdate = false;
                    handleCreateUpdateNV(e, phongban.danhmuc_id)
                  }}
                />
              </div>
            )
          }
        </div>
      )
    });
  };

  const renderNhanVien = (phongban, indexPB) => {
    return phongban.ns_nhanvien?.map((nhanvien, indexNV) => {
      return (
        <div
          key={indexNV}
          className='w-full relative'
        >
          <div
            id={`NV_PhongBan_${phongban.danhmuc_id}_${nhanvien.nv_id}`}
            className={`w-full ps-7 relative z-0 ${currentPhongBan == phongban.danhmuc_id ? '' : 'hidden'}`}
          >
            <div
              className='w-full h-7 flex items-center gap-2'
              onClick={() => {
                dispatch(setCurrentNhanVien(nhanvien?.nv_id));
              }}
              onContextMenu={(e) => {
                e.target.click();
                handleContextMenu(e, 'nhanvien', nhanvien.nv_id);
              }}
            >
              <div
                className='w-3 h-full border-l border-b border-gray-900 -translate-y-1/2'
                style={{
                  borderBottomStyle: 'dashed',
                }}
              ></div>
              <input
                className={`w-full flex-1 focus:outline-none border rounded ${currentNhanVien == nhanvien.nv_id ? 'bg-orange-100 border-orange-400' : 'bg-transparent border-transparent'} cursor-pointer px-1 py-0.5`}
                readOnly
                type="text"
                name=""
                value={nhanvien?.nv_name}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.blur();
                  }
                }}
                onBlur={(e) => {
                  if (e.target.readOnly) {
                    return;
                  }
                  isUpdate = true;
                  handleUpdateNameNhanVien(e);
                  handleCreateUpdateNV(e, phongban.danhmuc_id, nhanvien.nv_id)
                }}
                onChange={(e) => changeInputNV(indexPB, indexNV, e)}
              />
            </div>
          </div>

          <div
            id={`ContextMenu_NV_${nhanvien.nv_id}`}
            className='w-full absolute top-8 bg-white z-10 rounded shadow-lg border p-1 flex flex-col hidden'
            onMouseLeave={() => {
              handleCloseContextMenu('nhanvien', nhanvien.nv_id);
            }}
          >
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleAddNhanVien(phongban.danhmuc_id);
                handleCloseContextMenu('nhanvien', nhanvien.nv_id);
              }}
            >
              Thêm nhân viên mới
            </button>
            <Popconfirm title="Xoá Nhân Viên" description="Xác Nhận Xoá Nhân Viên Này?" okText="Đồng Ý" cancelText="Huỷ Bỏ"
              onConfirm={() => handleDeleteNV(nhanvien.nv_id)}
            >
              <button
                type='button'
                className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              >
                Xóa nhân viên
              </button>
            </Popconfirm>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleRenameNhanVien(phongban.danhmuc_id, nhanvien.nv_id);
                handleCloseContextMenu('nhanvien', nhanvien.nv_id);
              }}
            >
              Đổi tên nhân viên
            </button>
          </div>
        </div>
      )
    })
  }

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleOk = () => {
    setShowModal(false);
    setShowModal1(true);
  };

  const handleOk1 = () => {
    setShowModal1(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleCancel1 = () => {
    setShowModal1(false);
  };

  return (
    <div
      id='PhongBan'
      className='w-full'
    >
      <div
        className='w-full h-10 flex justify-between items-center border-b border-orange-400 sticky top-0 left-0 z-10 bg-white'
      >
        <h1
          className='text-xl font-bold text-orange-400'
        >
          Phòng Ban
        </h1>
        <button
          type='button'
          title="Tạo nhân viên bằng file excel"
          className='p-1 text-orange-500 text-xl cursor-pointer border border-orange-500 rounded aspect-square flex justify-center items-center focus:outline-none'
          onClick={() => {
            setShowModal(true);
          }}
        >
          <i class="fa-solid fa-upload"></i>
        </button>
        <ModalUploadExcel
          showModal={showModal}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />

        <ModalShowDataUpload
          showModal={showModal1}
          handleOk={handleOk1}
          handleCancel={handleCancel1}
        />
      </div>
      <div
        id='searchPhongBan'
        className='w-full h-10 flex items-center justify-center p-1 sticky top-10 left-0 z-10 bg-white'
      >
        <input
          onChange={searchUser}
          type="text"
          className='w-full flex-1 h-full border border-r-0 border-orange-400 rounded-s-full p-2 text-sm focus:outline-none placeholder:italic'
          placeholder='Nhập tên nhân viên...'
        />

        <button
          type="button"
          disabled
          className='h-full aspect-square flex justify-center items-center text-orange-400 font-semibold border border-l-0 border-orange-400 rounded-e-full focus:outline-none'
        >
          <FaSearch />
        </button>
      </div>
      <div
        id='listPhongBan'
        className='w-full text-sm relative'
      >
        {renderPhongBan()}

        <div
          id={`PhongBan_AddRow`}
          className={`w-full h-8 ${addPhongBanRow ? 'flex' : 'hidden'} items-center bg-white z-[1] relative`}
        >
          <FaCaretDown
            className={`text-xs transition-all duration-100 delay-75 ease-linear`}
          />
          <div className='w-8 flex justify-center items-center'>
            {folderSVG}
          </div>
          <input
            className='w-full flex-1 focus:outline-none bg-transparent border rounded cursor-pointer px-1 py-0.5'
            type="text"
            name=""
            placeholder='Nhập tên phòng ban...'
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                e.target.blur();
                setAddPhongBanRow(false);
              }
            }}
            onBlur={(e) => {
              isUpdate = false;
              handleCreateUpdatePB(e);
            }}
          />
        </div>
      </div>
    </div>
  )
}
