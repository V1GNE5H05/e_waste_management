import { useState } from "react";
import { updateProfile } from "../services/api";
import { validateMobile, validatePincode } from "../utils/validators";
import { HiUser, HiPencil, HiCheck, HiX } from "react-icons/hi";

function ProfileSection({ profileForm, setProfileForm, originalProfileForm, setOriginalProfileForm, email }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileStatus, setProfileStatus] = useState("");
  const [profileStatusType, setProfileStatusType] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setProfileStatus("");
    setProfileStatusType("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProfileForm(originalProfileForm);
    setIsEditing(false);
    setProfileStatus("");
    setProfileStatusType("");
  };

  const handleProfileSave = () => {
    setProfileStatus("");
    setProfileStatusType("");

    const trimmedMobile = profileForm.mobileNumber.trim();
    const mobileError = validateMobile(trimmedMobile);
    if (mobileError) {
      setProfileStatus(mobileError);
      setProfileStatusType("error");
      return;
    }

    const trimmedPincode = profileForm.pincode.trim();
    const pincodeError = validatePincode(trimmedPincode);
    if (pincodeError) {
      setProfileStatus(pincodeError);
      setProfileStatusType("error");
      return;
    }

    updateProfile({
      email: profileForm.email,
      name: profileForm.name,
      mobileNumber: trimmedMobile,
      street: profileForm.street,
      landmark: profileForm.landmark,
      city: profileForm.city,
      state: profileForm.state,
      pincode: trimmedPincode,
    })
      .then(() => {
        setProfileStatus("Profile updated successfully");
        setProfileStatusType("success");
        setOriginalProfileForm(profileForm);
        setIsEditing(false);
      })
      .catch((err) => {
        setProfileStatus(err.response?.data || "Unable to update profile");
        setProfileStatusType("error");
      });
  };

  return (
    <section className="content-card">
      <div className="card-header">
        <h1><HiUser className="header-icon" /> Profile</h1>
        <p>Manage your personal information</p>
      </div>
      <div className="profile-section">
        <div className="profile-avatar-large">
          {(profileForm.name || email || "U").charAt(0).toUpperCase()}
        </div>
        <form className="profile-form">
          <div className="form-row">
            <label>
              <span className="label-text">Full Name</span>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                value={profileForm.name}
                onChange={handleProfileChange}
                readOnly={!isEditing}
              />
            </label>
            <label>
              <span className="label-text">Email Address</span>
              <input
                name="email"
                type="email"
                value={profileForm.email}
                readOnly
                className="readonly-field"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span className="label-text">Mobile Number</span>
              <input
                name="mobileNumber"
                type="tel"
                placeholder="10-digit mobile number"
                value={profileForm.mobileNumber}
                onChange={handleProfileChange}
                readOnly={!isEditing}
              />
            </label>
          </div>
          <h3 className="section-title">Address Details</h3>
          <label>
            <span className="label-text">Street Address</span>
            <input
              name="street"
              type="text"
              placeholder="House/Flat No, Street name"
              value={profileForm.street}
              onChange={handleProfileChange}
              readOnly={!isEditing}
            />
          </label>
          <label>
            <span className="label-text">Landmark</span>
            <input
              name="landmark"
              type="text"
              placeholder="Near landmark (optional)"
              value={profileForm.landmark}
              onChange={handleProfileChange}
              readOnly={!isEditing}
            />
          </label>
          <div className="form-row">
            <label>
              <span className="label-text">City</span>
              <input
                name="city"
                type="text"
                placeholder="City"
                value={profileForm.city}
                onChange={handleProfileChange}
                readOnly={!isEditing}
              />
            </label>
            <label>
              <span className="label-text">State</span>
              <input
                name="state"
                type="text"
                placeholder="State"
                value={profileForm.state}
                onChange={handleProfileChange}
                readOnly={!isEditing}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span className="label-text">Pincode</span>
              <input
                name="pincode"
                type="text"
                placeholder="6-digit pincode"
                value={profileForm.pincode}
                onChange={handleProfileChange}
                readOnly={!isEditing}
                maxLength={6}
              />
            </label>
            <div></div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleEditClick}
              >
                <HiPencil className="btn-icon" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleProfileSave}
                >
                  <HiCheck className="btn-icon" />
                  Save Changes
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  <HiX className="btn-icon" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
        {profileStatus && (
          <div className={`status ${profileStatusType}`}>
            {profileStatus}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfileSection;
