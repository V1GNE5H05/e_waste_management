import { HiHome, HiUser, HiCog, HiLogout } from "react-icons/hi";

function Sidebar({ active, setActive, profileName, email, onLogout, onSettingsClick }) {
  return (
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
          onClick={onSettingsClick}
        >
          <HiCog className="nav-icon" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {(profileName || email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{profileName || "User"}</span>
            <span className="user-email">{email}</span>
          </div>
        </div>
        <button className="btn btn-logout" type="button" onClick={onLogout}>
          <HiLogout className="btn-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
