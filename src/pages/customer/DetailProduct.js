import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { currency } from "utils/FormatCurrency"
import { Link } from 'react-router-dom';
import { API_URL } from 'actions/constants/constants'
import { getCurrentUser } from 'actions/services/UserActions'
import { getAllProductByBrand, getOneItem } from 'actions/services/ProductServices'
import { addLikeProduct, deleteProductLiked, getProductLiked } from 'actions/services/ProductServices'
import { getAllCommentByProductId } from 'actions/services/ProductServices'
import { addProductToCart, getCartInfo } from 'actions/services/CartActions'
import AddressForm from '../form/AddressForm';
import "react-toastify/dist/ReactToastify.css";
import useTimeout from 'hooks/useTimeout';
import DetailProductSkeleton from 'components/Loading/DetailProductSkeleton';
import DetailsThumbnail from 'components/Item/DetailThumbnail';
import ProductItem from 'components/Item/ProductItem';
import ProductItemSkeleton from 'components/Item/ProductItemSkeleton';
import BrandProduct from 'components/Brand/BrandProduct';
import { toast } from 'react-toastify';

function DetailProduct(props) {

    const dispatch = useDispatch();
    const { match } = props;

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [index, setIndex] = useState(0);
    const [productByBrands, setProductByBrands] = useState([]);
    const [productLiked, setProductLiked] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [comments, setComments] = useState([]);
    const username = localStorage.getItem('username')
    const user = useSelector(state => state.auth.auth);

    const getUser = useCallback(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    const myRef = React.createRef();

    const handleTab = index => {
        setIndex(index);
        const images = myRef.current.children;
        for (let i = 0; i < images.length; i++) {
            images[i].className = images[i].className.replace("active", "");
        }
        images[index].className = "active";
    };

    useEffect(() => {
        const id = match.params.id;
        getOneItem(id)
            .then((res) => {
                setProduct(res.data);
            })
            .catch(err => console.log(err));
        getAllCommentByProductId(id)
            .then((res) => {
                setComments(res.data)
            })
            .catch(err => alert(err))
        if (username) {
            getProductLiked(id)
                .then((res) => {
                    if (res.data === true) {
                        setProductLiked(true)
                    }
                })
                .catch(() => setProductLiked(false))
        }

    }, [match.params.id, username])

    useEffect(() => {
        if (myRef.current) {
            myRef.current.children[index].className = "active";
        }
    }, [index, myRef])

    useEffect(() => {
        getUser();
    }, [getUser])

    useEffect(() => {
        const { id, brand } = product;
        if (id) {
            getAllProductByBrand(id, brand?.code)
                .then(res => setProductByBrands(res.data))
                .catch(() => alert('ERR'))
        }
    }, [product])

    useEffect(() => {
        document.title = `${product?.name} | Tiki`
    }, [product?.name])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    const handleAddToCart = () => {
        if (username) {
            const data = {
                cart_details: [{
                    product_id: product?.id,
                    quantity
                }]
            }
            if (product?.in_stock > 0 && quantity <= product?.in_stock) {
                // dispatch(addProductToCart(data))
                addProductToCart(data)
                    .then((res) => {
                        toast.info(res.data.message, {
                            position: "bottom-center",
                            theme: 'dark',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        dispatch(getCartInfo())
                    })
                    .catch((err) => {
                        toast.warning(err.response.data.message, {
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
        } else {
            props.history.push('/login')
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleClickOpenAddress = () => {
        setOpenAddress(true);
    };

    const handleCloseAddress = () => {
        setOpenAddress(false);
        getUser();
    }

    const displayComment = (numStar) => {
        let ratingStars = [];
        if (product) {
            for (let i = 0; i < 5; i++) {
                if (numStar === 5) {
                    ratingStars.push(<i key={i} className="fas fa-star" />)
                }
                else {
                    for (let j = 0; j < numStar; j++) {
                        ratingStars.push(<i key={j} className="fas fa-star" />);
                    }
                    for (let k = numStar; k < 5; k++) {
                        ratingStars.push(<i key={k} className="far fa-star" />);
                    }
                    break;
                }

            }
        }
        return ratingStars;
    }

    const displayStatusRating = (rating) => {
        let status = '';
        switch (rating) {
            case 5:
                status = "Cực kỳ hài lòng";
                break;
            case 4:
                status = "Hài lòng";
                break;
            case 3:
                status = "Bình thường";
                break;
            case 2:
                status = "Không hài lòng";
                break;
            case 1:
                status = "Rất không hài lòng";
                break;
            default:
                break;
        }
        return status;
    }

    const toggleLikeProduct = () => {
        if (username) {
            const data = {
                productId: product?.id,
            }
            if (productLiked) {
                deleteProductLiked(product?.id)
                    .then(() => setProductLiked(false))
                    .catch(() => alert("ERR"))
            } else {
                addLikeProduct(data)
                    .then(() => setProductLiked(true))
                    .catch(() => setProductLiked(false))
            }
        } else {
            props.history.push('/login');
        }

    }

    return (
        <>
            {!loading ? (
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
                    <div className="col l-12 m-12 c-12">
                        <div className="product-info">
                            {/* ------   Grid -> Row -> Column  ------ */}
                            <div className="row sm-gutter section__item">
                                <div className="col l-5 m-4 c-12">
                                    <div className="left-thumbnail">
                                        {
                                            <img
                                                src={`${API_URL}/images/product/${product.images[index]}`}
                                                alt=""
                                                style={{ width: '444px', height: '444px', objectFit: 'contain' }} />
                                        }
                                        <div className="list-img">
                                            <DetailsThumbnail images={product.images} tab={handleTab} myRef={myRef} />
                                        </div>
                                        <div className="left-bottom">
                                            <div className="share">
                                                <p>Chia sẻ:</p>
                                                <div className="share-social">
                                                    <img
                                                        src={`${API_URL}/images/facebook.png`}
                                                        alt="social-facebook" />
                                                    <img src={`${API_URL}/images/messenger.png`}
                                                        alt="social-messenger" />
                                                    <img
                                                        src={`${API_URL}/images/copy.png`}
                                                        alt="social-copy" />
                                                </div>
                                                <div className="like">
                                                    {
                                                        productLiked
                                                            ?
                                                            <img src={`${API_URL}/images/liked.png`} onClick={toggleLikeProduct} alt="social-liked" />
                                                            :
                                                            <img src={`${API_URL}/images/like.png`} onClick={toggleLikeProduct} alt="social-like" />
                                                    }
                                                    <p>{productLiked ? 'Đã thích' : 'Thích'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col l-7 m-6 c-12">
                                    <div className="product-detail">
                                        <h4 className="product-name">{product.name}</h4>
                                    </div>
                                    <div className="product-detail-body">
                                        <div className="left">
                                            <p className="product-price">
                                                <span className="product-price__current-price">{currency(product.price)}</span>
                                                <span className="product-price__list-price">{currency(product.list_price)}</span>
                                                <span className="product-price__discount">{product.percent_discount}% giảm</span>
                                            </p>
                                            {
                                                username ? (
                                                    <div className="ship-info">
                                                        <span className="text">Giao đến</span>
                                                        <span className="address">{`${user?.district},${user?.city}`}</span>
                                                        <span className="address-change" onClick={handleClickOpenAddress} >Đổi địa chỉ</span>
                                                        <AddressForm open={openAddress} onClose={handleCloseAddress} />
                                                    </div>
                                                ) : ''
                                            }

                                            <div id="info-1" className="collapse in">
                                                <div className="input-label">
                                                    <span>Số lượng</span>
                                                </div>

                                                <div className="group-input">
                                                    <button
                                                        className={quantity <= 1 ? 'disable' : ''}
                                                        disabled={quantity <= 1}
                                                        onClick={() => setQuantity(quantity - 1)}>
                                                        <img src={`${API_URL}/images/remove.png`} alt="remove-icon" width={20} height={20} />
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
                                                        <img src={`${API_URL}/images/add.png`} alt="add-icon" width={20} height={20} />
                                                    </button>
                                                </div>
                                                <div className="input-label">
                                                    {
                                                        product.in_stock > 0 ? <span>Đã bán: {product.seller_count}</span> : <span>Hết hàng</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="group-button">
                                                <button
                                                    className="btn btn-add-to-cart"
                                                    onClick={handleAddToCart}
                                                >Thêm vào giỏ hàng</button>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <BrandProduct brand={product.brand} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            Sản phẩm tương tự
                                        </h3>
                                    </div>
                                </div>
                                {
                                    loading ? <ProductItemSkeleton total={productByBrands.length} /> : <ProductItem products={productByBrands} />
                                }
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
                                                    <tr>
                                                        <td>Thương hiệu</td>
                                                        <td>{product.brand?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Xuất xứ thương hiệu</td>
                                                        <td>{product.brand?.madeIn}</td>
                                                    </tr>
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
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            Đánh giá, nhận xét từ khách hàng
                                        </h3>
                                    </div>
                                </div>
                                <div className="col l-12 m-12 c-12">
                                    {
                                        comments.length === 0 ? (
                                            <div className="customer-reviews__empty">
                                                <img src={`${API_URL}/images/star.png`} alt="" />
                                                <span>Chưa có đánh giá nào cho sản phẩm này</span>
                                            </div>
                                        ) :
                                            comments.map((item) => {
                                                return (
                                                    <div className="review-comment" key={item.id}>
                                                        <div className="review-comment__user">
                                                            <div className="review-comment__user-inner">
                                                                <div className="review-comment__user-avatar">
                                                                    <div className="has-character">
                                                                        <img src={`${API_URL}/images/avatar.png`} alt="" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="review-comment__user-name">{item.displayName}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ flexGrow: 1 }}>
                                                            <div className="review-comment__rating-title">
                                                                <div className="review-comment__rating">
                                                                    {displayComment(item.rating)}
                                                                </div>
                                                                <span className="review-comment__title">
                                                                    {displayStatusRating(item.rating)}
                                                                </span>
                                                            </div>
                                                            <div className="review-comment__seller-name-attributes">
                                                                <div className="review-comment__seller-name">Thương hiệu<span className="review-comment__check-icon" />{product.brand?.name}</div>
                                                            </div>
                                                            <div className="review-comment__content">{item.content}</div>
                                                            <div className="review-comment__created-date">
                                                                <span>Nhận xét vào {item.date_comment}</span>
                                                            </div>
                                                            <span className="review-comment__reply">Gửi trả lời</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            </div>
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            Sản phẩm cùng thương hiệu
                                        </h3>
                                    </div>
                                </div>
                                {
                                    loading ? <ProductItemSkeleton total={productByBrands.length} /> : <ProductItem products={productByBrands} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ) : <DetailProductSkeleton product={product} />
            }
        </>
    )
}
export default DetailProduct;