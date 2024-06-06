import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm, Select } from 'antd'
import { localStorageService } from '../../../services/localStorageService';
import {  toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../../../issets/css/customTable.css'
import { macroLuongService } from '../../../services/macroLuongService';
import SaveIcon from '@mui/icons-material/Save';
import { setReloadPage } from '../../../Redux-toolkit/reducer/MacroLuongSlice';
import { useDispatch } from 'react-redux';

export default function TaoCongThuc() {
    let token = localStorageService.getItem("token");
    let dispatch = useDispatch();
    
    let [cotList, setCotList] = useState([]);
    const regex = /[^A-Z0-9%^.+\-*/()]|([+\-*/^])(?=[+\-*/^%)])|([A-Z0-9])([(])|([)])([A-Z0-9])|([(])([*/])/g;

    const typeList = [{cot_type:1,type_name:'Lương'},{cot_type:2,type_name:'Phúc lợi'},{cot_type:5,type_name:'Tổng thu nhập'},{cot_type:3,type_name:'Khấu trừ'},{cot_type:6,type_name:'Tổng khấu trừ'},{cot_type:4,type_name:'Thông tin thêm'},/*{cot_type:7,type_name:'Thực nhận'},*/{cot_type:8,type_name:'Ẩn với nhân viên'},{cot_type:9,type_name:'Ngày'}];
    let [reloadCot, setReloadCot] = useState();
    let [newCot, setNewCot] = useState({});
    let resetNewCot = () => {
        setNewCot({
            cot_name: '',
            cot_congthuc: '',
            cot_type: 4
        });
    }
    useEffect(() => {
        macroLuongService.getCot(token).then((res) => {
            setCotList(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
        resetNewCot();
    }, [reloadCot])
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    let changeInput = (index, field, value) => {
        if(field=='cot_congthuc'){
            value = value.replace(regex, "");
        }
        let clone;
        if(index < 0) {
            clone = {...newCot};
            clone[field] = value;
            setNewCot(clone);
        } else {
            clone = [...cotList];
            clone[index][field] = value;
            setCotList(clone);
        }
    }
    const checkNullValues = (obj) => {
        for (let key in obj) {
          if (!obj[key]) {
            return false;
          }
        }
        return true;
    }
    const handleCreateCot = async() => {
        await macroLuongService.addCot(token,newCot).then((res) => {
            if(!res.data.newData.status){
                toast.success('Thêm cột lương thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000
                });
                setReloadCot(Date.now());
                dispatch(setReloadPage(Date.now()));
            } else {
                toast.error(res.data.newData.content, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
            }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const handleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.target.blur();
        }
    }
    const handleOnBlur = (index) => {
        handleUpdateCot(index);
    }
    const handleUpdateCot = (index) => {
        macroLuongService.updateCot(token, cotList[index].cot_id, cotList[index]).then((res) => {
            if(!res.data.updatedData.status){
                toast.success('Cập nhật cột lương thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000
                });
                setReloadCot(Date.now());
                dispatch(setReloadPage(Date.now()));
            } else {
                if(res.data.updatedData.status!='nothingChanged'){
                    toast.error(res.data.updatedData.content, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000
                    });
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    const handleDeleleCot = (cot_id) => {
        macroLuongService.deleteCot(token, cot_id).then((res) => {
            if(!res.data.deletedData.status){
                toast.success('Xóa cột lương thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000
                });
                setReloadCot(Date.now());
                dispatch(setReloadPage(Date.now()));
            } else {
                toast.error(res.data.deletedData.content, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    let renderCot = () => {
        return cotList?.map((item, index) => {
            return <tr>
                <td>{index + 1}</td>
                <td>
                    <input onChange={(e) => changeInput(index, 'cot_name', e.target.value)} className='w-full focus:outline-none px-2' type="text" value={item?.cot_name} onKeyDown={(e) => handleKeyDown(e)} onBlur={() => handleOnBlur(index)}  /></td>
                <td>
                    <input onChange={(e) => changeInput(index, 'cot_congthuc', e.target.value)} className='w-full focus:outline-none px-2' type="text" value={item?.cot_congthuc} onKeyDown={(e) => handleKeyDown(e)} onBlur={() => handleOnBlur(index)}  />
                </td>
                <td><Select
                    className='w-full'
                    listHeight={288}
                    value={item?.cot_type}
                    options={
                        typeList?.map((itm)=>{
                        return {value:itm.cot_type, label:itm.type_name}
                        })
                    }
                    onChange={(value)=>{
                        changeInput(index, 'cot_type',value);
                    }}
                    onBlur={() => handleOnBlur(index)}
                    />
                </td>
                <td>
                    <Popconfirm
                        title="Xác nhận xóa cột lương này?"
                        okText="Xoá"
                        cancelText="Huỷ"
                        onConfirm={() => {
                            handleDeleleCot(item?.cot_id);
                        }}
                    >
                        <button type="button" className="px-1 rounded bg-orange-400 text-white cursor-pointer">
                        <i className='fa-solid fa-trash-alt'></i>
                        </button>
                    </Popconfirm>
                </td>
            </tr>
        })
    }
    return (
        <div id='taoCongThuc' className='px-2'>
            <div className='w-full mx-auto'>
                <div className='w-full relative'>
                    <h1 className='text-left font-bold mb-2 text-lg uppercase text-orange-400 pe-6'>
                        Các cột lương hiện hành
                    </h1>
                    <button
                        type="button"
                        className='w-6 h-6 rounded-full border border-sky-400 text-sky-400 bg-white hover:bg-sky-400 hover:text-white bg-opacity-70 self-center focus:outline-none absolute top-1/2 right-0 -translate-y-1/2'
                        onClick={showModal}
                    >
                        <i class="fa-solid fa-question"></i>
                    </button>
                </div>
                <div className='w-full overflow-auto rounded'>
                    <table className='customTable w-max min-w-full text-center'>
                        <thead className='leading-8'>
                            <th>STT</th>
                            <th className='px-2 text-left'>Tên Cột</th>
                            <th className='px-2 text-left'>Công Thức</th>
                            <th className='px-2 text-center'>Phân loại</th>
                            <th className='min-w-[30px]'></th>
                        </thead>
                        <tbody>
                            {renderCot()}
                            <tr className='addRow'>
                                <td>
                                    <button
                                        type='button'
                                        className={`text-sky-400 ${!checkNullValues(newCot) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        disabled={!checkNullValues(newCot)}
                                        onClick={handleCreateCot}
                                    >
                                        <SaveIcon></SaveIcon>
                                    </button>
                                </td>
                                <td>
                                    <input className='w-full focus:outline-none px-3' placeholder='Thêm mới cột lương' value={newCot.cot_name} onChange={(e)=>{
                                    changeInput(-1,'cot_name',e.target.value)
                                }} /></td>
                                <td><input className='w-full focus:outline-none px-3' value={newCot.cot_congthuc} onChange={(e)=>{
                                    changeInput(-1,'cot_congthuc',e.target.value)
                                }} /></td>
                                <td><Select
                                    className='w-full'
                                    value={newCot.cot_type}
                                    options={
                                        typeList?.map((itm)=>{
                                        return {value:itm.cot_type, label:itm.type_name}
                                        })
                                    } 
                                    onChange={(value)=>{
                                        changeInput(-1, 'cot_type',value);
                                    }}
                                    />
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                open={open}
                onCancel={handleCancel}
                title={<p className='text-lg'>Tạo Công Thức</p>}
                footer={[]}
            >
                <div className='text-base'>
                    <p><span style={{ color: "red", fontWeight: "600" }}>**1.</span> Công thức để tính giá trị của cột là một biểu thức toán học</p>
                    <p><span style={{ color: "red", fontWeight: "600" }}>**2.</span> Công thức bao gồm:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;- Ký hiệu các Macro liên quan</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;- Số</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;- Các phép tính: cộng [+], trừ [-], nhân [*], chia [/], lũy thừa [^]</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;- Ký hiệu phần trăm [%]</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;- Dấu ngoặc đơn [()]</p>
                    <p><span style={{ color: "red", fontWeight: "600" }}>**3.</span> Công thức đúng là công thức thỏa mãn điều kiện về mặt công thức toán học</p>
                    <p><span style={{ color: "red", fontWeight: "600" }}>**4.</span> Công thức sai hoặc ký hiệu Macro bị nhập sai sẽ khiến kết quả trả về bị sai, vui lòng nhập và kiểm tra lại công thức sau khi nhập xong</p>
                </div>
            </Modal>
        </div>
    )
}
