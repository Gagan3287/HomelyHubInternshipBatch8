import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPropertyDetails } from "../../store/PropertyDetails/propertyDetails-action";
import { propertDetailsAction } from "../../store/PropertyDetails/propertyDetails-slice";

import PropertyGallery from "./PropertyGallery";
import PropertyContent from "./PropertyContent";
import PaymentForm from "./PaymentForm";
import PropertyMapSection from "./PropertyMapSection";
import PropertyDetailSkeleton from "./PropertyDetailSkeleton";

import "../../css/PropertyListing.css";

/* ── Stay-not-found state ── */
const StayNotFound = () => (
  <div className="pd-full-state" role="main" aria-label="Stay not found">
    <div className="pd-state-card">
      <span className="pd-state-icon" aria-hidden="true">🏚️</span>
      <h1 className="pd-state-title">Stay not found</h1>
      <p className="pd-state-desc">
        This listing doesn't exist or may have been removed. Browse other stays and find your perfect home away from home.
      </p>
      <a href="/" className="btn-hh btn-primary" style={{ textDecoration: "none" }}>
        Browse stays
      </a>
    </div>
  </div>
);

/* ── Error state ── */
const ErrorState = ({ message, onRetry }) => (
  <div className="pd-full-state" role="main" aria-label="Error loading stay">
    <div className="pd-state-card">
      <span className="pd-state-icon" aria-hidden="true">⚠️</span>
      <h2 className="pd-state-title">Something went wrong</h2>
      <p className="pd-state-desc">{message || "We couldn't load this stay. Please try again."}</p>
      <button className="btn-hh btn-primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  </div>
);

/* ── Main page component ── */
const PropertyListing = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, propertydetails, error } = useSelector(
    (state) => state.propertydetails
  );

  useEffect(() => {
    dispatch(getPropertyDetails(id));
  }, [dispatch, id]);

  const handleRetry = useCallback(() => {
    dispatch(propertDetailsAction.getListRequest());
    dispatch(getPropertyDetails(id));
  }, [dispatch, id]);

  /* ── Loading state: full-page skeleton ── */
  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  /* ── Error state ── */
  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  /* ── Not-found state (successful fetch but no data) ── */
  if (!propertydetails) {
    return <StayNotFound />;
  }

  /* Destructure only real fields */
  const {
    propertyName,
    address,
    description,
    propertyType,
    roomType,
    maximumGuest,
    images,
    amenities,
    price,
    checkInTime,
    checkOutTime,
    currentBookings,
  } = propertydetails;

  const addressStr = address
    ? `${address.area ? address.area + ", " : ""}${address.city ? address.city + ", " : ""}${address.state || ""}`
    : "";

  return (
    <div className="pd-page" role="main">
      {/* ── HEADER BLOCK ── */}
      <header className="pd-header-block">
        <div className="pd-header-inner">
          <h1 className="pd-property-name">{propertyName}</h1>
          <div className="pd-header-meta">
            {addressStr && (
              <span className="pd-address">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {addressStr}
              </span>
            )}
            <span className="pd-meta-chips">
              {propertyType && <span className="pd-chip">{propertyType}</span>}
              {propertyType && roomType && <span className="pd-meta-dot" aria-hidden="true">·</span>}
              {roomType && <span className="pd-chip">{roomType}</span>}
              {maximumGuest && (
                <>
                  <span className="pd-meta-dot" aria-hidden="true">·</span>
                  <span className="pd-chip">Up to {maximumGuest} guests</span>
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* ── GALLERY ── */}
      {images && images.length > 0 && (
        <PropertyGallery images={images} propertyName={propertyName} />
      )}

      {/* ── CONTENT + BOOKING CARD (two-column layout) ── */}
      <div className="pd-body-grid">
        {/* Left column */}
        <div className="pd-content-col">
          <PropertyContent
            description={description}
            amenities={amenities}
            checkInTime={checkInTime}
            checkOutTime={checkOutTime}
          />

          {/* Map section */}
          {address && (
            <PropertyMapSection address={address} propertyName={propertyName} />
          )}
        </div>

        {/* Right column — sticky booking card */}
        <div className="pd-booking-col" aria-label="Booking card">
          <div className="pd-booking-sticky">
            <PaymentForm
              propertyId={id}
              price={price}
              propertyName={propertyName}
              address={address}
              maximumGuest={maximumGuest}
              currentBookings={currentBookings}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE STICKY BOTTOM BAR ── */}
      <div className="pd-mobile-bar" aria-label="Mobile booking bar">
        <div className="pd-mobile-bar-price">
          <span className="pd-mobile-price-amount">
            {price ? `₹${Number(price).toLocaleString("en-IN")}` : "–"}
          </span>
          <span className="pd-mobile-price-per"> / night</span>
        </div>
        <button
          className="btn-hh btn-primary pd-mobile-reserve-btn"
          onClick={() => {
            const card = document.getElementById("pd-booking-card");
            if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

export default PropertyListing;
