import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getSubCategoryByCategoryCode } from "actions/services/CategoryServices";
// import qs from "query-string";
import { getAllBrandByCategoryCode } from "actions/services/CategoryActions";

const list_price = [
  {
    category: "sach",
    prices: [
      {
        label: "Dưới 50.000",
        value: "50000",
      },
      {
        label: "Từ 50.000 - 120.000",
        value: "50000,120000",
      },
      {
        label: "Từ 120.000 - 300.000",
        value: "120000,300000",
      },
      {
        label: "Trên 300.000",
        value: "300000,10000000000",
      },
    ],
  },
  {
    category: "laptop",
    prices: [
      {
        label: "Dưới 5.000.000",
        value: "5000000",
      },
      {
        label: "Từ 5.000.000 - 10.000.000",
        value: "5000000,10000000",
      },
      {
        label: "Từ 10.000.000 - 20.000.000",
        value: "10000000,20000000",
      },
      {
        label: "Trên 20.000.000",
        value: "20000000,10000000000",
      },
    ],
  },
  {
    category: "dien-thoai",
    prices: [
      {
        label: "Dưới 500.000",
        value: "500000",
      },
      {
        label: "Từ 500.000 - 5.000.000",
        value: "500000,5000000",
      },
      {
        label: "Từ 5.000.000 - 20.000.000",
        value: "8000000,20000000",
      },
      {
        label: "Trên 20.000.000",
        value: "20000000,10000000000",
      },
    ],
  },
  {
    category: "bach-hoa",
    prices: [
      {
        label: "Dưới 40.000",
        value: "40000",
      },
      {
        label: "Từ 40.000 - 140.000",
        value: "40000,140000",
      },
      {
        label: "Từ 140.000 - 420.000",
        value: "140000,420000",
      },
      {
        label: "Trên 420.000",
        value: "420000,10000000000",
      },
    ],
  },
];

export default function Filter(props) {
  const { category } = props;
  const history = useHistory();

  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const params = new URLSearchParams(window.location.search);
  const sortBy = params.get("sort_by") ? params.get("sort_by") : "";
  const sortValue = params.get("sort_value") ? params.get("sort_value") : "";
  const price_search = params.get("price") ? params.get("price") : "";
  const brand = params.get("brand") ? params.get("brand") : "";

  useEffect(() => {
    getSubCategoryByCategoryCode(category)
      .then((res) => setSubcategories(res.data))
      .catch(() => setSubcategories({}));
    getAllBrandByCategoryCode(category)
      .then((res) => setBrands(res.data))
      .catch((err) => console.log(err));

  }, [category, sortBy, sortValue, price_search, brand]);

  // const [query, setQuery] = useState({
  //   brand: [],
  //   price: [],
  // });

  const addQuery = (key, value) => {
    let pathname = window.location.pathname;
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
  };

  const removeQuery = (key) => {
    let pathname = window.location.pathname;
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(key);
    history.push({
             pathname: pathname,
             search: searchParams.toString()
       });
   };

  // const handleSubmit = () => {
  //   let pathname = window.location.pathname;
  //   let searchParams = new URLSearchParams(window.location.search);
  //   if (query.brand.length > 0) {
  //     searchParams.set("brand", query.brand.join(","));
  //   }
  //   if (query.price.length > 0) {
  //     searchParams.set("price", query.price.join(","));
  //   }
  //   history.push({
  //     pathname: pathname,
  //     search: searchParams.toString(),
  //   });
  // };

  // const handleChange = (e) => {
  //   const checked = e.target.checked;
  //   const checkedValue = e.target.value;

  //   if (checked) {
  //     setQuery({
  //       ...query,
  //       [e.target.name]: checkedValue,
  //     });
  //   }
  // };

  return (
    <>
      <div className="col l-2-4 m-0 c-0" style={{ paddingBottom: "50px" }}>
        <nav className="filter__bar">
          <h3 className="category__heading">Danh mục sản phẩm</h3>
          <ul className="category-list">
            {subcategories?.map((item) => {
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
                      history.push("?sort_by=price&sort_value=asc");
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
                      history.push("?sort_by=price&sort_value=desc");
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
                      history.push("?sort_by=name&sort_value=asc");
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
                      history.push("?sort_by=name&sort_value=desc");
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
            {/* <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input
                    type="radio"
                    name="price"
                    value={""}
                    checked={price_search === null}
                    onChange={handleChange}
                    onClick={() => removeQuery("price")}
                  />
                  <div>
                    <span>Tất cả</span>
                  </div>
                </label>
              </label>
            </li> */}
            {list_price
              .filter((item) => item.category === category)[0]
              .prices.map((price, index) => {
                return (
                  <li
                    className="category-item category-item__filter"
                    key={index}
                  >
                    <label className="item  item--seller">
                      <label className="style__Checkbox">
                        <input
                          type="radio"
                          name="price"
                          value={price.value}
                          readOnly
                          checked={price_search === price.value}
                          onClick={() => addQuery("price", price.value)}
                        />
                        <div>
                          <span>{price.label}</span>
                        </div>
                      </label>
                    </label>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="filter__bar">
          <h3 className="category__heading">Thương Hiệu</h3>
          <ul className="category-list">
          <li className="category-item category-item__filter">
              <label className="item  item--seller">
                <label className="style__Checkbox">
                  <input
                    type="radio"
                    name="price"
                    value={""}
                    checked={brand === null || brand === ''}
                    readOnly
                    onClick={() => removeQuery("brand")}
                  />
                  <div>
                    <span>Tất cả</span>
                  </div>
                </label>
              </label>
            </li>
            {brands.map((item) => (
              <li className="category-item category-item__filter" key={item.id}>
                <label className="item  item--seller">
                  <label className="style__Checkbox">
                    <input
                      type="radio"
                      name={item.name}
                      value={item.code}
                      checked={item.code === brand}
                      readOnly
                      // onChange={(e) => {
                      //   if (e.target.checked) {
                      //     setQuery({
                      //       ...query,
                      //       brand: [...query.brand, e.target.value],
                      //     });
                      //   } else {
                      //     setQuery({
                      //       ...query,
                      //       brand: query.brand.filter(
                      //         (item) => item !== e.target.value
                      //       ),
                      //     });
                      //   }
                      // }}
                      onClick={() => {addQuery("brand", item.code)}}
                    />
                    <div>
                      <span>{item.name}</span>
                    </div>
                  </label>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
