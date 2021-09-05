import React from "react";
import { Link } from "react-router-dom";
import { currency } from "../../utils/FormatCurrency";
import {API_URL} from '../../actions/constants/constants'
function ProductItem(props) {
  const { type, books, laptops, phones, products } = props;
  let productList = [];
  if (type === "book") {
    productList = books;
  }  else if (type === "laptop") {
    productList = laptops;
  } else if (type === "phone") {
    productList = phones;
  } else {
    productList = products;
  }
  
  return (
    <>
      {productList.map((item) => {
        const price = currency(item.price);
        const list_price = currency(item.list_price);
        return (
          <div className="col l-2-4 m-2-4 c-6" key={item.id}>
            <Link to={`/san-pham/${item.id}/${item.slug}`} className="home-product-item-link">
              <div className="home-product-item">
                <div
                  className="home-product-item__img"
                  style={{ backgroundImage: `url(${API_URL + "/images/product/" +  item.mainImage})` }}
                />
                <h4 className="home-product-item__name">{item.name}</h4>
                <div className="home-product-item-price">
                  <span className="home-product-item-price-old">{list_price}</span>
                  <span className="home-product-item-price-new">{price}</span>
                </div>
                <div className="home-product-item__info">
                  <span className="home-product-item__brand">
                    {item.brand ? item.brand.name : ""}
                  </span>
                  <span className="home-product-item__brand-name">
                    {item.brand ? item.brand.madeIn : ""}
                  </span>
                </div>
                <div className="home-product-item__favourite">
                  <i className="fas fa-check" />
                  <span>Yêu thích</span>
                </div>
                <div className="home-product-item__sales">
                  <span className="home-product-item__sales-percent">{item.percent_discount}%</span>
                  <span className="home-product-item__sales-label">GIẢM</span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
}
export default ProductItem;
