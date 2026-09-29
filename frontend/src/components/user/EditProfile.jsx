import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { Upload, Save, ArrowLeft, User, Phone, Image as ImageIcon } from "lucide-react";

import { updateUser } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";
import ProgressSteps from "../ProgressSteps";
import Input from "../ui/Input";
import Button from "../ui/Button";

const EditProfile = () => {
  const { user, errors, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || "/assets/avatar.png"
  );
  const [avatarError, setAvatarError] = useState("");

  const originalUserData = {
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    avatar: user?.avatar?.url || "",
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select a valid image file");
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image size must be less than 5MB");
      toast.error("Image size must be less than 5MB");
      return;
    }

    setAvatarError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        form.setFieldValue("avatar", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      avatar: user?.avatar?.url || "",
    },
    onSubmit: ({ value }) => {
      const updatedFields = {};

      if (value.name !== originalUserData.name) {
        updatedFields.name = value.name;
      }
      if (value.phoneNumber !== originalUserData.phoneNumber) {
        updatedFields.phoneNumber = value.phoneNumber;
      }
      if (value.avatar !== originalUserData.avatar) {
        updatedFields.avatar = value.avatar;
      }

      if (Object.keys(updatedFields).length === 0) {
        toast("No changes made");
        return;
      }

      dispatch(updateUser(updatedFields));
      navigate("/profile");
      toast.success("Profile Updated");
    },
  });

  useEffect(() => {
    if (errors && errors.length > 0) {
      const errorMsg = typeof errors === "string" ? errors : "Failed to update profile";
      toast.error(errorMsg);
      dispatch(userActions.clearErrors());
    }
  }, [errors, dispatch]);

  return (
    <div className="account-page-wrapper">
      <div className="account-container">
        <ProgressSteps />

        <div className="account-header">
          <h1 className="account-title">Update Profile</h1>
          <p className="account-subtitle">
            Update your account details and profile picture
          </p>
        </div>

        <div className="edit-profile-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            encType="multipart/form-data"
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Avatar Upload */}
            <form.Field name="avatar">
              {(field) => (
                <div className="hh-field">
                  <label className="hh-label">Profile Picture</label>
                  <div className="avatar-upload-row">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="avatar-preview-sm"
                      width="72"
                      height="72"
                      loading="lazy"
                    />
                    <div>
                      <label htmlFor="avatarupdate" className="avatar-file-btn">
                        <Upload size={16} /> Choose New Avatar
                      </label>
                      <input
                        type="file"
                        id="avatarupdate"
                        name={field.name}
                        accept="image/*"
                        className="hidden-file-input"
                        onChange={handleAvatarChange}
                      />
                      <span className="hh-subtitle" style={{ display: "block", marginTop: "0.35rem", fontSize: "0.75rem" }}>
                        JPG, PNG or WEBP (Max 5MB)
                      </span>
                      {avatarError && <span className="hh-error-msg">{avatarError}</span>}
                    </div>
                  </div>
                </div>
              )}
            </form.Field>

            {/* Name Field */}
            <form.Field name="name">
              {(field) => (
                <Input
                  id="name_field"
                  type="text"
                  label="Full Name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              )}
            </form.Field>

            {/* Phone Number Field */}
            <form.Field name="phoneNumber">
              {(field) => (
                <Input
                  id="phone_field"
                  type="tel"
                  label="Phone Number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              )}
            </form.Field>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Button
                type="submit"
                variant="primary"
                style={{ flex: 1 }}
                isLoading={loading}
                isDisabled={loading}
              >
                <Save size={16} /> {loading ? "Updating..." : "Save Changes"}
              </Button>

              <Link to="/profile" style={{ textDecoration: "none" }}>
                <Button variant="secondary" type="button">
                  <ArrowLeft size={16} /> Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
