import { Dropdown, Image } from 'antd'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FaPen, FaTrashCan } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { localStorageService } from '../../../../../services/localStorageService';
import { nhanVienService } from '../../../../../services/nhanVienService';
import { toast } from 'react-toastify';

export default function HoSoChungChi() {

  const { currentNhanVien } = useSelector(state => state.UserSlice);
  let token = localStorageService.getItem('token');
  let [chungChiList,setChungChiList] = useState([]);
  let [reload,setReload] = useState(0);
  let [openContextMenu,setOpenContextMenu] = useState({
    open: false,
    bangcap_id: 0
  });

  useEffect(() => {
    if(!currentNhanVien){
      return;
    }
    nhanVienService.getChungChi(token, currentNhanVien).then((res) => {
      setChungChiList(res.data.content);
    })
      .catch((err) => {
        console.log(err);
      });
  }, [currentNhanVien, reload]);
  let uploadChungChi = (e, bangcap_id) => {
    nhanVienService.uploadChungChiNew(token, currentNhanVien, bangcap_id, e.target.files[0]).then((res) => {
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      setReload(Date.now())
    })
      .catch((err) => {
        toast.error("Cập nhật thất bại!!!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      });
  }
  const items = [
    {
      key: '1',
      label: (
        <button
          type='button'
          className='min-w-40 flex items-center gap-2'
        >
          <label htmlFor='chungChi' className='w-full block text-left rounded-md font-normal'>
            <input
              type="file"
              id='chungChi'
              className='hidden'
              name=""
              onChange={(e) => uploadChungChi(e, 0)}
              />
              <div className='flex'>
                <div
                  className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
                  >
                  <FaPen />
                </div>
                <span className='ml-2'>
                  Thêm chứng chỉ
                </span>
              </div>
          </label>
        </button>
      ),
    },
    // {
    //   key: '2',
    //   label: (
    //     <button
    //       type='button'
    //       className='min-w-40 flex items-center gap-2'
    //     >
    //       <div
    //         className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
    //       >
    //         <FiDownload />
    //       </div>
    //       <span>
    //         Tải xuống
    //       </span>
    //     </button>
    //   ),
    // },
  ];

  let deleteChungChi = (bangcap_id) => {
    nhanVienService.deleteChungChi(token,bangcap_id).then((res) => {
      toast.success("Xóa thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      setReload(Date.now())
    })
      .catch((err) => {
        toast.error("Xóa thất bại!!!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      });
    
  }
  const renderContextMenu = () => {
    return (
      <>
        <div className='w-full h-full absolute top-0 left-0 z-[1] bg-black/50 rounded'></div>
        <div
          className='w-40 border shadow-lg rounded bg-white z-10 p-1 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          onMouseLeave={() => setOpenContextMenu({ open: false, bangcap_id: 0 })}
        >
          <ul>
            <li>
              <button
                type="button"
                className='w-full px-2 py-1 rounded border border-transparent hover:bg-slate-100 hover:border-orange-400 text-left flex items-center gap-2'
                onClick={() => {
                  deleteChungChi(openContextMenu.bangcap_id);
                  setOpenContextMenu({ open: false, bangcap_id: 0 })
                }}
              >
                <div
                  className='w-6 aspect-square rounded border border-gray-500 flex justify-center items-center'
                >
                  <FaTrashCan />
                </div>
                <span>
                  Xóa
                </span>
              </button>
            </li>
          </ul>
        </div>
      </>
    )
  };
  const renderChungChi = () => {
    return chungChiList?.map((chungchi, index) => {
      if(chungchi?.bangcap_scan_file){
        return (
          <div key={index} className='relative'>
          <Image
            id={index}
            onContextMenu={(e) => {
              e.preventDefault();
                setOpenContextMenu({
                  open: true,
                  bangcap_id: chungchi.bangcap_id,
                })
            }}
            key={chungchi.bangcap_id}
            className='w-full aspect-[4/3] object-contain border rounded-lg p-1'
            src={chungchi.bangcap_scan_file}
          />
          {(openContextMenu.open == true && openContextMenu.bangcap_id == chungchi.bangcap_id)  && renderContextMenu()}
          </div>
        )
      }
    })
  };
  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4 text-left flex flex-col gap-4'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='flex-1 text-orange-400 font-bold text-lg'>
          Chứng chỉ
        </h1>

        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <button
            type='button'

          >
            <BsThreeDots
              className='text-lg'
            />
          </button>
        </Dropdown>
      </div>

      <div
        className='w-full grid grid-cols-3 gap-4'
      >
        <Image.PreviewGroup>
          {renderChungChi()}
        </Image.PreviewGroup>
      </div>
    </div>
  )
}
