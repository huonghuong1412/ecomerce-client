import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./Slide.css";
function PrevButton({ onClick }) {
  return (
    <button onClick={onClick} className="slick-prev">
      <i className="fas fa-chevron-left"></i>
    </button>
  );
}
function NextButton({ onClick }) {
  return (
    <button onClick={onClick} className="slick-next">
      <i className="fas fa-chevron-right"></i>
    </button>
  );
}
export default function Slide() {
  const slideItems = [
    {
      img: "https://cdn.tgdd.vn/bachhoaxanh/banners/2505/laupro-2-28062021133311.jpg",
      link: "/quan-ao",
    },
    {
      img: "https://salt.tikicdn.com/ts/banner/9b/8b/a0/ff13d673e466f0a53ec335c392feda2e.png",
      link: "/sach",
    },
    {
      img: "https://salt.tikicdn.com/cache/w824/ts/banner/51/a5/d4/8412280f9df1a15fcbf699e2357e7dc3.png.jpg",
      link: "/sach",
    },
    {
      img: "https://cdn.tgdd.vn/2021/06/banner/sn-chung-800-33002-830x300.gif",
      link: "/sach",
    },
  ];

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevButton />,
    nextArrow: <NextButton />,
  };

  return (
    <>
      <div className="row sm-gutter section__content">
        <div className="col l-12 m-12 c-12">
          <Slider {...settings}>
            {slideItems.map((slide, key) => {
              return (
                <section className="features-slide" key={key}>
                  <div className="features-slide-item">
                    <Link to={`${slide.link}`}>
                      <img
                        className="features-slide-img"
                        src={`${slide.img}`}
                        alt=""
                      />
                    </Link>
                  </div>
                </section>
              );
            })}
          </Slider>
        </div>
      </div>
    </>
  );
}
