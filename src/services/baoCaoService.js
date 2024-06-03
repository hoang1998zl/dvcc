import axios from "axios"
import { BASE_URL } from "./configURL"

export const baoCaoService = {
    layThongKe: (token,ngay) => {
        return axios({
            url: BASE_URL + "api/bao-cao/lay-thong-ke-phep",
            method: "POST",
            data:{
                ngay
            },
            headers: {
                token
            }
        })
    },
    layBaoCaoTuan: (token,ngay) => {
        return axios({
            url: BASE_URL + "api/bao-cao/lay-bao-cao-tuan",
            method: "POST",
            data:{
                ngay
            },
            headers: {
                token
            }
        })
    },
    layBaoCaoPhongBan: (token,ngay) => {
        return axios({
            url: BASE_URL + "api/bao-cao/lay-bao-cao-phong-ban",
            method: "POST",
            data:{
                ngay
            },
            headers: {
                token
            }
        })
    },
    layNhanVienOnline: (token,data) => {
        return axios({
            url: BASE_URL + "api/bao-cao/lay-nv-online",
            method: "POST",
            data:data,
            headers: {
                token
            }
        })
    }
}