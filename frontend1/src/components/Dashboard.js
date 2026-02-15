import devImage from "../assets/ewaste2.png";
import { HiTruck, HiRefresh, HiClock, HiChartBar } from "react-icons/hi";

function Dashboard({ profileName }) {
  return (
    <>
      <div className="page-header">
        <div className="header-content">
          <h1>Welcome back{profileName ? `, ${profileName}` : ""} 👋</h1>
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
  );
}

export default Dashboard;
