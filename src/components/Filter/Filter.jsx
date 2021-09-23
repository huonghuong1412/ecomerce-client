import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getSubCategoryByCategoryCode } from "actions/services/CategoryServices";

export default function Filter(props) {
  const { category } = props;
  const history = useHistory();

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    getSubCategoryByCategoryCode(category)
      .then((res) => setSubcategories(res.data))
      .catch(() => setSubcategories({}));
  }, [category]);

  const params = new URLSearchParams(window.location.search);
  const sortBy = params.get("sort");
  const sortValue = params.get("value");

  return (
    <>
      <div className="col l-2 m-0 c-0" style={{ paddingBottom: "50px" }}>
        <nav className="filter__bar">
          <h3 className="category__heading">Danh mục sản phẩm</h3>
          <ul className="category-list">
            {subcategories &&
              subcategories.map((item) => {
                return (
                  <li className="category-item" key={item.id}>
                    <Link
                      to={`/${category}/${item.code}`}
                      className="category-item__link"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
        <div className="filter__bar">
          <h3 className="category__heading">Sắp xếp</h3>
          <ul className="category-list">
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "price" && sortValue === "asc"}
                    readOnly
                    onClick={() => {
                      history.push("?sort=price&value=asc");
                    }}
                  />
                  <div>
                    <span>Giá thấp đến cao</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "price" && sortValue === "desc"}
                    readOnly
                    onClick={() => {
                      history.push("?sort=price&value=desc");
                    }}
                  />
                  <div>
                    <span>Giá cao đến thấp</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "name" && sortValue === "asc"}
                    readOnly
                    onClick={() => {
                      history.push("?sort=name&value=asc");
                    }}
                  />
                  <div>
                    <span>Tên A-Z</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "name" && sortValue === "desc"}
                    readOnly
                    onClick={() => {
                      history.push("?sort=name&value=desc");
                    }}
                  />
                  <div>
                    <span>Tên Z-A</span>
                  </div>
                </label>
              </label>
            </li>
          </ul>
        </div>
        <div className="filter__bar">
          <h3 className="category__heading">Giá</h3>
          <ul className="category-list">
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input type="checkbox" />
                  <div>
                    <span>Dưới 100.000đ</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input type="checkbox" />
                  <div>
                    <span>Từ 100.000đ - 200.000đ</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input type="checkbox" />
                  <div>
                    <span>Từ 200.000đ - 300.000đ</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input type="checkbox" />
                  <div>
                    <span>Trên 300.000đ</span>
                  </div>
                </label>
              </label>
            </li>
          </ul>
        </div>
        <div className="filter__bar">
          <h3 className="category__heading">Nhà cung cấp</h3>
          <ul className="category-list">
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input
                    type="checkbox"
                    checked={sortBy === "name" && sortValue === "desc"}
                    readOnly
                    onClick={() => {
                      history.push({
                        pathname: '/sach',
                        search: `${params}&brand=alpha-books`
                      });
                    }}
                  />
                  <div>
                    <span>Times Books</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input type="checkbox" />
                  <div>
                    <span>Times Books</span>
                  </div>
                </label>
              </label>
            </li>
            <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input type="checkbox" />
                  <div>
                    <span>Times Books</span>
                  </div>
                </label>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
