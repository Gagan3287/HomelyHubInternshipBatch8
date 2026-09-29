import React from "react";
import { Link } from "react-router-dom";
import { Globe, Heart } from "lucide-react";
import "../../css/Home.css";

const Footer = () => {
  return (
    <footer className="hh-footer" role="contentinfo">
      <div className="hh-footer-container">
        {/* Brand Column */}
        <div className="hh-footer-brand-col">
          <Link to="/" className="hh-footer-brand">
            <img
              src="/assets/logo.png"
              alt="HomelyHub Logo"
              className="hh-footer-logo"
              width="28"
              height="28"
              loading="lazy"
            />
            <span className="hh-footer-brand-name">HomelyHub</span>
          </Link>
          <p className="hh-footer-tagline">
            Find and book unique stays, vacation rentals, and plan custom travel itineraries with AI.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="hh-footer-links-col">
          <h4 className="hh-footer-heading">Navigation</h4>
          <ul className="hh-footer-links">
            <li><Link to="/">Explore Stays</Link></li>
            <li><Link to="/ai-trip-planner">Trip Genie AI</Link></li>
            <li><Link to="/user/mybookings">My Bookings</Link></li>
            <li><Link to="/accomodation">My Accommodations</Link></li>
          </ul>
        </div>

        {/* Info Column */}
        <div className="hh-footer-info-col">
          <div className="hh-footer-region">
            <Globe size={16} />
            <span>India · INR (₹)</span>
          </div>
        </div>
      </div>

      <div className="hh-footer-bottom">
        <div className="hh-footer-bottom-container">
          <p className="hh-footer-copyright">
            © {new Date().getFullYear()} HomelyHub, Inc. All rights reserved.
          </p>
          <p className="hh-footer-crafted">
            Crafted with <Heart size={13} className="hh-heart-icon" /> for travelers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
