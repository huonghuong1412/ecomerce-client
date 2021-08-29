import * as types from '../actions/constants/constants'

const cart = JSON.parse(localStorage.getItem('CART'));

const initialState = cart ? cart : []

let findIndex = (cart, product) => {
    let index = -1;
    if (cart.length > 0) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].product.id === product.id) {
                index = i;
                break;
            }
        }
    } else {
        index = -1;
    }
    return index;
}

let checkQuantity = (cart, product) => {
    let check = 0;
    if(cart.length > 0) {
        for(let i = 0; i<cart.length; i++) {
            if(cart[i].quantity > product.in_stock) {
                check = 1;
                break;
            }
        }
    }
    return check;
}

const cartReducer = (state = initialState, action) => {
    let { product, quantity } = action;
    let index = -1, check = 0;
    switch (action.type) {
        case types.ADD_TO_CART:
            index = findIndex(state, product);
            check = checkQuantity(state, product);
            // console.log(check);
            if (index !== -1) {
                if(check === 0) {
                    state[index].quantity += quantity;
                } else {
                    state[index].quantity = quantity;
                }
            } else {
                state.push({
                    product,
                    quantity
                })
            }
            localStorage.setItem("CART", JSON.stringify(state))
            return [...state]

        case types.DELETE_ITEM_IN_CART:
            index = findIndex(state, product);
            if (index !== -1) {
                state.splice(index, 1);
            }
            localStorage.setItem("CART", JSON.stringify(state))
            return [...state];

        case types.UPDATE_ITEM_IN_CART:
            index = findIndex(state, product)
            if (index !== -1) {
                state[index].quantity = quantity;
            }
            if (quantity <= 0) {
                state.splice(index, 1);
            }
            localStorage.setItem('CART', JSON.stringify(state))
            return [...state]
        case types.CART_COMPLETE:
            localStorage.setItem('CART', JSON.stringify([]));
            state = [];
            return [...state];
        default:
            return [...state];
    }
}

export default cartReducer;