import axios from "axios"
import { BASE_URL } from "./configURL"

export const  nhanVienService = {
    getNhanVienTheoId: (token,user_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-nhan-vien/" + user_id,
            method: "GET",
            headers:{
                token
            }
        })
    },
    getAllNhanVien: (token) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-toan-bo-nhan-vien/",
            method: "GET",
            headers:{
                token
            }
        })
    },
    createDvcc: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-dvcc",
            method: "POST",
            data
            ,headers:{
                token
            }
        })
    },
    updateNhanVien: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-nhan-vien",
            method: "PUT",
            data:data,
            headers:{
                token
            }
        })
    },
    updateAvatar: (token,nv_id,files) => {
        const formData = new FormData();
        formData.append("nv_avatar", files);
        let nv = {
            nv_id
        }
        formData.append("nv",JSON.stringify(nv));
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-avatar",
            method: "POST",
            data: formData,
            headers: {
                token
            }
        });
    },
    updateHopDong: (token,nv_id,files) => {
        const formData = new FormData();
        formData.append("nv_hopdong", files);
        let nv = {
            nv_id
        }
        formData.append("nv",JSON.stringify(nv));
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-hop-dong",
            method: "POST",
            data: formData,
            headers: {
                token
            }
        });
    },
    updateCCCD: (token,nv_id,files,upload_type) => {
        const formData = new FormData();
        formData.append("nv_cccd", files);
        let nv = {
            nv_id,
            upload_type
        }
        formData.append("nv",JSON.stringify(nv));
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-cccd",
            method: "POST",
            data: formData,
            headers: {
                token
            }
        });
    },
    updateGPLX: (token,nv_id,files,upload_type) => {
        const formData = new FormData();
        formData.append("nv_gplx", files);
        let nv = {
            nv_id,
            upload_type
        }
        formData.append("nv",JSON.stringify(nv));
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-gplx",
            method: "POST",
            data: formData,
            headers: {
                token
            }
        });
    },
    getChungChi: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-chung-chi/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    createChungChi: (token,nv_id,bangcap_name) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-chung-chi",
            method: "POST",
            data: {
                nv_id,
                bangcap_name
            },headers: {
                token
            }
        })
    },
    updateChungChi: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-chung-chi",
            method: "PUT",
            data: data,
            headers: {
                token
            }
        })
    },
    uploadChungChi: (token,bangcap_id,files) => {
        const formData = new FormData();
        formData.append("bangcap_scan_file", files);
        let bangcap = {
            bangcap_id
        }
        console.log(bangcap);
        formData.append("bangcap",JSON.stringify(bangcap));
        return axios({
            url: BASE_URL + "api/nhan-vien/upload-chung-chi",
            method: "POST",
            data: formData,
            headers: {
                token
            }
        });
    },
    uploadChungChiNew: (token,nv_id,bangcap_id,files) => {
        const formData = new FormData();
        formData.append("bangcap_scan_file", files);
        let bangcap = {
            nv_id,
            bangcap_id
        }
        formData.append("bangcap",JSON.stringify(bangcap));
        return axios({
            url: BASE_URL + "api/nhan-vien/upload-chung-chi-new",
            method: "POST",
            data: formData,
            headers: {
                token
            }
        });
    },
    getHoSo: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-ho-so/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    createHoSo: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-ho-so/",
            method: "POST",
            data,
            headers: {
                token
            }
        })
    },
    updateHoSo: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-ho-so",
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    getViPham: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-vi-pham/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    createViPham: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-vi-pham/",
            method: "POST",
            data,
            headers: {
                token
            }
        })
    },
    updateViPham: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-vi-pham",
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    getTNGT: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-tngt/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    createTNGT: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-tngt/",
            method: "POST",
            data,
            headers: {
                token
            }
        })
    },
    updateTNGT: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-tngt",
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    getTapHuan: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-tap-huan/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    createThamGiaTapHuan: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-tham-gia-tap-huan",
            method: "POST",
            data,
            headers: {
                token
            }
        })
    },
    deleteThamGiaTapHuan: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/xoa-tham-gia-tap-huan",
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    getKhamSucKhoe: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-kham-suc-khoe/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    createThamGiaKSK: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-tham-gia-ksk",
            method: "POST",
            data,
            headers: {
                token
            }
        })
    },
    updateThamGiaKSK: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/sua-tham-gia-ksk",
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    getBaoHiem: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-bao-hiem/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    getThuongPhat: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-thuong-phat/"+ nv_id,
            method: "GET",
            headers: {
                token
            }
        })
    },
    addDieuChuyen: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-dieu-chuyen",
            method: "POST",
            data,
            headers: {
                token
            }
        })
    },
    addThoiViec: (token,data,files) => {
        const formData = new FormData();
        formData.append("thoiviec_file", files);
        let transData = {
            thoiviec_date: data.thoiviec_date,
            thoiviec_reson: data.thoiviec_reson,
            thoiviec_note: data.thoiviec_note
        }
        formData.append('nv', JSON.stringify(transData));
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-thoi-viec",
            method: "POST",
            data: formData,
            headers: {
                token,
                nv_id: data.nv_id
            }
        })
    },
    deleteQHGD: (token,data) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/xoa-quan-he-gia-dinh",
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    updateNhanVienField: (token,nv_id, field, value) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/cap-nhat-nhan-vien-field",
            method: "PUT",
            data:{
                nv_id,
                field,
                value,
            },
            headers:{
                token
            }
        })
    },
    updateCV: (token,nv_id,files) => {
        const formData = new FormData();
        formData.append("nv_cv", files);
        let nv = {
            nv_id
        }
        formData.append("nv",JSON.stringify(nv));
        return axios({
            url: BASE_URL + "api/nhan-vien/upload-cv",
            method: "POST",
            data: formData,
            headers: {
                token
            }
        });
    },
}