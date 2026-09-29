import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, KeyRound, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";

import { resetPassword } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";
import Input from "../ui/Input";
import Button from "../ui/Button";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(!token);

  const { errors, loading } = useSelector((state) => state.user);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(resetPassword({ password, passwordConfirm }, token));
      toast.success("Password has been changed successfully");
      navigate("/login");
    } catch {
      setIsTokenInvalid(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (errors) {
      const errorMsg = typeof errors === "string" ? errors : "Invalid or expired reset token.";
      toast.error(errorMsg);

      // If token error or invalid, display the designed invalid link state
      if (
        errorMsg.toLowerCase().includes("token") ||
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("expired")
      ) {
        setIsTokenInvalid(true);
      }
      dispatch(userActions.clearErrors());
    }
  }, [errors, dispatch]);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-split-grid">
            {/* Form Side */}
            <div className="auth-form-side">
              {isTokenInvalid ? (
                <div className="auth-state-box">
                  <div className="auth-icon-wrapper auth-icon-error">
                    <AlertTriangle size={36} />
                  </div>
                  <h1 className="auth-title">Invalid or Expired Link</h1>
                  <p className="auth-subtitle" style={{ marginBottom: "1.5rem" }}>
                    This password reset link is invalid or has expired. Password reset links are valid for a limited time for security.
                  </p>
                  <Link to="/user/forgotPassword" style={{ textDecoration: "none", width: "100%" }}>
                    <Button variant="primary" className="auth-submit-btn">
                      Request New Reset Link <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="auth-header">
                    <span className="auth-badge">
                      <Sparkles size={14} /> Password Reset
                    </span>
                    <h1 className="auth-title">Set new password</h1>
                    <p className="auth-subtitle">
                      Choose a strong new password with at least 6 characters for your account.
                    </p>
                  </div>

                  <form onSubmit={submitHandler} className="auth-form">
                    <div className="auth-password-wrap">
                      <Input
                        id="password_field"
                        type={showPassword ? "text" : "password"}
                        label="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        id="confirm_password_field"
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm New Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
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

                    <Button
                      id="new_password_button"
                      type="submit"
                      variant="primary"
                      className="auth-submit-btn"
                      isLoading={isSubmitting || loading}
                      isDisabled={isSubmitting || loading || !password || !passwordConfirm}
                    >
                      <KeyRound size={16} /> Set Password
                    </Button>

                    <div className="auth-footer-text">
                      Back to
                      <Link to="/login" className="auth-link">
                        Login Page
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Brand Image Side */}
            <div className="auth-image-side" aria-hidden="true">
              <img
                src="/assets/image8.jpeg"
                alt="Account security"
                className="auth-image-bg"
              />
              <div className="auth-image-overlay">
                <div className="auth-quote-badge">
                  <Sparkles size={13} /> Account Protection
                </div>
                <blockquote className="auth-quote-text">
                  "Resetting your password helps maintain account integrity and secures your bookings."
                </blockquote>
                <p className="auth-quote-author">— HomelyHub Security System</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
