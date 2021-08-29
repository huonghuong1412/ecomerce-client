import React, { useEffect } from 'react'
import { updateStatusPayment, checkTradingCode } from 'actions/services/OrderActions'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function ResultOrderPage(props) {
    const params = new URLSearchParams(window.location.search)
    const order_id = params.get('order_id') ? params.get('order_id') : localStorage.getItem('order_id');
    const vnp_BankCode = params.get('vnp_BankCode')
    const vnp_ResponseCode = params.get('vnp_ResponseCode')
    const vnp_TransactionNo = params.get('vnp_TransactionNo')


    const handleUpdatePayment = () => {
        if (vnp_ResponseCode === "00") {
            const data = {
                order_id: parseInt(order_id),
                bankName: vnp_BankCode,
                tradingCode: vnp_TransactionNo
            }
            checkTradingCode(vnp_TransactionNo)
                .then(res => {
                    if (res.data === false) {
                        updateStatusPayment(data)
                            .then((res) => {
                                props.history.push(`/success/payment?order_id=${order_id}`);
                                localStorage.removeItem('order_id');
                                toast.success(res.data.message, {
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
                    } else {
                        toast.warning('Thanh toán đơn hàng không thành công', {
                            position: "bottom-center",
                            theme: 'dark',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                })
        }

    }

    useEffect(() => {
        if (vnp_TransactionNo) {
            handleUpdatePayment();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="progress">
                        <div className="Header__StyledProgressStep-hmoohz-1 hSHEnI">
                            <div className="text">Đăng nhập</div>
                            <div className="bar">
                                <div className="fill-color" />
                            </div>
                            <div className="circle">1</div>
                        </div>
                        <div className="Header__StyledProgressStep-hmoohz-1 hSHEnI">
                            <div className="text">Địa chỉ giao hàng</div>
                            <div className="bar">
                                <div className="fill-color" /></div>
                            <div className="circle">2</div>
                        </div>
                        <div className="Header__StyledProgressStep-hmoohz-1 hSHEnI">
                            <div className="text">Thanh toán &amp; Đặt mua</div>
                            <div className="bar">
                                <div className="fill-color" />
                            </div>
                            <div className="circle">3</div>
                        </div>
                    </div>
                </div>
                <div className="col l-12 m-12 c-12">
                    <div className="order-info">
                        <div className="order-info__left">
                            <img src="https://salt.tikicdn.com/ts/upload/63/fc/e8/50c078ea9bf9a4627176d3574db7a446.jpg" height={178} width={195} alt="" />
                        </div>
                        <div className="order-info__content">
                            <h3 className="thanks-msg">Cảm ơn bạn đã mua hàng tại Taka!</h3>
                            <p>Mã số đơn hàng của bạn:</p>
                            <div className="order-number">{order_id}</div>
                            <p>Bạn có thể xem lại <Link to="/customer/order/history">đơn hàng của tôi</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultOrderPage;