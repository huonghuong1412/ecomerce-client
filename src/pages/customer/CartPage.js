import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { currency } from "utils/FormatCurrency"
import { Link } from 'react-router-dom';
import { API_URL } from 'actions/constants/constants'
import { deleteItemInCart, getCartInfo, getDetailCart, updateQuantityItem } from 'actions/services/CartActions'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; import Loading from 'components/Loading/Loading';
;

function CartPage(props) {

    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);
    const isFetching = useSelector(state => state.cart.isFetching);

    const handleDeleteItem = (product_id) => {
        dispatch(deleteItemInCart(product_id))
        dispatch(getCartInfo())
        dispatch(getDetailCart());
    }

    const handleUpdateItem = (item, quantity) => {
        const data = {
            cart_details: [{
                product_id: item?.product_id,
                quantity
            }]
        }
        dispatch(updateQuantityItem(data))
        dispatch(getCartInfo())
        dispatch(getDetailCart());
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
    }

    useEffect(() => {
        if (token) {
            dispatch(getDetailCart())
        } else {
            props.history.push('/login');
        }
    }, [dispatch, props.history, token])

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="bkMhdM">
                            <h4 className="productsV2__title">Giỏ hàng</h4>
                            {
                                isFetching ? <Loading /> : (
                                    <>
                                        {
                                            cart?.cart_details.length > 0 ? (
                                                <div className="row sm-gutter">
                                                    <div className="col l-9 m-12 c-12">
                                                        <div className="productsV2-heading">
                                                            <div className="row">
                                                                <div className="col-1">
                                                                    <label className="kKoWwZ">
                                                                        <span className="label">{cart?.items_count} sản phẩm</span>
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
                                                                <div className="jfwAio">
                                                                    <div className="sellers">
                                                                        <ul className="fhrjkV">
                                                                            {
                                                                                cart?.cart_details.map((item, index) => {
                                                                                    return (
                                                                                        <li className="iMeYki" key={index}>
                                                                                            <div className="row">
                                                                                                <div className="col-1">
                                                                                                    <div className="intended__images false">
                                                                                                        <Link className="intended__img" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                            <img src={`${API_URL + "/images/product/" + item.mainImage}`} alt="" />
                                                                                                        </Link>
                                                                                                        <div className="intended__content">
                                                                                                            <Link className="intended__name" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                                {item.name}
                                                                                                            </Link>
                                                                                                            <span className="intended__not-bookcare">{item?.category.name}</span>
                                                                                                            <span className="intended__not-bookcare">{item?.brand.name}</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2">
                                                                                                    <span className="intended__real-prices">{currency(item.price)}</span>
                                                                                                    <del className="intended__discount-prices">{currency(item.list_price)}</del>
                                                                                                </div>
                                                                                                <div className="col-3">
                                                                                                    <div className="intended-qty">
                                                                                                        <div className="bcFTqg">
                                                                                                            <span className="qty-decrease" onClick={() => handleUpdateItem(item, item.quantity - 1)}>
                                                                                                                <img src={`${API_URL}/images/decrease.png`} alt="decrease" />
                                                                                                            </span>
                                                                                                            <input
                                                                                                                type="tel"
                                                                                                                className="qty-input"
                                                                                                                readOnly
                                                                                                                value={item.quantity}
                                                                                                            />
                                                                                                            <span className="qty-increase" onClick={() => handleUpdateItem(item, item.quantity + 1)}>
                                                                                                                <img src={`${API_URL}/images/increase.png`} alt="increase" />
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    <span className="intended__final-prices">{currency(item.quantity * item.price)}</span>
                                                                                                </div>
                                                                                                <div className="col-5">
                                                                                                    <span className="intended__delete" onClick={() => handleDeleteItem(item.product_id)}>
                                                                                                        <img src={`${API_URL}/images/trash.png`} alt="deleted" />
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
                                                                    <div className="etSUOP">
                                                                        <div className="prices">
                                                                            <ul className="prices__items">
                                                                                <li className="prices__item">
                                                                                    <span className="prices__text">Tạm tính</span>
                                                                                    <span className="prices__value">{currency(cart?.total_price)}</span>
                                                                                </li>
                                                                                <li className="prices__item">
                                                                                    <span className="prices__text">Giảm giá</span>
                                                                                    <span className="prices__value">0đ</span>
                                                                                </li>
                                                                            </ul>
                                                                            <p className="prices__total">
                                                                                <span className="prices__text">Tổng cộng</span>
                                                                                <span className="prices__value prices__value--final">{currency(cart?.total_price)}
                                                                                    <i>(Đã bao gồm VAT nếu có)</i>
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="group-button">
                                                                        {
                                                                            cart?.cart_details.length >= 1 ? <Link to={token ? "/checkout/payment" : "/login"} type="button" className="btn btn-add-to-cart">Mua Hàng</Link>
                                                                                : <Link to='#' onClick={showToast} type="button" className="btn btn-add-to-cart">Mua Hàng</Link>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="no-cart">
                                                    <img src={`${API_URL}/images/no-cart.png`} alt="" className="no-cart__img" />
                                                    <p className="no-cart__note">Không có sản phẩm nào trong giỏ hàng của bạn.</p>
                                                    <Link to="/" className="no-cart__btn">Tiếp tục mua sắm</Link>
                                                </div>
                                            )
                                        }
                                    </>

                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CartPage;