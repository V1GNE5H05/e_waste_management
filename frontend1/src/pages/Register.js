import { useState, useEffect, useRef } from "react";
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
  const [timer, setTimer] = useState(60);
  const timerRef = useRef();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [step, timer]);

  const handleResendOtp = async () => {
    setIsLoading(true);
    setStatus("");
    setStatusType("");
    try {
      await register({ email: form.email.trim(), password: form.password });
      setStatus("OTP resent to your email");
      setStatusType("success");
      setTimer(60);
      setForm((f) => ({ ...f, otp: "" }));
    } catch (err) {
      setStatus(err.response?.data?.error || "Unable to resend OTP. Please try again.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

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
      await register(payload);
      setStatus("OTP sent successfully");
      setStatusType("success");
      setStep("otp");
      setTimer(60);
    } catch (err) {
      setStatus(err.response?.data?.error || "Unable to send OTP. Please try again.");
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
      setStatus(res.data.message);
      setStatusType("success");
      onVerified?.();
    } catch (err) {
      setStatus(err.response?.data?.error || "OTP verification failed. Please try again.");
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
              disabled={timer === 0}
            />
          </label>
          {timer > 0 ? (
            <div style={{ marginBottom: 8, color: '#00796b', fontWeight: 500 }}>
              Time left: 0:{timer.toString().padStart(2, '0')}
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              style={{ marginBottom: 8 }}
            >
              {isLoading ? "Resending..." : "Resend OTP"}
            </button>
          )}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading || timer === 0}
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
