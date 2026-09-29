import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Clock, Home, Building2, Hotel, Building, ExternalLink } from "lucide-react";

import formatCurrency from "../../utils/formatCurrency";
import { format12HourTime } from "../../utils/formatDate";

const TYPE_ICONS = {
  house: Home,
  flat: Building2,
  "guest house": Hotel,
  "guest-house": Hotel,
  hotel: Building,
};

const MyAccomodation = ({ accomodation = [] }) => {
  return (
    <div className="bookings-list">
      {accomodation.map((place) => {
        const imageUrl =
          place.images && place.images.length > 0 && place.images[0]?.url
            ? place.images[0].url
            : "/assets/image1.jpeg";

        const locationText = place.address
          ? [place.address.area, place.address.city, place.address.state]
              .filter(Boolean)
              .join(", ")
          : "Location N/A";

        const checkIn12 = format12HourTime(place.checkInTime);
        const checkOut12 = format12HourTime(place.checkOutTime);

        const TypeIcon = TYPE_ICONS[place.propertyType?.toLowerCase()] || Home;

        return (
          <div key={place._id} className="booking-card" style={{ cursor: "default" }}>
            <div className="booking-card-image-wrap">
              <img
                src={imageUrl}
                alt={place.propertyName || "Accommodation"}
                className="booking-card-image"
              />
            </div>

            <div className="booking-card-content">
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <h2 className="booking-card-title">{place.propertyName}</h2>
                  {place.propertyType && (
                    <span className="hh-badge hh-badge-muted">
                      <TypeIcon size={12} /> {place.propertyType}
                    </span>
                  )}
                </div>

                <div className="booking-card-location">
                  <MapPin size={14} /> {locationText}
                </div>

                <div className="booking-meta-row" style={{ marginTop: "0.75rem" }}>
                  {place.maximumGuest && (
                    <span className="booking-meta-item">
                      <Users size={14} /> Up to {place.maximumGuest} {place.maximumGuest === 1 ? "guest" : "guests"}
                    </span>
                  )}

                  {(checkIn12 || checkOut12) && (
                    <span className="booking-meta-item">
                      <Clock size={14} /> Check-in: {checkIn12 || "N/A"} · Check-out: {checkOut12 || "N/A"}
                    </span>
                  )}
                </div>
              </div>

              <div className="booking-card-footer">
                <div>
                  <span className="booking-price-label">Nightly Rate</span>
                  <div className="booking-price-amount">
                    {formatCurrency(place.price)} <span style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-text-muted)" }}>/ night</span>
                  </div>
                </div>

                <Link
                  to={`/propertylist/${place._id}`}
                  className="hh-nav-link"
                  style={{ textDecoration: "none", fontSize: "var(--text-xs)" }}
                >
                  <span>View Public Listing</span> <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyAccomodation;
