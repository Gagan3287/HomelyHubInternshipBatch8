import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Sun,
  Sunset,
  Moon,
  Clock,
  Info,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  Palmtree,
  Utensils,
  PartyPopper,
  Trees,
  Mountain,
  ShoppingBag,
  Landmark,
  Smile,
} from "lucide-react";

import { getTripPlan } from "../../ai/tripPlanner";
import PropertyCard from "../home/PropertyCard";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import formatCurrency from "../../utils/formatCurrency";
import "../../css/AiTripPlanner.css";

const INTEREST_OPTIONS = [
  { name: "Beach", icon: Palmtree },
  { name: "Food", icon: Utensils },
  { name: "Nightlife", icon: PartyPopper },
  { name: "Nature", icon: Trees },
  { name: "Adventure", icon: Mountain },
  { name: "Shopping", icon: ShoppingBag },
  { name: "History", icon: Landmark },
  { name: "Relaxation", icon: Smile },
];

/**
 * Pure helper function to parse activity strings into time slots (Morning, Afternoon, Evening, Night)
 * or fall back safely to a plain array if the pattern is absent or non-standard.
 */
const parseActivities = (activities = []) => {
  if (!Array.isArray(activities) || activities.length === 0) {
    return { isGrouped: false, slots: [], rawList: [] };
  }

  const slots = [
    { label: "Morning", icon: Sun, items: [] },
    { label: "Afternoon", icon: Clock, items: [] },
    { label: "Evening", icon: Sunset, items: [] },
    { label: "Night", icon: Moon, items: [] },
    { label: "Other", icon: Sparkles, items: [] },
  ];

  let hasMatchedTimePattern = false;

  activities.forEach((act) => {
    if (typeof act !== "string") return;
    const match = act.match(/^(Morning|Afternoon|Evening|Night)\s*:\s*(.*)/i);
    if (match) {
      hasMatchedTimePattern = true;
      const slotName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      const targetSlot = slots.find((s) => s.label === slotName);
      if (targetSlot) {
        targetSlot.items.push(match[2].trim() || act);
      } else {
        slots.find((s) => s.label === "Other").items.push(act);
      }
    } else {
      slots.find((s) => s.label === "Other").items.push(act);
    }
  });

  const activeSlots = slots.filter((s) => s.items.length > 0);

  if (hasMatchedTimePattern && activeSlots.length > 0) {
    return { isGrouped: true, slots: activeSlots, rawList: activities };
  }

  return { isGrouped: false, slots: [], rawList: activities };
};

