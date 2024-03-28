import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { FaPersonSwimming } from "react-icons/fa6";
import { FaPlane } from "react-icons/fa6";
import CharacterRepalce from '../../../GlobalFunction/CharacterReplace';
import { nhanVienService } from '../../../services/nhanVienService';
import {cauHinhChungService} from '../../../services/cauHinhChungService'
import { localStorageService } from '../../../services/localStorageService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setReloadMany } from '../../../Redux-toolkit/reducer/ChamCongSlice';

const filterOption = (input, option) =>
  CharacterRepalce((option?.label ?? '').toLowerCase()).includes(CharacterRepalce(input.toLowerCase()));

export default function DuyetPhep() {

  let [reload,setReload] = useState(0);
  let token = localStorageService.getItem("token");
  let dispatch = useDispatch();
  const [nvList, setNvList] = useState([]);
  const [diTreList, setDiTreList] = useState([]);
  const [duyetPhepList, setDuyetPhepList] = useState([]);
  const [congtacList, setCongTacList] = useState([]);

  useEffect(() => {
    nhanVienService.getAllNhanVien(token).then((res) => {
        setNvList(res.data.content);
    })
        .catch((err) => {
            console.log(err);
        });
    cauHinhChungService.getNguoiDuyetDiTre(token).then((res) => {
        setDiTreList(res.data.content)
    })
        .catch((err) => {
            console.log(err);
        });
    cauHinhChungService.getNguoiDuyetPhep(token).then((res) => {
        setDuyetPhepList(res.data.content)
    })
        .catch((err) => {
            console.log(err);
        });
    cauHinhChungService.getNguoiDuyetCongTac(token).then((res) => {
        setCongTacList(res.data.content)
    })
        .catch((err) => {
            console.log(err);
        });
    }, [reload])
  const renderOptions = () => {
    let array = [];
    nvList.map((nv) => {
      array.push({
        value: nv?.nv_id,
        label: nv?.nv_name
      })
    })
    return array;
  };

  let handlePhanQuyen = (nv_id,col) => {
    let data = {
        nv_id,
        field: col
    }
    cauHinhChungService.phanQuyen(token, data).then((res) => {
        setReload(Date.now());
        dispatch(setReloadMany(Date.now()));
        toast.success("Cập nhật thành công!!!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
    })
        .catch((err) => {
            console.log(err);
        });
  }

  let handleBoPhanQuyen = (nv_id,col) => {
        let data = {
            nv_id,
            field: col
        }
        cauHinhChungService.boPhanQuyen(token, data).then((res) => {
            setReload(Date.now());
            dispatch(setReloadMany(Date.now()));
            toast.success("Cập nhật thành công!!!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
        })
            .catch((err) => {
                console.log(err);
            });
  }

  const renderNguoiDuyetDiTre = () => {
    return diTreList?.map((nv, index) => {
      return (
        <div
          key={index}
          className='w-full flex gap-2'
        >
          <p className='flex-1 line-clamp-1'>
            {nv?.nv_name}
          </p>
          <button
            type="button"
            className='w-6 h-6 flex justify-center items-center text-white bg-orange-400 font-semibold border border-orange-400 rounded'
            onClick={() => {
              handleBoPhanQuyen(nv?.nv_id, 'nv_quyenditre');
            }}
          >
            X
          </button>
        </div>
      )
    })
  }

  const renderNguoiDuyetPhep = () => {
    return duyetPhepList?.map((nv, index) => {
      return (
        <div
          key={index}
          className='w-full flex gap-2'
        >
          <p className='flex-1 line-clamp-1'>
            {nv?.nv_name}
          </p>
          <button
            type="button"
            className='w-6 h-6 flex justify-center items-center text-white bg-orange-400 font-semibold border border-orange-400 rounded'
            onClick={() => {
              handleBoPhanQuyen(nv?.nv_id, 'nv_quyenphep');
            }}
          >
            X
          </button>
        </div>
      )
    })
  }

  const renderNguoiCongTac = () => {
    return congtacList?.map((nv, index) => {
      return (
        <div
          key={index}
          className='w-full flex gap-2'
        >
          <p className='flex-1 line-clamp-1'>
            {nv?.nv_name}
          </p>
          <button
            type="button"
            className='w-6 h-6 flex justify-center items-center text-white bg-orange-400 font-semibold border border-orange-400 rounded'
            onClick={() => {
              handleBoPhanQuyen(nv?.nv_id, 'nv_quyencongtac');
            }}
          >
            X
          </button>
        </div>
      )
    })
  }


  return (

    <div className='w-full bg-white rounded-lg shadow-md p-4 flex flex-col gap-2'>
      <h1
        className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg'
      >
        <FaRegCircleCheck />
        <strong>
          Quyền Duyệt phép
        </strong>
      </h1>

      <div className='w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div
          className='w-full border border-gray-300 rounded-lg p-4 flex flex-col items-center gap-2'
        >
          <div className='w-max p-1 aspect-square border border-gray-300 rounded flex justify-center items-center text-4xl text-purple-400'>
            <FaPersonWalkingLuggage />
          </div>
          <h1 className='font-bold text-center'>
            Xin đi trễ - về sớm
          </h1>
          <Select
            onChange={(e) => {
              handlePhanQuyen(e, "nv_quyenditre")
            }}
            options={renderOptions()}
            optionFilterProp="children"
            filterOption={filterOption}
            className='w-full'
            showSearch
            placeholder={<p className=' text-base'>Chọn Người Duyệt</p>}
          />
          <div className='w-full flex flex-col gap-2'>
            {renderNguoiDuyetDiTre()}
          </div>
        </div>
        <div
          className='w-full border border-gray-300 rounded-lg p-4 flex flex-col items-center gap-2'
        >
          <div className='w-max p-1 aspect-square border border-gray-300 rounded flex justify-center items-center text-4xl text-red-500'>
            <FaPersonSwimming />
          </div>
          <h1 className='font-bold text-center'>
            Xin nghỉ phép
          </h1>
          <Select
            onChange={(e) => {
              handlePhanQuyen(e, "nv_quyenphep")
            }}
            options={renderOptions()}
            optionFilterProp="children"
            filterOption={filterOption}
            className='w-full'
            showSearch
            placeholder={<p className=' text-base'>Chọn Người Duyệt</p>}
          />
          <div className='w-full flex flex-col gap-2'>
            {renderNguoiDuyetPhep()}
          </div>
        </div>
        <div
          className='w-full border border-gray-300 rounded-lg p-4 flex flex-col items-center gap-2'
        >
          <div className='w-max p-1 aspect-square border border-gray-300 rounded flex justify-center items-center text-4xl text-sky-400'>
            <FaPlane className='-rotate-45' />
          </div>
          <h1 className='font-bold text-center'>
            Công tác
          </h1>
          <Select
            onChange={(e) => {
              handlePhanQuyen(e, "nv_quyencongtac")
            }}
            options={renderOptions()}
            optionFilterProp="children"
            filterOption={filterOption}
            className='w-full'
            showSearch
            placeholder={<p className=' text-base'>Chọn Người Duyệt</p>}
          />
          <div className='w-full flex flex-col gap-2'>
            {renderNguoiCongTac()}
          </div>
        </div>
      </div>
    </div>
  )
}
