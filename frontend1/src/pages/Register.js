import { useState } from "react";
import { register, verifyOtp } from "../services/api";
import { validateEmail, validatePassword } from "../utils/validators";
import "../App.css";

function Register({ embedded = false, footer = null, onVerified }) {
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [step, setStep] = useState("register");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("");
    setStatusType("");
    const emailError = validateEmail(form.email.trim());
    if (emailError) {
      setStatus(emailError);
      setStatusType("error");
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setStatus(passwordError);
      setStatusType("error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { email: form.email.trim(), password: form.password };
      const res = await register(payload);
      if (String(res.data).startsWith("OTP sent")) {
        setStatus("OTP sent successfully");
        setStatusType("success");
        setStep("otp");
      } else {
        setStatus(res.data);
      }
    } catch {
      setStatus("Unable to send OTP. Please try again.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus("");
    setStatusType("");
    setIsLoading(true);
    try {
      const email = form.email.trim();
      const res = await verifyOtp({
        email,
        password: form.password,
        otp: form.otp,
      });
      setStatus(res.data);
      setStatusType("success");
      if (String(res.data).startsWith("User verified and registered")) {
        onVerified?.();
      }
    } catch {
      setStatus("OTP verification failed. Please try again.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="auth-card">
      <div className="auth-header">
        <h2>{step === "register" ? "Create account" : "Verify OTP"}</h2>
        <p>
          {step === "register"
            ? "Start your account and we will send a secure OTP."
            : "Enter the 6-digit OTP sent to your email."}
        </p>
      </div>

      {step === "register" ? (
        <form className="auth-form" onSubmit={handleRegister}>
          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show password
          </label>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleVerify}>
          <label>
            OTP
            <input
              name="otp"
              placeholder="6-digit code"
              value={form.otp}
              onChange={handleChange}
              required
            />
          </label>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => setStep("register")}
          >
            Edit email and password
          </button>
        </form>
      )}

      {status && <div className={`status ${statusType}`}>{status}</div>}
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
  );

  if (embedded) {
    return content;
  }

  return <div className="page auth-page">{content}</div>;
}

export default Register;
