import { useState } from "react";
import { changePassword } from "../services/api";
import {
  HiCog,
  HiLockClosed,
  HiColorSwatch,
  HiArrowLeft,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";

function SettingsSection({ email }) {
  const [settingsView, setSettingsView] = useState("menu");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordStatusType, setPasswordStatusType] = useState("");

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
      email: email || "",
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
      .then((res) => {
        setPasswordStatus(res.data.message);
        setPasswordStatusType("success");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        setPasswordStatus(err.response?.data?.error || "Unable to update password");
        setPasswordStatusType("error");
      });
  };

  return (
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
  );
}

export default SettingsSection;
