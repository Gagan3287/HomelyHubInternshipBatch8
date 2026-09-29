import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Calendar,
  Users,
  MapPin,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building,
  HelpCircle,
} from "lucide-react";

import ProgressSteps from "../ProgressSteps";
import { Skeleton } from "../ui/Skeleton";
import { formatPrice } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  initiateCheckoutSession,
  verifyPayment,
} from "../../store/Payment/payment-action";
import {
  selectPaymentDetails,
  selectPaymentStatus,
  paymentActions,
} from "../../store/Payment/payment-slice";
import { getPropertyDetails } from "../../store/PropertyDetails/propertyDetails-action";

import "../../css/Payment.css";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const {
    checkinDate,
    checkoutDate,
    totalPrice,
    propertyName,
    address,
    guests,
    nights,
    name,
    phoneNumber,
  } = useSelector(selectPaymentDetails);

  const { loading, error, orderData } = useSelector(selectPaymentStatus);

  const { propertydetails, loading: propLoading } = useSelector(
    (state) => state.propertydetails || {}
  );

  // Ensure property details (images, location) are loaded if missing or ID changed
  useEffect(() => {
    if (propertyId && (!propertydetails || propertydetails._id !== propertyId)) {
      dispatch(getPropertyDetails(propertyId));
    }
  }, [dispatch, propertyId, propertydetails]);

  // Original booking initiation handler
  const handleBooking = async () => {
    const paymentData = {
      amount: totalPrice,
      propertyId,
      fromDate: checkinDate,
      toDate: checkoutDate,
      guests,
    };
    try {
      await dispatch(initiateCheckoutSession(paymentData));
    } catch {
      toast.error("Payment initiation failed");
    }
  };

  // Original payment verification/confirmation handler
  const handleConfirmPayment = async () => {
    try {
      await dispatch(
        verifyPayment({
          orderId: orderData?.orderId,
          bookingDetails: {
            propertyId,
            fromDate: checkinDate,
            toDate: checkoutDate,
            guests,
            price: totalPrice,
          },
          forceStatus: "success",
        })
      );

      toast.success("🎉 Payment Successful! Booking Confirmed!");
      setTimeout(() => navigate("/user/mybookings"), 1000);
      dispatch(paymentActions.resetPayment());
    } catch {
      toast.error("Payment failed!");
    }
  };

  // Original payment cancellation handler
  const handleCancelPayment = () => {
    toast.error("Payment Cancelled");
    navigate(`/propertylist/${propertyId}`);
  };

  // Derived property info with fallbacks
  const displayTitle = propertyName || propertydetails?.propertyName || "HomelyHub Stay";
  const displayAddress =
    address ||
    (propertydetails?.address
      ? `${propertydetails.address.address || ""}, ${propertydetails.address.city || ""}`
      : "Location provided upon confirmation");
  const imageUrl =
    propertydetails?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  const nightlyRate = nights && totalPrice ? Math.round(totalPrice / nights) : 0;

  // Empty state if accessed directly without date/price selection
  if (!checkinDate || !totalPrice) {
    return (
      <div className="payment-page-container">
        <ProgressSteps />
        <div className="payment-empty-state">
          <div className="empty-icon-wrapper">
            <AlertCircle size={40} className="text-muted" />
          </div>
          <h2>No active reservation selected</h2>
          <p>
            Please select your check-in dates and guest count on the property
            details page before proceeding to demo checkout.
          </p>
          <Link to={`/propertylist/${propertyId}`} className="btn-return">
            <ArrowLeft size={18} />
            Return to Property Listing
          </Link>
        </div>
      </div>
    );
  }

  // Full-page skeleton while property details are fetching
  if (propLoading && !propertydetails) {
    return (
      <div className="payment-page-container">
        <ProgressSteps />
        <div className="payment-skeleton-grid">
          <div className="skeleton-left">
            <Skeleton height="3rem" width="60%" className="mb-4" />
            <Skeleton height="12rem" className="mb-4" />
            <Skeleton height="10rem" />
          </div>
          <div className="skeleton-right">
            <Skeleton height="22rem" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <ProgressSteps />

      <header className="payment-page-header">
        <h1>Demo Checkout</h1>
        <p className="subtitle">
          Review your reservation details and complete your simulated stay booking.
        </p>
      </header>

      {/* Prominent, calm notice banner */}
      <div className="demo-notice-banner" role="status">
        <ShieldCheck size={20} className="notice-icon" />
        <div className="notice-text">
          <strong>Demo mode · No real charge</strong>
          <span>This is a simulated reservation system. No real money or payment cards are processed.</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="payment-grid-layout">
        
        {/* Mobile Collapsible Booking Summary */}
        <details className="mobile-summary-accordion">
          <summary className="accordion-trigger">
            <span className="accordion-title">
              <Building size={18} />
              Reservation Summary
            </span>
            <span className="accordion-price">{formatPrice(totalPrice)}</span>
          </summary>
          <div className="mobile-summary-body">
            <div className="summary-prop-preview">
              <img src={imageUrl} alt={displayTitle} className="thumb-img" />
              <div>
                <h4>{displayTitle}</h4>
                <p>{displayAddress}</p>
              </div>
            </div>
            <div className="summary-line-item">
              <span>Dates</span>
              <span>{formatDate(checkinDate)} – {formatDate(checkoutDate)}</span>
            </div>
            <div className="summary-line-item">
              <span>Duration</span>
              <span>{nights} night{nights > 1 ? "s" : ""}</span>
            </div>
            <div className="summary-line-item">
              <span>Guests</span>
              <span>{guests} guest{guests > 1 ? "s" : ""}</span>
            </div>
            <div className="summary-line-item total">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </details>

        {/* Left Column: Guest info & Payment interaction */}
        <section className="payment-interaction-column" aria-label="Demo Payment Options">
          
          {/* Guest Information Card */}
          <div className="payment-card">
            <h3 className="card-heading">Guest Information</h3>
            <div className="guest-details-grid">
              <div className="detail-item">
                <span className="label">Primary Guest</span>
                <span className="value">{name || "Registered User"}</span>
              </div>
              {phoneNumber && (
                <div className="detail-item">
                  <span className="label">Phone Number</span>
                  <span className="value">{phoneNumber}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="label">Total Guests</span>
                <span className="value">{guests} Guest{guests > 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Payment Method / Demo Gateway Card */}
          <div className="payment-card">
            <h3 className="card-heading">Demo Payment Method</h3>
            <p className="card-subtext">
              Simulated payment processing powered by HomelyHub test engine.
            </p>

            {/* Error Message Display */}
            {error && (
              <div className="payment-error-alert" role="alert">
                <AlertCircle size={20} />
                <div className="error-content">
                  <strong>Payment Notice</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {orderData ? (
              <div className="order-initiated-box">
                <div className="order-status-header">
                  <CheckCircle2 size={20} className="success-icon" />
                  <div>
                    <span className="order-label">Demo Order Session Active</span>
                    <span className="order-id">Order ID: {orderData.orderId}</span>
                  </div>
                </div>

                <div className="demo-actions-group">
                  <button
                    onClick={handleConfirmPayment}
                    className="btn-confirm-payment"
                    disabled={loading}
                    aria-label="Confirm Demo Payment"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spinner-icon" />
                        <span>Processing Confirmation...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>Confirm Demo Payment ({formatPrice(totalPrice)})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCancelPayment}
                    className="btn-cancel-payment"
                    disabled={loading}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ) : (
              <div className="initiate-box">
                <div className="simulated-badge">
                  <HelpCircle size={16} />
                  <span>Instant Simulated Checkout</span>
                </div>

                <button
                  onClick={handleBooking}
                  className="btn-initiate-payment"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinner-icon" />
                      <span>Initiating Demo Session...</span>
                    </>
                  ) : (
                    `Proceed to Demo Checkout (${formatPrice(totalPrice)})`
                  )}
                </button>

                <button
                  onClick={handleCancelPayment}
                  className="btn-cancel-link"
                  disabled={loading}
                >
                  Cancel and Return
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Sticky Booking Summary */}
        <aside className="payment-summary-column" aria-label="Booking Summary">
          <div className="sticky-booking-card">
            <div className="summary-media">
              <img src={imageUrl} alt={displayTitle} className="summary-img" />
            </div>

            <div className="summary-content">
              <h2 className="summary-title">{displayTitle}</h2>
              <div className="summary-address">
                <MapPin size={15} />
                <span>{displayAddress}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-dates-grid">
                <div className="date-block">
                  <Calendar size={16} className="date-icon" />
                  <div>
                    <span className="date-label">Check-in</span>
                    <span className="date-value">{formatDate(checkinDate)}</span>
                  </div>
                </div>
                <div className="date-block">
                  <Calendar size={16} className="date-icon" />
                  <div>
                    <span className="date-label">Check-out</span>
                    <span className="date-value">{formatDate(checkoutDate)}</span>
                  </div>
                </div>
              </div>

              <div className="summary-meta-row">
                <span><Users size={15} /> {guests} Guest{guests > 1 ? "s" : ""}</span>
                <span>{nights} Night{nights > 1 ? "s" : ""}</span>
              </div>

              <div className="summary-divider" />

              <h3 className="breakdown-heading">Price Details</h3>
              <div className="price-breakdown">
                {nightlyRate > 0 && (
                  <div className="price-row">
                    <span>{formatPrice(nightlyRate)} × {nights} nights</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                )}
                <div className="price-row total-row">
                  <span>Total (INR)</span>
                  <span className="total-amount">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Payment;
