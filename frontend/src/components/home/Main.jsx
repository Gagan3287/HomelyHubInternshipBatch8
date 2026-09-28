import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import HeroSection from "./HeroSection";

const Main = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="hh-app-shell">
      <Header />
      {isHomePage && <HeroSection />}
      <main className="hh-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
