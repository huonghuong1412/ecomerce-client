import React from "react";
import { Link } from "react-router-dom";

export default function Category() {
  return (
    <>
      <div className="row sm-gutter section__item">
        <div className="col l-12 m-12 c-12">
          <h3 className="home-product-title">Danh mục nổi bật</h3>
        </div>
        <div className="row sm-gutter section__content">
          <div className="col l-3 m-6 c-12">
            <Link to="/" className="home-product-category">
              <img
                src="https://salt.tikicdn.com/cache/w295/ts/banner/a8/39/18/5d93d0296f0cfc27a13c640997309b14.png.jpg"
                alt=""
              />
              <h4 className="home-product-category-name">Sách</h4>
            </Link>
          </div>
          <div className="col l-3 m-6 c-12">
            <Link to="/" className="home-product-category">
              <img
                src="https://salt.tikicdn.com/cache/w295/ts/banner/a8/39/18/5d93d0296f0cfc27a13c640997309b14.png.jpg"
                alt=""
              />
              <h4 className="home-product-category-name">Laptop</h4>
            </Link>
          </div>
          <div className="col l-3 m-6 c-12">
            <Link to="/" className="home-product-category">
              <img
                src="https://salt.tikicdn.com/cache/w295/ts/banner/a8/39/18/5d93d0296f0cfc27a13c640997309b14.png.jpg"
                alt=""
              />
              <h4 className="home-product-category-name">Điện thoại</h4>
            </Link>
          </div>
	<div className="col l-3 m-6 c-12">
            <Link to="/" className="home-product-category">
              <img
                src="https://salt.tikicdn.com/cache/w295/ts/banner/a8/39/18/5d93d0296f0cfc27a13c640997309b14.png.jpg"
                alt=""
              />
              <h4 className="home-product-category-name">Máy tính bảng</h4>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
