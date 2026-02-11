import { useEffect, useState } from "react";
import devImage from "../assets/ewaste2.png";
import { changePassword, fetchProfile, updateProfile } from "../services/api";
import { validateMobile } from "../utils/validators";
import "../App.css";

function HomePage({ user, onLogout }) {
  const [active, setActive] = useState("home");
  const [settingsView, setSettingsView] = useState("menu");
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: user?.email || "",
    mobileNumber: "",
    address: "",
  });
  const [originalProfileForm, setOriginalProfileForm] = useState({
    name: "",
    email: user?.email || "",
    mobileNumber: "",
    address: "",
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
          address: res.data.address || "",
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

    updateProfile({
      email: profileForm.email,
      name: profileForm.name,
      mobileNumber: trimmedMobile,
      address: profileForm.address,
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
        <div className="profile-block">
          <img src={devImage} alt="Profile placeholder" />
          <div className="profile-text">
            <strong>Welcome</strong>
            <span>Manage your account</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${active === "home" ? "active" : ""}`}
            onClick={() => setActive("home")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-item ${active === "profile" ? "active" : ""}`}
            onClick={() => setActive("profile")}
          >
            Profile
          </button>
          <button
            type="button"
            className={`nav-item ${active === "settings" ? "active" : ""}`}
            onClick={() => {
              setActive("settings");
              setSettingsView("menu");
            }}
          >
            Settings
          </button>
        </nav>

        <button className="btn btn-logout" type="button" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="home-content">
        {active === "home" && (
          <section className="content-card home-card">
            <img src={devImage} alt="E-waste development preview" />
            <h1>Still in development</h1>
          </section>
        )}

        {active === "profile" && (
          <section className="content-card">
            <h1>Profile</h1>
            <div className="profile-section">
              <h2>Edit profile</h2>
              <form className="profile-form">
                <label>
                  Name
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    readOnly={!isEditing}
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    readOnly
                  />
                </label>
                <label>
                  Mobile number
                  <input
                    name="mobileNumber"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={profileForm.mobileNumber}
                    onChange={handleProfileChange}
                    readOnly={!isEditing}
                  />
                </label>
                <label>
                  Address
                  <textarea
                    name="address"
                    rows="3"
                    placeholder="Enter your address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    readOnly={!isEditing}
                  ></textarea>
                </label>
                <div className="profile-actions">
                  {!isEditing ? (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleProfileSave}
                      >
                        Save changes
                      </button>
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={handleCancelEdit}
                      >
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
            <h1>Settings</h1>
            {settingsView === "menu" && (
              <div className="profile-section">
                <div className="settings-menu">
                  <button
                    className="settings-item"
                    type="button"
                    onClick={() => setSettingsView("theme")}
                  >
                    <strong>Theme</strong>
                    <span>Customize appearance</span>
                  </button>
                  <button
                    className="settings-item"
                    type="button"
                    onClick={() => setSettingsView("change-password")}
                  >
                    <strong>Change password</strong>
                    <span>Update your password</span>
                  </button>
                </div>
              </div>
            )}
            {settingsView === "theme" && (
              <div className="profile-section">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setSettingsView("menu")}
                  style={{ marginBottom: "20px" }}
                >
                  ← Back to Settings
                </button>
                <h2>Theme</h2>
                <p>Theme customization coming soon.</p>
              </div>
            )}
            {settingsView === "change-password" && (
              <div className="profile-section">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setSettingsView("menu")}
                  style={{ marginBottom: "20px" }}
                >
                  ← Back to Settings
                </button>
                <h2>Change password</h2>
                <form className="profile-form">
                  <label>
                    Current password
                    <input
                      name="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      placeholder="Current password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </label>
                  <label>
                    New password
                    <input
                      name="newPassword"
                      type={showPasswords ? "text" : "password"}
                      placeholder="New password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </label>
                  <label>
                    Confirm password
                    <input
                      name="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      placeholder="Confirm password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={showPasswords}
                      onChange={(e) => setShowPasswords(e.target.checked)}
                    />
                    Show passwords
                  </label>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handlePasswordSave}
                  >
                    Update password
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
