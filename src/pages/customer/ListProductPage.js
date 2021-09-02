import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Filter from 'components/Filter/Filter';
import Title from 'components/Filter/Title';
import Product from 'components/Item/Product';
import Pagination from 'components/Pagination/Pagination';
import { getProductListByCategoryAndSubcategory } from 'services/ProductServices'
import useTimeout from 'hooks/useTimeout';
import ProductSkeleton from 'components/Item/ProductSkeleton';

function ListProductPage(props) {
    const { match } = props;
    const [products, setProducts] = useState([]);
    const [totalElements, setTotalElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const page = params.get('page');
        const sortBy = params.get('sortBy');
        const sortValue = params.get('sortValue');
        let searchObject = {};
        searchObject.keyword = '';
        searchObject.page = page ? parseInt(page) : 1;
        const category = match.params.category ? match.params.category : '';
        const subcategory = match.params.subcategory ? match.params.subcategory : '';
        searchObject.category = category;
        searchObject.subcategory = subcategory;
        searchObject.sortBy = sortBy ? sortBy : '';
        searchObject.sortValue = sortValue ? sortValue : '';
        getProductListByCategoryAndSubcategory(searchObject)
            .then((res) => {
                setProducts(res.data.content);
                setTotalElements(res.data.totalElements)
            })
            .catch(err => console.log(err))
    }, [page, match])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            <div className="row sm-gutter section__content">
                <Filter category={match.params.category} history={props.history} />
                <div className="col l-10 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <Title type={match.params.category} totalProducts={totalElements} />
                            {
                                loading ? <ProductSkeleton total={totalElements} /> : <Product products={products} />
                            }
                        </div>

                    </div>
                    <Pagination totalRows={totalElements} page={page ? page : 1} limit={20} />
                </div>
            </div>
        </>
    )
}

export default ListProductPage;