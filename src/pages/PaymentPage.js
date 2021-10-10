import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom'
import { currency } from 'utils/FormatCurrency'
import { makePaymentVnpay } from 'actions/services/PaymentActions'
import AddressForm from 'components/form/AddressForm';
import { addOrder } from 'actions/services/OrderActions'
import { completeCart, getCartInfo, getDetailCart } from 'actions/services/CartActions';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { getUserLogin } from 'actions/services/UserActions';
import Loading from 'components/Loading/Loading';
import { getPaymentMethods } from 'actions/services/PaymentServices';
import { calculateShipFee } from 'actions/services/GHNServices';
import _ from 'lodash'
import useTimeout from 'hooks/useTimeout';

function PaymentPage(props) {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);
    // const isFetching = useSelector(state => state.cart.isFetching);
    const [user, setUser] = useState({})
    const [type, setType] = useState(1);
    const [openAddress, setOpenAddress] = useState(false);
    const [payMethods, setPayMethods] = useState([])
    const [shipInfo, setShipInfo] = useState({})
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const getUser = useCallback(() => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    const getCalculateShipFee = useCallback(() => {
        if (!_.isEmpty(user)) {
            calculateShipFee({
                from_district_id: 1542,
                service_id: 53320,
                service_type_id: null,
                to_district_id: user?.district_id,
                to_ward_code: user?.ward_id,
                weight: cart?.weight,
                length: cart?.length,
                width: cart?.width,
                height: cart?.height
            })
                .then((res1 => {
                    setShipInfo(res1.data.data)
                }))
                .catch(err => console.log(err))
        }
    }, [cart?.height, cart?.length, cart?.weight, cart?.width, user])

    useEffect(() => {
        getUser();
    }, [getUser])

    useEffect(() => {
        getCalculateShipFee();
    }, [getCalculateShipFee])

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

    useEffect(() => {

        document.title = "Thông tin thanh toán | Tiki"

        if (token) {
            dispatch(getDetailCart())
        } else {
            props.history.push('/login');
        }
        getPayMethodsList();
    }, [dispatch, props.history, token])

    const calculateShipFeeIfTotalMorethan3Mil = (total) => {
        let fee = shipInfo.total;
        if(total < 3000000) {
            fee += 0;
        } else {
            fee += 0.005*total;
        }
        return fee;
    }

    const calculateTotalOrder = (total) => {
        let fee = calculateShipFeeIfTotalMorethan3Mil(total);
        return fee + total;
    }

    useTimeout(() => setLoading(false), loading ? 1500 : null);

    const handlePayment = () => {
        let orderInfo = {}

        orderInfo.vnp_OrderInfo = "thanh toan doan hang";
        orderInfo.vnp_Amount = calculateTotalOrder(cart?.total_price);

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
                username: user.username,
                total_price: orderInfo.vnp_Amount,
                total_item: cart?.items_count,
                order_details: order_details,
                orderInfo: orderInfo.vnp_OrderInfo,
                address: user ? user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : "",
                payment: payment,
                phone: user.phone,
                name: user.fullName,
                ward_code: user?.ward_id,
                district_id: user?.district_id,
                ship_fee: calculateShipFeeIfTotalMorethan3Mil(cart?.total_price)
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
                username: user.username,
                total_price: orderInfo.vnp_Amount,
                total_item: cart?.items_count,
                order_details: order_details,
                orderInfo: orderInfo.vnp_OrderInfo,
                address: user ? user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : "",
                ward_code: user?.ward_id,
                district_id: user?.district_id,
                payment: payment,
                phone: user.phone,
                name: user.fullName,
                ship_fee: calculateShipFeeIfTotalMorethan3Mil(cart?.total_price)
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
                            (loading) ? <Loading /> : (
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
                                                    <h3 className="title">1. Chọn hình thức giao hàng</h3>
                                                    <div className="cDxQbC">
                                                        <div className="iLupwL">
                                                            <div className="productsV2-content">
                                                                <div className="method-inner">
                                                                    <div>
                                                                        <label className="HafWE">
                                                                            <input type="radio" readOnly name="shipping-methods" defaultValue={1} defaultChecked />
                                                                            <span className="radio-fake" />
                                                                            <span className="label">
                                                                                Giao Tiết Kiệm
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="infinite-scroll-component" style={{ height: 'auto', overflow: 'auto' }}>
                                                                    <ul className="fhrjkV">
                                                                        {
                                                                            cart?.cart_details.map((item, index) => {
                                                                                return (
                                                                                    <li className="iMeYki" key={index}>
                                                                                        <div className="row">
                                                                                            <div className="col-1">
                                                                                                <div className="intended__images false">
                                                                                                    <Link className="intended__img" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                        <img src={`${item.mainImage}`} alt="" />
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
                                                <div className="kRoZux">
                                                    <h3 className="title">2. Chọn hình thức thanh toán</h3>
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
                                                                    {/* <li className="prices__item">
                                                                        <span className="prices__text">Phí vận chuyển</span>
                                                                        <span className="prices__value">{currency(cart?.total_price <= 3000000 ? shipInfo?.total : shipInfo?.total + 0.005*cart?.total_price)}</span>
                                                                    </li> */}
                                                                    <li className="prices__item">
                                                                        <span className="prices__text">Phí vận chuyển</span>
                                                                        <span className="prices__value">{currency(calculateShipFeeIfTotalMorethan3Mil(cart?.total_price))}</span>
                                                                    </li>
                                                                </ul>
                                                                {/* <p className="prices__total">
                                                                    <span className="prices__text">Tổng cộng</span>
                                                                    <span className="prices__value prices__value--final">{currency(cart?.total_price + shipInfo?.total)}
                                                                        <i>(Đã bao gồm VAT nếu có)</i>
                                                                    </span>
                                                                </p> */}
                                                                <p className="prices__total">
                                                                    <span className="prices__text">Tổng cộng</span>
                                                                    <span className="prices__value prices__value--final">{currency(calculateTotalOrder(cart?.total_price))}
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
           {
               openAddress ?  <AddressForm open={openAddress} onClose={handleCloseAddress} /> : ''
           }
        </>
    )
}
export default PaymentPage;