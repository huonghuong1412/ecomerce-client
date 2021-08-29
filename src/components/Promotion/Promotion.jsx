import React from "react";

export default function Promotion() {
  return (
    <>
      <div className="row sm-gutter section__content ">
        <div className="col l-12 m-12 c-12">
          <div className="same-promotion-list">
            <div className="view-more-promo">
              <h3 className="home-product-title">Ưu đãi của bạn</h3>
            </div>
            <div className="never-show-promo">
              {/* <span>Không hiện lại ✖</span> */}
            </div>
            <div className="same-promotion-item">
              <i className="bhx-block hidden" />
              <i className="bhx-check" />
              <img
                src="//cdn.tgdd.vn/bachhoaxanh/www/Content/images/VIP.v202106241519.png"
                alt=""
                width={23}
                height={20}
                className="vip hidden"
              />
              <span className="use hidden">Sử dụng</span>
              <div className="title">Miễn phí giao</div>
              <div className="content">
                5 đơn đầu tiên từ 100.000đ, không áp dụng hàng to, nặng (tối đa
                15.000đ)
              </div>
            </div>
            <div className="same-promotion-item">
              <a href="https://www.bachhoaxanh.com/khuyen-mai">
                <i className="bhx-block hidden" />
                <i className="bhx-check hidden" />
                <img
                  src="//cdn.tgdd.vn/bachhoaxanh/www/Content/images/VIP.v202106241519.png"
                  alt=""
                  width={23}
                  height={20}
                  className="vip hidden"
                />
                <span className="use hidden">Sử dụng</span>
                <div className="title">Khuyến mãi đến 50%</div>
                <div className="content">
                  Hàng ngàn sản phẩm có giá khuyến mãi cực sốc, giảm đến 50%
                </div>
              </a>
            </div>
            <div className="same-promotion-item un-selected">
              <a href="https://www.bachhoaxanh.com/kinh-nghiem-hay/huong-dan-cach-su-dung-voucher-tai-website-bachhoaxanhcom-1363774">
                <i className="bhx-block" />
                <i className="bhx-check hidden" />
                <img
                  src="//cdn.tgdd.vn/bachhoaxanh/www/Content/images/VIP.v202106241519.png"
                  alt=""
                  width={23}
                  height={20}
                  className="vip hidden"
                />
                <span className="use hidden">Sử dụng</span>
                <div className="title un-selected">Tặng 40.000đ</div>
                <div className="content un-selected">
                  Dành cho người thân và bạn bè sau khi mua online tại
                  BachhoaXANH.com
                </div>
              </a>
            </div>
            <div className="same-promotion-item un-selected">
              <a href="https://www.bachhoaxanh.com/chinh-sach-giao-hang">
                <i className="bhx-block hidden" />
                <i className="bhx-check hidden" />
                <img
                  src="//cdn.tgdd.vn/bachhoaxanh/www/Content/images/VIP.v202106241519.png"
                  alt=""
                  width={23}
                  height={20}
                  className="vip"
                />
                <span className="use hidden">Sử dụng</span>
                <div className="title un-selected">Miễn phí giao</div>
                <div className="content un-selected">
                  Cho đơn từ 250.000đ với khách hàng mua online tại
                  BachhoaXANH.com
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
