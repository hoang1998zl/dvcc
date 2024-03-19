import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { FaPersonSwimming } from "react-icons/fa6";
import { FaPlane } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { setReload } from '../../../Redux-toolkit/reducer/PageSlice';

const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export default function DuyetPhep() {

  const dispatch = useDispatch();

  const { reload } = useSelector(state => state.PageSlice);

  const [nvList, setNvList] = useState([]);
  const [diTreList, setDiTreList] = useState([]);
  const [duyetPhepList, setDuyetPhepList] = useState([]);
  const [congtacList, setCongTacList] = useState([]);

  const dataNv = [
    {
      nv_id: 1,
      nv_name: "Nguyễn Văn A",
      nv_status: 1,
      company_id: 65,
      nv_nguoiduyet_ditre: 0,
      nv_nguoiduyet_congtac: 1,
      nv_nguoiduyet_phep: 1
    },
    {
      nv_id: 2,
      nv_name: "Nguyễn Văn B",
      nv_status: 1,
      company_id: 65,
      nv_nguoiduyet_ditre: 1,
      nv_nguoiduyet_congtac: 1,
      nv_nguoiduyet_phep: 0
    }
  ];

  useEffect(() => {

    setNvList(dataNv);
    setDiTreList(dataNv?.filter(item => item?.nv_nguoiduyet_ditre === 1));
    setDuyetPhepList(dataNv?.filter(item => item?.nv_nguoiduyet_phep === 1));
    setCongTacList(dataNv?.filter(item => item?.nv_nguoiduyet_congtac === 1));

    dispatch(setReload(false));

  }, [reload]);


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

  const handleAddNguoiDuyet = (nv_id, type) => {
  };

  const handleRemoveNguoiDuyet = (nv_id, type) => {
  };

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
              handleRemoveNguoiDuyet(nv?.nv_id, 'nv_nguoiduyet_ditre');
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
              handleRemoveNguoiDuyet(nv?.nv_id, 'nv_nguoiduyet_phep');
            }}
          >
            X
          </button>
        </div>
      )
    })
  }

  const renderNguoiCongTac = () => {
    return nvList?.filter(item => item?.nv_nguoiduyet_congtac === 1).map((nv, index) => {
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
              handleRemoveNguoiDuyet(nv?.nv_id, 'nv_nguoiduyet_congtac');
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
          Duyệt phép
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
              handleAddNguoiDuyet(e, "nv_nguoiduyet_ditre")
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
              handleAddNguoiDuyet(e, "nv_nguoiduyet_phep")
            }}
            onBlur={(e) => {
              handleAddNguoiDuyet(e, "nv_nguoiduyet_phep")
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
              handleAddNguoiDuyet(e, "nv_nguoiduyet_congtac")
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
