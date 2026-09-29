import React, { useState } from "react";
import Modal from "./Modal";
import { Images } from "lucide-react";
import { optimizeImageUrl } from "../../utils/imageUrl";

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
            src={optimizeImageUrl(images[0]?.url, 960)}
            className="images"
            style={{
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
            }}
            alt="Property main photo"
            width="600"
            height="400"
            loading="eager"
          />
        </div>

        {images.slice(1, 4).map((image, index) => (
          <div key={index}>
            <img
              className="images"
              src={optimizeImageUrl(image.url, 600)}
              alt={`Property photo ${index + 2}`}
              width="300"
              height="200"
              loading="lazy"
            />
          </div>
        ))}
        {images[4] && (
          <div>
            <img
              className="images"
              src={optimizeImageUrl(images[4]?.url || images[0]?.url, 600)}
              alt="Property photo 5"
              style={{ borderBottomRightRadius: "10px" }}
              width="300"
              height="200"
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
