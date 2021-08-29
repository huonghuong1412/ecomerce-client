import {
    Button,
    Grid,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

const headCells = [
    { id: "", numeric: false, label: "STT", minWidth: 50 },
    { id: "order_id", numeric: false, label: "Mã đơn hàng", minWidth: 50 },
    {
        id: "product_name",
        numeric: true,
        label: "Tên sản phẩm",
        minWidth: 50,
    },
    {
        id: "amount_item",
        numeric: true,
        label: "Số lượng",
        minWidth: 100,
    },
    {
        id: "price_item",
        numeric: true,
        label: "Giá sản phẩm",
        minWidth: 100,
    },
    {
        id: "total_proce",
        numeric: true,
        label: "Tổng tiền",
        minWidth: 100,
    },
];

function HistoryOrderDetail(props) {
    const username = localStorage.getItem("username")

    const classes = useStyles();

    const [orders, setOrders] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [orderInfo, setOrderInfo] = useState({});

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

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id]);

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-2 m-2 c-2">
                                <AccountNavbar name={username} />
                            </div>
                            <div className="col l-10 m-10 c-10">
                                <div className="glOjBk list-cusomer-order">
                                    <div className="heading">Chi tiết đơn hàng #{props.match.params.id} - <span>{orderInfo.status_order_name}</span></div>

                                    <Grid container spacing={3}>
                                        <Grid item md={12}>
                                            <div className="group">
                                                <h4 className="heading">Thông tin khách hàng</h4>
                                                <div className="content has-table">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>Họ tên</td>
                                                                <td>{userInfo.user_fullname}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Username</td>
                                                                <td>{userInfo.username}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Email</td>
                                                                <td>{userInfo.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Ngày sinh</td>
                                                                <td>{userInfo.dateOfBirth}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={12}>
                                            <div className="group">
                                                <h4 className="heading">Thông tin đặt hàng</h4>
                                                <div className="content has-table">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>Ngày đặt hàng</td>
                                                                <td>{orderInfo.create_time}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Địa chỉ nhận hàng</td>
                                                                <td>{orderInfo.address}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Số lượng sản phẩm</td>
                                                                <td>{orderInfo.total_item}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tổng tiền</td>
                                                                <td>{currency(orderInfo.total_price)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Ghi chú</td>
                                                                <td>{orderInfo.orderInfo}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tình trạng đơn hàng</td>
                                                                <td>{orderInfo.status_order_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tình trạng thanh toán</td>
                                                                <td>{orderInfo.status_payment_name}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TableContainer className={classes.container}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow>
                                                            {headCells.map((headCell) => (
                                                                <TableCell
                                                                    key={headCell.id}
                                                                    className={classes.head}
                                                                >
                                                                    {headCell.label}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {orders.map((row, index) => {
                                                            return (
                                                                <TableRow
                                                                    hover
                                                                    role="checkbox"
                                                                    tabIndex={-1}
                                                                    key={index}
                                                                >
                                                                    <TableCell
                                                                        component="th"
                                                                        scope="row"
                                                                        className={classes.text}
                                                                    >
                                                                        {index + 1}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="th"
                                                                        scope="row"
                                                                        className={classes.text}
                                                                    >
                                                                        {row.order_id}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="th"
                                                                        scope="row"
                                                                        className={classes.text}
                                                                    >
                                                                        {row.product_name}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="th"
                                                                        scope="row"
                                                                        className={classes.text}
                                                                    >
                                                                        {row.amount_item}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="th"
                                                                        scope="row"
                                                                        className={classes.text}
                                                                    >
                                                                        {currency(row.price_item)}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="th"
                                                                        scope="row"
                                                                        className={classes.text}
                                                                    >
                                                                        {currency(row.total_price)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HistoryOrderDetail;
