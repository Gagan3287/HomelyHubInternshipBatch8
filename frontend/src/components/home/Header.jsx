import React from "react";
import Search from "./Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Filter from "./Filter";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/User/user-action";
import toast from "react-hot-toast";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "../../css/AiTripPlanner.css";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const logoutUser = () => {
    dispatch(logout());
    toast.success("User has loggedout successfully");
    navigate("/");
  };

  const refreshFunction = () => {
    dispatch(propertyAction.updateSearchParams({}));
    dispatch(getAllProperties());
  };

  return (
    <>
      <nav className="header row sticky-top ">
        <Link to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            className="logo"
            onClick={refreshFunction}
          />
        </Link>
        {isHomePage && (
          <div className="search_filter">
            <Search />
            <Filter />

            <Link to="/ai-trip-planner" className="ai-trip-link">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Trip Genie</span>
            </Link>
          </div>
        )}

        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun size={20} className="theme-icon sun-icon" />
            ) : (
              <Moon size={20} className="theme-icon moon-icon" />
            )}
          </button>

          {!isAuthenticated && !user && (
            <Link to="/login" className="login-tip">
              <span className="material-symbols-outlined web_logo">
                account_circle
              </span>
              <span className="login-tip-text">You are not logged in. Please login</span>
            </Link>
          )}

          {isAuthenticated && user && (
            <div className="dropdown">
              <span
                className="material-symbols-outlined web_logo dropdown-toggle"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.avatar.url && (
                  <img
                    src={user.avatar.url}
                    className="user-img"
                    alt="icon"
                  />
                )}
                {!user.avatar.url && "account_circle"}
              </span>

              <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    My Account
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={logoutUser}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
export default Header;
