import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../css/ProgressSteps.css";

const ProgressSteps = () => {
  const location = useLocation();

  const steps = [
    { path: "/profile", label: "My Profile" },
    { path: "/user/mybookings", label: "My Bookings" },
    { path: "/accomodation", label: "My Accommodations" },
  ];

  return (
    <nav className="progress-steps-nav" aria-label="Account navigation steps">
      <ol className="progress-steps-list">
        {steps.map((step) => {
          const isActive = location.pathname === step.path;
          return (
            <li key={step.path} className="progress-step-item">
              <NavLink
                to={step.path}
                className={`progress-step-link ${isActive ? "active" : ""}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="step-label">{step.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressSteps;
