import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, Mail, Calendar, Edit3, KeyRound, Sparkles } from "lucide-react";

import ProgressSteps from "../ProgressSteps";
import formatDate from "../../utils/formatDate";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import { optimizeImageUrl } from "../../utils/imageUrl";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);

  return (
    <div className="account-page-wrapper">
      <div className="account-container">
        <ProgressSteps />

        <div className="account-header">
          <h1 className="account-title">My Profile</h1>
          <p className="account-subtitle">
            Manage your personal information and account preferences
          </p>
        </div>

        {loading ? (
          <div className="profile-card">
            <div className="profile-grid">
              <Skeleton variant="image" width="9rem" height="9rem" style={{ borderRadius: "50%" }} />
              <div className="profile-info-side">
                <Skeleton variant="heading" width="50%" height="1.5rem" />
                <Skeleton variant="text" width="70%" height="1rem" />
                <Skeleton variant="text" width="60%" height="1rem" />
                <Skeleton variant="text" width="40%" height="1rem" />
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="profile-card">
            <div className="profile-grid">
              <div className="profile-avatar-side">
                <div className="profile-avatar-wrapper">
                  <img
                    className="profile-avatar-img"
                    src={optimizeImageUrl(user.avatar?.url || "/assets/avatar.png", 300)}
                    alt={user.name || "User Avatar"}
                    width="144"
                    height="144"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="profile-info-side">
                <div className="profile-field-group">
                  <span className="profile-field-label">
                    <User size={13} style={{ display: "inline", marginRight: "4px" }} /> Full Name
                  </span>
                  <p className="profile-field-value">{user.name}</p>
                </div>

                <div className="profile-field-group">
                  <span className="profile-field-label">
                    <Mail size={13} style={{ display: "inline", marginRight: "4px" }} /> Email Address
                  </span>
                  <p className="profile-field-value">{user.email}</p>
                </div>

                <div className="profile-field-group">
                  <span className="profile-field-label">
                    <Calendar size={13} style={{ display: "inline", marginRight: "4px" }} /> Joined On
                  </span>
                  <p className="profile-field-value">
                    {formatDate(user.createdAt) || "24 Sep 2026"}
                  </p>
                </div>

                <div className="profile-actions">
                  <Link to="/editprofile" style={{ textDecoration: "none" }}>
                    <Button id="edit_profile" variant="primary">
                      <Edit3 size={16} /> Edit Profile
                    </Button>
                  </Link>

                  <Link to="/user/updatepassword" style={{ textDecoration: "none" }}>
                    <Button variant="secondary">
                      <KeyRound size={16} /> Change Password
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
