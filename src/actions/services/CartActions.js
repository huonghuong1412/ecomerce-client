import {
    ADD_TO_CART,
    DELETE_ITEM_IN_CART,
    UPDATE_ITEM_IN_CART,
    CART_COMPLETE,
    GET_CART_INFO,
    GET_ALL_ITEM_IN_CART
} from '../constants/constants'
import { toast } from 'react-toastify';
import {
    API_URL
} from '../constants/constants'
import axios from 'axios'
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` }

// get thông tin chi tiết giỏ hàng
export const getDetailCart = () => { 
    return dispatch => {
        axios({
            method: 'GET',
            url: `${API_URL}/api/carts/mine/items`,
            headers: headers,
        })
        .then((res) => {
            getCartInfo();
            dispatch({
                type: GET_ALL_ITEM_IN_CART,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
    }
}


// get thông tin giỏ hàng (số lượng sản phẩm, status, số lượng item)
export const getCartInfo = () => {
    return dispatch => {
        axios({
            method: 'GET',
            url: `${API_URL}/api/carts/mine/info`,
            headers: headers,
        })
        .then((res) => {
            dispatch({
                type: GET_CART_INFO,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
    }
}


// thêm sản phẩm vào giỏ hàng
export const addProductToCart = (data) => {
    return dispatch => {
        axios({
            method: "POST",
            headers: headers,
            url: `${API_URL}/api/carts/mine/items`,
            data: data,
        })
            .then((res) => {
                toast.info(res.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getCartInfo();
                dispatch({
                    type: ADD_TO_CART,
                    payload: res.data
                });
            })
            .catch((err) => {
                toast.warning(err.response.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch({
                    type: ADD_TO_CART,
                    payload: err.response.data
                });
            })
    }
}


// sửa số lượng sản phẩm trong giỏ hàng
export const updateQuantityItem = (data) => {
    return dispatch => {
        axios({
            method: "PUT",
            headers: headers,
            url: `${API_URL}/api/carts/mine/items/update`,
            data: data,
        })
            .then((res) => {
                toast.info(res.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getCartInfo();
                getDetailCart();
                dispatch({
                    type: UPDATE_ITEM_IN_CART
                });
            })
            .catch((err) => {
                toast.warning(err.response.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch({
                    type: UPDATE_ITEM_IN_CART,
                    payload: err.response.data
                });
            })
    }
}

// xoá sản phẩm trong giỏ hàng
export const deleteItemInCart = (data) => {
    return dispatch => {
        axios({
            method: "DELETE",
            headers: headers,
            url: `${API_URL}/api/carts/mine/items/remove?product_id=${data}`,
            data: data,
        })
            .then((res) => {
                toast.info(res.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getCartInfo();
                getDetailCart();
                dispatch({
                    type: DELETE_ITEM_IN_CART
                });
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export const completeCart = () => dispatch => {
    dispatch({
        type: CART_COMPLETE
    })
}