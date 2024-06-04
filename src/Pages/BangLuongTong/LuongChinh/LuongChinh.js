import React, { useEffect, useState } from 'react'
import '../../../issets/css/customTable.css'
import { useSelector } from 'react-redux'
import { localStorageService } from '../../../services/localStorageService'
import { macroLuongService } from '../../../services/macroLuongService'
import { toast } from 'react-toastify'

export default function LuongChinh({fMonth,fYear}) {
  let token = localStorageService.getItem("token");
  let [macroList,setMacroList] = useState([]);
  let [nhapLieuList, setNhapLieuList] = useState([]);
  let danhmuc_id = useSelector(state => state.ChamCongSlice.danhmuc_id);
  let [reloadNhapLieu, setReloadNhapLieu] = useState();
  useEffect(() => {
    macroLuongService.getMacro(token).then((res) => {
      setMacroList(res.data.data.filter(item => item.macro_nguon==1));
      })
      .catch((err) => {
          console.log(err);
      });
  }, [])
  useEffect(() => {
    let data = {
      danhmuc_id,
      fMonth,
      fYear
    }
    macroLuongService.getNhapLieu(token, data).then((res) => {
      setNhapLieuList(res.data.data);
      })
      .catch((err) => {
          console.log(err);
      });
  }, [fMonth,fYear,danhmuc_id,reloadNhapLieu]);
  let changeData = (index, idx, value) => {
    let clone = [...nhapLieuList];
    clone[index].ns_bangluong_nhaplieu[idx].value = value.replace(/\D/g, '');
    setNhapLieuList(clone);
  }
  const handleKeyDown = (e) => {
    if (e.keyCode == 13) {
        e.target.blur();
    }
  }
  const handleOnBlur = (index, idx) => {
    let data = {...nhapLieuList[index].ns_bangluong_nhaplieu[idx]};
    data.nv_id =nhapLieuList[index].nv_id;
    data.fMonth = fMonth;
    data.fYear = fYear;
    macroLuongService.updateNhapLieu(token, data).then((res) => {
      if(!res.data.updatedData?.status){
          toast.success('Cập nhật dữ liệu thành công', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000
          });
      } else {
        if(res.data.updatedData.status!='nothingChanged'){
          toast.error(res.data.updatedData.content, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000
          });
        }
        setReloadNhapLieu(Date.now());
      }
    })
    .catch((err) => {
        console.log(err);
    });
  }
  let renderBangLuong = () => {
    return nhapLieuList.map((item,index) => {
      return <tr>
        <td className='w-12'>{index + 1}</td>
        <td className='text-left px-2 bg-transparent'>{item.nv_name}</td>
        {item?.ns_bangluong_nhaplieu?.map((itm,idx) => {
            return (
              <td className='w-[150px]'><input className='w-full focus:outline-none text-center bg-transparent' type="text" value={new Intl.NumberFormat('EN-US').format(itm.value)} onChange={(e) => {
                changeData(index,idx,e.target.value);
              }} onKeyDown={(e) => handleKeyDown(e)} onBlur={() => handleOnBlur(index,idx)} /></td>
            )
          })
          }
      </tr>
    })
  }
  return (
    <div id='luongChinh' className='bg-white my-4 w-full overflow-x-auto'>
      <table className='text-center customTable'>
        <thead>
          <th className='w-12'>STT</th>
          <th className='text-left px-2'>Nhân Viên</th>
          {macroList?.map((item) => {
            return (
              <th>{item.macro_name}</th>
            )
          })}
        </thead>
        <tbody>
          {renderBangLuong()}
        </tbody>
      </table>
    </div>
  )
}
