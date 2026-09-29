import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { MapPin, Users, Home, Building2, Hotel, Building } from "lucide-react";
import { formatPrice } from "../../utils/formatCurrency";
import { optimizeImageUrl } from "../../utils/imageUrl";

const TYPE_ICONS = {
  house: Home,
  flat: Building2,
  "guest-house": Hotel,
  hotel: Building,
};

const PropertyCard = ({ property }) => {
  const [imgError, setImgError] = useState(false);

  const {
    _id,
    propertyName,
    address,
    price,
    images,
    propertyType,
    roomType,
    maximumGuest,
  } = property;

  const rawImageUrl =
    !imgError && images && images.length > 0 && images[0]?.url
      ? images[0].url
      : null;

  const imageUrl = rawImageUrl ? optimizeImageUrl(rawImageUrl, 600) : null;

  const locationText = address
    ? `${address.city || ""}${address.city && address.state ? ", " : ""}${address.state || ""}`
    : "Location unavailable";

  const TypeIcon = TYPE_ICONS[propertyType?.toLowerCase()] || Home;

  return (
    <article className="hh-property-card">
      <Link to={`/propertylist/${_id}`} className="hh-card-image-link" tabIndex={0}>
        <div className="hh-card-image-container">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={propertyName || "Accommodation"}
              className="hh-card-image"
              width="400"
              height="280"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="hh-card-image-placeholder" aria-label="Photo unavailable">
              <Home size={36} className="hh-placeholder-icon" />
              <span className="hh-placeholder-text">Photo unavailable</span>
            </div>
          )}
          <div className="hh-card-badge-group">
            {propertyType && (
              <span className="hh-card-type-badge">
                <TypeIcon size={13} />
                <span>{propertyType}</span>
              </span>
            )}
            {roomType && (
              <span className="hh-card-room-badge">
                {roomType}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="hh-card-content">
        <div className="hh-card-header">
          <h3 className="hh-card-title">
            <Link to={`/propertylist/${_id}`} title={propertyName}>
              {propertyName}
            </Link>
          </h3>
        </div>

        <div className="hh-card-location">
          <MapPin size={15} className="hh-location-icon" />
          <span className="hh-location-text">{locationText}</span>
        </div>

        <div className="hh-card-meta">
          {maximumGuest && (
            <span className="hh-meta-item">
              <Users size={14} />
              <span>Up to {maximumGuest} guests</span>
            </span>
          )}
        </div>

        <div className="hh-card-footer">
          <div className="hh-card-price-container">
            <span className="hh-card-price">{formatPrice(price)}</span>
            <span className="hh-card-price-period"> / night</span>
          </div>
          <Link to={`/propertylist/${_id}`} className="hh-card-view-btn" aria-label={`View details for ${propertyName}`}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    propertyName: PropTypes.string,
    address: PropTypes.object,
    price: PropTypes.number,
    images: PropTypes.array,
    propertyType: PropTypes.string,
    roomType: PropTypes.string,
    maximumGuest: PropTypes.number,
  }).isRequired,
};

export default PropertyCard;
