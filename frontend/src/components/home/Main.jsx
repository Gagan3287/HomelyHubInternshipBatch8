import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import HeroSection from "./HeroSection";

const Main = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Focus main content or first h1 on route navigation for screen readers
    const mainHeading = document.querySelector("h1") || document.getElementById("main-content");
    if (mainHeading) {
      mainHeading.setAttribute("tabindex", "-1");
      mainHeading.focus();
    }
  }, [location.pathname]);

  return (
    <div className="hh-app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      {isHomePage && <HeroSection />}
      <main className="hh-main-content" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
