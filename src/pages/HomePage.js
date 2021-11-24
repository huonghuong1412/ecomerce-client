import React, { useCallback, useEffect, useState } from 'react'
import Slide from 'components/Slide/Slide'
import Promotion from 'components/Promotion/Promotion'
import Category from 'components/CategoryHighlights/Category'
import * as services from 'actions/services/ProductServices'
import useTimeout from 'hooks/useTimeout'
import ProductItem from 'components/Item/ProductItem'
import ProductItemSkeleton from 'components/Item/ProductItemSkeleton'
import ProductTopSale from 'components/Item/ProductTopSale'

function HomePage(props) {
    const [products, setProducts] = useState([]);
    const [topSale, setTopSale] = useState([]);
    const [mostPopularProduct, setMostPopularProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const handleChangePage = (page) => {
        setPage(page + 1)
    }

    const getNewData = useCallback(() => {
        let searchObject = {
            page: page,
            limit: 24,
            keyword: ''
        }
        services.getProductList(searchObject)
            .then((res) => {
                setProducts([...products, ...res.data.content]);
                setLoading(false);
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const getTopSaleProduct = () => {
        services.topSaleProduct()
            .then(res => {
                setTopSale(res.data.content);
            })
            .catch(err => console.log(err))
    }

    const getPopularProduct = useCallback(() => {
        services.getListProductMostPopular()
            .then(res => setMostPopularProduct(res.data))
            .catch(() => setMostPopularProduct([]))
    }, [])

    useEffect(() => {
        document.title = "Mua hàng online giá tốt, hàng chuẩn, ship nhanh"
        getNewData();
        getTopSaleProduct();
        getPopularProduct();
    }, [getNewData, getPopularProduct])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            <Slide />
            <Promotion />
            <Category />
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Sản phẩm bán chạy nhất
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <ProductItemSkeleton total={products.length} /> : <ProductTopSale products={topSale} />
                            }
                        </div>
                    </div>
                </div>
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Sản phẩm phổ biến nhất
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <ProductItemSkeleton total={mostPopularProduct.length} /> : <ProductTopSale products={mostPopularProduct} />
                            }
                        </div>
                    </div>
                </div>
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Sản phẩm mới nhất
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <ProductItemSkeleton total={products.length} /> : <ProductItem products={products} />
                            }
                            <div className="col l-12 m-12 c-12">
                                <div className="section-center">
                                    {
                                        page <= 3 ? <button className="home-product-viewmore" onClick={() => handleChangePage(page)}>
                                            Xem thêm
                                        </button> : ""
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
export default HomePage;