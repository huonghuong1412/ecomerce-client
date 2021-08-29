import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from 'actions/services/CartActions'
import { currency } from "utils/FormatCurrency"
import { Link } from 'react-router-dom';
import Loading from 'components/Loading/Loading'
import Filter from 'components/Filter/Filter'
import { API_URL } from 'actions/constants/constants'
import { getOneItem } from 'services/ProductServices'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";;

function DetailProduct(props) {

    const dispatch = useDispatch();
    const { match } = props;

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const id = match.params.id;
        getOneItem(id)
            .then((res) => {
                setLoading(false);
                setProduct(res.data);
            })
            .catch(err => console.log(err));
    }, [match.params.id])

    const handleAddToCart = () => {
        dispatch(addToCart(product, quantity));
        toast.info('Đã thêm sản phẩm vào giỏ hàng!', {
            position: "bottom-center",
            theme: 'dark',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return (
        <>
            {(loading && !product) ? <Loading /> : (
                <div className="row sm-gutter section__content">
                    <div className="breadcrumb">
                        <Link className="breadcrumb-item" to="/">Trang chủ</Link>
                        <Link className="breadcrumb-item" to={`/${product.category?.code}`}>
                            {product.category?.name}
                        </Link>
                        <Link className="breadcrumb-item" to={`/${product.category?.code}/${product.subcategory?.code}`}>{product.subcategory?.name}</Link>
                        <span className="breadcrumb-item">
                            <span>{product.name}</span></span>
                    </div>
                    <div className="col l-10 m-12 c-12">
                        <div className="home-product">
                            {/* ------   Grid -> Row -> Column  ------ */}
                            <div className="row sm-gutter section__item">
                                <div className="product-info col l-5 m-4 c-12">
                                    <div className="left">
                                        <>
                                            {
                                                <img
                                                    src={`${API_URL}/images/product/${product.mainImage}`}
                                                    alt=""
                                                    style={{ width: '360px', height: '348px', objectFit: 'cover' }} />
                                            }
                                        </>
                                        <div className="slider">
                                            {product.images && product.images.map((item, i) => {
                                                return (
                                                    <img
                                                        className="u-img-fluid"
                                                        src={API_URL + "/images/product/" + item}
                                                        key={i}
                                                        alt=""
                                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="col l-7 m-6 c-12">
                                    <div className="product-detail">
                                        <p>Danh Mục:
                                            <Link to={`/${product.category?.code}`}
                                                className="text-primary">{product.category?.name}
                                            </Link>
                                            <span className="text-primary">
                                                <i className="fas fa-angle-right"></i>
                                            </span>
                                            <Link to={`/${product.category?.code}/${product.subcategory?.code}`}
                                                className="text-primary">{product.subcategory?.name}
                                            </Link>
                                        </p>
                                        <h4 className="product-name">{product.name}</h4>
                                        <p className="product-price">
                                            <span className="product-price__current-price">{currency(product.price)}</span>
                                            <span className="product-price__list-price">{currency(product.list_price)}</span>
                                            <span className="product-price__discount">{product.percent_discount}% giảm</span>
                                        </p>

                                        <div id="info-1" className="collapse in">
                                            <div className="input-label">
                                                <span>Số lượng</span>
                                            </div>

                                            <div className="group-input">
                                                <button
                                                    className={quantity <= 1 ? 'disable' : ''}
                                                    disabled={quantity <= 1}
                                                    onClick={() => setQuantity(quantity - 1)}>
                                                    <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-remove.svg" alt="remove-icon" width={20} height={20} />
                                                </button>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    className="input"
                                                    pattern="^[1-9]\d*"
                                                    value={quantity <= 0 ? 1 : quantity >= product.in_stock ? product.in_stock : quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value) <= 1 ? 1 : parseInt(e.target.value) >= product.in_stock ? product.in_stock : parseInt(e.target.value))}
                                                />
                                                <button
                                                    onClick={() =>
                                                        setQuantity(quantity + 1)}
                                                    className={quantity >= product.in_stock ? 'disable' : ''}
                                                    disabled={quantity >= product.in_stock}>
                                                    <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-add.svg" alt="add-icon" width={20} height={20} />
                                                </button>
                                            </div>
                                            <div className="input-label">
                                                <span>{product.in_stock} sản phẩm có sẵn </span>
                                            </div>
                                        </div>
                                        <div className="group-button">
                                            <button
                                                className="btn btn-add-to-cart"
                                                onClick={handleAddToCart}
                                            >Thêm vào giỏ hàng</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            Thông tin chi tiết
                                        </h3>
                                    </div>
                                </div>
                                <div className="col l-12 m-12 c-12">
                                    <div className="group">
                                        <div className="content has-table">
                                            <table>
                                                <tbody>
                                                    {
                                                        product.type === 1 ? (
                                                            <>
                                                                <tr>
                                                                    <td>Công ty phát hành</td>
                                                                    <td>{product?.brand.name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Tác giả</td>
                                                                    <td>
                                                                        {product.authors.map((item) =>
                                                                            <span key={item.code}>{item.name}&nbsp;&nbsp;</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                {product.product_specs.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{item.attributeName}</td>
                                                                            <td>{item.attributeValue}</td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </>
                                                        ) : <tr></tr>
                                                    }
                                                    {
                                                        product.type === 2 ? (
                                                            product.product_specs.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{item.attributeName}</td>
                                                                        <td>{item.attributeValue}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        ) : <tr></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            Mô tả sản phẩm
                                        </h3>
                                    </div>
                                </div>
                                <div className="col l-12 m-12 c-12">
                                    <div className="group">
                                        <div className="content" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Filter category="sach" />
                </div>
            )}
        </>
    )
}
export default DetailProduct;