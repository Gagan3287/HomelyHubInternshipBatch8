import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Home, RefreshCw, Sparkles } from "lucide-react";

import ProgressSteps from "../ProgressSteps";
import MyAccomodation from "./MyAccomodation";
import { getAllAccomodation } from "../../store/Accomodation/Accomodation-action";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

const Accomodation = () => {
  const dispatch = useDispatch();
  const { accomodation, loading } = useSelector((state) => state.accomodation);

  useEffect(() => {
    dispatch(getAllAccomodation());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(getAllAccomodation());
  };

  return (
    <div className="account-page-wrapper">
      <div className="account-container">
        <ProgressSteps />

        <div className="account-header" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 className="account-title">My Accommodations</h1>
          <p className="account-subtitle" style={{ marginBottom: "1.5rem" }}>
            Manage your listed stay properties and add new host places
          </p>

          <Link to="/accomodationform" style={{ textDecoration: "none" }}>
            <Button variant="primary">
              <Plus size={18} /> Add new place
            </Button>
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="bookings-list" style={{ marginTop: "2rem" }} aria-label="Loading accommodations">
            {[1, 2].map((i) => (
              <div key={i} className="booking-card" style={{ cursor: "default" }}>
                <div className="booking-card-image-wrap">
                  <Skeleton variant="image" width="100%" height="100%" />
                </div>
                <div className="booking-card-content">
                  <div>
                    <Skeleton variant="heading" width="50%" height="1.5rem" />
                    <Skeleton variant="text" width="40%" height="1rem" />
                  </div>
                  <div>
                    <Skeleton variant="text" width="60%" height="1rem" />
                    <Skeleton variant="text" width="30%" height="1.25rem" style={{ marginTop: "0.5rem" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error / Failed State */}
        {!loading && !accomodation && (
          <div className="account-empty-card" style={{ marginTop: "2rem" }}>
            <div className="empty-icon-box" style={{ backgroundColor: "var(--color-error-bg)", color: "var(--color-error)" }}>
              <Home size={36} />
            </div>
            <h2 className="account-title" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Unable to load accommodations
            </h2>
            <p className="account-subtitle" style={{ maxWidth: "420px", marginBottom: "2rem" }}>
              There was a problem retrieving your property listings. Please try again.
            </p>
            <Button variant="primary" onClick={handleRetry}>
              <RefreshCw size={16} /> Retry Loading
            </Button>
          </div>
        )}

        {/* Designed Empty State */}
        {!loading && accomodation && accomodation.length === 0 && (
          <div className="account-empty-card" style={{ marginTop: "2rem" }}>
            <div className="empty-icon-box">
              <Home size={36} />
            </div>
            <h2 className="account-title" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              You haven't listed a place yet
            </h2>
            <p className="account-subtitle" style={{ maxWidth: "440px", marginBottom: "2rem" }}>
              Share your home, cottage, apartment, or guest house with travelers on HomelyHub and start hosting guests.
            </p>
            <Link to="/accomodationform" style={{ textDecoration: "none" }}>
              <Button variant="primary">
                <Plus size={18} /> Add new place
              </Button>
            </Link>
          </div>
        )}

        {/* Accommodations List */}
        {!loading && accomodation && accomodation.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <MyAccomodation accomodation={accomodation} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Accomodation;
