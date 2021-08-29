import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Filter from 'components/Filter/Filter';
import Title from 'components/Filter/Title';
import Product from 'components/Item/Product';
import Pagination from 'components/Pagination/Pagination';
import Loading from 'components/Loading/Loading';
import { getProductListByCategoryAndSubcategory } from 'services/ProductServices'

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
        let searchObject = {};
        searchObject.keyword = '';
        searchObject.page = page ? parseInt(page) : 1;
        const category = match.params.category ? match.params.category : '';
        const subcategory = match.params.subcategory ? match.params.subcategory : '';
        searchObject.category = category;
        searchObject.subcategory = subcategory;

        getProductListByCategoryAndSubcategory(searchObject)
            .then((res) => {
                setProducts(res.data.content);
                setTotalElements(res.data.totalElements)
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, [page, match])


    return (
        <>
            <div className="row sm-gutter section__content">
                <Filter category={match.params.category} />
                <div className="col l-10 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <Title type={match.params.category} totalProducts={totalElements} />
                            {
                                loading ? <Loading /> : <Product products={products} />
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