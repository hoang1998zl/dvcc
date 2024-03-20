import axios from "axios"
import { BASE_URL } from "./configURL"

export const chiNhanhService = {
    getChiNhanh: (token) => {
        return axios({
            url: BASE_URL + "api/phong-ban/lay-chi-nhanh",
            method: "GET",
            headers:{
                token
            }
        })
    },
    getChiNhanhTheoUSer: (token,nv_id) => {
        return axios({
            url: BASE_URL + "api/phong-ban/lay-chi-nhanh-theo-user/"+nv_id,
            method: "GET",
            headers:{
                token
            }
        })
    }
    ,
    createChiNhanh: (token,data) => {
        return axios({
            url: BASE_URL + "api/phong-ban/tao-chi-nhanh",
            method: "POST",
            data,
            headers:{
                token
            }
        })
    },
    updateChiNhanh: (token,data) => {
        return axios({
            url: BASE_URL + "api/phong-ban/cap-nhat-chi-nhanh",
            method: "PUT",
            data,
            headers:{
                token
            }
        })
    }
}