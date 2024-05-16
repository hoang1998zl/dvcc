import axios from "axios"
import { BASE_URL } from "./configURL"

export const dvccService = {
    getTotal: (token) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-tong-can-duyet",
            method: "GET",
            headers:{
                token
               }
           })
    },
    getPhepNghi: (token) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-phep-nghi",
            method: "GET",
            headers:{
                token
               }
           })
    },
    duyetPhep: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/duyet-don-xin-phep",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    tuChoiPhep: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/tu-choi-don-xin-phep",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    nhacNho: (data) => {
        return axios({
            url: "https://onesignal.com/api/v1/notifications",
            method: "POST",
            data:{
                include_external_user_ids: ["user_" + data.nv_id],
                data: {
                    type: 1
                },         
                app_id: "6e66ae96-a240-411b-94b8-07bc0cd4466d",
                contents: {
                                en: data.noiDung
                            },
                            headings: {
                                en: data.tieuDe
                            }
            },
            headers:{
                Authorization: "Basic MmMwZWFhYzUtMTI0MC00YjhmLTgxOGMtYjViNmJmZmQzM2I4"
               }
           })
    },
    getCongTac: (token) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-cong-tac",
            method: "GET",
            headers:{
                token
               }
           })
    },
    duyetCongTac: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/duyet-cong-tac",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    tuChoiCongTac: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/tu-choi-cong-tac",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    getSomTre: (token) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-di-tre-ve-som",
            method: "GET",
            headers:{
                token
               }
           })
    },
    duyetDiTre: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/duyet-di-tre",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    duyetVeSom: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/duyet-ve-som",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    tuChoiDiTre: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/tu-choi-di-tre",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    tuChoiVeSom: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/tu-choi-ve-som",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    layDinhVi: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-dinh-vi",
            method: "POST",
            data,
            headers:{
                token
               }
           })
    },
    getNghiPhepUser: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-phep-nghi-user",
            method: "POST",
            data,
            headers:{
                token
               }
           })
    },
    getCongTacUser: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-cong-tac-user",
            method: "POST",
            data,
            headers:{
                token
               }
           })
    },
    getTangCa: (token) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-tang-ca",
            method: "GET",
            headers:{
                token
               }
           })
    },
    duyetTangCa: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/duyet-tang-ca",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    tuChoiTangCa: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/tu-choi-tang-ca",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    layTangCaUser: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-tang-ca-user",
            method: "POST",
            data,
            headers:{
                token
               }
           })
    },
    getLLV: (token) => {
        return axios({
            url: BASE_URL + "api/dvcc/lay-llv-pt",
            method: "GET",
            headers:{
                token
               }
           })
    },
    duyetLLV: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/duyet-llv",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    },
    tuChoiLLV: (token,data) => {
        return axios({
            url: BASE_URL + "api/dvcc/tu-choi-llv",
            method: "PUT",
            data,
            headers:{
                token
               }
           })
    }
}