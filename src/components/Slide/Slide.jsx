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
      img: "https://salt.tikicdn.com/cache/w1080/ts/banner/46/8d/a5/9e1b5189721b5d7d907d779c562b97b6.png",
      link: "/laptop",
    },
    {
      img: "https://salt.tikicdn.com/ts/banner/9b/8b/a0/ff13d673e466f0a53ec335c392feda2e.png",
      link: "/sach",
    },
    {
      img: "https://salt.tikicdn.com/cache/w1080/ts/banner/31/f0/7e/14e65836534912005bc59307661335e9.png",
      link: "/dien-thoai",
    },
    {
      img: "https://salt.tikicdn.com/cache/w824/ts/banner/51/a5/d4/8412280f9df1a15fcbf699e2357e7dc3.png.jpg",
      link: "/may-tinh-bang",
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
