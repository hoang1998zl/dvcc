import React, { useEffect } from 'react'
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCloseModalSlice } from './ModalSlice';
import GioiThieuModal from './GioiThieuModal/GioiThieuModal';
// import QHGDModal from './QHGDModal/QHGDModal';
import LTPTModal from './LTPTModal/LTPTModal';
// import BHXHModal from './BHXHModal/BHXHModal';
import { setReloadHS, setnhanVienUpdated } from '../../Redux-toolkit/reducer/HoSoNhanVienSlice';
import { nhanVienService } from '../../services/nhanVienService';
import { toast } from 'react-toastify';
import { localStorageService } from '../../services/localStorageService';

function ModalComponent() {

  const dispatch = useDispatch();
  let token = localStorageService.getItem('token');
  let nhanVienHS = useSelector(state => state.HoSoNhanVienSlice.nhanVienHS);
  let nhanVienUpdated = useSelector(state => state.HoSoNhanVienSlice.nhanVienUpdated);
  useEffect(() => {
    dispatch(setnhanVienUpdated(nhanVienHS));
  }, [nhanVienHS]);

  
  const InfoModal = useSelector((state) => state.ModalSlice)

  const renderContentModal = (type) => {
    switch (type) {
      case 'GioiThieuModal':
        return <GioiThieuModal />
      // case 'QHGDModal':
      //   return <QHGDModal />
      case 'LTPTModal':
        return <LTPTModal />
      // case 'BHXHModal':
      //   return <BHXHModal />
      default:
        break;
    }
  }
  const handleUpdateNV = () => {
    nhanVienService.updateNhanVien(token, nhanVienUpdated).then((res) => {
      toast.success("Cập nhật thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      dispatch(setReloadHS(Date.now()));
    })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Modal
      title={<p className="text-center text-xl font-bold">{InfoModal.title}</p>}
      width={InfoModal.width}
      style={{top: 5}}
      open={InfoModal.open}
      onCancel={() => {
        dispatch(setReloadHS(Date.now()));
        dispatch(setCloseModalSlice());
      }}
      footer={(
        <div className="w-full flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={() => {
              dispatch(setReloadHS(Date.now()));
              dispatch(setCloseModalSlice());
            }}
            className="bg-slate-100 hover:bg-slate-200 py-1 px-4 w-20 rounded border border-gray-300"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              handleUpdateNV();
              dispatch(setCloseModalSlice());
            }}
            className="bg-orange-400 hover:bg-orange-500 py-1 px-4 w-20 text-white rounded border border-gray-300"
          >
            Đồng ý
          </button>
        </div>
      )}
      closable={false}
    >
      {renderContentModal(InfoModal.type)}
    </Modal>
  )
}

export default ModalComponent