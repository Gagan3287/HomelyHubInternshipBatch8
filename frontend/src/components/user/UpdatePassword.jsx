import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";

import { updatePassword } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";
import Input from "../ui/Input";
import Button from "../ui/Button";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { errors, success, loading } = useSelector((state) => state.user);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Password does not matched");
      return false;
    }

    dispatch(updatePassword({ passwordCurrent, password, passwordConfirm }));
  };

  useEffect(() => {
    if (errors) {
      const errorMsg = typeof errors === "string" ? errors : "Failed to update password.";
      toast.error(errorMsg);
      dispatch(userActions.clearErrors());
    } else if (success) {
      toast.success("Password update successfully");
      navigate("/profile");
      dispatch(userActions.getPasswordSuccess(false));
    }
  }, [errors, dispatch, navigate, success]);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-split-grid">
            {/* Form Side */}
            <div className="auth-form-side">
              <div className="auth-header">
                <span className="auth-badge">
                  <Sparkles size={14} /> Security Settings
                </span>
                <h1 className="auth-title">Update Password</h1>
                <p className="auth-subtitle">
                  Keep your account safe by updating your password regularly.
                </p>
              </div>

              <form onSubmit={submitHandler} className="auth-form">
                <div className="auth-password-wrap">
                  <Input
                    id="passwordCurrent_field"
                    type={showCurrent ? "text" : "password"}
                    label="Current Password"
                    value={passwordCurrent}
                    onChange={(e) => setPasswordCurrent(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label={showCurrent ? "Hide current password" : "Show current password"}
                    aria-pressed={showCurrent}
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="auth-password-wrap">
                  <Input
                    id="new_password_field"
                    type={showNew ? "text" : "password"}
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
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? "Hide new password" : "Show new password"}
                    aria-pressed={showNew}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="auth-password-wrap">
                  <Input
                    id="new_password_confirm_field"
                    type={showConfirm ? "text" : "password"}
                    label="Confirm New Password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    error={passwordConfirm && password !== passwordConfirm ? "Password does not matched" : undefined}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    aria-pressed={showConfirm}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="auth-submit-btn"
                  isLoading={loading}
                  isDisabled={loading || !passwordCurrent || !password || !passwordConfirm}
                >
                  <ShieldCheck size={16} /> Update Password
                </Button>

                <div className="auth-footer-text">
                  Return to your
                  <Link to="/profile" className="auth-link">
                    Profile Page
                  </Link>
                </div>
              </form>
            </div>

            {/* Brand Image Side */}
            <div className="auth-image-side" aria-hidden="true">
              <img
                src="/assets/image7.jpeg"
                alt="Account security settings"
                className="auth-image-bg"
              />
              <div className="auth-image-overlay">
                <div className="auth-quote-badge">
                  <Sparkles size={13} /> Account Security
                </div>
                <blockquote className="auth-quote-text">
                  "Maintain control of your personal profile with secure authentication protocols."
                </blockquote>
                <p className="auth-quote-author">— HomelyHub Account Settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
