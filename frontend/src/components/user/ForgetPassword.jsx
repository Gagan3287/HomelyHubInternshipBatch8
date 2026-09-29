import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Mail, MailCheck, ArrowLeft, Send, Sparkles } from "lucide-react";

import { forgotPassword } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";
import Input from "../ui/Input";
import Button from "../ui/Button";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { errors, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await dispatch(forgotPassword(email));
      setIsSubmitted(true);
      toast.success("Email sent! Please check your inbox.");
    } catch {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (errors) {
      const errorMsg = typeof errors === "string" ? errors : "Failed to send reset email.";
      toast.error(errorMsg);
      setIsSubmitted(false);
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
              {isSubmitted ? (
                <div className="auth-state-box">
                  <div className="auth-icon-wrapper auth-icon-success">
                    <MailCheck size={36} />
                  </div>
                  <h1 className="auth-title">Check your inbox</h1>
                  <p className="auth-subtitle" style={{ marginBottom: "1.5rem" }}>
                    We have sent password reset instructions to <strong>{email}</strong> if an account exists for it.
                  </p>
                  <p className="auth-footer-text" style={{ margin: "0 0 2rem 0" }}>
                    Didn't receive the email? Check your spam folder or ensure the email address was entered correctly.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
                    <Link to="/login" style={{ textDecoration: "none", width: "100%" }}>
                      <Button variant="primary" className="auth-submit-btn">
                        <ArrowLeft size={16} /> Return to Login
                      </Button>
                    </Link>

                    <Button
                      variant="secondary"
                      className="auth-submit-btn"
                      onClick={() => setIsSubmitted(false)}
                    >
                      <Mail size={16} /> Send to another email
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="auth-header">
                    <span className="auth-badge">
                      <Sparkles size={14} /> Password Recovery
                    </span>
                    <h1 className="auth-title">Forget Password</h1>
                    <p className="auth-subtitle">
                      Enter your registered email address and we'll send you instructions to reset your password.
                    </p>
                  </div>

                  <form onSubmit={submitHandler} className="auth-form">
                    <Input
                      id="email_field"
                      type="email"
                      label="Enter Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      required
                    />

                    <Button
                      id="forgot_password_button"
                      type="submit"
                      variant="primary"
                      className="auth-submit-btn"
                      isLoading={isSubmitting || loading}
                      isDisabled={isSubmitting || loading || !email}
                    >
                      <Send size={16} /> Send Reset Email
                    </Button>

                    <div className="auth-footer-text">
                      Remember your password?
                      <Link to="/login" className="auth-link">
                        Back to Login
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Brand Image Side */}
            <div className="auth-image-side" aria-hidden="true">
              <img
                src="/assets/image2.jpeg"
                alt="Account security"
                className="auth-image-bg"
              />
              <div className="auth-image-overlay">
                <div className="auth-quote-badge">
                  <Sparkles size={13} /> Secure Account Access
                </div>
                <blockquote className="auth-quote-text">
                  "Your privacy and account security are protected with industry-standard encryption."
                </blockquote>
                <p className="auth-quote-author">— HomelyHub Safety Standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
