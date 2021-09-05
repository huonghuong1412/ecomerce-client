import axios from 'axios'
import {
    API_URL
} from '../actions/constants/constants'
axios.defaults.baseURL = API_URL;
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` }


export const getProductListByCategoryAndSubcategory = (searchObject) => {
    return axios.get(`${API_URL}/api/product/danh-muc/${searchObject.category}/${searchObject.subcategory}?page=${searchObject.page}&keyword=${searchObject.keyword}&sortBy=${searchObject.sortBy}&sortValue=${searchObject.sortValue}`)
}
export const getProductList = (searchObject) => {
    return axios.get(`${API_URL}/api/product/search?page=${searchObject.page}&keyword=${searchObject.keyword}`)
}

export const getProductByCategory = (searchObject) => {
    return axios.get(`${API_URL}/api/product/danh-muc/${searchObject.category}?page=${searchObject.page}&keyword=${searchObject.keyword}`)
}

export const getOneItem = (id) => {
    return axios.get(`${API_URL}/api/product/san-pham/${id}`);
}

// http://localhost:8080/api/product/brand?brandCode=DELL&productId=5
export const getAllProductByBrand = (productId, brandCode) => {
    return axios.get(`${API_URL}/api/product/brand?productId=${productId}&brandCode=${brandCode}`);
}

// http://localhost:8080/api/viewed-product?username=huong1&category=sach
export const getAllProductViewed = (username) => {
    return axios.get(`${API_URL}/api/viewed-product?username=${username}`);
}

export const addProductViewed = (data) => {
    return axios.post(`${API_URL}/api/viewed-product`, data);
}


// -------   SP Da Thich   --------

// http://localhost:8080/api/liked/user
export const addLikeProduct = (data) => {
    return axios({
        method: 'POST',
        url: `${API_URL}/api/liked/user`,
        data: data,
        headers: headers,
    })
}

// http://localhost:8080/api/liked/product?username=huong1&productId=1
export const getProductLiked = (username, productId) => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/liked/product?username=${username}&productId=${productId}`,
        headers: headers,
    });
}

//http://localhost:8080/api/liked/products?username=huong1
// get ds sp yeu thich
export const getListProductLiked = (username) => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/liked/products?username=${username}`,
        headers: headers,
    });
}

// bo thich san pham
// http://localhost:8080/api/liked/user?username=huong1&productId=1

export const deleteProductLiked = (username, productId) => {
    return axios({
        method: 'DELETE',
        url: `${API_URL}/api/liked/user?username=${username}&productId=${productId}`,
        headers: headers,
    })
}