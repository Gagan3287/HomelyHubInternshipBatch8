import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, MapPin, Calendar, Moon, Users, Receipt, Sparkles } from "lucide-react";

import { fetchBookingDetails } from "../../store/Booking/booking-action";
import PropertyImg from "../propertyListing/PropertyImg";
import formatDate, { calculateNights } from "../../utils/formatDate";
import formatCurrency from "../../utils/formatCurrency";
import Skeleton from "../ui/Skeleton";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const { bookingDetails, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingDetails(bookingId));
    }
  }, [dispatch, bookingId]);

  if (loading || !bookingDetails || !bookingDetails.property) {
    return (
      <div className="account-page-wrapper">
        <div className="account-container booking-details-wrapper">
          <div className="back-link-bar">
            <Skeleton variant="text" width="140px" height="1.25rem" />
          </div>
          <div className="account-card" style={{ padding: "2rem", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-xl)" }}>
            <Skeleton variant="heading" width="60%" height="2rem" />
            <Skeleton variant="text" width="40%" height="1rem" style={{ marginTop: "0.5rem" }} />
            <div style={{ marginTop: "2rem" }}>
              <Skeleton variant="image" width="100%" height="300px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { property, fromDate, toDate, numberOfnights, price, guests } = bookingDetails;
  const nights = calculateNights(fromDate, toDate, numberOfnights);
  const guestCount = guests || property?.maximumGuest || 1;

  const addressFormatted = property?.address
    ? [property.address.area, property.address.city, property.address.state, property.address.pincode]
        .filter(Boolean)
        .join(", ")
    : "Address details unavailable";

  return (
    <div className="account-page-wrapper">
      <div className="account-container booking-details-wrapper">
        {/* Back Link */}
        <div className="back-link-bar">
          <Link to="/user/mybookings" className="back-link">
            <ArrowLeft size={16} /> Back to My Bookings
          </Link>
        </div>

        {/* Header Title & Location */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 className="account-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
            {property?.propertyName || "Stay Accommodation"}
          </h1>
          <div className="booking-card-location" style={{ fontSize: "var(--text-sm)" }}>
            <MapPin size={16} style={{ color: "var(--color-brand)" }} />
            <span>{addressFormatted}</span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="details-summary-card">
          <div>
            <h2 className="hh-subtitle" style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "1rem", color: "var(--color-primary)" }}>
              Reservation Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div className="booking-meta-item" style={{ fontSize: "var(--text-sm)" }}>
                <Calendar size={18} style={{ color: "var(--color-brand)" }} />
                <span>
                  <strong>Check-in:</strong> {formatDate(fromDate)}
                </span>
              </div>

              <div className="booking-meta-item" style={{ fontSize: "var(--text-sm)" }}>
                <Calendar size={18} style={{ color: "var(--color-brand)" }} />
                <span>
                  <strong>Check-out:</strong> {formatDate(toDate)}
                </span>
              </div>

              <div className="booking-meta-item" style={{ fontSize: "var(--text-sm)" }}>
                <Moon size={18} style={{ color: "var(--color-brand)" }} />
                <span>
                  <strong>Total Stay:</strong> {nights} {nights === 1 ? "night" : "nights"}
                </span>
              </div>

              <div className="booking-meta-item" style={{ fontSize: "var(--text-sm)" }}>
                <Users size={18} style={{ color: "var(--color-brand)" }} />
                <span>
                  <strong>Guests:</strong> {guestCount} {guestCount === 1 ? "guest" : "guests"}
                </span>
              </div>
            </div>
          </div>

          <div className="details-price-box">
            <Receipt size={28} style={{ color: "var(--color-brand)", marginBottom: "0.5rem" }} />
            <span className="details-price-title">Total Price Paid</span>
            <div className="details-price-value">{formatCurrency(price)}</div>
          </div>
        </div>

        {/* Property Images */}
        {property?.images && property.images.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h2 className="hh-subtitle" style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "1rem" }}>
              Property Photos
            </h2>
            <PropertyImg images={property.images} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
