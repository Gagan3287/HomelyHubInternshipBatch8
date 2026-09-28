import React from "react";
import Search from "./Search";
import CategoryChips from "./CategoryChips";
import { Sparkles } from "lucide-react";
import "../../css/Home.css";

const HeroSection = () => {
  return (
    <section className="hh-hero-section" aria-label="Hero Discovery">
      <div className="hh-hero-container">
        {/* Left Column: Hero Content & Search */}
        <div className="hh-hero-content">
          <div className="hh-hero-badge">
            <Sparkles size={14} className="hh-badge-sparkle" />
            <span>AI-POWERED STAY DISCOVERY</span>
          </div>

          <h1 className="hh-hero-title">
            Find a place that <span className="hh-title-highlight">feels like home.</span>
          </h1>

          <p className="hh-hero-subtitle">
            Browse quality stays, unique apartments, and cosy villas across India for your next journey.
          </p>

          {/* Integrated Search Bar */}
          <div className="hh-hero-search-wrapper">
            <Search />
          </div>

          {/* Category Chips Bar */}
          <div className="hh-hero-categories-wrapper">
            <CategoryChips />
          </div>
        </div>

        {/* Right Column: Split Hero Showcase Image */}
        <div className="hh-hero-media">
          <div className="hh-hero-image-card">
            <img
              src="/assets/property2.webp"
              alt="Featured accommodation"
              className="hh-hero-img"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
