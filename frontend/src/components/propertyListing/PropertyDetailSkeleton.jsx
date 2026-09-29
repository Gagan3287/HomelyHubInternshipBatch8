import React from "react";
import { Skeleton } from "../ui/Skeleton";

/**
 * Full-page skeleton that resembles the final PropertyListing layout:
 * - header block (title + meta)
 * - mosaic gallery (1 large + 4 tiles)
 * - two-column body (content left, booking card right)
 */
const PropertyDetailSkeleton = () => {
  return (
    <div className="pd-page pd-skeleton-page" aria-busy="true" aria-label="Loading property details">
      {/* Header block */}
      <div className="pd-header-block">
        <div className="pd-header-inner">
          <Skeleton variant="heading" width="55%" height="2.5rem" style={{ marginBottom: "0.75rem" }} />
          <div style={{ display: "flex", gap: "1rem" }}>
            <Skeleton variant="text" width="180px" height="1rem" />
            <Skeleton variant="text" width="120px" height="1rem" />
          </div>
        </div>
      </div>

      {/* Gallery skeleton — 5-tile mosaic */}
      <div className="pd-gallery-section">
        <div className="pd-gallery-mosaic pd-gallery-five pd-skel-gallery">
          <div className="pd-tile-main">
            <Skeleton variant="image" style={{ height: "100%", paddingTop: 0, borderRadius: "var(--radius-md)" }} />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="pd-tile-sub">
              <Skeleton variant="image" style={{ height: "100%", paddingTop: 0, borderRadius: "var(--radius-sm)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Body grid */}
      <div className="pd-body-grid">
        {/* Left column */}
        <div className="pd-content-col">
          <div className="pd-content-sections">
            {/* About */}
            <Skeleton variant="heading" width="40%" style={{ marginBottom: "1rem" }} />
            {[100, 80, 90, 65, 75].map((w, i) => (
              <Skeleton key={i} variant="text" width={`${w}%`} style={{ marginBottom: "0.5rem" }} />
            ))}
            <Skeleton variant="text" width="30%" style={{ marginBottom: "0.5rem" }} />

            {/* Amenities */}
            <div style={{ marginTop: "2rem" }}>
              <Skeleton variant="heading" width="50%" style={{ marginBottom: "1rem" }} />
              <div className="pd-amenities-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="pd-amenity-item">
                    <Skeleton variant="text" width="1.2rem" height="1.2rem" style={{ borderRadius: "50%", flexShrink: 0 }} />
                    <Skeleton variant="text" width="80%" />
                  </div>
                ))}
              </div>
            </div>

            {/* Times */}
            <div style={{ marginTop: "2rem" }}>
              <Skeleton variant="heading" width="45%" style={{ marginBottom: "1rem" }} />
              <div className="pd-times-grid">
                <Skeleton variant="image" height="5rem" style={{ paddingTop: 0, borderRadius: "var(--radius-md)" }} />
                <Skeleton variant="image" height="5rem" style={{ paddingTop: 0, borderRadius: "var(--radius-md)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="pd-booking-col">
          <div className="pd-booking-sticky">
            <Skeleton variant="image" height="22rem" style={{ paddingTop: 0, borderRadius: "var(--radius-lg)" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailSkeleton;
