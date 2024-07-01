import axios from "axios"
import { BASE_URL } from "./configURL"

export const  chamCongService = {
    getPhongBan: (token) => {
        return axios({
            url: BASE_URL + "api/phong-ban/get-phong-ban",
            method: "GET",
            headers:{
                token
              }
        })
    },
    getPhongBanNhanVien: (token) => {
        return axios({
            url: BASE_URL + "api/phong-ban/get-phong-ban-nhan-vien",
            method: "GET",
            headers:{
                token
              }
        })
    },
    taoPhongBan: (token,danhmuc_name) => {
        return axios({
            url: BASE_URL + "api/phong-ban/tao-phong-ban",
            method: "POST",
            data:{
                danhmuc_name
            },
            headers:{
                token
              }
        })
    },
    doiTenPhongBan: (token,danhmuc_id,danhmuc_name) => {
        return axios({
            url: BASE_URL + "api/phong-ban/doi-ten-phong-ban",
            method: "PUT",
            data:{
                danhmuc_name,
                danhmuc_id
            },
            headers:{
                token
              }
        })
    },
    xoaPhongBan: (token,danhmuc_id) => {
        return axios({
            url: BASE_URL + "api/phong-ban/xoa-phong-ban/"+ danhmuc_id,
            method: "DELETE",
            headers:{
                token
              }
        })
    },
    taoNhanVien: (token,danhmuc_id,nv_name) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/tao-nhan-vien",
            method: "POST",
            data:{
                danhmuc_id,
                nv_name
            },
            headers:{
                token
              }
        })
    },
    renameNhanVien: (token,nv_name,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/sua-ten-nhan-vien",
            method: "PUT",
            data:{
                nv_name,
                nv_id
            },
            headers:{
                token
              }
        })
    },
    xoaNhanVien: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/xoa-nhan-vien/"+ nv_id,
            method: "DELETE",
            headers:{
                token
              }
        })
    },
    layCongTy: (token) => {
        return axios({
            url: BASE_URL + "api/phong-ban/lay-thong-tin-cong-ty",
            method: "GET",
            headers:{
                token
            }
        })
    },
    getBangCong: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/data",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    updateBangCong: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/post/change-data",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    getNhatKy: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/note",
            method: "POST",
            data,
            headers:{
                token
            }
        }) 
    },
    getChamApp: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/get-cham-app",
            method: "POST",
            data,
            headers:{
                token
            }
        }) 
    },
    getNCC: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/post/lay-ncc",
            method: "POST",
            data,
            headers:{
                token
            }
        }) 
    },
    updateNCC: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/post/cap-nhat-ncc",
            method: "PUT",
            data,
            headers:{
                token
            }
        }) 
    },
    layLogBangCong: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/post/lay-log-cham-cong",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    layAnhChamCong: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/post/lay-anh-cham-cong",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    layCachTinhTangCa: (token) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/lay-cach-tinh-tang-ca",
            method: "GET",
            headers:{
                token
            }
        })
    },
    suaCachTinhTangCa: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/sua-cach-tinh-tang-ca",
            method: "PUT",
            data,
            headers:{
                token
            }
        })
    },
    layBangCongParttime: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/bang-cong-pt",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    layChiTietNgayCongPt: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/chi-tiet-ngay-cong-pt",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    layBangCongTangCa: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/bang-cong-tang-ca",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    layChiTietTangCa: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/get/chi-tiet-tang-ca",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    updateTangCa: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/post/cap-nhat-tang-ca",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    createTangCa: (token,data) => {
        return axios({
            url: BASE_URL + "api/bang-cong/post/them-tang-ca",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    sendThongBaoNoiBo: (token,data) => {
        const formData = new FormData();
        if(data.file) {
            formData.append('fileTBNB', data.file);
        }
        formData.append('title', JSON.stringify(data.title));
        formData.append('content', JSON.stringify(data.content));
        formData.append('danhmuc_id', JSON.stringify(data.danhmuc_id));
        return axios({
            url: BASE_URL + "api/bang-cong/post/gui-thong-bao-noi-bo",
            method: "POST",
            data: formData,
            headers:{
                token
            }
        })
    }
}