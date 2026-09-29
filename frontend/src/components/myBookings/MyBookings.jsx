import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Moon, MapPin, Users, Compass, RefreshCw, CalendarX, ArrowRight } from "lucide-react";

import ProgressSteps from "../ProgressSteps";
import { fetchBookingDetails, fetchUserBookings } from "../../store/Booking/booking-action";
import formatDate, { calculateNights } from "../../utils/formatDate";
import formatCurrency from "../../utils/formatCurrency";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

const MyBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleBookingClick = (bookingId) => {
    dispatch(fetchBookingDetails(bookingId));
    navigate(`/user/mybookings/${bookingId}`);
  };

  const handleRetry = () => {
    dispatch(fetchUserBookings());
  };

  return (
    <div className="account-page-wrapper">
      <div className="account-container">
        <ProgressSteps />

        <div className="account-header">
          <h1 className="account-title">My Bookings</h1>
          <p className="account-subtitle">
            View your stay reservation history and active bookings
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="bookings-list" aria-label="Loading bookings">
            {[1, 2].map((i) => (
              <div key={i} className="booking-card" style={{ cursor: "default" }}>
                <div className="booking-card-image-wrap">
                  <Skeleton variant="image" width="100%" height="100%" />
                </div>
                <div className="booking-card-content">
                  <div>
                    <Skeleton variant="heading" width="60%" height="1.5rem" />
                    <Skeleton variant="text" width="40%" height="1rem" />
                  </div>
                  <div>
                    <Skeleton variant="text" width="75%" height="1rem" />
                    <Skeleton variant="text" width="30%" height="1.25rem" style={{ marginTop: "0.5rem" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error / Failed state with retry */}
        {!loading && !bookings && (
          <div className="account-empty-card">
            <div className="empty-icon-box" style={{ backgroundColor: "var(--color-error-bg)", color: "var(--color-error)" }}>
              <CalendarX size={36} />
            </div>
            <h2 className="account-title" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              Unable to load bookings
            </h2>
            <p className="account-subtitle" style={{ maxWidth: "420px", marginBottom: "2rem" }}>
              There was a problem retrieving your stay reservations. Please try again.
            </p>
            <Button variant="primary" onClick={handleRetry}>
              <RefreshCw size={18} /> Retry Loading
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings && bookings.length === 0 && (
          <div className="account-empty-card">
            <div className="empty-icon-box">
              <CalendarX size={36} />
            </div>
            <h2 className="account-title" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              No trips yet
            </h2>
            <p className="account-subtitle" style={{ maxWidth: "420px", marginBottom: "2rem" }}>
              When you book a stay accommodation on HomelyHub, your reservation details and booking history will appear here.
            </p>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="primary">
                <Compass size={18} /> Browse Stays
              </Button>
            </Link>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings && bookings.length > 0 && (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const nights = calculateNights(
                booking.fromDate,
                booking.toDate,
                booking.numberOfnights
              );
              const formattedFromDate = formatDate(booking.fromDate);
              const formattedToDate = formatDate(booking.toDate);
              const dateRangeStr =
                formattedFromDate && formattedToDate
                  ? `${formattedFromDate} to ${formattedToDate}`
                  : "Dates N/A";

              const propertyImage =
                booking.property?.images && booking.property.images.length > 0
                  ? booking.property.images[0].url
                  : "/assets/image1.jpeg";

              const addressStr = booking.property?.address
                ? [booking.property.address.city, booking.property.address.state]
                    .filter(Boolean)
                    .join(", ")
                : "Location N/A";

              const guestCount = booking.guests || booking.property?.maximumGuest || 1;

              return (
                <div
                  key={booking._id}
                  className="booking-card"
                  onClick={() => handleBookingClick(booking._id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleBookingClick(booking._id);
                    }
                  }}
                >
                  <div className="booking-card-image-wrap">
                    <img
                      src={propertyImage}
                      alt={booking.property?.propertyName || "Property"}
                      className="booking-card-image"
                    />
                  </div>

                  <div className="booking-card-content">
                    <div>
                      <h2 className="booking-card-title">
                        {booking.property?.propertyName || "Property Booking"}
                      </h2>
                      <div className="booking-card-location">
                        <MapPin size={14} /> {addressStr}
                      </div>

                      <div className="booking-meta-row">
                        <span className="booking-meta-item">
                          <Calendar size={14} /> {dateRangeStr}
                        </span>
                        <span className="booking-meta-item">
                          <Moon size={14} /> {nights} {nights === 1 ? "night" : "nights"}
                        </span>
                        <span className="booking-meta-item">
                          <Users size={14} /> {guestCount} {guestCount === 1 ? "guest" : "guests"}
                        </span>
                      </div>
                    </div>

                    <div className="booking-card-footer">
                      <div>
                        <span className="booking-price-label">Total Price</span>
                        <div className="booking-price-amount">
                          {formatCurrency(booking.price)}
                        </div>
                      </div>

                      <Button variant="secondary" size="sm">
                        View Details <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
