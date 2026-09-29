import React from "react";
import MapComponent from "./MapComponent";

const PropertyMapSection = ({ address }) => {
  return (
    <section className="pd-map-section" aria-label="Location on map">
      <hr className="pd-section-divider" />
      <h2 className="pd-section-heading">Where you'll be</h2>
      {address && (
        <p className="pd-map-address">
          {[address.area, address.city, address.state]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
      <div className="pd-map-container">
        <MapComponent address={address} />
      </div>
    </section>
  );
};

export default PropertyMapSection;
