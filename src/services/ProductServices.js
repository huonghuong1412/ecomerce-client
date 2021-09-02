import axios from 'axios'
import {
    API_URL
} from '../actions/constants/constants'
axios.defaults.baseURL = API_URL;

export const getProductListByCategoryAndSubcategory = (searchObject) => {
    return axios.get(`${API_URL}/api/product/danh-muc/${searchObject.category}/${searchObject.subcategory}?page=${searchObject.page}&keyword=${searchObject.keyword}&&sortBy=${searchObject.sortBy}&sortValue=${searchObject.sortValue}`)
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
