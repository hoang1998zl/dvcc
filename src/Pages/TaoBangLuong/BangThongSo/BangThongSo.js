import React, { useEffect, useState } from 'react'
import { macroLuongService } from '../../../services/macroLuongService';
import { localStorageService } from '../../../services/localStorageService';
import TaoCongThuc from '../TaoCongThuc/TaoCongThuc';
import '../../../issets/css/CustomTab.css';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';
import { Popconfirm } from 'antd';

export default function BangThongSo() {
    let token = localStorageService.getItem("token");
    const regex = /[^A-Z0-9]/g;
    let [macroList,setMacroList] = useState([]);
    let [reloadMacro, setReloadMacro] = useState();
    let [newMacro, setNewMacro] = useState({});
    let resetNewMacro = () => {
        setNewMacro({
            macro_name: '',
            macro_kyhieu: '',
            macro_ynghia: '',
            macro_nguon: 1
        });
    }
    useEffect(() => {
        macroLuongService.getMacro(token).then((res) => {
            setMacroList(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
        resetNewMacro();
    }, [reloadMacro])
    const checkNullValues = (obj) => {
        for (let key in obj) {
          if (!obj[key]) {
            return false;
          }
        }
        return true;
    }
    const [isHovering, setIsHovering] = useState(-1);
    const [isConfirming, setIsConfirming] = useState(-1);
    const handleMouseOver = (id) => {
        setIsHovering(id);
    };
    const handleMouseOut = () => {
        if(isConfirming!=isHovering){
            setIsHovering(-1);
        }
    };
    const changeInput = (index, field, value) => {
        if(field=='macro_kyhieu'){
            value = value.substring(0, 5);
            value = value.replace(regex, "");
        }
        let clone;
        if(index < 0) {
            clone = {...newMacro};
            clone[field] = value;
            setNewMacro(clone);
        } else {
            clone = [...macroList];
            clone[index][field] = value;
            setMacroList(clone);
        }
    }
    const handleCreateMacro = async() => {
        await macroLuongService.addMacro(token,newMacro).then((res) => {
            if(!res.data.newData.status){
                toast.success('Thêm macro thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000
                });
                setReloadMacro(Date.now());
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
    const handleDeleleMacro = async(macro_id) => {
        await macroLuongService.deleteMacro(token, macro_id).then((res) => {
            if(!res.data.deletedData.status){
                toast.success('Xóa macro thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000
                });
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
        handleMouseOut();
        setReloadMacro(Date.now());
    }
    const handleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.target.blur();
        }
    }
    const handleOnBlur = (index) => {
        macroLuongService.updateMacro(token, macroList[index].macro_id, macroList[index]).then((res) => {
            if(!res.data.updatedData.status){
                toast.success('Cập nhật macro thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000
                });
                setReloadMacro(Date.now());
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
    const renderNguon = (nguon) => {
        switch(nguon){
            case 1:
                return 'Nhập liệu';
            case 2:
                return 'Từ bảng công';
            case 3:
                return 'BHXH';
            case 4:
                return 'Tạm Ứng';
            case 5:
                return 'Thưởng/Phạt';
            default:
                return '';
        }
    }

    return (
        <div id='bangThongSo' className='grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[calc(100vh-11.5rem)] overflow-y-auto'>
            <div className='bg-white rounded-lg p-4'>
                <h1 className='text-left font-bold mb-2 text-lg uppercase text-orange-400'>Bảng Macro hệ thống</h1>
                <div className='w-full overflow-auto rounded'>
                    <table className='customTable w-max min-w-full mx-auto'>
                        <thead className='leading-8'>
                            <th>STT</th>
                            <th>Tên Macro</th>
                            <th className='w-[80px]'>Ký Hiệu</th>
                            <th className='hidden lg:table-cell'>Ý Nghĩa</th>
                            <th>Nguồn dữ liệu</th>
                        </thead>
                        <tbody>
                            {macroList.length > 0?
                                macroList?.map((item,index) => {
                                    return (
                                        <tr>
                                            <td onMouseOver={() => handleMouseOver(item?.macro_id)} onMouseOut={handleMouseOut}>
                                                {(isHovering==item?.macro_id && item?.macro_nguon == 1)? (
                                                    <Popconfirm
                                                        title="Xác nhận xóa Macro này?"
                                                        okText="Xoá"
                                                        cancelText="Huỷ"
                                                        onConfirm={() => {
                                                            handleDeleleMacro(item?.macro_id);
                                                        }}
                                                        onOpenChange={() => setIsConfirming(item?.macro_id)}
                                                        onCancel={() => setIsConfirming(-1)}
                                                    >
                                                        <button type="button" className="px-1 rounded bg-orange-400 text-white cursor-pointer">
                                                        <i className='fa-solid fa-trash-alt'></i>
                                                        </button>
                                                    </Popconfirm>
                                                ) : index + 1}
                                            </td>
                                            <td className='text-left'>
                                                {
                                                    item?.macro_nguon == 1?(
                                                        <input className='w-full' value={item?.macro_name} onChange={(e)=>{
                                                            changeInput(index,'macro_name',e.target.value)
                                                        }} onKeyDown={(e) => handleKeyDown(e)} onBlur={() => handleOnBlur(index)} />
                                                    ) : item?.macro_name
                                                }
                                            </td>
                                            <td className='text-left'>
                                                {
                                                    item?.macro_nguon == 1?(
                                                        <input className='w-full' value={item?.macro_kyhieu} onChange={(e)=>{
                                                            changeInput(index,'macro_kyhieu',e.target.value)
                                                        }} onKeyDown={(e) => handleKeyDown(e)} onBlur={() => handleOnBlur(index)} />
                                                    ) : item?.macro_kyhieu
                                                }
                                            </td>
                                            <td className='text-left hidden lg:table-cell'>
                                                {
                                                    item?.macro_nguon == 1?(
                                                        <input className='w-full' value={item?.macro_ynghia} onChange={(e)=>{
                                                            changeInput(index,'macro_ynghia',e.target.value)
                                                        }} onKeyDown={(e) => handleKeyDown(e)} onBlur={() => handleOnBlur(index)} />
                                                    ) : item?.macro_ynghia
                                                }
                                            </td>
                                            <td>{renderNguon(item.macro_nguon)}</td>
                                        </tr>
                                    )
                                })
                                :''
                            }
                            <tr>
                                <td>
                                    <button
                                        type='button'
                                        className={`text-sky-400 ${!checkNullValues(newMacro) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        disabled={!checkNullValues(newMacro)}
                                        onClick={handleCreateMacro}
                                    >
                                        <SaveIcon></SaveIcon>
                                    </button>
                                </td>
                                <td className='text-left'><input className='w-full' placeholder='Thêm mới macro' value={newMacro.macro_name} onChange={(e)=>{
                                    changeInput(-1,'macro_name',e.target.value)
                                }} /></td>
                                <td className='text-left'><input className='w-full' value={newMacro.macro_kyhieu}onChange={(e)=>{
                                    changeInput(-1,'macro_kyhieu',e.target.value)
                                }} /></td>
                                <td className='text-left hidden lg:table-cell'><input className='w-full' value={newMacro.macro_ynghia}onChange={(e)=>{
                                    changeInput(-1,'macro_ynghia',e.target.value)
                                }} /></td>
                                <td>{renderNguon(newMacro.macro_nguon)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='bg-white rounded-lg p-4'>
                <TaoCongThuc/>
            </div>
        </div>
    )
}
