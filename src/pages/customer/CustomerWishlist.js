import React, { useCallback, useEffect, useState } from 'react'
import AccountNavbar from 'components/AccountNavbar/AccountNavbar.';
import Loading from 'components/Loading/Loading'
import useTimeout from 'hooks/useTimeout';
import { deleteProductLiked, getListProductLiked } from 'actions/services/ProductServices'
import { Link } from 'react-router-dom';
import { currency } from 'utils/FormatCurrency';
import { API_URL } from 'actions/constants/constants';
export default function CustomerWishlist(props) {


    const [listProductLiked, setListProductLiked] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username');

    const getData = useCallback(() => {
        getListProductLiked(username)
            .then((res) => setListProductLiked(res.data))
            .catch(() => alert('ERROR'))
    }, [username])

    useEffect(() => {

        document.title = "Sản phẩm yêu thích | Tiki"

        getData();
    }, [getData, username])

    const dislikeProduct = (productId) => {
        if (username) {
            deleteProductLiked(username, productId)
                .then(() => getData())
                .catch(() => alert("ERR"))
        } else {
            props.history.push('/login');
        }
    }

    useTimeout(() => setLoading(false), loading ? 1000 : null);
    return (
        <>
            {
                loading ? <Loading /> : (
                    <div className="row sm-gutter section__content">
                        <div className="customer-wishlist">
                            <div className="row sm-gutter section__item">
                                <div className="col l-3 m-3 c-3">
                                    <AccountNavbar name={username} />
                                </div>
                                <div className="col l-9 m-9 c-9">
                                    <h4 className="heading">Danh sách yêu thích ({listProductLiked.length}) </h4>
                                    <ul className="list">
                                        {
                                            listProductLiked.map((item) => {
                                                return (
                                                    <li className="item" key={item.id}>
                                                        <button className="btn-delete" onClick={() => dislikeProduct(item.productId)}>×</button>
                                                        <div className="thumbnail">
                                                            <Link to={`/san-pham/${item.productId}/${item.slug}`}>
                                                                <div className="thumbnail-img">
                                                                    <img className="image" alt="" src={`${API_URL}/images/product/${item.mainImage}`} />
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="body">
                                                            <Link className="name" to={`/san-pham/${item.productId}/${item.slug}`}>{item.name}</Link>
                                                            <Link className="name" to={`/${item.category?.code}`}>{item.category?.name}</Link>
                                                            <Link className="name" to={`/${item.category?.code}/${item.subcategory?.code}`}>{item.subcategory?.name}</Link>
                                                        </div>
                                                        <div className="item-footer">
                                                            <div className="price">{currency(item.price)}</div>
                                                            <div className="wrap">
                                                                <div className="list-price">{currency(item.list_price)}</div>
                                                                <div className="discount">{item.percent_discount}%</div>
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
                )
            }
        </>
    )
}
