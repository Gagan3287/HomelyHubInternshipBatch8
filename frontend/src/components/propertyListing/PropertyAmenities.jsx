import React from "react";
import {
  Wifi,
  Utensils,
  Car,
  WashingMachine,
  Tv,
  Waves,
  Wind,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP = {
  wifi: Wifi,
  kitchen: Utensils,
  parking: Car,
  washingmachine: WashingMachine,
  tv: Tv,
  pool: Waves,
  ac: Wind,
};

const PropertyAmenities = ({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="property-amenities-section">
      <h2 className="property-amenities">What this place offers</h2>
      <div className="amenities">
        {amenities.map((amenity, index) => {
          const key = (amenity.icon || amenity.name || "").toLowerCase().replace(/\s+/g, "");
          const IconComponent = ICON_MAP[key] || CheckCircle2;
          return (
            <p key={index} className="amenity-item">
              <IconComponent size={20} className="amenity-icon" />
              <span>{amenity.name}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyAmenities;
