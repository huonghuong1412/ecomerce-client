import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom'
import { currency } from 'utils/FormatCurrency'
import { IMAGE_FOLDER } from 'actions/constants/constants'
import { makePaymentVnpay } from 'actions/services/PaymentActions'
import AddressForm from '../form/AddressForm';
import { CircularProgress } from '@material-ui/core';
import { addOrder } from 'actions/services/OrderActions'
import { completeCart } from 'actions/services/CartActions';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { getUserLogin } from 'actions/services/UserActions';
import useTimeout from 'hooks/useTimeout';


function PaymentPage(props) {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const [user, setUser] = useState({})
    const [type, setType] = useState(1);
    const [openAddress, setOpenAddress] = useState(false);
    const [loading, setLoading] = useState(true);

    const getUser = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getUser();
        if (cart.lengh >= 1) {
            return;
        } else {
            return <Redirect to="/sach" />
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    const handleClickOpenAddress = () => {
        setOpenAddress(true);
    };

    const handleCloseAddress = () => {
        setOpenAddress(false);
        getUser();
    }

    const handleCompleteCart = () => {
        dispatch(completeCart());
    }


    const getTotalPrice = () => {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].quantity * cart[i].product.price;
        }
        return total;
    }

    const getTotalProduct = () => {
        return cart.reduce((quantity, item) => {
            return parseInt(item.quantity) + quantity;
        }, 0);
    };

    const getSubTotal = (cart) => {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].product.price * cart[i].quantity;
        }
        return total;
    }

    const getTotalItemPrice = (item) => {
        let total = item.quantity * item.product.price;
        return total;
    }

    const handlePayment = () => {
        let orderInfo = {}

        orderInfo.vnp_OrderInfo = "Thanh toan don hang";
        orderInfo.vnp_Amount = getSubTotal(cart);

        if (type === 1) {
            let now = new Date();
            const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
            const order_details = cart.map(item => {
                return {
                    product_id: item.product.id,
                    amount: item.quantity,
                    price: item.product.price,
                    total_price: item.product.price * item.quantity
                }
            })
            const payment = {
                type: 1,
                method_code: "ATM",
                datePayment: create_time,
                tradingCode: null,
                status: 0
            }

            const order = {
                create_time: create_time,
                username: user.username,
                total_price: orderInfo.vnp_Amount,
                total_item: getTotalProduct(),
                order_details: order_details,
                orderInfo: orderInfo.vnp_OrderInfo,
                address: user ? user.address?.house + ", " + user.address?.ward + ", " + user.address?.district + ", " + user.address?.city : "",
                payment: payment,
                phone: user.phone,
                name: user.fullName,
            }

            addOrder(order)
                .then((res) => {
                    localStorage.setItem('order_id', res.data.id);
                    makePaymentVnpay(orderInfo)
                        .then((res) => {
                            window.location.href = res.data.redirect_url;
                        })
                    handleCompleteCart();
                })
                .catch(() => toast.error('Đặt hàng không thành công, mời thực hiện lại!', {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }))
        } else if (type === 2) {
            let now = new Date();
            const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
            const order_details = cart.map(item => {
                return {
                    product_id: item.product.id,
                    amount: item.quantity,
                    price: item.product.price,
                    total_price: item.product.price * item.quantity
                }
            })
            const payment = {
                bankName: null,
                method_code: "PayOff",
                datePayment: create_time,
                tradingCode: null,
                status: 0
            }
            const order = {
                create_time: create_time,
                username: user.username,
                total_price: orderInfo.vnp_Amount,
                total_item: getTotalProduct(),
                order_details: order_details,
                orderInfo: orderInfo.vnp_OrderInfo,
                address: user ? user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : "",
                payment: payment,
                phone: user.phone,
                name: user.fullName,
            }
            addOrder(order)
                .then((res) => {
                    props.history.push(`/success/payment?order_id=${res.data.id}`)
                    toast.success('Đặt hàng thành công!', {
                        position: "bottom-center",
                        theme: 'dark',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    handleCompleteCart();
                })
                .catch(() => {
                    toast.error('Vui lòng đăng nhập trước khi đặt hàng', {
                        position: "bottom-center",
                        theme: 'dark',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
        }
    }

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="styles__StyledProductsV2-rkft9e-0 bkMhdM">
                            <h4 className="productsV2__title">Thanh toán đơn hàng</h4>
                            <div className="row sm-gutter">
                                <div className="col l-9 m-12 c-12">
                                    <div className="styles__Left-sc-18qxeou-1 deellp">
                                        <div className="styles__Section-sc-18qxeou-0 kRoZux">
                                            <h3 className="title">1. Thông tin sản phẩm</h3>
                                            <div className="styles__StyledShippingMethods-xd7513-0 cDxQbC">
                                                <div className="styles__StyledMethod-xd7513-1 iLupwL">
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
                                                                                                        <img src={`${IMAGE_FOLDER + item.product.mainImage}`} alt="" />
                                                                                                    </Link>
                                                                                                    <div className="intended__content">
                                                                                                        <Link className="intended__name" to={`/san-pham/${item.product.id}/${item.product.slug}`}>
                                                                                                            {item.product.name}
                                                                                                        </Link>
                                                                                                        <span className="intended__not-bookcare">SL: x{item.quantity}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-2">
                                                                                                <span className="intended__real-prices">{currency(item.product.price)}</span>
                                                                                            </div>
                                                                                            <div className="col-4">
                                                                                                <span className="intended__final-prices">{currency(getTotalItemPrice(item))}</span>
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
                                            </div>
                                        </div>
                                        <div className="styles__Section-sc-18qxeou-0 kRoZux">
                                            <h3 className="title">2. Chọn hình thức thanh toán</h3>
                                            <div className="styles__StyledPaymentMethods-sc-1u5r3pb-0 dnENUJ">
                                                <ul className="list">
                                                    <li className="styles__StyledMethod-sc-1u5r3pb-2 dWHFNX">
                                                        <label className="styles__StyledRadio-sc-1y2j2ih-0 HafWE">
                                                            <input type="radio" readOnly name="payment-methods" onChange={(e) => setType(2)} value={2} /><span className="radio-fake" />
                                                            <span className="label">
                                                                <div className="styles__StyledMethodLabel-sc-1u5r3pb-1 fbjKoD">
                                                                    <img className="method-icon" width={32} src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-cod.svg" alt="cod" />
                                                                    <div className="method-content">
                                                                        <div className="method-content__name"><span>Thanh toán tiền mặt khi nhận hàng</span></div>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </label>
                                                    </li>
                                                    <li className="styles__StyledMethod-sc-1u5r3pb-2 dWHFNX">
                                                        <label className="styles__StyledRadio-sc-1y2j2ih-0 HafWE">
                                                            <input type="radio" readOnly name="payment-methods" onChange={(e) => setType(1)} value={1} defaultChecked /><span className="radio-fake" />
                                                            <span className="label">
                                                                <div className="styles__StyledMethodLabel-sc-1u5r3pb-1 fbjKoD">
                                                                    <img className="method-icon" width={32} src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-atm.svg" alt="pay123" />
                                                                    <div className="method-content">
                                                                        <div className="method-content__name"><span>Thẻ ATM nội địa/Internet Banking (Miễn phí thanh toán)</span></div>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="group-button">
                                            {
                                                user ? <Link to="#" onClick={handlePayment} type="button" className="btn btn-add-to-cart">Đặt Mua</Link> :
                                                    <Redirect to="/login" />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col l-3 m-3 c-12">
                                    <div className="styles__StyledShippingAddress-sc-1v9yiuw-0 gDuXAE">
                                        <div className="title">
                                            <span>Địa chỉ giao hàng</span>
                                            <Link to="#" onClick={handleClickOpenAddress} >Sửa</Link>
                                        </div>
                                        {
                                            !loading ? <div className="address">
                                                <span className="name">
                                                    {user?.fullName} | {user?.phone}
                                                </span>
                                                <span className="street">
                                                    {user ?  user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : ''}
                                                </span>
                                            </div> : <CircularProgress color="secondary" />
                                        }
                                    </div>
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
                                                                <span className="prices__text">Phí vận chuyển</span>
                                                                <span className="prices__value">{currency(0)}</span>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddressForm open={openAddress} onClose={handleCloseAddress} />
        </>
    )
}
export default PaymentPage;