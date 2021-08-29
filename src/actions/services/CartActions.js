import {
    ADD_TO_CART,
    DELETE_ITEM_IN_CART,
    UPDATE_ITEM_IN_CART,
    CART_COMPLETE
} from '../constants/constants'

export const addToCart = (product, quantity) => dispatch => {
    dispatch({
        type: ADD_TO_CART,
        product,
        quantity
    })
}

export const updateItemInCart = (product, quantity) => dispatch => {
    dispatch({
        type: UPDATE_ITEM_IN_CART,
        product,
        quantity
    })
}

export const deleteItemInCart = (product) => dispatch => {
    dispatch({
        type: DELETE_ITEM_IN_CART,
        product
    })
}

export const completeCart = () => dispatch => {
    dispatch({
        type: CART_COMPLETE
    })
}