import { useState } from "react";
import heroImage from "../assets/e-waste.jpg";
import authImage from "../assets/ewaste2.png";
import Login from "./Login";
import Register from "./Register";
import "../App.css";

function Launch({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState("register");

  return (
    <div className="page launch" style={{ "--launch-image": `url(${heroImage})` }}>
      <header className="topbar">
        <div className="brand">E-Waste Loop</div>
        <nav className="nav">
          <a className="nav-link" href="#auth" onClick={() => setAuthMode("login")}>
            Login
          </a>
          <a
            className="btn btn-primary"
            href="#auth"
            onClick={() => setAuthMode("register")}
          >
            Register
          </a>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-content">
          <span className="badge">Clean tech, real impact</span>
          <h1>Turn old devices into a cleaner future.</h1>
          <p>
            Track, verify, and recycle e-waste with a simple account flow. Build
            cleaner neighborhoods and reduce toxic landfill impact.
          </p>
          <div className="cta">
            <a
              className="btn btn-primary"
              href="#auth"
              onClick={() => setAuthMode("register")}
            >
              Create account
            </a>
            <a
              className="btn btn-ghost"
              href="#auth"
              onClick={() => setAuthMode("login")}
            >
              I already have an account
            </a>
          </div>
          <div className="hero-meta">
            <div>
              <strong>Why it matters</strong>
              <span>Electronics contain metals that harm soil and water.</span>
            </div>
            <div>
              <strong>What we do</strong>
              <span>We connect safe collection with responsible recycling.</span>
            </div>
            <div>
              <strong>Community impact</strong>
              <span>More reuse and repair means fewer raw materials mined.</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card">
            <h3>Reduce toxic waste</h3>
            <p>
              Batteries and circuit boards leak hazardous materials when dumped.
            </p>
          </div>
          <div className="panel-card">
            <h3>Recover materials</h3>
            <p>
              Precious metals and plastics can be recovered and reused
              responsibly.
            </p>
          </div>
          <div className="panel-card">
            <h3>Make it easy</h3>
            <p>We help households and businesses find safe recycling paths.</p>
          </div>
        </div>
      </main>

      <section className="auth-section" id="auth">
        <div className="auth-split">
          <div className="auth-media" aria-hidden="true">
            <img src={authImage} alt="" />
          </div>
          <div className="auth-panel">
            {authMode === "register" ? (
              <Register
                embedded
                onVerified={() => setAuthMode("login")}
                footer={
                  <button
                    className="link-button"
                    type="button"
                    onClick={() => setAuthMode("login")}
                  >
                    Already have an account? Login
                  </button>
                }
              />
            ) : (
              <Login
                embedded
                onSuccess={onLoginSuccess}
                footer={
                  <button
                    className="link-button"
                    type="button"
                    onClick={() => setAuthMode("register")}
                  >
                    New here? Create an account
                  </button>
                }
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Launch;
