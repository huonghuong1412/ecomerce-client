import React from "react";
import Skeleton from "react-loading-skeleton";
export default function ProductSkeleton(props) {
  const { total } = props;
  return (
    <>
      {Array(total)
        .fill()
        .map((item, index) => {
          return (
            <div className="col l-3 m-4 c-6" key={index}>
              <div className="home-product-item">
                <Skeleton duration={1} width={245} height={245} />
                <Skeleton duration={1} />
                <Skeleton duration={1} />
                <Skeleton duration={1} />
              </div>
            </div>
          );
        })}
    </>
  );
}
