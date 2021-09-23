import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import AccountNavbar from 'components/AccountNavbar/AccountNavbar.';
import { getAllOrderByUser } from 'actions/services/OrderActions'
import { currency } from 'utils/FormatCurrency'
import {
    Grid,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import useTimeout from 'hooks/useTimeout';
import Loading from 'components/Loading/Loading';

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
    { id: "id", label: "Mã đơn hàng", minWidth: 50 },
    { id: "create_time", label: "Ngày mua", minWidth: 100, type: "text" },
    { id: "total_item", label: "Số lượng sản phẩm", numeric: true, minWidth: 100, type: "number" },
    {
        id: "total_price",
        label: "Tổng tiền",
        minWidth: 100,
        numeric: true,
        type: "number",
        format: (value) => currency(value),
    },
    {
        id: "status_order_name",
        label: "Trạng thái đơn hàng",
        minWidth: 180,
        type: "text",
    },
];


export default function HistoryOrder(props) {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem("username");
    const classes = useStyles();
    useEffect(() => {

        document.title = "Đơn hàng của tôi | Tiki"

        getAllOrderByUser()
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    useTimeout(() => setLoading(false), loading ? 500 : null);
    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-3 m-3 c-3">
                                <AccountNavbar name={username} />
                            </div>
                            <div className="col l-9 m-9 c-9">
                                <div className="glOjBk list-cusomer-order">
                                    <div className="heading">Danh sách đơn hàng của tôi</div>
                                    {
                                        loading ? <Loading /> : (
                                            <Grid container spacing={3}>
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
                                                                                <Link to={`/customer/order/history/detail/${row.id}`} className="info-cusomer-order-link">
                                                                                    {row.id}
                                                                                </Link>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                className={classes.text}
                                                                            >
                                                                                {row.create_time}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                className={classes.text}
                                                                            >
                                                                                {row.total_item}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                className={classes.text}
                                                                            >
                                                                                {currency(row.total_price)}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                className={classes.text}
                                                                            >
                                                                                {row.status_order_name}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                            </Grid>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
