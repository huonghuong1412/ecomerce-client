import { API_URL } from "actions/constants/constants";
import React from "react";

function DetailsThumbnail(props) {
    const { images, tab, myRef } = props;
    return (
      <div className="thumb u-img-fluid" ref={myRef}>
        {images.map((img, index) => (
          <img alt="" src={`${API_URL}/images/product/${img}`} style={{ width: '75px', height: '75px', objectFit: 'cover' }} key={index} onClick={() => tab(index)} />
        ))}
      </div>
    );
}

export default DetailsThumbnail;
