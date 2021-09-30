import axios from 'axios'
import {
    API_URL
} from 'actions/constants/constants'
axios.defaults.baseURL = API_URL;
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` }

// get
export const getProductListByCategoryAndSubcategory = (searchObject) => {
    return axios.get(`${API_URL}/api/product/danh-muc/${searchObject.category}/${searchObject.subcategory}?page=${searchObject.page}&keyword=${searchObject.keyword}&sortBy=${searchObject.sortBy}&sortValue=${searchObject.sortValue}&brand=${searchObject.brand}&price=${searchObject.price}`)
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


// Get ds sap cung thuong hieu sp
export const getAllProductByBrand = (productId, brandCode) => {
    return axios.get(`${API_URL}/api/product/brand?productId=${productId}&brandCode=${brandCode}`);
}

// GET all SP theo thuong hieu
export const getAllProductByBrandCode = (searchObject) => {
    return axios.get(`${API_URL}/api/product/all/${searchObject.brandCode}?page=${searchObject.page}&keyword=${searchObject.keyword}&sortBy=${searchObject.sortBy}`);
}

// Get Thuowng hieu theo ma thuong hieu
export const getBrandByCode = (brandCode) => {
    return axios.get(`${API_URL}/api/brand/get-one/${brandCode}`);
}

// -------   SP Da Thich   --------

export const addLikeProduct = (data) => {
    return axios({
        method: 'POST',
        url: `${API_URL}/api/liked/user`,
        data: data,
        headers: headers,
    })
}

export const getProductLiked = (productId) => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/liked/product?productId=${productId}`,
        headers: headers,
    });
}

// get ds sp yeu thich
export const getListProductLiked = () => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/liked/products`,
        headers: headers,
    });
}

// bo thich san pham
export const deleteProductLiked = (productId) => {
    return axios({
        method: 'DELETE',
        url: `${API_URL}/api/liked/user?productId=${productId}`,
        headers: headers,
    })
}
