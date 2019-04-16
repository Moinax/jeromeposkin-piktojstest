import React from "react";

export default ({ images = [], onClick }) => {
  return (
    <div className="image">
      <h4>Images</h4>
      <ul className="list-unstyled">
        {/*List of images here*/}
        {images.map(src => (
          <li key={src}>
            <img src={src} onClick={() => onClick(src)} alt="imageItem" className="img-rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
};
