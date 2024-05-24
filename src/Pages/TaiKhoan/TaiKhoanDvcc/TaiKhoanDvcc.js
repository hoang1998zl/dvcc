import React, { useEffect, useState } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { localStorageService } from '../../../services/localStorageService';
import { Switch } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import { Input, Select } from 'antd';
import { nhanVienService } from '../../../services/nhanVienService';
import { cauHinhChungService } from '../../../services/cauHinhChungService';
import { chiNhanhService } from '../../../services/chiNhanhService';
import { toast } from 'react-toastify';
import { setReloadMany } from '../../../Redux-toolkit/reducer/ChamCongSlice';
import moment from 'moment/moment';

const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
const label = { inputProps: { 'aria-label': 'Switch demo' } };
export default function TaiKhoanDvcc() {
    const YellowSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: yellow[400],
          '&:hover': {
            backgroundColor: alpha(yellow[700], theme.palette.action.hoverOpacity),
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: yellow[700],
        },
    }));
    let dispatch = useDispatch();
    let token = localStorageService.getItem("token");
    let congTy = useSelector((state) => state.UserSlice.congTy);
    let [reload, setReload] = useState(0);
    let nv_id = useSelector((state) => state.UserSlice.currentNhanVien);
    let [textUsername, setTextUsername] = useState("");
    let [textPassword, setTextPassWord] = useState("");
    let [chiNhanh, setChiNhanh] = useState([]);
    let [caLamViec, setCaLamViec] = useState([]);
    let [arrayCNNV, setArrayCNNV] = useState([]);
    let [diTreList, setDiTreList] = useState([]);
    let [nghiPhepList, setNghiPhepList] = useState([]);
    let [congTacList, setCongTacList] = useState([]);
    let [baseFormat, setBaseFormat] = useState({
        nv_id: 0,
        nv_name:"",
        nv_username: "",
        nv_password: "",
        nv_chinhanh: [],
        nv_calamviec: null,
        nv_calamviec2: null,
        nv_anhchamcong: 0,
    })
    useEffect(() => {
        setTextUsername("");
        setTextPassWord("");
        if(!nv_id){
          return;
        }
        nhanVienService.getNhanVienTheoId(token, nv_id).then((res) => {
          setThongTinDVCC(res.data.content);
        })
          .catch((err) => {
            console.log(err);
          });
        chiNhanhService.getChiNhanh(token).then((res) => {
          setChiNhanh(res.data.content);
        })
          .catch((err) => {
            console.log(err);
          });
        cauHinhChungService.getCaLamViec(token).then((res) => {
          setCaLamViec(res.data.content);
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
        chiNhanhService.getChiNhanhTheoUSer(token, nv_id).then((res) => {
          setArrayCNNV(renderValueChiNhanh(res.data.content))
        })
          .catch((err) => {
            console.log(err);
          });
    }, [nv_id, reload])

    let handleUpdateUserDVCC = () => {
        baseFormat.nv_chinhanh = arrayCNNV;
        if (baseFormat?.nv_username == "" || baseFormat?.nv_username == null) {
          setTextUsername("Vui lòng nhập tài khoản");
          return;
        } else {
          let codeCompany = baseFormat?.nv_username ? baseFormat.nv_username.split(".") : [""];
          if (codeCompany[0] !== congTy.company_code) {
            setTextUsername("Tài khoản không hợp lệ! " + `${congTy?.company_code}` + ".tài khoản");
            return;
          }
        };
        if (baseFormat?.nv_password == "" || baseFormat?.nv_password == null) {
          setTextPassWord("Vui lòng nhập mật khẩu");
          return;
        }
        setTextUsername("");
        setTextPassWord("");
        if (baseFormat.nv_chinhanh.length === 0) {
          baseFormat.nv_chinhanh = chiNhanh[0]?.chi_nhanh_id ? [chiNhanh[0].chi_nhanh_id] : null
        }
        if (!baseFormat.nv_calamviec) {
          baseFormat.nv_calamviec = caLamViec[0]?.id ? caLamViec[0].id : null
        }
        
        nhanVienService.createDvcc(token, baseFormat).then((res) => {
          setReload(Date.now());
          dispatch(setReloadMany(Date.now()));
          toast.success("Cập nhật thành công!!!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        })
          .catch((err) => {
            toast.error("Cập nhật thất bại!!!", {
              position: toast.POSITION.TOP_RIGHT
            });
            console.log(err);
          });
    }
    let setThongTinDVCC = (nv) => {
        let data = {
            nv_name: nv?.nv_name,
            nv_id: nv?.nv_id ? nv.nv_id : 0,
            nv_username: nv?.nv_username ? nv.nv_username : "",
            nv_password: nv?.nv_password ? nv.nv_password : "",
            nv_chinhanh: [],
            nv_calamviec: nv?.nv_calamviec ? nv.nv_calamviec : null,
            nv_calamviec2: nv?.nv_calamviec2 ? nv?.nv_calamviec2 : null,
            nv_anhchamcong: nv?.nv_anhchamcong ? nv.nv_anhchamcong : 0,
            is_saler: nv?.is_saler ? nv.is_saler : 0,
            is_parttime: nv?.is_parttime
        }
        setBaseFormat(data);
    }
    let renderValueChiNhanh = (data) => {
        let array = [];
        data?.map((item) => {
          if (item?.chi_nhanh_id) {
            array.push(item?.chi_nhanh_id);
          }
        })
        return array;
    }
    let renderCaLamViecSelect = () => {
        let array = [];
        caLamViec?.map((item) => {
          array.push({
            value: item?.id,
            label: <p>{item?.name}: {moment(item?.gio_bat_dau,"HH:mm:ss").format("HH:mm")}-{moment(item?.gio_ket_thuc,"HH:mm:ss").format("HH:mm")}</p>
          })
        })
        return array;
    }
    let renderCaLamViec2Select = () => {
        let array = [];
        array.push({
          value: null,
          label: "Không Có"
        })
        caLamViec?.map((item) => {
          array.push({
            value: item?.id,
            label: <p>{item?.name}: {item?.gio_bat_dau}-{item?.gio_ket_thuc}</p>
          })
        })
        return array;
    }
    let changeInput = (e, type) => {
        let clone = { ...baseFormat };
        if (type == "username") {
          clone.nv_username = e.target.value;
        } else if (type == "chinhanh") {
          setArrayCNNV(e);
        } else if (type == "calamviec") {
          clone.nv_calamviec = e
        } else if (type == "calamviec2") {
          clone.nv_calamviec2 = e
        } else if (type == "anhchamcong") {
          clone.nv_anhchamcong = Number(e.target.checked);
        } else if (type == "is_saler") {
          clone.is_saler = Number(e.target.checked);
        }else if (type == "is_parttime") {
          clone.is_parttime = e;
        } else {
          clone.nv_password = e.target.value;
        }
        setBaseFormat(clone);
    }
    let renderOptionSelect = () => {
        let array = [];
        chiNhanh?.map((item) => {
          array.push({
            value: item?.chi_nhanh_id,
            label: <p>{item?.chi_nhanh_name}</p>
          })
        })
        return array;
    }
return (
    <div className='w-full flex flex-col pr-2 relative'>
        {
          !nv_id && <div className='absolute w-full h-full bg-white opacity-70'>
          </div>
        }
        <h1
            className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg pl-4 pt-2'>
        <FaRegCircleCheck />
            <strong>
                Tài Khoản App Định Vị Chấm Công: {baseFormat?.nv_name}
            </strong>
        </h1>
        <div className='w-full border border-gray-300 rounded-lg h-full m-2 grid grid-cols-3 gap-2 p-2'>
            <div>
                <p>
                Tài khoản App định vị:
                </p>
                <p className='text-xs text-red-600 italic'>
                Có thể dùng sđt để đăng nhập App
                </p>
                <Input
                    className='w-full' onChange={(e) => changeInput(e, "username")}
                    value={baseFormat?.nv_username ? baseFormat.nv_username : congTy?.company_code + "."}
                    placeholder="Nhập tài khoản"
                    />
                    <p className='text-red-500'>{textUsername}</p>
            </div>
            <div>
                <p>
                Mật khẩu:
                </p>
                <p className='text-xs text-transparent'>""</p>
                <Input.Password
                className='w-full'
                onChange={(e) => changeInput(e, "password")}
                value={baseFormat?.nv_password ? baseFormat.nv_password : ""}
                placeholder="Nhập mật khẩu"
                />
                <p className='text-red-500'>{textPassword}</p>
            </div>
            <div>
                <p>
                Làm việc tại:
                </p>
                <p className='text-xs text-transparent'>""</p>
                <Select
                    className='w-full'
                    mode='multiple'
                    onChange={(e) => changeInput(e, "chinhanh")}
                    value={arrayCNNV}
                    showSearch
                    placeholder="Chọn chi nhánh"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={renderOptionSelect()}
                />
            </div>
            <div>
                <p>
                Ca Sáng:
                </p>
                <Select
                className='w-full'
                onChange={(e) => changeInput(e, "calamviec")} value={baseFormat?.nv_calamviec ? baseFormat?.nv_calamviec : caLamViec[0]?.id} showSearch placeholder="Chọn Ca Làm Việc" optionFilterProp="children"
                filterOption={filterOption}
                options={renderCaLamViecSelect()}
                />
            </div>
            <div>
                <p>
                Ca Chiều:
                </p>
                <Select
                className='w-full'
                onChange={(e) => changeInput(e, "calamviec2")} value={baseFormat?.nv_calamviec2 ? baseFormat?.nv_calamviec2 : null} showSearch placeholder="Chọn Ca Làm Việc" optionFilterProp="children"
                filterOption={filterOption}
                options={renderCaLamViec2Select()}
                />
            </div>
            <div>
                <p>
                  Hình thức chấm công:
                </p>
                <Select
                className='w-full'
                onChange={(e) => changeInput(e, "is_parttime")} value={baseFormat?.is_parttime} showSearch placeholder="Chọn Loại Nhân Viên" optionFilterProp="children"
                filterOption={filterOption}
                options={[
                  {
                    value: 0,
                    label: "Ca làm việc cố định "
                  },
                  {
                    value: 1,
                    label: "Đăng ký ca - duyệt ca"
                  }
                ]}
                />
            </div>
            <div>
                <p>
                  Chụp ảnh khi c/công:
                </p>
                <p className='text-transparent'>""</p>
                <YellowSwitch
                style={{ marginRight: 10 }}
                onChange={(e) => changeInput(e, "anhchamcong")}
                {...label}
                checked={baseFormat?.nv_anhchamcong == 1 ? true : false}
                />
            </div>
            <div>
                <p>
                  Chấm công bất kể khoảng cách:
                </p>
                <YellowSwitch
                style={{ marginRight: 10 }}
                onChange={(e) => changeInput(e, "is_saler")}
                {...label}
                checked={baseFormat?.is_saler == 1 ? true : false}
                />
            </div>
            <div className='flex justify-end items-end'>
                <button
                type="button"
                className='px-4 py-1 rounded text-white bg-yellow-400 h-8 mr-5'
                onClick={() => {
                    handleUpdateUserDVCC()
                }}
                >
                Lưu
                </button>
            </div>
        </div>
    </div>
  )
}
