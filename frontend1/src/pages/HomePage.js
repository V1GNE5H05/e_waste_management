import { useEffect, useState } from "react";
import devImage from "../assets/ewaste2.png";
import { changePassword, fetchProfile, updateProfile } from "../services/api";
import { validateMobile, validatePincode } from "../utils/validators";
import { 
  HiHome, 
  HiUser, 
  HiCog, 
  HiLogout, 
  HiPencil, 
  HiLockClosed, 
  HiColorSwatch,
  HiArrowLeft,
  HiCheck,
  HiX,
  HiEye,
  HiEyeOff,
  HiTruck,
  HiRefresh,
  HiClock,
  HiChartBar
} from "react-icons/hi";
import "../App.css";

function HomePage({ user, onLogout }) {
  const [active, setActive] = useState("home");
  const [settingsView, setSettingsView] = useState("menu");
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: user?.email || "",
    mobileNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [originalProfileForm, setOriginalProfileForm] = useState({
    name: "",
    email: user?.email || "",
    mobileNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [profileStatus, setProfileStatus] = useState("");
  const [profileStatusType, setProfileStatusType] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordStatusType, setPasswordStatusType] = useState("");

  useEffect(() => {
    if (!user?.email) {
      return;
    }
    fetchProfile(user.email)
      .then((res) => {
        const profileData = {
          name: res.data.name || "",
          email: res.data.email || user.email,
          mobileNumber: res.data.mobileNumber || "",
          street: res.data.street || "",
          landmark: res.data.landmark || "",
          city: res.data.city || "",
          state: res.data.state || "",
          pincode: res.data.pincode || "",
        };
        setProfileForm(profileData);
        setOriginalProfileForm(profileData);
      })
      .catch(() => {
        setProfileForm((prev) => ({ ...prev, email: user.email }));
      });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSave = () => {
    setPasswordStatus("");
    setPasswordStatusType("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("New password and confirm password do not match");
      setPasswordStatusType("error");
      return;
    }
    changePassword({
      email: user?.email || "",
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
      .then((res) => {
        setPasswordStatus(res.data);
        setPasswordStatusType(
          String(res.data).startsWith("Password updated") ? "success" : "error"
        );
        if (String(res.data).startsWith("Password updated")) {
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      })
      .catch(() => {
        setPasswordStatus("Unable to update password");
        setPasswordStatusType("error");
      });
  };

  return (
    <div className="page home-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">♻️</div>
          <span className="brand-text">E-Waste</span>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${active === "home" ? "active" : ""}`}
            onClick={() => setActive("home")}
          >
            <HiHome className="nav-icon" />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            className={`nav-item ${active === "profile" ? "active" : ""}`}
            onClick={() => setActive("profile")}
          >
            <HiUser className="nav-icon" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            className={`nav-item ${active === "settings" ? "active" : ""}`}
            onClick={() => {
              setActive("settings");
              setSettingsView("menu");
            }}
          >
            <HiCog className="nav-icon" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {(profileForm.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{profileForm.name || "User"}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="btn btn-logout" type="button" onClick={onLogout}>
            <HiLogout className="btn-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="home-content">
        {active === "home" && (
          <>
            <div className="page-header">
              <div className="header-content">
                <h1>Welcome back{profileForm.name ? `, ${profileForm.name}` : ""} 👋</h1>
                <p>Here's what's happening with your e-waste management</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon green">
                  <HiRefresh />
                </div>
                <div className="stat-info">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Items Recycled</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">
                  <HiTruck />
                </div>
                <div className="stat-info">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Pickups Scheduled</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <HiClock />
                </div>
                <div className="stat-info">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Pending Items</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <HiChartBar />
                </div>
                <div className="stat-info">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Impact Score</span>
                </div>
              </div>
            </div>

            <div className="content-grid">
              <section className="content-card quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button className="action-btn">
                    <HiTruck />
                    <span>Schedule Pickup</span>
                  </button>
                  <button className="action-btn">
                    <HiRefresh />
                    <span>Track Items</span>
                  </button>
                </div>
              </section>

              <section className="content-card featured-card">
                <img src={devImage} alt="E-waste illustration" />
                <div className="featured-overlay">
                  <span className="featured-badge">Coming Soon</span>
                  <h3>More Features</h3>
                  <p>E-waste scheduling, tracking, and rewards system</p>
                </div>
              </section>
            </div>
          </>
        )}

        {active === "profile" && (
          <section className="content-card">
            <div className="card-header">
              <h1><HiUser className="header-icon" /> Profile</h1>
              <p>Manage your personal information</p>
            </div>
            <div className="profile-section">
              <div className="profile-avatar-large">
                {(profileForm.name || user?.email || "U").charAt(0).toUpperCase()}
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
        )}

        {active === "settings" && (
          <section className="content-card">
            <div className="card-header">
              <h1><HiCog className="header-icon" /> Settings</h1>
              <p>Manage your account preferences</p>
            </div>
            {settingsView === "menu" && (
              <div className="profile-section">
                <div className="settings-menu">
                  <button
                    className="settings-item"
                    type="button"
                    onClick={() => setSettingsView("theme")}
                  >
                    <div className="settings-icon theme">
                      <HiColorSwatch />
                    </div>
                    <div className="settings-text">
                      <strong>Theme</strong>
                      <span>Customize appearance</span>
                    </div>
                  </button>
                  <button
                    className="settings-item"
                    type="button"
                    onClick={() => setSettingsView("change-password")}
                  >
                    <div className="settings-icon security">
                      <HiLockClosed />
                    </div>
                    <div className="settings-text">
                      <strong>Change Password</strong>
                      <span>Update your password</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {settingsView === "theme" && (
              <div className="profile-section">
                <button
                  className="btn btn-ghost back-btn"
                  type="button"
                  onClick={() => setSettingsView("menu")}
                >
                  <HiArrowLeft className="btn-icon" />
                  Back to Settings
                </button>
                <h2><HiColorSwatch className="section-icon" /> Theme</h2>
                <div className="coming-soon">
                  <p>Theme customization coming soon.</p>
                </div>
              </div>
            )}
            {settingsView === "change-password" && (
              <div className="profile-section">
                <button
                  className="btn btn-ghost back-btn"
                  type="button"
                  onClick={() => setSettingsView("menu")}
                >
                  <HiArrowLeft className="btn-icon" />
                  Back to Settings
                </button>
                <h2><HiLockClosed className="section-icon" /> Change Password</h2>
                <form className="profile-form password-form">
                  <label>
                    <span className="label-text">Current Password</span>
                    <div className="password-input">
                      <input
                        name="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        placeholder="Enter current password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </label>
                  <label>
                    <span className="label-text">New Password</span>
                    <div className="password-input">
                      <input
                        name="newPassword"
                        type={showPasswords ? "text" : "password"}
                        placeholder="Enter new password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </label>
                  <label>
                    <span className="label-text">Confirm Password</span>
                    <div className="password-input">
                      <input
                        name="confirmPassword"
                        type={showPasswords ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showPasswords}
                      onChange={(e) => setShowPasswords(e.target.checked)}
                    />
                    {showPasswords ? <HiEye className="checkbox-icon" /> : <HiEyeOff className="checkbox-icon" />}
                    <span>Show passwords</span>
                  </label>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handlePasswordSave}
                  >
                    <HiLockClosed className="btn-icon" />
                    Update Password
                  </button>
                </form>
                {passwordStatus && (
                  <div className={`status ${passwordStatusType}`}>
                    {passwordStatus}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default HomePage;
