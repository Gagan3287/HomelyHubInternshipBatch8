import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { setPaymentDetails } from "../../store/Payment/payment-slice";
import { formatPrice } from "../../utils/formatCurrency";

/**
 * PaymentForm — booking card (Phase 3 redesign)
 *
 * ALL original Redux logic, validation, availability-check, and
 * unauthenticated-user behaviour are preserved exactly.
 * Only the markup and CSS classes are updated.
 *
 * Price displayed: formatPrice() = "₹3,600" (Indian format)
 * Breakdown: ₹X × N nights = ₹Total
 */
const PaymentForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings,
}) => {
  const [calculatedPrice, setCalulatedPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const { isAuthenticated } = useSelector((state) => state.user);

  /* ── Date disabled logic (unchanged) ── */
  const isDateDisabled = (current) => {
    const today = moment().startOf("day");
    if (current.isBefore(today)) {
      return true;
    }
    if (!currentBookings) return false;
    return currentBookings.some((booking) => {
      const startDate = moment(booking.fromDate).startOf("day");
      const endDate = moment(booking.toDate).startOf("day");
      const currentMoment = moment(current.toDate()).startOf("day");
      return (
        currentMoment.isSameOrAfter(startDate) &&
        currentMoment.isSameOrBefore(endDate)
      );
    });
  };

  /* ── Form (unchanged logic) ── */
  const form = useForm({
    defaultValues: {
      dateRange: [],
      guests: "",
      name: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      const [checkinDate, checkoutDate] = value.dateRange;
      const nightCount = moment(checkoutDate).diff(moment(checkinDate), "days");
      const { name, guests, phoneNumber } = value;
      if (name && guests && phoneNumber && checkinDate && checkoutDate) {
        setIsSubmitting(true);
        await dispatch(
          setPaymentDetails({
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            nights: nightCount,
            totalPrice: calculatedPrice,
            propertyName,
            address,
            guests: Number(guests),
            name,
            phoneNumber,
          })
        );
        navigate(`/payment/${propertyId}`);
        setIsSubmitting(false);
      } else {
        alert("Please fill all fields correctly before proceeding.");
      }
    },
  });

  const priceFormatted = formatPrice(price);
  const totalFormatted = formatPrice(calculatedPrice);

  return (
    <div className="pd-booking-card" id="pd-booking-card">
      {/* Price header */}
      <div className="pd-booking-price-row">
        <span className="pd-booking-price-amount">{priceFormatted}</span>
        <span className="pd-booking-price-period"> / night</span>
      </div>

      <form
        className="pd-booking-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        noValidate
      >
        {/* ── Date range picker ── */}
        <form.Field name="dateRange">
          {(field) => (
            <div className="pd-field-group">
              <label className="pd-field-label" id="label-dates">
                Dates
              </label>
              <div className="pd-datepicker-wrap">
                <Space direction="vertical" size={0} style={{ width: "100%" }}>
                  <RangePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    disabledDate={isDateDisabled}
                    className="pd-antd-rangepicker"
                    placeholder={["Check-in", "Check-out"]}
                    aria-labelledby="label-dates"
                    onChange={(value, dateString) => {
                      field.handleChange(dateString);
                      const [checkin, checkout] = dateString;
                      if (checkin && checkout) {
                        const n = moment(checkout, "YYYY-MM-DD").diff(
                          moment(checkin, "YYYY-MM-DD"),
                          "days"
                        );
                        setNights(n);
                        setCalulatedPrice(price * n);
                      } else {
                        setNights(0);
                        setCalulatedPrice(0);
                      }
                    }}
                  />
                </Space>
              </div>
            </div>
          )}
        </form.Field>

        {/* ── Guests ── */}
        <form.Field
          name="guests"
          validators={{
            onChange: ({ value }) =>
              value > 0 && value <= maximumGuest
                ? undefined
                : `Guests must be 1–${maximumGuest}`,
          }}
        >
          {(field) => (
            <div className="pd-field-group">
              <label className="pd-field-label" htmlFor="pd-guests">
                Guests
              </label>
              <input
                id="pd-guests"
                type="number"
                className="hh-input pd-number-input"
                placeholder={`1–${maximumGuest}`}
                min={1}
                max={maximumGuest}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-describedby={
                  field.state.meta.errors?.length ? "pd-guests-error" : undefined
                }
              />
              {field.state.meta.errors?.length > 0 && (
                <p id="pd-guests-error" className="hh-error-msg">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* ── Name ── */}
        <form.Field name="name">
          {(field) => (
            <div className="pd-field-group">
              <label className="pd-field-label" htmlFor="pd-name">
                Full name
              </label>
              <input
                id="pd-name"
                type="text"
                className="hh-input"
                placeholder="Your name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
        </form.Field>

        {/* ── Phone ── */}
        <form.Field name="phoneNumber">
          {(field) => (
            <div className="pd-field-group">
              <label className="pd-field-label" htmlFor="pd-phone">
                Phone number
              </label>
              <input
                id="pd-phone"
                type="tel"
                className="hh-input"
                placeholder="10-digit number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="tel"
              />
            </div>
          )}
        </form.Field>

        {/* ── Price breakdown ── */}
        {nights > 0 && (
          <div className="pd-price-breakdown" aria-live="polite">
            <div className="pd-breakdown-row">
              <span>
                {priceFormatted} × {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span>{totalFormatted}</span>
            </div>
            <div className="pd-breakdown-divider" />
            <div className="pd-breakdown-row pd-breakdown-total">
              <span>Total</span>
              <span>{totalFormatted}</span>
            </div>
          </div>
        )}

        {/* ── Reserve / Login button ── */}
        <div className="pd-booking-actions">
          {!isAuthenticated ? (
            <button
              type="button"
              className="btn-hh btn-primary pd-reserve-btn"
              onClick={() => navigate("/login")}
            >
              Login to Reserve
            </button>
          ) : (
            <button
              type="submit"
              className={`btn-hh btn-primary pd-reserve-btn${isSubmitting ? " btn-loading" : ""}`}
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? "" : "Reserve"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
