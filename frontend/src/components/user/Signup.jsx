import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus, Sparkles } from "lucide-react";

import { getSignup } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, errors, loading } = useSelector((state) => state.user);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, passwordConfirm, phoneNumber } = user;

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(getSignup(user));
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (errors && errors.length > 0) {
      const errorMsg = typeof errors === "string" ? errors : "Signup failed. Please try again.";
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
                  <Sparkles size={14} /> Join HomelyHub
                </span>
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">
                  Join HomelyHub to book unique vacation stays or manage your property listings.
                </p>
              </div>

              {loading ? (
                <div className="auth-form" aria-label="Loading signup form">
                  <Skeleton variant="text" width="30%" height="1rem" />
                  <Skeleton variant="text" width="100%" height="2.75rem" />
                  <Skeleton variant="text" width="30%" height="1rem" />
                  <Skeleton variant="text" width="100%" height="2.75rem" />
                  <Skeleton variant="text" width="30%" height="1rem" />
                  <Skeleton variant="text" width="100%" height="2.75rem" />
                </div>
              ) : (
                <form onSubmit={submitHandler} className="auth-form" noValidate={false}>
                  <Input
                    id="name_field"
                    type="text"
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                  />

                  <Input
                    id="email_field"
                    type="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />

                  <div className="auth-password-wrap">
                    <Input
                      id="password_field"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
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

                  <div className="auth-password-wrap">
                    <Input
                      id="passwordConfirm_field"
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirm Password"
                      name="passwordConfirm"
                      value={passwordConfirm}
                      onChange={onChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      error={passwordConfirm && password !== passwordConfirm ? "Passwords do not match" : undefined}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <Input
                    id="phoneNumber_field"
                    type="tel"
                    label="Phone Number"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={onChange}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    required
                  />

                  <Button
                    id="register_button"
                    type="submit"
                    variant="primary"
                    className="auth-submit-btn"
                    isLoading={loading}
                    isDisabled={loading || !name || !email || !password || !passwordConfirm || !phoneNumber}
                  >
                    <UserPlus size={16} /> Create Account
                  </Button>

                  <div className="auth-footer-text">
                    Already have an account?
                    <Link to="/login" className="auth-link">
                      Log in
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Brand Image Side (Hidden on Mobile) */}
            <div className="auth-image-side" aria-hidden="true">
              <img
                src="/assets/image6.jpeg"
                alt="Beautiful holiday stay"
                className="auth-image-bg"
              />
              <div className="auth-image-overlay">
                <div className="auth-quote-badge">
                  <Sparkles size={13} /> Seamless Stays
                </div>
                <blockquote className="auth-quote-text">
                  "Start discovering unique accommodations and memorable stays designed around your comfort."
                </blockquote>
                <p className="auth-quote-author">— HomelyHub Travel Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
