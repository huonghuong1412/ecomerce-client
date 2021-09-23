import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { getAllProductViewed } from 'actions/services/ProductServices'
import useTimeout from 'hooks/useTimeout';
import ProductItemSkeleton from 'components/Item/ProductItemSkeleton';
import ProductItem from 'components/Item/ProductItem';

function ListProductViewed(props) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username');

    useEffect(() => {
        getAllProductViewed(username)
            .then((res) => {
                setProducts(res.data);
            })
            .catch(err => console.log(err))
    }, [username])


    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            {
                                loading ? <ProductItemSkeleton total={products.length} /> : <ProductItem products={products} />
                            }
                        </div>

                    </div>
                    {/* <Pagination totalRows={totalElements} page={page ? page : 1} limit={20} /> */}
                </div>
            </div>
        </>
    )
}

export default ListProductViewed;