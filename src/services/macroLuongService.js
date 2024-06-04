import axios from "axios"
import { BASE_URL } from "./configURL"

export const macroLuongService = {
  getPermission: (token) => {
    return axios({
        url: BASE_URL + "api/macro-luong/get-permission",
        method: "GET",
        headers:{
            token
        }
    })
  },
  getMacro: (token) => {
    return axios({
        url: BASE_URL + "api/macro-luong/get-macro",
        method: "GET",
        headers:{
            token
        }
    })
  },
  addMacro: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/create-macro`, data, {
        headers: {
          token
        },
      })
  },
  updateMacro: (token, macro_id, data) => {
    return axios.put(`${BASE_URL}api/macro-luong/update-macro/${macro_id}`,data, {
      headers: {
        token
      },
    })
  },
  deleteMacro: (token, macro_id) => {
    return axios.put(`${BASE_URL}api/macro-luong/delete-macro/${macro_id}`,{}, {
      headers: {
        token
      },
    })
  },
  getCot: (token) => {
    return axios.get(`${BASE_URL}api/macro-luong/get-cot`, {
      headers: {
        token
      },
    })
  },
  addCot: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/create-cot`, data, {
        headers: {
          token
        },
      })
  },
  updateCot: (token, cot_id, data) => {
    return axios.put(`${BASE_URL}api/macro-luong/update-cot/${cot_id}`,data, {
      headers: {
        token
      },
    })
  },
  deleteCot: (token, cot_id) => {
    return axios.put(`${BASE_URL}api/macro-luong/delete-cot/${cot_id}`,{}, {
      headers: {
        token
      },
    })
  },
  getNhapLieu: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/data-nhap-lieu`, data, {
        headers: {
          token
        },
      })
  },
  updateNhapLieu: (token, data) => {
    return axios.put(`${BASE_URL}api/macro-luong/nhap-lieu`,data, {
      headers: {
        token
      },
    })
  },
  getHTTL: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/data-httl`, data, {
        headers: {
          token
        },
      })
  },
  upsertHTTL: (token, data) => {
    return axios.put(`${BASE_URL}api/macro-luong/hien-thi-tinh-luong`,data, {
      headers: {
        token
      },
    })
  },
  addHTTL: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/create-httl`, data, {
        headers: {
          token
        },
      })
  },
  copyHTTL: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/copy-httl`, data, {
        headers: {
          token
        },
      })
  },
  getBangLuong: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/data-bangluong`, data, {
        headers: {
          token
        },
      })
  },
  sendBangLuongToEmail: (token, data) => {
    return axios.post(`${BASE_URL}api/macro-luong/send-email`, data, {
        headers: {
          token
        },
      })
  },
}