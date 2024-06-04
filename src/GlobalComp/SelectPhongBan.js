import { Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { localStorageService } from '../services/localStorageService';
import { chamCongService } from '../services/chamCongService';
import { useDispatch, useSelector } from 'react-redux';
import { setDanhMuc, setNhanVien } from '../Redux-toolkit/reducer/ChamCongSlice';
import { setLoading } from '../Redux-toolkit/reducer/UserSlice';

export default function SelectPhongBan() {
    let token = localStorageService.getItem("token");
    let dispatch = useDispatch();
    let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);
    let option = [];
    let [pbList, setPbList] = useState([]);
    useEffect(() => {
        chamCongService.getPhongBan(token).then((res) => {
            setPbList(res.data.content);
            dispatch(setDanhMuc(res.data.content[0]?.danhmuc_id));
        })
            .catch((err) => {
                console.log(err);
            });
    }, [])
    const filterOption = (input, option) =>
        (option?.key ?? '').toLowerCase().includes(input.toLowerCase());
    let changePhongBan = (e) => {
        dispatch(setDanhMuc(e));
        getNhanVien(e);
    }
    const getNhanVien = (e) => {
        chamCongService.getPhongBanNhanVien(token).then((res) => {
            dispatch(setLoading(false));
            res.data.content?.map((phongBan) => {
                if (phongBan?.danhmuc_id == e) {
                    phongBan?.ns_nhanvien?.map((nhanVien, index) => {
                        if (index == 0) {
                            dispatch(setNhanVien(nhanVien?.nv_id));
                        }
                    })
                }
            })
        })
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
        option = [...array];
    }
    return (
        <div id='selectPB' className='w-full'>
            {renderOption()}
            <Select
                value={danhmuc_id == 0 ? null : danhmuc_id}
                onChange={changePhongBan}
                filterOption={filterOption}
                showSearch
                className='w-full text-gray-600'
                style={{ height: "100%", border: "none", textAlign: "left" }}
                placeholder={<p className='text-black font-medium'>Chọn Phòng Ban</p>}
                options={option}
            >
            </Select>
        </div>
    )
}
