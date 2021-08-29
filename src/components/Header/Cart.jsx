import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteItemInCart } from "actions/services/CartActions";
import { IMAGE_FOLDER } from "actions/constants/constants";
import { currency } from "utils/FormatCurrency";
function Header(props) {
  
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const getTotalProduct = () => {
    return cart.reduce((quantity, item) => {
      return parseInt(item.quantity) + quantity;
    }, 0);
  };

  const handleDeleteItem = (product) => {
    dispatch(deleteItemInCart(product));
  };

  return (
    <>
      <div className="header__cart">
        <div className="header__cart-link">
          <i className="fas fa-shopping-cart cart-icon" />
          <span className="header__cart-notice">{getTotalProduct()}</span>
        </div>
        {/* ----------   No cart  ------- */}
        {/* ----------   add class header__cart-list-no-nocart  ------- */}
        <div className="header__cart-list">
          {cart.length > 0 ? (
            <>
              <h4 className="header__cart-list-heading">Sản phẩm đã thêm</h4>
              <ul className="header__cart-list-item">
                {cart.map((item, index) => {
                  return (
                    <li className="header__cart-item" key={index}>
                      <img src={IMAGE_FOLDER + item.product.mainImage} alt="" />
                      <div className="header__cart-item-info">
                        <div className="header__cart-item-head">
                          <Link
                            to={`/san-pham/${item.product.id}/${item.product.slug}`}
                            className="header__cart-item-name"
                          >
                            {item.product.name}
                          </Link>
                          <div className="header__cart-item-price-wrap">
                            <span className="header__cart-item-price">
                              {currency(item.product.price)}
                            </span>
                            <span className="header__cart-item-multipe">x</span>
                            <span className="header__cart-item-count">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="header__cart-item-body">
                          <span
                            className="header__cart-item-description"
                          >
                            {item.product.category.name}
                          </span>
                          <span
                            className="header__cart-item-remove"
                            onClick={() => handleDeleteItem(item.product)}
                          >
                            Xoá
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="/checkout/cart"
                className="btn btn--primary header__cart-view"
              >
                Xem giỏ hàng
              </Link>
            </>
          ) : (
            <>
              <img
                src="/images/no-cart.png"
                alt=""
                className="header__cart-no-cart-img"
              />
              <span className="header__cart-list-no-nocart-message">
                Chưa có sản phẩm
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
