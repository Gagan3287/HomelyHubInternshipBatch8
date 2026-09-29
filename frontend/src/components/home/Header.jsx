import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/User/user-action";
import toast from "react-hot-toast";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";
import { useTheme } from "../../context/ThemeContext";
import {
  Sun,
  Moon,
  Sparkles,
  Home,
  CalendarCheck,
  Building,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import "../../css/Home.css";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutUser = () => {
    setUserMenuOpen(false);
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
    setMobileMenuOpen(false);
  };

  const refreshFunction = () => {
    dispatch(propertyAction.updateSearchParams({}));
    dispatch(getAllProperties());
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Trip Genie", path: "/ai-trip-planner", icon: Sparkles, badge: "AI" },
    { label: "My Bookings", path: "/user/mybookings", icon: CalendarCheck, requiresAuth: true },
    { label: "Accommodations", path: "/accomodation", icon: Building, requiresAuth: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  return (
    <header className="hh-header">
      <div className="hh-header-container">
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="hh-brand" onClick={refreshFunction}>
          <img src="/assets/logo.png" alt="HomelyHub Logo" className="hh-logo-img" />
          <span className="hh-brand-name">HomelyHub</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hh-nav-desktop" aria-label="Main Navigation">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`hh-nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={17} className="hh-nav-icon" />
                <span>{item.label}</span>
                {item.badge && <span className="hh-nav-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Controls */}
        <div className="hh-header-actions">
          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun size={19} className="theme-icon sun-icon" />
            ) : (
              <Moon size={19} className="theme-icon moon-icon" />
            )}
          </button>

          {/* User Auth Section */}
          {!isAuthenticated && !user ? (
            <Link to="/login" className="hh-btn-login">
              <User size={18} />
              <span>Log In</span>
            </Link>
          ) : (
            <div className="hh-user-dropdown" ref={dropdownRef}>
              <button
                className="hh-user-menu-btn"
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-expanded={userMenuOpen}
                aria-label="User account menu"
              >
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} className="hh-user-avatar" alt={user.name || "User"} />
                ) : (
                  <div className="hh-user-avatar-placeholder">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="hh-user-name">{user?.name || "Account"}</span>
                <ChevronDown size={14} className="hh-user-chevron" />
              </button>

              {userMenuOpen && (
                <ul className="hh-dropdown-menu show">
                  <li>
                    <Link
                      className="hh-dropdown-item"
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>My Account</span>
                    </Link>
                  </li>
                  <li><hr className="hh-dropdown-divider" /></li>
                  <li>
                    <button
                      className="hh-dropdown-item text-danger"
                      type="button"
                      onClick={logoutUser}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="hh-mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="hh-mobile-drawer">
          <nav className="hh-mobile-nav">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hh-mobile-nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="hh-mobile-nav-link hh-mobile-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>Log In / Register</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
