import axios from 'axios'
import { API_URL } from '../constants/constants'

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` }

export const getAllOrderByUser = () => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/order/user`,
        headers: headers,
    })
}

export const addOrder = (order) => {
    return axios({
        method: 'POST',
        url: `${API_URL}/api/order`,
        data: order,
        headers: headers,
    })
}

export const checkTradingCode = (tradingCode) => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/order/checkCode?tradingCode=${tradingCode}`,
        headers: headers,
    })
}

export const getDetailOrderById = (id) => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/order/detail-full/${id}`,
        headers: headers,
    })
}

export const cancelOrder = (id) => {
    // return axios.put(`${API_URL}/api/order/cancel/${id}`)
    return axios({
        method: 'PUT',
        url: `${API_URL}/api/order/cancel/${id}`,
        headers: headers,
    })
}

export const updateStatusPayment = (data) => {
    // return axios.put(`${API_URL}/api/order/pay-success/${data.order_id}`, data)
    return axios({
        method: 'PUT',
        url: `${API_URL}/api/order/pay-success/${data.order_id}`,
        data: data,
        headers: headers,
    })
}