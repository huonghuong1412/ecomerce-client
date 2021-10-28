import {
    GET_CART_INFO,
    GET_ALL_ITEM_IN_CART
} from '../constants/constants'
import {
    API_URL
} from '../constants/constants'
import axiosClient from 'actions/constants/axiosClient';
// import axios from 'axios'
// const token = localStorage.getItem('token');
// const headers = { Authorization: `Bearer ${token}` }


// get thông tin chi tiết giỏ hàng
export const getDetailCart = () => {
    return dispatch => {
        axiosClient({
            method: 'GET',
            url: `${API_URL}/api/carts/mine/items`,
            // headers: headers,
        })
            .then((res) => {
                getCartInfo();
                dispatch({
                    type: GET_ALL_ITEM_IN_CART,
                    payload: res
                })
            })
            .catch(err => console.log(err))
    }
}


// get thông tin giỏ hàng (số lượng sản phẩm, status, số lượng item)
export const getCartInfo = () => {
    return dispatch => {
        axiosClient({
            method: 'GET',
            url: `${API_URL}/api/carts/mine/info`,
            // headers: headers,
        })
            .then((res) => {
                dispatch({
                    type: GET_CART_INFO,
                    payload: res
                })
            })
            .catch(err => console.log(err))
    }
}


// thêm sản phẩm vào giỏ hàng
export const addProductToCart = (data) => {
    return axiosClient({
        method: "POST",
        // headers: headers,
        url: `${API_URL}/api/carts/mine/items`,
        data: data,
    })
}


// sửa số lượng sản phẩm trong giỏ hàng
export const updateQuantityItem = (data) => {
    return axiosClient({
        method: "PUT",
        // headers: headers,
        url: `${API_URL}/api/carts/mine/items/update`,
        data: data,
    })
}

// xoá sản phẩm trong giỏ hàng
export const deleteItemInCart = (data) => {
    return axiosClient({
        method: "DELETE",
        // headers: headers,
        url: `${API_URL}/api/carts/mine/items/remove?product_id=${data}`,
        data: data,
    })
}

// kiểm tra số lượng trước khi đặt hàng
export const checkQuantityItemInCart = (data) => {
    return axiosClient({
        method: 'POST',
        url: `${API_URL}/api/carts/mine/items/check_quantity`,
        data: data,
        // headers: headers,
    })
}


export const completeCart = () => {
    return axiosClient({
        method: "DELETE",
        // headers: headers,
        url: `${API_URL}/api/carts/mine/items/remove_all`,
    })
}