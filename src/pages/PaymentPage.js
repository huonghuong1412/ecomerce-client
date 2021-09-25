import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom'
import { currency } from 'utils/FormatCurrency'
import { API_URL, IMAGE_FOLDER } from 'actions/constants/constants'
import { makePaymentVnpay } from 'actions/services/PaymentActions'
import AddressForm from 'components/form/AddressForm';
import { addOrder } from 'actions/services/OrderActions'
import { completeCart, getCartInfo, getDetailCart } from 'actions/services/CartActions';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { getUserLogin } from 'actions/services/UserActions';
import Loading from 'components/Loading/Loading';
import { getPaymentMethods } from 'actions/services/PaymentServices';
import { getShipMethods } from 'actions/services/ShipmentServices';


function PaymentPage(props) {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);
    const loading = useSelector(state => state.cart.isFetching);
    const [user, setUser] = useState({})
    const [type, setType] = useState(1);
    const [shipment, setShipment] = useState({
        code: 'noi-thanh',
        fee: 20000
    });
    const [openAddress, setOpenAddress] = useState(false);
    const [payMethods, setPayMethods] = useState([])
    const [shipMethods, setShipMethods] = useState([])
    const token = localStorage.getItem('token');

    const getUser = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getUser();
    }, [])

    const handleClickOpenAddress = () => {
        setOpenAddress(true);
    };

    const handleCloseAddress = () => {
        setOpenAddress(false);
        getUser();
    }

    const handleCompleteCart = () => {
        completeCart()
            .then(() => {
                dispatch(getCartInfo())
            })
            .catch(err => console.log(err))
    }

    const getPayMethodsList = () => {
        getPaymentMethods()
            .then((res) => {
                setPayMethods(res.data.content)
            })
            .catch(err => console.log(err))
    }

    const getShipMethodsList = () => {
        getShipMethods()
            .then((res) => {
                setShipMethods(res.data.content)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {

        document.title = "Thông tin thanh toán | Tiki"

        if (token) {
            dispatch(getDetailCart())
        } else {
            props.history.push('/login');
        }
        getPayMethodsList();
        getShipMethodsList();
    }, [dispatch, props.history, token])

    const handlePayment = () => {
        let orderInfo = {}

        orderInfo.vnp_OrderInfo = "Thanh toan don hang";
        orderInfo.vnp_Amount = cart?.total_price + shipment?.fee;

        if (type === 2) {
            let now = new Date();
            const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
            const order_details = cart?.cart_details.map(item => {
                return {
                    product_id: item.product_id,
                    amount: item.quantity,
                    price: item.price,
                    total_price: item.price * item.quantity
                }
            })
            const payment = {
                type: 1,
                method_code: 'vnpay',
                datePayment: create_time,
                tradingCode: null,
                status: 0
            }

            const order = {
                create_time: create_time,
                username: user.username,
                total_price: orderInfo.vnp_Amount,
                total_item: cart?.items_count,
                order_details: order_details,
                orderInfo: orderInfo.vnp_OrderInfo,
                address: user ? user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : "",
                payment: payment,
                phone: user.phone,
                name: user.fullName,
                shipment: shipment?.code
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
        } else if (type === 1) {
            let now = new Date();
            const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
            const order_details = cart?.cart_details.map(item => {
                return {
                    product_id: item.product_id,
                    amount: item.quantity,
                    price: item.price,
                    total_price: item.price * item.quantity
                }
            })
            const payment = {
                bankName: null,
                method_code: 'cod',
                datePayment: create_time,
                tradingCode: null,
                status: 0
            }
            const order = {
                create_time: create_time,
                username: user.username,
                total_price: orderInfo.vnp_Amount,
                total_item: cart?.items_count,
                order_details: order_details,
                orderInfo: orderInfo.vnp_OrderInfo,
                address: user ? user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : "",
                payment: payment,
                phone: user.phone,
                name: user.fullName,
                shipment: shipment?.code
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
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        {
                            loading ? <Loading /> : (
                                <div className="bkMhdM">
                                    {
                                        cart?.cart_details.length === 0 ? (
                                            <div className="cwMaQD">
                                                Giỏ hàng không có sản phẩm. Vui lòng thực hiện lại.
                                            </div>
                                        ) : ""
                                    }
                                    <h4 className="productsV2__title">Thanh toán đơn hàng</h4>

                                    <div className="row sm-gutter">
                                        <div className="col l-9 m-12 c-12">
                                            <div className="deellp">
                                                <div className="kRoZux">
                                                    <h3 className="title">1. Thông tin sản phẩm</h3>
                                                    <div className="cDxQbC">
                                                        <div className="iLupwL">
                                                            <div className="productsV2-content">
                                                                <div className="infinite-scroll-component" style={{ height: 'auto', overflow: 'auto' }}>
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
                                                                                                                <img src={`${IMAGE_FOLDER + item.mainImage}`} alt="" />
                                                                                                            </Link>
                                                                                                            <div className="intended__content">
                                                                                                                <Link className="intended__name" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                                    {item.name}
                                                                                                                </Link>
                                                                                                                <span className="intended__not-bookcare">SL: x{item.quantity}</span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-2">
                                                                                                        <span className="intended__real-prices">{currency(item.price)}</span>
                                                                                                    </div>
                                                                                                    <div className="col-4">
                                                                                                        <span className="intended__final-prices">{currency(item.price * item.quantity)}</span>
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
                                                    <h3 className="title">2. Chọn hình thức giao hàng</h3>
                                                    <div className="dnENUJ">
                                                        <ul className="list">
                                                            {
                                                                shipMethods.map((item, index) => {
                                                                    return (
                                                                        <li className="dWHFNX" key={index}>
                                                                            <label className="HafWE">
                                                                                <input type="radio" readOnly name="shipCode" onChange={(e) => setShipment(item)} value={item} required defaultChecked={item?.code === shipment?.code}/><span className="radio-fake" />
                                                                                <span className="label">
                                                                                    <div className="fbjKoD">
                                                                                        <div className="method-content">
                                                                                            <div className="method-content__name"><span>{item.name} - {currency(item.fee)}</span></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                            </label>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="styles__Section-sc-18qxeou-0 kRoZux">
                                                    <h3 className="title">3. Chọn hình thức thanh toán</h3>
                                                    <div className="dnENUJ">
                                                        <ul className="list">
                                                            {
                                                                payMethods.map((item, index) => {
                                                                    return (
                                                                        <li className="dWHFNX" key={index}>
                                                                            <label className="HafWE">
                                                                                <input type="radio" readOnly name="payment-methods" onChange={(e) => setType(item.type)} value={item.type} defaultChecked={item?.type === type} /><span className="radio-fake" />
                                                                                <span className="label">
                                                                                    <div className="fbjKoD">
                                                                                        <img className="method-icon" width={32} src={`${API_URL}/images/${item.icon}`} alt="cod" />
                                                                                        <div className="method-content">
                                                                                            <div className="method-content__name"><span>{item.name}</span></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                            </label>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
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
                                            <div className="gDuXAE">
                                                <div className="title">
                                                    <span>Thông tin giao hàng</span>
                                                    <Link to="#" onClick={handleClickOpenAddress} >Sửa</Link>
                                                </div><div className="address">
                                                    <span className="name">
                                                        {user?.fullName} | {user?.phone}
                                                    </span>
                                                    <span className="street">
                                                        {user ? user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : ''}
                                                    </span>
                                                </div>
                                            </div>
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
                                                                        <span className="prices__text">Phí vận chuyển</span>
                                                                        <span className="prices__value">{currency(shipment?.fee)}</span>
                                                                    </li>
                                                                </ul>
                                                                <p className="prices__total">
                                                                    <span className="prices__text">Tổng cộng</span>
                                                                    <span className="prices__value prices__value--final">{currency(cart?.total_price + shipment?.fee)}
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
                            )}
                    </div>
                </div>
            </div>
            <AddressForm open={openAddress} onClose={handleCloseAddress} />
        </>
    )
}
export default PaymentPage;