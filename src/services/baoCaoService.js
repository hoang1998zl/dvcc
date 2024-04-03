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
    }
}