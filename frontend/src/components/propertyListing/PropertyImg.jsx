import React, { useState } from "react";
import Modal from "./Modal";
import { Images } from "lucide-react";

const PropertyImg = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="property-img-container">
        <div className="img-item">
          <img
            src={images[0]?.url}
            className="images"
            style={{
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
            }}
            alt="property main photo"
            loading="eager"
          />
        </div>

        {images.slice(1, 4).map((image, index) => (
          <div key={index}>
            <img
              className="images"
              src={image.url}
              alt={`property photo ${index + 2}`}
              loading="lazy"
            />
          </div>
        ))}
        {images[4] && (
          <div>
            <img
              className="images"
              src={images[4]?.url || images[0]?.url}
              alt="property photo 5"
              style={{ borderBottomRightRadius: "10px" }}
              loading="lazy"
            />
            <button
              className="similar-photos"
              onClick={handleShowAllPhotos}
              aria-label="View all property photos"
              type="button"
            >
              <Images size={18} />
              <span>Show all photos</span>
            </button>
          </div>
        )}
      </div>

      <div className="similar-photos-container"></div>
      {isModalOpen && <Modal images={images} onClose={handleCloseModal} />}
    </>
  );
};

export default PropertyImg;
