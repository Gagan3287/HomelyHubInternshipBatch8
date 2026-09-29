import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Home, MapPin, Image, Tag, CheckSquare, FileText, Clock, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

import ImagesUploading from "./ImagesUploading";
import { getAiDescription } from "../../ai/aiDescription";
import { AddressField } from "./AddressField";
import AmenitiesField from "./AmenitiesField";
import { createAccomodation, getAllAccomodation } from "../../store/Accomodation/Accomodation-action";
import Input from "../ui/Input";
import Button from "../ui/Button";

// ── Section wrapper
const Section = ({ icon: Icon, title, subtitle, children }) => (
  <section className="accf-card">
    <div className="accf-sec">
      <Icon size={20} style={{ color: "var(--color-brand)" }} />
      <div>
        <h2>{title}</h2>
        {subtitle && <span className="accf-hint">{subtitle}</span>}
      </div>
    </div>
    {children}
  </section>
);

const AccomodationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.accomodation);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      propertyType: undefined,
      roomType: undefined,
      extraInfo: undefined,
      images: [],
      amenities: [],
      address: { area: "", city: "", state: "", pincode: "" },
      checkIn: undefined,
      checkOut: undefined,
      maximumGuest: 0,
      price: "",
    },
    onSubmit: async ({ value }) => {
      // Basic validation
      const errors = {};
      if (!value.name?.trim()) errors.name = "Property name is required";
      if (!value.price || Number(value.price) <= 0) errors.price = "Price per night must be greater than 0";
      if (!value.address?.city?.trim()) errors.city = "City is required";
      if (!value.maximumGuest || Number(value.maximumGuest) <= 0) errors.maximumGuest = "At least 1 guest must be allowed";

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error("Please fix the errors in the form before submitting");
        return;
      }

      try {
        await dispatch(
          createAccomodation({
            propertyName: value.name,
            description: value.description,
            propertyType: value.propertyType,
            roomType: value.roomType,
            extraInfo: value.extraInfo,
            images: value.images,
            address: value.address,
            amenities: value.amenities,
            checkInTime: value.checkIn,
            checkOutTime: value.checkOut,
            maximumGuest: value.maximumGuest,
            price: value.price,
          })
        );

        await dispatch(getAllAccomodation());
        toast.success("New Property Created Successfully");
        navigate("/accomodation");
      } catch (error) {
        toast.error(
          error.response?.data?.message || error.message || "Failed to create listing"
        );
        console.error(error);
      }
    },
  });

  const handleAiDescription = async (field) => {
    const values = form.state.values;

    if (!values.name) {
      toast.error("Please add a property title first so the AI has context");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    try {
      const description = await getAiDescription(values);
      field.handleChange(description);
      toast.success("AI description generated! You can edit it below.");
    } catch (error) {
      setAiError("Could not generate a description. Please try again or write one manually.");
      toast.error("Could not generate a description");
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="accf-page">
      <header className="accf-hero">
        <span className="auth-badge" style={{ margin: "0 auto 0.75rem auto" }}>
          <Home size={14} /> List your place
        </span>
        <h1>Create your listing</h1>
        <p>Fill in the sections below to share your property with HomelyHub travellers.</p>
      </header>

      <form
        className="accf-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* ── SECTION 1: BASICS ── */}
        <Section icon={Tag} title="Basics" subtitle="Give your property a clear, descriptive title">
          <form.Field name="name">
            {(field) => (
              <Input
                id="property_name"
                type="text"
                label="Property Name / Title"
                placeholder="e.g. Sunny beach cottage near Anjuna"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                }}
                error={formErrors.name}
                required
              />
            )}
          </form.Field>

          <div className="accf-grid-2" style={{ marginTop: "1rem" }}>
            <div className="accf-field">
              <label className="hh-label">Property Type</label>
              <form.Field name="propertyType">
                {(field) => (
                  <select
                    className="accf-input"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>Select type</option>
                    <option value="House">House</option>
                    <option value="Flat">Flat</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Hotel">Hotel</option>
                  </select>
                )}
              </form.Field>
            </div>

            <div className="accf-field">
              <label className="hh-label">Room Type</label>
              <form.Field name="roomType">
                {(field) => (
                  <select
                    className="accf-input"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>Select room type</option>
                    <option value="Anytype">Any type</option>
                    <option value="Entire Home">Entire Home</option>
                    <option value="Room">Room</option>
                  </select>
                )}
              </form.Field>
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: LOCATION ── */}
        <Section icon={MapPin} title="Location" subtitle="Help guests find your place">
          <AddressField form={form} />
        </Section>

        {/* ── SECTION 3: PHOTOS ── */}
        <Section icon={Image} title="Photos" subtitle="Add at least 3 photos — more photos attract more guests">
          <form.Field name="images">
            {(field) => <ImagesUploading field={field} />}
          </form.Field>
        </Section>

        {/* ── SECTION 4: AMENITIES ── */}
        <Section icon={CheckSquare} title="Amenities" subtitle="Select what you offer to guests">
          <AmenitiesField form={form} />
        </Section>

        {/* ── SECTION 5: STAY DETAILS ── */}
        <Section icon={Clock} title="Stay Details" subtitle="Availability and pricing information">
          <div className="accf-grid-4">
            <div className="accf-field">
              <label className="hh-label">Check-in Time</label>
              <form.Field name="checkIn">
                {(field) => (
                  <input
                    className="accf-input"
                    type="time"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <div className="accf-field">
              <label className="hh-label">Check-out Time</label>
              <form.Field name="checkOut">
                {(field) => (
                  <input
                    className="accf-input"
                    type="time"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="maximumGuest">
              {(field) => (
                <Input
                  id="max_guest"
                  type="number"
                  label="Max Guests"
                  placeholder="2"
                  value={field.state.value || ""}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (formErrors.maximumGuest) setFormErrors({ ...formErrors, maximumGuest: null });
                  }}
                  error={formErrors.maximumGuest}
                  required
                />
              )}
            </form.Field>

            <form.Field name="price">
              {(field) => (
                <div className="accf-field">
                  <label className="hh-label" htmlFor="price_field">Price per Night (₹)</label>
                  <div className="accf-price-input-wrap">
                    <span className="accf-price-prefix">₹</span>
                    <input
                      id="price_field"
                      className="accf-input accf-price-input"
                      type="number"
                      placeholder="2000"
                      value={field.state.value || ""}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        if (formErrors.price) setFormErrors({ ...formErrors, price: null });
                      }}
                      required
                    />
                  </div>
                  {formErrors.price && <span className="hh-error-msg">{formErrors.price}</span>}
                </div>
              )}
            </form.Field>
          </div>
        </Section>

        {/* ── SECTION 6: DESCRIPTION ── */}
        <Section icon={FileText} title="Description" subtitle="Tell guests what makes your place special">
          <form.Field name="description">
            {(field) => (
              <>
                <div className="accf-desc-row">
                  <p className="accf-hint" style={{ margin: 0 }}>
                    Write your own, or let AI draft it based on the details you've entered above.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    isLoading={aiLoading}
                    isDisabled={aiLoading}
                    onClick={() => handleAiDescription(field)}
                  >
                    <Sparkles size={15} />
                    {aiLoading ? "Writing..." : "Write with AI"}
                  </Button>
                </div>

                {/* AI error with retry */}
                {aiError && (
                  <div className="accf-upload-error" style={{ marginTop: "0.5rem" }}>
                    <AlertCircle size={14} />
                    <span>{aiError}</span>
                    <button
                      type="button"
                      onClick={() => handleAiDescription(field)}
                      className="accf-error-retry"
                    >
                      <RefreshCw size={12} /> Retry
                    </button>
                  </div>
                )}

                <textarea
                  id="description_field"
                  className="accf-input accf-textarea"
                  rows="6"
                  placeholder="Describe your property — location highlights, unique features, what guests can expect..."
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ marginTop: "0.75rem" }}
                />
              </>
            )}
          </form.Field>

          {/* House Rules */}
          <div style={{ marginTop: "1.25rem" }}>
            <label className="hh-label" style={{ display: "block", marginBottom: "0.35rem" }}>
              House Rules <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>(Optional)</span>
            </label>
            <form.Field name="extraInfo">
              {(field) => (
                <textarea
                  id="extrainfo_field"
                  className="accf-input accf-textarea"
                  rows="3"
                  placeholder="e.g. Check-in after 1 PM, no smoking, no pets..."
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>
        </Section>

        {/* ── SUBMIT ── */}
        <Button
          type="submit"
          variant="primary"
          style={{ width: "100%", height: "3.25rem", fontSize: "1rem" }}
          isLoading={loading}
          isDisabled={loading}
        >
          {loading ? "Publishing listing..." : "Publish Listing"}
        </Button>
      </form>
    </div>
  );
};

export default AccomodationForm;
