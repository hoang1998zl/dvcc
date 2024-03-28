import React, { useEffect, useState } from 'react'
import { FaPersonSwimming, FaPersonWalkingLuggage, FaPlane, FaRegCircleCheck } from 'react-icons/fa6'
import CharacterRepalce from '../../../GlobalFunction/CharacterReplace';
import { Select } from 'antd';
import { localStorageService } from '../../../services/localStorageService';
import { useDispatch, useSelector } from 'react-redux';
import { nhanVienService } from '../../../services/nhanVienService';
import { cauHinhChungService } from '../../../services/cauHinhChungService';
import { toast } from 'react-toastify';

const filterOption = (input, option) =>
  CharacterRepalce((option?.label ?? '').toLowerCase()).includes(CharacterRepalce(input.toLowerCase()));
export default function DuyetPhepDVCC() {
  let token = localStorageService.getItem("token");
  let dispatch = useDispatch();
  let [nv, setNV] = useState({});
  let nv_id = useSelector((state) => state.UserSlice.currentNhanVien);
  let reloadMany = useSelector((state) => state.ChamCongSlice.reloadMany);
  let [reload, setReload] = useState(0);
  let [diTreList, setDiTreList] = useState([]);
  let [nghiPhepList, setNghiPhepList] = useState([]);
  let [congTacList, setCongTacList] = useState([]);
  useEffect(() => {
    nhanVienService.getNhanVienTheoId(token, nv_id).then((res) => {
      setNV(res.data.content);
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
      setNghiPhepList(res.data.content)
    })
      .catch((err) => {
        console.log(err);
      });
    cauHinhChungService.getNguoiDuyetCongTac(token).then((res) => {
      setCongTacList(res.data.content);
    })
      .catch((err) => {
        console.log(err);
      });
  }, [nv_id, reload,reloadMany])
  let handleUpdateNguoiDuyet = (value, key) => {
    let data = {
      nv_id,
      [key]: value
    }
    nhanVienService.updateNhanVien(token, data).then((res) => {
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
  let renderDiTreSelect = () => {
    let array = [];
    diTreList?.map((diTre) => {
      array.push({
        value: diTre?.nv_id,
        label: <p>{diTre?.nv_name}</p>
      })
    })
    return array;
  }
  let renderNghiPhepSelect = () => {
    let array = [];
    nghiPhepList?.map((nghiPhep) => {
      array.push({
        value: nghiPhep?.nv_id,
        label: <p>{nghiPhep?.nv_name}</p>
      })
    })
    return array;
  }
  let renderCongTacSelect = () => {
    let array = [];
    congTacList?.map((congTac) => {
      array.push({
        value: congTac?.nv_id,
        label: <p>{congTac?.nv_name}</p>
      })
    })
    return array;
  }
  return (
    <div className='w-full flex flex-col pr-3'>
        <h1
            className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg pl-4 pt-2'>
        <FaRegCircleCheck />
            <strong>
                Người Duyệt Phép Cho {nv?.nv_name}
            </strong>
        </h1>
        <div className='w-full border border-gray-300 rounded-lg h-full m-2 grid grid-cols-3 gap-2 items-center'>
          <div className='px-2 py-4 border border-gray-300 rounded-lg ml-2'>
            <div className='w-max p-1 aspect-square border border-gray-300 rounded mx-auto items-center text-4xl text-purple-400'>
              <FaPersonWalkingLuggage />
            </div>
            <h1 className='font-bold text-center mt-2'>
              Duyệt đi trễ - về sớm
            </h1>
            <Select
              options={renderDiTreSelect()}
              onChange={(e) => handleUpdateNguoiDuyet(e, "nv_nguoiduyet_ditre")}
              optionFilterProp="children"
              value={nv?.nv_nguoiduyet_ditre}
              filterOption={filterOption}
              className='w-full mt-2'
              showSearch
              placeholder={<p className=' text-base'>Chọn Người Duyệt</p>}
            />
          </div>
          <div className='p-2 py-4 border border-gray-300 rounded-lg'>
            <div className='w-max p-1 aspect-square border border-gray-300 rounded mx-auto items-center text-4xl text-red-500'>
              <FaPersonSwimming />
            </div>
            <h1 className='font-bold text-center mt-2'>
              Duyệt nghỉ phép
            </h1>
            <Select
              options={renderNghiPhepSelect()}
              onChange={(e) => handleUpdateNguoiDuyet(e, "nv_nguoiduyet_phep")}
              optionFilterProp="children"
              value={nv?.nv_nguoiduyet_phep}
              filterOption={filterOption}
              className='w-full mt-2'
              showSearch
              placeholder={<p className=' text-base'>Chọn Người Duyệt</p>}
            />
          </div>
          <div className='p-2 py-4 border border-gray-300 rounded-lg mr-2'>
            <div className='w-max p-1 aspect-square border border-gray-300 rounded mx-auto items-center text-4xl text-sky-400'>
              <FaPlane />
            </div>
            <h1 className='font-bold text-center mt-2'>
              Duyệt công tác
            </h1>
            <Select
              options={renderCongTacSelect()}
              onChange={(e) => handleUpdateNguoiDuyet(e, "nv_nguoiduyet_congtac")}
              optionFilterProp="children"
              value={nv?.nv_nguoiduyet_congtac}
              filterOption={filterOption}
              className='w-full mt-2'
              showSearch
              placeholder={<p className=' text-base'>Chọn Người Duyệt</p>}
            />
          </div>
        </div>
    </div>
  )
}
