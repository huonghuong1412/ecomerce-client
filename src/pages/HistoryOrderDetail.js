import {
    Button,
    Grid,
    makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
    getDetailOrderById,
    cancelOrder
} from "actions/services/OrderActions";
import { currency } from "utils/FormatCurrency";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountNavbar from "components/AccountNavbar/AccountNavbar.";
import { Link } from "react-router-dom";
import useTimeout from "hooks/useTimeout";
import Loading from "components/Loading/Loading";
import { getUserLogin } from "actions/services/UserActions";
import { calculateShipTime } from 'actions/services/GHNServices'
import CustomerReviewForm from "components/form/CustomerReviewForm";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});


const useStyles = makeStyles({
    container: {
        maxHeight: 440,
    },
    visuallyHidden: {
        display: "none",
    },
    text: {
        fontSize: "1.3rem",
    },
    head: {
        fontSize: "1.5rem",
        background: "#349eff",
        color: "#fff",
    },
    caption: {
        color: "inherit",
        padding: 8,
        fontSize: "1.3rem",
    },
    toolbar: {
        "& > p:nth-of-type(2)": {
            fontSize: "1.3rem",
            fontWeight: 500,
        },
    },
    formControl: {
        minWidth: 120,
        marginRight: 15,
    },
    button: {
        padding: "12px 24px",
        fontWeight: 600,
        fontSize: "1.3rem",
    },
    right: {
        textAlign: 'right'
    },
});

function HistoryOrderDetail(props) {
    const classes = useStyles();

    const [orders, setOrders] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [orderInfo, setOrderInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [shipTime, setShipTime] = useState('')
    const [user, setUser] = useState({
        id: '',
        fullName: '',
        username: '',
    })
    const [openForm, setOpenForm] = useState(false);

    const handleClickOpenForm = (item) => {
        setOpenForm(true);
        setProduct(item);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        getUser();
    }

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        const id = props.match.params.id;
        cancelOrder(id)
            .then((res) => {
                toast.success(res.data.message);
                getData();
            })
            .catch(() =>
                toast.warning("Cập nhật trạng thái đơn hàng không thành công.")
            );
    };

    const getData = () => {
        const id = props.match.params.id;
        getDetailOrderById(id)
            .then((res) => {
                setOrders(res.data.order_details);
                setUserInfo(res.data.user);
                setOrderInfo(res.data.order_info);
            })
            .catch((err) => console.log(err));
    };
    const getUser = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
                calculateShipTime({
                    from_district_id: 1542,
                    from_ward_code: "1B1507",
                    to_district_id: res.data.district_id,
                    to_ward_code: res.data.ward_id,
                    service_id: 53321
                })
                    .then((res1) => setShipTime(res1.data.data))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    // "from_district_id": 1750,
    // "from_ward_code": "511110",
    // "to_district_id": 3255,
    // "to_ward_code": "1B2811",
    // "service_id": 53321

    useEffect(() => {
        document.title = "Đơn hàng của tôi | Tiki"
        getUser();
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id]);

    useTimeout(() => setLoading(false), loading ? 500 : null);

    // tính tổng tiền trong ds sản phẩm ở đơn hàng chi tiết
    const calTotalItemPrice = (orders) => {
        let total = 0;
        orders.forEach((item) => {
            total += item.total_price;
        })
        return total;
    }

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter">
                            <div className="col l-2-4 m-2 c-2">
                                <AccountNavbar name={user?.fullName}></AccountNavbar>
                            </div>
                            <div className="col l-9-4 m-10 c-10">
                                <div className="glOjBk list-cusomer-order">
                                    {
                                        loading ? <Loading /> : (
                                            <>
                                                <div className="heading"> Chi tiết đơn hàng #{props.match.params.id} - <span>{orderInfo.status_order_name}</span></div>
                                                <Grid container spacing={3}>
                                                    <Grid item sm={12}>
                                                        <div className="cRRvpz">
                                                            <div className="gQjSfs">
                                                                <div className="title">Địa chỉ người nhận</div>
                                                                <div className="content">
                                                                    <p className="name">{userInfo.user_fullname}</p>
                                                                    <p className="address">
                                                                        <span>Địa chỉ: </span>{orderInfo.address}
                                                                    </p>
                                                                    <p className="phone"><span>Điện thoại: </span>{userInfo.phone}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="gQjSfs">
                                                                <div className="title">Hình thức giao hàng</div>
                                                                <div className="content">
                                                                    <p>Giao hàng tiêu chuẩn</p>
                                                                    <p>Thời gian giao dự tính: {new Date(shipTime?.leadtime * 1000).toLocaleDateString()}</p>
                                                                    <p>Phí vận chuyển: {currency(orderInfo?.ship_fee)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="gQjSfs">
                                                                <div className="title">Hình thức thanh toán</div>
                                                                <div className="content">
                                                                    <p className="">{orderInfo?.payment_method}</p>
                                                                    <p className="">{orderInfo.status_payment_name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <table className="Nbknf">
                                                            <thead>
                                                                <tr>
                                                                    <th>Sản phẩm</th>
                                                                    <th>Loại sản phẩm</th>
                                                                    <th>Giá</th>
                                                                    <th>Số lượng</th>
                                                                    <th>Tạm tính</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    orders?.map((item, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>
                                                                                    <div className="product-item">
                                                                                        <img src={item?.mainImage} alt="Giày Thể Thao Nữ Biti’s Hunter X – 2K18 – DSUH00100DEN - Stardust Night (Size 35)" />
                                                                                        <div className="product-info">
                                                                                            <Link className="product-name" to={`/san-pham/${item?.product_id}/${item?.product_slug}`}>{item?.product_name}</Link>
                                                                                            <p className="product-sku">SKU: {item?.product_id}</p>
                                                                                            {
                                                                                                orderInfo?.status_order === 2 ? (
                                                                                                    <div className="product-review">
                                                                                                        <span onClick={() => handleClickOpenForm(item)}>Viết nhận xét</span>
                                                                                                        <Link to={`/san-pham/${item?.product_id}/${item?.product_slug}`} target="_blank">Mua lại</Link>
                                                                                                    </div>
                                                                                                ) : ""
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="discount-amount">{item?.category}</td>
                                                                                <td className="price">{currency(item.price_item)}</td>
                                                                                <td className="quantity">{item.amount_item}</td>
                                                                                <td className="raw-total">{currency(item.total_price)}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <span>Tạm tính</span>
                                                                    </td>
                                                                    <td>{currency(calTotalItemPrice(orders))}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}><span>Phí vận chuyển</span></td>
                                                                    <td>{currency(orderInfo?.ship_fee)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}><span>Tổng cộng</span></td>
                                                                    <td><span className="sum">{currency(orderInfo.total_price + orderInfo?.ship_fee)}</span></td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </Grid>
                                                    <Grid item md={12} className={classes.right}>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            className={classes.button}
                                                            onClick={handleSubmitOrder}
                                                        >
                                                            Huỷ đơn hàng
                                                        </Button>
                                                    </Grid>
                                                    <Grid item md={12}>
                                                        <Link className="view-list-order" to="/customer/order/history">&lt;&lt; Quay lại đơn hàng của tôi</Link>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerReviewForm open={openForm} onClose={handleCloseForm} product={product} user={user?.fullName} />
        </>
    );
}

export default HistoryOrderDetail;