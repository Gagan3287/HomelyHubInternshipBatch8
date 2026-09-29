import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home as HomeIcon } from "lucide-react";
import Button from "./ui/Button";

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <div className="auth-icon-wrapper auth-icon-info" style={{ width: "5rem", height: "5rem", marginBottom: "1rem" }}>
          <Compass size={40} />
        </div>
        <div className="notfound-badge-code">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-text">
          Oops! The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="primary" style={{ paddingInline: "2rem" }}>
            <HomeIcon size={18} /> Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
