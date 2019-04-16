import React from "react";
import ImageItem from "./ImageItem";

export default ({ images = [] }) => {
  return (
    <div className="image">
      <h4>Images</h4>
      <ul className="list-unstyled">
        {/*List of images here*/}
        {images.map(img => (
          <ImageItem img={img} />
        ))}
      </ul>
    </div>
  );
};
