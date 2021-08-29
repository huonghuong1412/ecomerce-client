import React from "react";

export default function Title(props) {
  const { type, totalProducts } = props;
  let title = "";
  if (type === "sach") {
    title = "Sách hay";
  } else if (type === "laptop") {
    title = "Laptop";
  } else if (type === "dien-thoai") {
    title = "Điện thoại";
  }

  return (
    <>
      <div className="col l-12 m-12 c-12">
        <div className="home-product-category-item">
          <h3 className="home-product-title">
            {title}:
            <span className="home-product-subtitle">
              {totalProducts} kết quả
            </span>
          </h3>
        </div>
      </div>
    </>
  );
}
