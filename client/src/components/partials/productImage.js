import React, { useEffect, useState } from "react";
import { showUserContexts } from "./../../App";

function ProductImage(props) {
  const userAuth = showUserContexts();
  const [selectedImage, setSelectedImage] = useState(0);
  const generateImageAlt = () => {
    let altImage = "";

    props.tags.forEach((tag) => {
      altImage = altImage + " " + tag;
    });

    altImage = altImage + " " + props.category;

    return altImage.toUpperCase();
  };

  const [images, setImages] = useState([]);
  useEffect(() => {
    setImages(props.images);
  }, [props.images]);

  useEffect(() => {}, [userAuth]);
  return images.length > 0 ? (
    <div id="prod-details-image">
      <img src={props.images[selectedImage].url} alt={generateImageAlt()} />

      <div className="images-slider">
        {props.images.map((image, i) => {
          return (
            <div>
              {userAuth.isAdmin && (
                <svg
                  onClick={() => props.deleteImage(image.id)}
                  className="admin-prod-delete-img"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z"
                    fill-rule="nonzero"
                  />
                </svg>
              )}

              <img
                onClick={() => setSelectedImage(i)}
                className={
                  i === selectedImage
                    ? "image-preview selected"
                    : "image-preview"
                }
                src={image.url}
                alt={generateImageAlt()}
              />
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    "Waiting"
  );
}

export default ProductImage;
