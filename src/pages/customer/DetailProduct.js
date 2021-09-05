import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from 'actions/services/CartActions'
import { currency } from "utils/FormatCurrency"
import { Link } from 'react-router-dom';
import { API_URL } from 'actions/constants/constants'
import { getAllProductByBrand, getOneItem } from 'services/ProductServices'
import { addLikeProduct, deleteProductLiked, getProductLiked } from 'services/ProductServices'
// import { addProductViewed, getAllProductViewed} from 'services/ProductServices'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; import useTimeout from 'hooks/useTimeout';
import DetailProductSkeleton from 'components/Loading/DetailProductSkeleton';
import DetailsThumbnail from 'components/Item/DetailThumbnail';
import ProductItem from 'components/Item/ProductItem';
import ProductItemSkeleton from 'components/Item/ProductItemSkeleton';

function DetailProduct(props) {

    const dispatch = useDispatch();
    const { match } = props;

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [index, setIndex] = useState(0);
    const [productByBrands, setProductByBrands] = useState([]);
    const [productLiked, setProductLiked] = useState(false);
    // const [productViewed, setProductViewed] = useState([]);
    const username = localStorage.getItem('username')

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
        // const data = {
        //     productId: id,
        //     username
        // }
        if (username) {
            getProductLiked(username, id)
                .then((res) => {
                    if (res.data === true) {
                        setProductLiked(true)
                    }
                })
                .catch(() => setProductLiked(false))
        }
        // addProductViewed(data)
        //     .then(() => { })
        //     .catch(err => console.log(err))

    }, [match.params.id, username])

    useEffect(() => {
        if (myRef.current) {
            myRef.current.children[index].className = "active";
        }
    }, [index, myRef])

    useEffect(() => {
        const { id, brand } = product;
        if (id) {
            getAllProductByBrand(id, brand?.code)
                .then(res => setProductByBrands(res.data))
                .catch(() => alert('ERR'))
        }
    }, [product])


    // useEffect(() => {
    //     const { category } = product;
    //     if (category) {
    //         getAllProductViewed(username, category?.code)
    //             .then(res => {
    //                 setProductViewed(res.data)
    //             })
    //             .catch(err => alert("Error"))
    //     }
    // }, [product, username])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

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

    const toggleLikeProduct = () => {
        if(username) {
            const data = {
                productId: product?.id,
                username
            }
            if (productLiked) {
                deleteProductLiked(username, product?.id)
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
                                    <div className="left">
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
                                                        src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/social-facebook.svg"
                                                        alt="social-facebook" />
                                                    <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/social-messenger.svg"
                                                        alt="social-messenger" />
                                                    <img
                                                        src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/social-copy.svg"
                                                        alt="social-copy" />
                                                </div>
                                                <div className="like">
                                                    {
                                                        productLiked
                                                            ?
                                                            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-liked.svg" onClick={toggleLikeProduct} alt="social-liked" />
                                                            :
                                                            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-like.svg" onClick={toggleLikeProduct} alt="social-like" />
                                                    }
                                                    <p>{productLiked ? 'Đã thích' : 'Thích'}</p>
                                                </div>
                                            </div>
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
                            {/* {
                                username ? (
                                    <div className="row sm-gutter section__item">
                                        <div className="col l-12 m-12 c-12">
                                            <div className="home-product-category-item">
                                                <h3 className="home-product-title">
                                                    Sản phẩm bạn đã xem
                                                </h3>
                                            </div>
                                        </div>
                                        {
                                            loading ? <ProductItemSkeleton total={productViewed.length} /> : <ProductItem products={productViewed} />
                                        }

                                    </div>
                                ) : ''
                            } */}
                        </div>
                    </div>
                </div>
            ) : <DetailProductSkeleton product={product} />
            }
        </>
    )
}
export default DetailProduct;