import React, { useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getAllCategory } from "actions/services/CategoryActions";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { logout, setCurrentUser } from "actions/services/UserActions";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Cart from "./Cart";
function Header(props) {
  const [category, setCategory] = useState([]);

  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(setCurrentUser(decoded));
    }
  }, [dispatch, token]);

  const handleLogout = () => dispatch(logout());

  useEffect(() => {
    getAllCategory()
      .then((res) => {
        setCategory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <header className="header">
        <div className="grid wide">
          <nav className="header__navbar hide-on-mobile-tablet">
            <ul className="header__navbar--list">
              <li className="header__navbar--item header__navbar--item-qr header__navbar-item--separate">
                Vào cửa hàng trên ứng dụng
                <div className="header__qr">
                  <img
                    src="./img/qrcode.png"
                    alt="Qr code"
                    className="header__qr-img"
                  />
                  <div className="header__qr-apps">
                    <Link to="/" className="header__qr-link">
                      <img
                        src="./img/googleplay.png"
                        alt="Goole Play"
                        className="header__qr-download-img"
                      />
                    </Link>
                    <Link to="/" className="header__qr-link">
                      <img
                        src="./img/appstore.png"
                        alt="App store"
                        className="header__qr-download-img"
                      />
                    </Link>
                  </div>
                </div>
              </li>
              <li className="header__navbar--item">
                <span className="header__navbar--item-title-no-pointer">
                  Kết nối
                </span>
                <Link to="/" className="nav--icon-link">
                  <i className="header__navbar-icon fab fa-facebook" />
                </Link>
                <Link to="/" className="nav--icon-link">
                  <i className="header__navbar-icon fab fa-instagram" />
                </Link>
              </li>
            </ul>
            <ul className="header__navbar--list">
              <li className="header__navbar--item">
                <Link to="/about-us" className="nav--link">
                  <i className="header__navbar-icon far fa-question-circle" />
                  Về chúng tôi
                </Link>
              </li>
              <li className="header__navbar--item">
                <Link to="/help" className="nav--link">
                  <i className="header__navbar-icon far fa-question-circle" />
                  Trợ giúp
                </Link>
              </li>
              {token ? (
                <li className="header__navbar--item header__navbar-user">
                  <AccountCircleIcon />
                  <span className="header__navbar-user-name">
                    {profile.sub}
                  </span>
                  <ul className="header__navbar-user-menu">
                    <li className="header__navbar-user-item">
                      <Link to="/my-profile">Tài khoản của tôi</Link>
                    </li>
                    <li className="header__navbar-user-item">
                      <Link to="/customer/address">Địa chỉ của tôi</Link>
                    </li>
                    <li className="header__navbar-user-item">
                      <Link to="/customer/order/history">Đơn mua</Link>
                    </li>
                    <li className="header__navbar-user-item header__navbar-user-item-separate">
                      <Link to="#" onClick={handleLogout}>
                        Đăng xuất
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="header__navbar--item navbar--strong header__navbar-item--separate">
                    <Link
                      to="/register"
                      className="nav--link nav--link-register"
                    >
                      Đăng ký
                    </Link>
                  </li>
                  <li className="header__navbar--item navbar--strong">
                    <Link
                      to="/login"
                      className="nav--link nav--link-login"
                    >
                      Đăng nhập
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className="header-width-search">
            <div className="header__logo">
              <Link to="/" className="header__logo-link">
                <img
                  className="header__logo-img"
                  src="https://salt.tikicdn.com/ts/upload/ae/f5/15/2228f38cf84d1b8451bb49e2c4537081.png"
                  alt=""
                />
              </Link>
            </div>
            <div className="header__category">
              <div className="header__category--inner">
                <div className="header__category--icon">
                  <img
                    src="https://salt.tikicdn.com/ts/upload/96/d1/77/e499ea39b0773a337d2217ad473fcb97.png"
                    alt=""
                  />
                </div>
                <div className="header__category--text">
                  <span className="header__category--text-title">Danh Mục</span>
                  <span className="header__category--text-subtitle">
                    Sản phẩm
                    <i className="fas fa-caret-down" />
                  </span>
                </div>
              </div>
              <div className="header__category--dropdown">
                <ul className="header__category--list">
                  {category.map((item) => {
                    return (
                      <li className="header__category--item" key={item.id}>
                        <Link
                          to={`/${item.code}`}
                          className="header__category--link"
                        >
                          <i className="fas fa-bolt"></i>
                          {item.name}
                        </Link>
                        <div className="header__category--item-dropdown">
                          <h3 className="header__category--item-title">
                            {item.name}
                          </h3>
                          <ul className="header__category--item-sublist">
                            {item?.subcategories.map((sub) => {
                              return (
                                <li
                                  className="header__category--item-subitem"
                                  key={sub.id}
                                >
                                  <Link
                                    to={`/${item.code}/${sub.code}`}
                                    className="header__category--item-link"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="header__search">
              <div className="header__search-input-wrap">
                <input
                  type="text"
                  className="header__search-input"
                  placeholder="Nhập thông tin tìm kiếm"
                />
                {/* -------  SEARCH HISTORY  ------ */}
                <div className="header__search-history">
                  <h3 className="header__search-history-heading">
                    Lịch sử tìm kiếm
                  </h3>
                  <ul className="header__search-history-list">
                    <li className="header__search-history-item">
                      <Link to="/">laptop</Link>
                    </li>
                    <li className="header__search-history-item">
                      <Link to="/">áo khoác nữ</Link>
                    </li>
                    <li className="header__search-history-item">
                      <Link to="/">truyện</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <button className="header__search-btn">
                <i className="header__search-btn-icon fas fa-search" />
              </button>
            </div>
            <Cart />
          </div>
        </div>
        <ul className="header__sort-bar">
          <li className="header__sort-item">
            <Link to="/" className="header__sort-link">
              Liên quan
            </Link>
          </li>
          <li className="header__sort-item header__sort-item-active">
            <Link to="/" className="header__sort-link">
              Mới nhất
            </Link>
          </li>
          <li className="header__sort-item">
            <Link to="/" className="header__sort-link">
              Bán chạy
            </Link>
          </li>
          <li className="header__sort-item">
            <Link to="/" className="header__sort-link">
              Giá
            </Link>
          </li>
        </ul>
      </header>
    </>
  );
}

export default Header;