import React, { useEffect, useState } from 'react';
import { folderSVG, folderClosedSVG } from '../../../issets/svg/svg'
import { FaSearch } from 'react-icons/fa';
import { FaCaretDown } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPhongBan } from '../../../Redux-toolkit/reducer/PhongBanSlice';
import { setCurrentNhanVien } from '../../../Redux-toolkit/reducer/UserSlice';
import dataNhanVien from '../../../issets/json/NhanVien.json'

export default function PhongBan() {

  const dispatch = useDispatch();

  const { currentPhongBan } = useSelector(state => state.PhongBanSlice);
  const { currentNhanVien } = useSelector(state => state.UserSlice);

  const [listPhongBan, setListPhongBan] = useState([]);
  const [addPhongBanRow, setAddPhongBanRow] = useState(false);
  const [addNhanVienRow, setAddNhanVienRow] = useState({
    open: false,
    phongban_id: 0,
  });


  useEffect(() => {
    const dataPhongBan = dataNhanVien;
    setListPhongBan(dataPhongBan);
    dataPhongBan?.map((pb, indexpb) => {
      if (indexpb === 0) {
        dispatch(setCurrentPhongBan(pb?.phongban_id));
        pb?.children?.map((nv, indexnv) => {
          if (indexnv === 0) {
            dispatch(setCurrentNhanVien(nv));
          }
          return nv
        })
      }
      return pb
    })
  }, [dispatch]);

  const handleChangeCurrentPhongBan = (phongban_id) => {
    dispatch(setCurrentPhongBan(phongban_id));

    listPhongBan?.map((pb) => {
      if (pb?.phongban_id === phongban_id) {
        pb?.children?.map((nv, indexnv) => {
          if (indexnv === 0) {
            dispatch(setCurrentNhanVien(nv));
          }
          return nv
        })
      }
      return pb
    })
  }

  const handleChangeCurrentNhanVien = (nhanvien) => {
    dispatch(setCurrentNhanVien(nhanvien));
  }

  const handleContextMenu = (e, type, id) => {
    e.preventDefault();

    if (type === 'phongban') {
      document.querySelectorAll('[id^="ContextMenu_NV_"]').forEach(item => {
        item.classList.add('hidden');
      });
      document.getElementById(`ContextMenu_PB_${id}`).classList.toggle('hidden');
      handleChangeCurrentPhongBan(id);
    }

    if (type === 'nhanvien') {
      document.querySelectorAll('[id^="ContextMenu_PB_"]').forEach(item => {
        item.classList.add('hidden');
      });
      document.getElementById(`ContextMenu_NV_${id}`).classList.toggle('hidden');
    }
  };

  const handleCloseContextMenu = (type, id) => {
    type === 'phongban' && document.getElementById(`ContextMenu_PB_${id}`).classList.add('hidden');

    type === 'nhanvien' && document.getElementById(`ContextMenu_NV_${id}`).classList.add('hidden');
  };

  const handleAddPhongBan = () => {
    setAddPhongBanRow(true);
    dispatch(setCurrentPhongBan(null));
    setTimeout(() => {
      document.querySelector('#PhongBan_AddRow input').focus();
    }, 500);
  }

  const handleCloseAddPhongBan = () => {
    setAddPhongBanRow(false);
    dispatch(setCurrentPhongBan(1));
  }

  const handleRenamePhongBan = (phongban_id) => {
    setTimeout(() => {
      document.querySelector(`#PhongBan_${phongban_id} input`).readOnly = false;
      document.querySelector(`#PhongBan_${phongban_id} input`).classList.add('border rounded px-1 py-0.5');
      document.querySelector(`#PhongBan_${phongban_id} input`).focus();
    }, 500);
  }

  const handleUpdateNamePhongBan = (phongban_id) => {
    setTimeout(() => {
      document.querySelector(`#PhongBan_${phongban_id} input`).readOnly = true;
      document.querySelector(`#PhongBan_${phongban_id} input`).classList.remove('border rounded px-1 py-0.5');
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
            id={`PhongBan_${phongban.phongban_id}`}
            className='w-full h-8 flex items-center bg-white z-[1] relative'
            onClick={() => {
              handleChangeCurrentPhongBan(phongban.phongban_id);
            }}
            onContextMenu={(e) => {
              handleContextMenu(e, 'phongban', phongban.phongban_id);
            }}
          >
            <FaCaretDown
              className={`text-xs transition-all duration-100 delay-75 ease-linear ${currentPhongBan === phongban.phongban_id ? '' : '-rotate-90'}`}
            />
            <div className='w-8 flex justify-center items-center'>
              {
                currentPhongBan === phongban.phongban_id
                  ? folderSVG
                  : folderClosedSVG
              }
            </div>
            <input
              className='w-full flex-1 focus:outline-none bg-transparent cursor-pointer'
              readOnly
              type="text"
              name=""
              value={phongban.name}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateNamePhongBan(phongban.phongban_id);
                }
              }}
            />
          </div>

          <div
            id={`ContextMenu_PB_${phongban.phongban_id}`}
            className='w-full absolute top-8 bg-white z-10 rounded shadow-lg border p-1 flex flex-col hidden'
            onMouseLeave={() => {
              handleCloseContextMenu('phongban', phongban.phongban_id);
            }}
            onClick={() => {
              handleCloseContextMenu('phongban', phongban.phongban_id);
            }}
          >
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleAddNhanVien(phongban.phongban_id);
              }}
            >
              Thêm nhân viên
            </button>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleAddPhongBan();
              }}
            >
              Thêm phòng ban
            </button>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
            >
              Xóa phòng ban
            </button>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleRenamePhongBan(phongban.phongban_id);
              }}
            >
              Đổi tên
            </button>
          </div>

          {renderNhanVien(phongban, indexPB)}

          {
            addNhanVienRow && true && addNhanVienRow.phongban_id == phongban.phongban_id && (
              <div
                id='NhanVien_AddRow'
                className={`w-full ps-7 h-7 ${currentPhongBan == phongban.phongban_id ? 'flex' : 'hidden'} items-center gap-2`}
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
                      handleCloseAddNhanVien();
                    }
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
    return phongban.children?.map((nhanvien, indexNV) => {
      return (
        <div
          key={indexNV}
          className='w-full relative'
        >
          <div
            id={`NV_PhongBan_${phongban.phongban_id}_${nhanvien.nv_id}`}
            className={`w-full ps-7 relative z-0 ${currentPhongBan == phongban.phongban_id ? '' : 'hidden'}`}
          >
            <div
              className='w-full h-7 flex items-center gap-2'
              onClick={() => {
                handleChangeCurrentNhanVien(nhanvien);
              }}
              onContextMenu={(e) => {
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
                className={`w-full flex-1 focus:outline-none border rounded ${currentNhanVien.nv_id == nhanvien.nv_id ? 'bg-orange-100 border-orange-400' : 'bg-transparent border-transparent'} cursor-pointer px-1 py-0.5`}
                readOnly
                type="text"
                name=""
                value={`Nguyễn Văn A`}
              />
            </div>
          </div>

          <div
            id={`ContextMenu_NV_${nhanvien.nv_id}`}
            className='w-full absolute top-8 bg-white z-10 rounded shadow-lg border p-1 flex flex-col hidden'
            onMouseLeave={() => {
              handleCloseContextMenu('nhanvien', nhanvien.nv_id);
            }}
            onClick={() => {
              handleCloseContextMenu('nhanvien', nhanvien.nv_id);
            }}
          >
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
              onClick={() => {
                handleAddNhanVien(phongban.phongban_id);
              }}
            >
              Thêm nhân viên mới
            </button>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
            >
              Xóa nhân viên
            </button>
            <button
              type='button'
              className='w-full focus:outline-none text-left outline outline-1 outline-transparent hover:outline-orange-400 hover:bg-orange-50 px-2 py-1 rounded-sm'
            >
              Đổi tên nhân viên
            </button>
          </div>
        </div>
      )
    })
  }

  return (
    <div
      id='PhongBan'
      className='w-full'
    >
      <div
        className='w-full h-10 flex items-center border-b border-orange-400'
      >
        <h1
          className='text-xl font-bold text-orange-400'
        >
          Phòng Ban
        </h1>
      </div>
      <div
        id='searchPhongBan'
        className='w-full h-10 flex items-center justify-center p-1'
      >
        <input
          type="text"
          className='w-full flex-1 h-full border border-r-0 border-orange-400 rounded-s-full p-2 text-sm focus:outline-none placeholder:italic'
          placeholder='Nhập tên phong ban...'
        />

        <button
          type="button"
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
          className={`w-full h-8 ${addPhongBanRow ? 'flex' : 'hidden'} items-center bg-white z-[1] relative`} Ư
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
            placeholder='Nhập tên phong ban...'
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                handleCloseAddPhongBan();
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