const AiTripPlanner = () => {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [people, setPeople] = useState("");
  const [interests, setInterests] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [result, setResult] = useState(null);

  const toggleInterest = (interestName) => {
    if (interests.includes(interestName)) {
      setInterests(interests.filter((item) => item !== interestName));
    } else {
      setInterests([...interests, interestName]);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!destination || !destination.trim()) {
      errors.destination = "Destination is required";
    }

    const budgetNum = Number(budget);
    if (!budget || isNaN(budgetNum) || budgetNum <= 0) {
      errors.budget = "Please enter a valid budget (> 0)";
    }

    const daysNum = Number(days);
    if (!days || isNaN(daysNum) || daysNum <= 0) {
      errors.days = "Please enter a valid number of days (> 0)";
    }

    const peopleNum = Number(people);
    if (!people || isNaN(peopleNum) || peopleNum <= 0) {
      errors.people = "Please enter number of guests (> 0)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the form errors before submitting");
      return;
    }

    setLoading(true);
    setApiError(null);
    setResult(null);

    try {
      const data = await getTripPlan({
        destination: destination.trim(),
        budget: Number(budget),
        days: Number(days),
        people: Number(people),
        interests,
      });
      setResult(data);
      toast.success("Your trip plan is ready!");
    } catch (error) {
      setApiError("Could not create a trip plan. Please check your connection or try again.");
      toast.error("Could not create a trip plan, please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-page">
      {/* Hero Header */}
      <header className="trip-hero">
        <span className="auth-badge" style={{ margin: "0 auto 0.75rem auto" }}>
          <Sparkles size={14} /> AI Travel Companion
        </span>
        <h1>Trip Genie</h1>
        <p>
          Tell us where you’re going, and Trip Genie will create a personalized
          day-by-day plan with HomelyHub stays that fit your budget.
        </p>
      </header>

      {/* Form Container */}
      <form className="trip-form" onSubmit={handleGenerate} noValidate>
        <div className="trip-fields">
          <Input
            id="trip_destination"
            type="text"
            label="Destination"
            placeholder="e.g. Goa, Manali, Jaipur"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (formErrors.destination) setFormErrors({ ...formErrors, destination: null });
            }}
            error={formErrors.destination}
            required
          />

          <Input
            id="trip_budget"
            type="number"
            label="Total Budget (₹)"
            placeholder="e.g. 15000"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              if (formErrors.budget) setFormErrors({ ...formErrors, budget: null });
            }}
            error={formErrors.budget}
            required
          />

          <Input
            id="trip_days"
            type="number"
            label="Days"
            placeholder="e.g. 3"
            value={days}
            onChange={(e) => {
              setDays(e.target.value);
              if (formErrors.days) setFormErrors({ ...formErrors, days: null });
            }}
            error={formErrors.days}
            required
          />

          <Input
            id="trip_people"
            type="number"
            label="People"
            placeholder="e.g. 2"
            value={people}
            onChange={(e) => {
              setPeople(e.target.value);
              if (formErrors.people) setFormErrors({ ...formErrors, people: null });
            }}
            error={formErrors.people}
            required
          />
        </div>

        {/* Interests Selection */}
        <div className="trip-interests">
          <label className="hh-label" style={{ marginBottom: "0.5rem", display: "block" }}>
            Interests & Preferences (Optional)
          </label>
          <div className="trip-chips" role="group" aria-label="Trip interest choices">
            {INTEREST_OPTIONS.map((interest) => {
              const Icon = interest.icon;
              const picked = interests.includes(interest.name);
              return (
                <button
                  type="button"
                  key={interest.name}
                  className={`trip-chip ${picked ? "trip-chip-on" : ""}`}
                  onClick={() => toggleInterest(interest.name)}
                  aria-pressed={picked}
                >
                  <Icon size={14} />
                  <span>{interest.name}</span>
                  {picked && <Check size={13} style={{ marginLeft: "2px" }} />}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="trip-generate-btn"
          isLoading={loading}
          isDisabled={loading}
          style={{ width: "100%", marginTop: "1.75rem", height: "3rem" }}
        >
          <Sparkles size={18} />
          {loading ? "Planning your trip..." : "Generate Trip Plan"}
        </Button>
      </form>

      {/* Loading Structured Skeleton */}
      {loading && (
        <div className="trip-loading-skeleton" aria-label="Generating itinerary plan">
          <div className="trip-loading-notice">
            <Sparkles size={20} className="spinning-sparkle" />
            <span>Our AI is putting your itinerary together. This usually takes 5 to 10 seconds...</span>
          </div>

          <div className="trip-result">
            <div className="trip-summary">
              <Skeleton variant="heading" width="50%" height="1.75rem" />
              <Skeleton variant="text" width="90%" height="1rem" style={{ marginTop: "0.5rem" }} />
              <Skeleton variant="text" width="70%" height="1rem" />
            </div>

            <div className="trip-days">
              {[1, 2, 3].map((num) => (
                <div key={num} className="trip-day">
                  <Skeleton variant="text" width="70px" height="1.25rem" style={{ borderRadius: "1rem" }} />
                  <Skeleton variant="heading" width="60%" height="1.3rem" style={{ margin: "0.75rem 0" }} />
                  <Skeleton variant="text" width="100%" height="0.9rem" />
                  <Skeleton variant="text" width="90%" height="0.9rem" />
                  <Skeleton variant="text" width="80%" height="0.9rem" />
                </div>
              ))}
            </div>

            <div className="trip-stays" style={{ marginTop: "2rem" }}>
              <Skeleton variant="heading" width="40%" height="1.5rem" />
              <Skeleton variant="text" width="30%" height="1rem" style={{ marginBottom: "1.5rem" }} />
              <div className="hh-property-grid">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="hh-card" style={{ height: "320px" }}>
                    <Skeleton variant="image" width="100%" height="180px" />
                    <Skeleton variant="heading" width="70%" height="1.2rem" style={{ marginTop: "1rem" }} />
                    <Skeleton variant="text" width="50%" height="1rem" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Failure / Error State */}
      {apiError && !loading && (
        <div className="account-empty-card" style={{ marginTop: "2.5rem" }}>
          <div className="empty-icon-box" style={{ backgroundColor: "var(--color-error-bg)", color: "var(--color-error)" }}>
            <AlertCircle size={36} />
          </div>
          <h2 className="account-title" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Trip Planning Failed
          </h2>
          <p className="account-subtitle" style={{ maxWidth: "440px", marginBottom: "2rem" }}>
            {apiError}
          </p>
          <Button variant="primary" onClick={handleGenerate}>
            <RefreshCw size={16} /> Try Again
          </Button>
        </div>
      )}

      {/* Result Display */}
      {result && result.plan && !loading && (
        <section className="trip-result">
          {/* Summary Banner */}
          <div className="trip-summary">
            <h2>
              Your {days}-day trip to {destination}
            </h2>
            <p>{result.plan.summary || "Here is your custom travel itinerary tailored to your preferences."}</p>
          </div>

          {/* Timeline Days */}
          {Array.isArray(result.plan.days) && result.plan.days.length > 0 && (
            <div className="trip-days">
              {result.plan.days.map((dayItem) => {
                const dayNum = dayItem?.day || 1;
                const dayTitle = dayItem?.title || `Day ${dayNum} Exploration`;
                const rawActivities = Array.isArray(dayItem?.activities) ? dayItem.activities : [];

                const { isGrouped, slots, rawList } = parseActivities(rawActivities);

                return (
                  <article className="trip-day" key={dayNum}>
                    <span className="trip-day-number">Day {dayNum}</span>
                    <h3>{dayTitle}</h3>

                    {isGrouped ? (
                      <div className="trip-grouped-activities">
                        {slots.map((slot) => {
                          const SlotIcon = slot.icon;
                          return (
                            <div key={slot.label} className="trip-slot-block">
                              <div className="trip-slot-header">
                                <SlotIcon size={14} className="trip-slot-icon" />
                                <span>{slot.label}</span>
                              </div>
                              <ul className="trip-activity-list">
                                {slot.items.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <ul className="trip-activity-list">
                        {rawList.map((act, idx) => (
                          <li key={idx}>{typeof act === "string" ? act : String(act)}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Good to Know Tips Callout */}
          {Array.isArray(result.plan.tips) && result.plan.tips.length > 0 && (
            <div className="trip-tips">
              <div className="trip-tips-header">
                <Info size={18} style={{ color: "var(--color-brand)" }} />
                <h3>Good to know</h3>
              </div>
              <ul>
                {result.plan.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Stays Section (Must remain visible even if properties list is empty) */}
          <div className="trip-stays">
            <div className="trip-stays-header">
              <h3>Stays for you in {destination}</h3>
              {result.perNight ? (
                <p className="trip-stays-note">
                  Within your estimated nightly budget of {formatCurrency(Math.round(result.perNight))} per night
                </p>
              ) : null}
            </div>

            {/* Empty Stays Case */}
            {(!result.properties || result.properties.length === 0) ? (
              <div className="trip-empty-stays-box">
                <Search size={24} style={{ color: "var(--color-warning)", marginBottom: "0.5rem" }} />
                <h4>No stays match this budget</h4>
                <p>
                  We don't have stay accommodations in {destination} within your estimated nightly budget of{" "}
                  <strong>{formatCurrency(Math.round(result.perNight || 0))}</strong> yet. Try increasing your total budget or reducing the trip duration.
                </p>
              </div>
            ) : (
              <div className="hh-property-grid" style={{ marginTop: "1.25rem" }}>
                {result.properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AiTripPlanner;
