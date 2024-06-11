import axios from "axios"
import { BASE_URL } from "./configURL"

export const cauHinhChungService = {
    layGioCong: (token) => {
        return axios({
            url: BASE_URL + "api/gio-cong/lay-gio-cong",
            method: "GET",
            headers: {
                token
            }
        })
    },
    createUpdateGioCong: (token, data) => {
        return axios({
            url: BASE_URL + "api/gio-cong/tao-gio-cong",
            method: "POST",
            data,
            headers: {
                token
            }
        })
    },
    getNguoiDuyetDiTre: (token) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-nguoi-duyet-di-tre",
            method: "GET",
            headers: {
                token
            }
        })
    },
    getNguoiDuyetPhep: (token) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-nguoi-duyet-phep",
            method: "GET",
            headers: {
                token
            }
        })
    },
    getNguoiDuyetCongTac: (token) => {
        return axios({
            url: BASE_URL + "api/nhan-vien/lay-nguoi-duyet-cong-tac",
            method: "GET",
            headers: {
                token
            }
        })
    },
    getCaLamViec: (token) => {
        return axios({
            url: BASE_URL + "api/gio-cong/lay-ca-lam-viec",
            method: "GET",
            headers: {
                token
            }
        })
    },
    getProvinces: (token) => {
        return axios({
            url: BASE_URL + "api/phong-ban/lay-tinh-thanh",
            method: "GET",
            headers: {
                token
            }
        })
    },
    getDistricts: (token, province_code) => {
        return axios({
            url: BASE_URL + `api/phong-ban/lay-quan-huyen/${province_code}`,
            method: "GET",
            headers: {
                token
            }
        })
    },
    getWards: (token, district_code) => {
        return axios({
            url: BASE_URL + `api/phong-ban/lay-xa-phuong/${district_code}`,
            method: "GET",
            headers: {
                token
            }
        })
    },
    phanQuyen: (token,data) => {
        return axios({
            url: BASE_URL + `api/cau-hinh-chung/phan-quyen`,
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    boPhanQuyen: (token,data) => {
        return axios({
            url: BASE_URL + `api/cau-hinh-chung/bo-phan-quyen`,
            method: "PUT",
            data,
            headers: {
                token
            }
        })
    },
    layThongTinCongTy: (token) => {
        return axios({
            url: BASE_URL + `api/cau-hinh-chung/lay-thong-tin-cong-ty`,
            method: "GET",
            headers: {
                token
            }
        })
    },
    updateLogo: (token,files) => {
        const formData = new FormData();
        formData.append("company_logo", files);
        return axios({
            url: BASE_URL + `api/cau-hinh-chung/update-logo`,
            method: "PUT",
            data: formData,
            headers: {
                token
            }
        })
    },
    updateCongTy: (token,data) => {
        return axios({
            url: BASE_URL + `api/cau-hinh-chung/update-cong-ty`,
            method: "PUT",
            data ,
            headers: {
                token
            }
        })
    },
    xoaCaLamViec: (token,id) => {
        return axios({
            url: BASE_URL + `api/gio-cong/xoa-ca-lam-viec/` + id,
            method: "DELETE",
            headers: {
                token
            }
        })
    }
}