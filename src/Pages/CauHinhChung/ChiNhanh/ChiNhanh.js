import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { chiNhanhService } from '../../../services/chiNhanhService';
import { localStorageService } from '../../../services/localStorageService';
import { Input, Modal, Popconfirm, Popover, Select } from 'antd';
import tieudePNG from '../../../issets/img/tieude.png'
import { setDefaults, fromAddress } from "react-geocode";
import { KEY_GG } from '../../../services/configURL';
import { toast } from 'react-toastify';
import { cauHinhChungService } from '../../../services/cauHinhChungService';

setDefaults({
  key: KEY_GG, // Your API key here.
  language: "vi", // Default language for responses.
  region: "vi", // Default region for responses.
});
export default function ChiNhanh() {

  let token = localStorageService.getItem("token");
  let [isChange,setIsChange] = useState(false);
  let [reload,setReload] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chiNhanh, setChiNhanh] = useState([]);
  let [isPopupOpen, setIsPopupOpen] = useState(false);
  let [PopupContent, setPopupContent] = useState(null);
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [provinces, setProvinces] = useState();
  const [provincesName, setProvincesName] = useState('');
  const [districts, setDistricts] = useState();
  const [districtsName, setDistrictsName] = useState('');
  const [wards, setWards] = useState();
  const [wardsName, setWardsName] = useState('');
  const [address, setAddress] = useState('');

  let [baseFormat, setBaseFormat] = useState({
    chi_nhanh_name: "",
    chi_nhanh_address: ""
  })
  const [toaDo, setToaDo] = useState({
    lat: "",
    lng: ""
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
        setScreenWidth(window.innerWidth);
    })
  }, [screenWidth])
  useEffect(() => {
    chiNhanhService.getChiNhanh(token).then((res) => {
      setChiNhanh(res.data.content);
      setToaDo({lat: res.data.content[0]?.latitude,lng: res.data.content[0]?.longitude});
    }).catch((err) => {
      console.log(err);
    })
    cauHinhChungService.getProvinces(token)
            .then((res) => {
                setProvinces(res.data.content);
            })
  }, [reload]);

  let getFromAddress = (address) => {
    fromAddress(address)
        .then(({ results }) => {
            const { lat, lng } = results[0].geometry.location;
            setToaDo({lat,lng})
        })
        .catch(console.error);
  }
  let changeInput = (e, index) => {
    let clone = [...chiNhanh];
    setIsChange(true);
    if (e.target.name === "chi_nhanh_address") {
        getFromAddress(e.target.value);
        clone[index].latitude = toaDo?.lat;
        clone[index].longitude = toaDo?.lng;
    }
    clone[index][e.target.name] = e.target.value;
    setChiNhanh(clone);
  }
  let changeInputCreate = (e) => {
    let clone = { ...baseFormat };
    clone[e.target.name] = e.target.value;
    setBaseFormat(clone);
    if (e.target.id === "chi_nhanh_address_input") {
        if (e.target.value?.length > 10) {
            getFromAddress(e.target.value);
        }
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChangeChiNhanh = (index) => {
    setToaDo({
      lat: chiNhanh[index]?.latitude,
      lng: chiNhanh[index]?.longitude
    });
  }
  let handleCreateChiNhanh = () => {
    if (baseFormat.chi_nhanh_name === "") {
        toast.error("Vui Lòng Nhập Tên Chi Nhánh", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        })
        return;
    }
    if (baseFormat.chi_nhanh_address === "") {
        toast.error("Vui Lòng Nhập Địa Chỉ", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        })
        return;
    }
    if(!toaDo.lat || !toaDo.lng){
        toast.error("Không Lấy Được Toạ Độ", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        })
        return;
    }
    let data = { ...baseFormat };
    data.latitude = toaDo.lat;
    data.longitude = toaDo.lng;
    chiNhanhService.createChiNhanh(token, data).then((res) => {
        setReload(Date.now());
        document.getElementById("chi_nhanh_address_input").value = "";
        document.getElementById("chi_nhanh_name_input").value = "";
        toast.success("Tạo Mới Thành Công!!!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
    })
        .catch((err) => {
            console.log(err);
        });
  }
  let handleUpdateChiNhanh = (index) => {
    let data = chiNhanh[index];
    chiNhanhService.updateChiNhanh(token, data).then((res) => {
        setReload(Date.now());
        setIsChange(false);
        toast.success("Cập nhật thành công!!!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
    })
        .catch((err) => {
            console.log(err);
        });
  }
  let handleDeleteChiNhanh = (chi_nhanh_id) => {
    let data = {
        chi_nhanh_id,
        chi_nhanh_status: 0
    };
    chiNhanhService.updateChiNhanh(token, data).then((res) => {
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
  let tooltipProvince = () => {
    return (
        <div
            className='p-2 grid grid-cols-1 lg:flex gap-2'
        >
            <Select
                id='province'
                showSearch
                showAction={['click', 'focus']}
                autoFocus
                labelInValue
                className='w-full lg:w-40'
                placeholder="Chọn tỉnh thành"
                options={renderProvince()}
                onChange={(e) => {
                    setWards([])
                    setProvincesName(e.title)
                    cauHinhChungService.getDistricts(token, e.value)
                        .then((res) => {
                            setDistricts(res.data.content);
                        })
                }}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
            />
            <Select
                showSearch
                labelInValue
                className='w-full lg:w-40'
                onChange={(e) => {
                    setDistrictsName(e.title)
                    cauHinhChungService.getWards(token, e.value)
                        .then((res) => {
                            setWards(res.data.content);
                        })
                }}
                placeholder="Chọn quận huyện"
                options={renderDistricts()}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
            />
            <Select
                showSearch
                labelInValue
                className='w-full lg:w-40'
                onChange={(e) => {
                    setWardsName(e.title)
                }}
                placeholder="Chọn phường xã"
                options={renderWards()}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
            />
            <Input
                className='w-full lg:w-60'
                placeholder='Địa chỉ'
                autoFocus
                onChange={(e) => {
                    setAddress(e.target.value)
                }}
            />
        </div>
    )
  }
  let renderProvince = () => {
    let options = [];
    let array = [];
    provinces?.map((provinces) => {
        let item = {
            value: provinces.code,
            label: provinces.name,
            title: provinces.full_name
        }
        array.push(item);
    })
    options = [...array];
    return options;
  }
  let renderDistricts = () => {
      let options = [];
      let array = [];
      districts?.map((districts) => {
          let item = {
              value: districts.code,
              label: districts.name,
              title: districts.full_name
          }
          array.push(item);
      })
      options = [...array];
      return options;
  }
  let renderWards = () => {
      let options = [];
      let array = [];
      wards?.map((wards) => {
          let item = {
              value: wards.code,
              label: wards.name,
              title: wards.full_name
          }
          array.push(item);
      })
      options = [...array];
      return options;
  }
  const renderChiNhanh = () => {
    return chiNhanh?.map((item, index) => {
      return (
        <div
          key={index}
          className='w-full flex justify-start items-center gap-2 cursor-pointer hover:bg-slate-100 py-1 px-2 rounded-lg'
          onClick={() => {
            handleChangeChiNhanh(index);
          }}
        >
          <FaLocationDot
            className='text-gray-400 text-lg'
          />
          <div className='flex-1'>
            <p className='text-gray-400 line-clamp-1 text-sm'>
              {item?.chi_nhanh_name}
            </p>
            <p className='font-semibold line-clamp-1'>
              {item?.chi_nhanh_address}
            </p>
          </div>
        </div>
      )
    })
  }
  const renderChiNhanhTable = () => {
    return chiNhanh?.map((item,index) => {
      return(
        <tr key={index} className='cursor-pointer'>
          <td className='text-center'><i className='fa-solid fa-map-marker-alt text-orange-400 text-lg'></i></td>
          <td>
              <input
                onChange={(e) => changeInput(e, index)}
                onKeyDown={(e) => { (e.key === "Enter") && e.target.blur() }}
                onBlur={() => isChange && handleUpdateChiNhanh(index)}
                name={`chi_nhanh_name`}
                className='w-full text-left bg-transparent focus:outline-none px-2 py-1'
                type="text" value={item?.chi_nhanh_name} />
          </td>
          <td>
              <input
                  autoSize
                  onChange={(e) => changeInput(e, index)}
                  onKeyDown={(e) => { (e.key === "Enter") && e.target.blur() }}
                  onBlur={() => isChange && handleUpdateChiNhanh(index)}
                  className='w-full text-left bg-transparent border-none focus:outline-none focus:shadow-none px-2 py-1'
                  value={item?.chi_nhanh_address}
                  name={`chi_nhanh_address`}
                    />
          </td>
          <td className='text-center' >
                    <Popconfirm
                    okType='danger'
                        onConfirm={() => handleDeleteChiNhanh(item.chi_nhanh_id)}
                        title="Xoá địa điểm"
                        description="Xác nhận xoá địa điểm này?"
                        okText="Đồng ý"
                        cancelText="Huỷ bỏ"
                    >
                        <button
                            className='focus:outline-none py-0.5 px-2 bg-orange-400 text-white rounded-sm'
                        >
                            <i className='fa-solid fa-trash-alt'></i>
                        </button>
                    </Popconfirm>
          </td>
        </tr>
      )
    })
  }
  return (
    <div
      id='chiNhanh'
      className='w-full bg-white rounded-lg shadow-md lg:h-[calc(100vh-5.125rem)]'
    >
      <div className='h-1/2 rounded-t-lg'>
        <iframe
          title='map'
          src={`https://maps.google.com/maps?q=${toaDo.lat},${toaDo.lng}&output=embed&z=14`}
          style={{ border: 0, width: "100%", height: "100%" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade" className='rounded-lg shadow'
        ></iframe>
      </div>

      <div className='w-full h-1/2 flex flex-col justify-between gap-4 p-4'>
        <h1
          className=' h-10 flex justify-start items-center gap-2 text-orange-400 text-lg'
        >
          <FaLocationDot />
          <strong>
            Địa điểm làm việc
          </strong>
        </h1>
        <div className='w-full h-[calc((100vh-5.125rem)/2-5.5rem)] ps-4 pe-2 overflow-y-scroll flex flex-col justify-start items-start customScrollbar'>
          {renderChiNhanh()}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className='w-1/3 h-10 mx-auto rounded-full bg-slate-100 font-bold hover:bg-orange-400 hover:text-white'
        >
          Cập nhật
        </button>
        
      </div>
      <Modal open={isModalOpen} footer={""} onCancel={handleCancel} width={"70%"}>
          <div id='chiNhanh' className='relative bg-white rounded-lg lg:p-4 lg:shadow-md'>
              <h2 className='h-10 text-base font-semibold flex items-center px-2 lg:px-4 py-1 bg-orange-400 mb-1 text-left rounded text-white uppercase'>
                <img src={tieudePNG} alt="" className='w-6 h-6 object-contain inline me-2' />
                        <span>Địa Điểm Làm Việc</span>
                    </h2>
                    <div className='overflow-x-auto customScrollbar'>
                        <table className='customTable w-full'>
                            <thead className='sticky top-0 bg-white z-10 text-orange-400 uppercase'>
                                <th className='text-center w-14'></th>
                                <th className='text-left w-32'><p className='px-2'>Tên</p></th>
                                <th className='text-left'><p className='px-2'>Địa chỉ</p></th>
                                <th className='text-end w-14'></th>
                            </thead>
                            <tbody>
                                {renderChiNhanhTable()}
                                <tr className='cursor-pointer addRow'>
                                    <td className='text-center'><i className='fa-solid fa-plus text-lg text-orange-400'></i></td>
                                    <td><input onChange={changeInputCreate} id="chi_nhanh_name_input" name="chi_nhanh_name" className='focus:outline-none text-left w-full px-2 py-1 min-w-0 bg-transparent' type="text" placeholder='Địa điểm mới...'
                                        onKeyDown={(e) => {
                                            if (e.key === 'Tab') {
                                                document.getElementById('chi_nhanh_address_input').click();
                                            }
                                        }}
                                        onFocus={() => {
                                            setIsPopupOpen(true);
                                            setPopupContent('Nhập tên địa điểm');
                                        }}
                                        onBlur={() => {
                                            setIsPopupOpen(false);
                                            setPopupContent(null)
                                        }}
                                    /></td>
                                    <td>
                                        <Popover
                                            title={tooltipProvince}
                                            placement={screenWidth > 540 ? "bottomLeft" : "bottom"}
                                            overlayInnerStyle={{
                                                width: 'max-content',
                                                padding: '0',
                                                backgroundColor: '#fff',
                                            }}
                                            overlayStyle={{
                                                width: 'max-content',
                                            }}
                                            onOpenChange={(visible) => {
                                                if (!visible) {
                                                    document.getElementById('chi_nhanh_address_input').click();
                                                }
                                            }}
                                            trigger={["click"]}
                                        >
                                            <input
                                                id="chi_nhanh_address_input"
                                                name='chi_nhanh_address'
                                                className='focus:outline-none text-left w-full px-2 py-1 bg-transparent'
                                                type="text"
                                                readOnly
                                                autoComplete='off'
                                                placeholder='Địa Chỉ...'
                                                onChange={changeInputCreate}
                                                onClick={(e) => {
                                                    changeInputCreate(e);
                                                }}
                                                onMouseLeave={changeInputCreate}
                                                onFocus={() => {
                                                    setIsPopupOpen(true);
                                                    setPopupContent('Chọn địa chỉ');
                                                }}
                                                onBlur={() => {
                                                    setIsPopupOpen(false);
                                                    setPopupContent(null)
                                                }}
                                                value={`${address}, ${wardsName}, ${districtsName}, ${provincesName}`}
                                            />
                                        </Popover>
                                    </td>
                                    <td className='text-center'>
                                        <button
                                            type='button'
                                            className='w-max border border-gray-300 bg-orange-400 text-white py-1 px-4 rounded font-semibold focus:outline-none pr-7 relative'
                                            onClick={() => {
                                                handleCreateChiNhanh();
                                            }}
                                        >
                                            Lưu
                                            <div className='customTicket absolute -bottom-3 -right-2'></div>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {
                        isPopupOpen == true &&

                        <div className='w-max px-6 py-2 text-center border absolute top-0 right-0 bg-green-400 rounded font-semibold shadow z-50'>
                            <p className='text-white'>
                                {PopupContent}
                            </p>
                        </div>
                    }
                </div>
      </Modal>
    </div>
  )
}
