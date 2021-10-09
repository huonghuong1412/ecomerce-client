import axios from 'axios'
const headers = {
    token: process.env.REACT_APP_GHN_TOKEN,
    shopid: process.env.REACT_APP_GHN_SHOPID
}
const URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";

// địa chỉ
export const getListProvince = () => {
    return axios({
        method: 'GET',
        url: `${URL}/province`,
        headers: headers
    })
}

export const getListDistrict = (province_id) => {
    return axios({
        method: 'GET',
        url: `${URL}/district`,
        params: { province_id: province_id },
        headers: headers
    })
}

export const getListWard = (district_id) => {
    return axios({
        method: 'GET',
        url: `${URL}/ward`,
        params: { district_id: district_id },
        headers: headers
    })
}

// tinh phí ship
export const calculateShipFee = (data) => {
    return axios({
        method: 'POST',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        data: data,
        headers: headers
    })
}
// tinh thoi gian du kien giao hang

export const calculateShipTime = (data) => {
    return axios({
        method: 'POST',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime',
        data: data,
        headers: headers
    })
}