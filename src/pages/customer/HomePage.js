import React, { useEffect, useState } from 'react'
import Loading from 'components/Loading/Loading'
import Slide from 'components/Slide/Slide'
import Promotion from 'components/Promotion/Promotion'
import Category from 'components/CategoryHighlights/Category'
import ProductItem from 'components/Item/ProductItem'
import * as services from 'services/ProductServices'
import { Link } from 'react-router-dom'
import Product from 'components/Item/Product'

function HomePage(props) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const getNewData = () => {
        let searchObject = {
            page: 0,
            limit: 20,
            keyword: ''
        }
        services.getProductList(searchObject)
            .then((res) => {
                setProducts(res.data.content);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getNewData();
    }, [])

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
                                        Sản phẩm mới nhất
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <Loading /> : <Product products={products} />
                            }
                            <div className="col l-12 m-12 c-12">
                                <div className="section-center">
                                    <Link to="/sach" className="home-product-viewmore">
                                        Xem thêm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Sách hay
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <Loading /> : <ProductItem type="book" books={products.filter(item => item.category.code === 'sach')} />
                            }
                            <div className="col l-12 m-12 c-12">
                                <div className="section-center">
                                    <Link to="/sach" className="home-product-viewmore">
                                        Xem thêm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Laptop
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <Loading /> : <ProductItem type="laptop" laptops={products.filter(item => item.category.code === 'laptop')} />
                            }
                            <div className="col l-12 m-12 c-12">
                                <div className="section-center">
                                    <Link to="/laptop" className="home-product-viewmore">
                                        Xem thêm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Điện thoại
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <Loading /> : <ProductItem type="phone" phones={products.filter(item => item.category.code === 'dien-thoai')} />
                            }
                            <div className="col l-12 m-12 c-12">
                                <div className="section-center">
                                    <Link to="/dien-thoai" className="home-product-viewmore">
                                        Xem thêm
                                    </Link>
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