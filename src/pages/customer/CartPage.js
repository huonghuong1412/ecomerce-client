import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { currency } from "utils/FormatCurrency"
import { Link } from 'react-router-dom';
import { API_URL } from 'actions/constants/constants'
import { deleteItemInCart, updateItemInCart } from 'actions/services/CartActions'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";;

function CartPage(props) {

    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    const handleUpdateItem = (product, quantity) => {
        dispatch(updateItemInCart(product, quantity));
    }

    const getTotalProduct = () => {
        return cart.reduce((quantity, item) => {
            return parseInt(item.quantity) + quantity;
        }, 0);
    };

    const getTotalPrice = () => {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].quantity * cart[i].product.price;
        }
        return total;
    }
    const getTotalItemPrice = (item) => {
        let total = item.quantity * item.product.price;
        return total;
    }

    const handleDeleteItem = (product) => {
        dispatch(deleteItemInCart(product))
    }

    const token = localStorage.getItem('token');

    const showToast = () => {
        toast.info('Bạn cần chọn mua sản phẩm!', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        props.history.push('/sach')
    }

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="styles__StyledProductsV2-rkft9e-0 bkMhdM">
                            <h4 className="productsV2__title">Giỏ hàng</h4>

                            <div className="row sm-gutter">
                                <div className="col l-9 m-12 c-12">
                                    <div className="productsV2-heading">
                                        <div className="row">
                                            <div className="col-1">
                                                <label className="styles__StyledCheckbox-kvz5pc-0 kKoWwZ">
                                                    <span className="label">{getTotalProduct()} sản phẩm</span>
                                                </label>
                                            </div>
                                            <div className="col-2">Đơn giá</div>
                                            <div className="col-3">Số lượng</div>
                                            <div className="col-4">Thành tiền</div>
                                            <div className="col-5">

                                            </div>
                                        </div>
                                    </div>
                                    <div className="productsV2-content">
                                        <div className="infinite-scroll-component " style={{ height: 'auto', overflow: 'auto' }}>
                                            <div className="styles__StyledIntendedSeller-sc-1dwh2vk-0 jfwAio">
                                                <div className="sellers">
                                                    <ul className="styles__StyledIntended-sc-1dwh2vk-1 fhrjkV">
                                                        {
                                                            cart.map((item, index) => {
                                                                return (
                                                                    <li className="styles__StyledIntendedProduct-sc-1idi3y3-0 iMeYki" key={index}>
                                                                        <div className="row">
                                                                            <div className="col-1">
                                                                                <div className="intended__images false">
                                                                                    <Link className="intended__img" to={`/san-pham/${item.product.id}/${item.product.slug}`}>
                                                                                        <img src={`${API_URL + "/images/product/" + item.product.mainImage}`} alt="" />
                                                                                    </Link>
                                                                                    <div className="intended__content">
                                                                                        <Link className="intended__name" to={`/san-pham/${item.product.id}/${item.product.slug}`}>
                                                                                            {item.product.name}
                                                                                        </Link>
                                                                                        <span className="intended__not-bookcare">{item.product.category.name}</span>
                                                                                        <span className="intended__not-bookcare">{item.product.subcategory.name}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2">
                                                                                <span className="intended__real-prices">{currency(item.product.price)}</span>
                                                                                <del className="intended__discount-prices">{currency(item.product.list_price)}</del>
                                                                            </div>
                                                                            <div className="col-3">
                                                                                <div className="intended-qty">
                                                                                    <div className="styles__StyledIntendedQty-sc-1bo1fa9-0 bcFTqg">
                                                                                        <span className="qty-decrease" onClick={() => handleUpdateItem(item.product, item.quantity - 1)}>
                                                                                            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/decrease.svg" alt="decrease" />
                                                                                        </span>
                                                                                        <input
                                                                                            type="tel"
                                                                                            className="qty-input"
                                                                                            // defaultValue={item.quantity}
                                                                                            readOnly
                                                                                            value={item.quantity}
                                                                                        />
                                                                                        <span className="qty-increase" onClick={() => handleUpdateItem(item.product, item.quantity + 1)}>
                                                                                            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/increase.svg" alt="increase" />
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4">
                                                                                <span className="intended__final-prices">{currency(getTotalItemPrice(item))}</span>
                                                                            </div>
                                                                            <div className="col-5">
                                                                                <span className="intended__delete" onClick={() => handleDeleteItem(item.product)}>
                                                                                    <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg" alt="deleted" />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col l-3 m-3 c-12">
                                    <div className="cart-total">
                                        <div className="cart-total-prices">
                                            <div className="cart-total-prices__inner">
                                                <div className="styles__StyledCartPrices-sc-1op1gws-0 etSUOP">
                                                    <div className="prices">
                                                        <ul className="prices__items">
                                                            <li className="prices__item">
                                                                <span className="prices__text">Tạm tính</span>
                                                                <span className="prices__value">{currency(getTotalPrice())}</span>
                                                            </li>
                                                            <li className="prices__item">
                                                                <span className="prices__text">Giảm giá</span>
                                                                <span className="prices__value">0đ</span>
                                                            </li>
                                                        </ul>
                                                        <p className="prices__total">
                                                            <span className="prices__text">Tổng cộng</span>
                                                            <span className="prices__value prices__value--final">{currency(getTotalPrice())}
                                                                <i>(Đã bao gồm VAT nếu có)</i>
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="group-button">
                                                    {
                                                        cart.length >= 1 ? <Link to={token ? "/checkout/payment" : "/login"} type="button" className="btn btn-add-to-cart">Mua Hàng</Link>
                                                            : <Link to='#' onClick={showToast} type="button" className="btn btn-add-to-cart">Mua Hàng</Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CartPage;