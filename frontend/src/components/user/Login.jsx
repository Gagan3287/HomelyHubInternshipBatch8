import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Sparkles } from "lucide-react";

import { getLogin } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, errors, loading } = useSelector((state) => state.user);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getLogin({ email, password }));
  };

  useEffect(() => {
    if (errors && errors.length > 0) {
      const errorMsg = typeof errors === "string" ? errors : "Login failed. Please check your credentials.";
      toast.error(errorMsg);
      dispatch(userActions.clearErrors());
    } else if (isAuthenticated) {
      navigate("/");
      toast.success("User logged in successfully");
    }
  }, [isAuthenticated, errors, navigate, dispatch]);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-split-grid">
            {/* Form Column */}
            <div className="auth-form-side">
              <div className="auth-header">
                <span className="auth-badge">
                  <Sparkles size={14} /> HomelyHub Account
                </span>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">
                  Sign in to access your saved stay bookings, preferences, and host listings.
                </p>
              </div>

              {loading ? (
                <div className="auth-form" aria-label="Loading login form">
                  <Skeleton variant="text" width="30%" height="1rem" />
                  <Skeleton variant="text" width="100%" height="2.75rem" />
                  <Skeleton variant="text" width="30%" height="1rem" />
                  <Skeleton variant="text" width="100%" height="2.75rem" />
                  <Skeleton variant="text" width="100%" height="2.75rem" style={{ marginTop: "1rem" }} />
                </div>
              ) : (
                <form onSubmit={submitHandler} className="auth-form" noValidate={false}>
                  <Input
                    id="email_field"
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />

                  <div className="auth-password-wrap">
                    <Input
                      id="password_field"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="auth-row-between">
                    <span />
                    <Link to="/user/forgotPassword" className="auth-link">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    id="login_button"
                    type="submit"
                    variant="primary"
                    className="auth-submit-btn"
                    isLoading={loading}
                    isDisabled={loading || !email || !password}
                  >
                    <Lock size={16} /> Sign In
                  </Button>

                  <div className="auth-footer-text">
                    New to HomelyHub?
                    <Link to="/signup" className="auth-link">
                      Create an account
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Brand Image Side (Hidden on Mobile) */}
            <div className="auth-image-side" aria-hidden="true">
              <img
                src="/assets/image1.jpeg"
                alt="Handpicked vacation stay"
                className="auth-image-bg"
              />
              <div className="auth-image-overlay">
                <div className="auth-quote-badge">
                  <Sparkles size={13} /> Verified Vacation Stays
                </div>
                <blockquote className="auth-quote-text">
                  "Find your home away from home with handpicked properties and transparent stay booking."
                </blockquote>
                <p className="auth-quote-author">— HomelyHub Guest Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
