import { Dropdown, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { localStorageService } from '../../../../services/localStorageService';
import { useDispatch, useSelector } from 'react-redux';
import { chamCongService } from '../../../../services/chamCongService';
import { setDanhMuc, setMonth, setYear } from '../../../../Redux-toolkit/reducer/ChamCongSlice';
import moment from 'moment';
import NhatKyChinhSua from '../NhatKyChinhSua/NhatKyChinhSua';
import BangCongGuide from '../BangCongGuide/BangCongGuide';

const filterOption = (input, option) =>
        (option?.key ?? '').toLowerCase().includes(input.toLowerCase());
export default function BangChamCongMenu() {
    let token = localStorageService.getItem("token");
    let dispatch = useDispatch();
    let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);
    let month = useSelector(state => state.ChamCongSlice.month);
    let year = useSelector(state => state.ChamCongSlice.year);
    let [pbList, setPbList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContent, setCurrentContent] = useState(0);
    const renderContent = () => {
        switch (currentContent) {
            case 0:
                return <NhatKyChinhSua />
            case 1:
                return <BangCongGuide />
            default:
                return <NhatKyChinhSua />
        }
    }
    useEffect(() => {
      chamCongService.getPhongBan(token).then((res) => {
          setPbList(res.data.content);
          if(danhmuc_id == 0){
            dispatch(setDanhMuc(res.data.content[0]?.danhmuc_id));
          }
      })
          .catch((err) => {
              console.log(err);
          });
    }, [])
    let changePhongBan = (e) => {
      dispatch(setDanhMuc(e));
    }
    let renderOption = () => {
      let array = [];
      pbList.map((pb) => {
          let item = {
              value: pb?.danhmuc_id,
              label: <p className='text-black'>{pb?.danhmuc_name}</p>,
              key: pb?.danhmuc_name
          }
          array.push(item);
      })
      return array
    }
    let renderOptMonth = () => {
      let array = [];
      for(let i = 1; i <=12 ; i++){
        let j = "";
        if(i < 10){
          j = "0" + i;
        }else{
          j = String(i);
        }
        let item = {
          value: j,
          label:<p className='text-black'>{j}</p>,
          key: j
        };
        array.push(item);
      }
      return array;
    }
    let renderOptYear = () => {
      let array = [];
      let nam = moment().format("YYYY");
      for(let i = -2; i <= 1; i++){
        let j = moment(nam).add(i,"years").format("YYYY");
        let item = {
          value: j,
          label:<p className='text-black'>{j}</p>,
          key: j
        };
        array.push(item);
      }
      return array;
    }
  return (
    <div
      className='w-full h-10 bg-orange-400 flex justify-between gap-2 items-center px-4 py-0.5 text-white font-semibold rounded'
    >
      <div className='h-full flex items-center gap-2'>
        <p
          className='text-lg uppercase'
        >
          Chấm công
        </p>
        <Select
          className='w-48'
          value={danhmuc_id == 0 ? null : danhmuc_id}
          showSearch
          filterOption={filterOption}
          placeholder="Chọn phòng ban"
          onChange={changePhongBan}
          options={renderOption()}
        />

        <Select
          className='w-16 text-center'
          value={month}
          onChange={(e) => dispatch(setMonth(e))}
          options={renderOptMonth()}
        />

        <Select
          className='w-24 text-center'
          value={year}
          onChange={(e) => dispatch(setYear(e))}
          options={renderOptYear()}
        />
      </div>
      <div>
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <button
                    type='button'
                    className='min-w-40 flex items-center gap-2'
                    onClick={() => {
                        setIsModalOpen(true);
                        setCurrentContent(0);
                    }}
                  >
                    <span>
                      Nhật ký
                    </span>
                  </button>
                ),
              },
              {
                key: '2',
                label: (
                  <button
                    type='button'
                    className='min-w-40 flex items-center gap-2'
                    onClick={() => {
                      setIsModalOpen(true);
                      setCurrentContent(1);
                  }}
                  >
                    <span>
                      Quy ước tăng ca
                    </span>
                  </button>
                ),
              },
            ],
          }}
          placement='bottomRight'
          trigger={['click']}
          arrow
        >
          <button
            type='button'
          >
            <div
              className='w-8 aspect-square rounded border border-transparent hover:border-white flex justify-center items-center text-white text-xl'
            >
              <BsThreeDots />
            </div>
          </button>
        </Dropdown>
        <Modal
                    closeIcon={false}
                    open={isModalOpen}
                    onOk={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                    width={`${window.innerWidth < 768 ? '100%' : '75%'}`}
                    className='mr-0 top-16 z-[10000]'
                    footer={null}
                >
                    {renderContent()}
                </Modal>
      </div>
    </div>
  )
}
