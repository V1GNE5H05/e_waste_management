import { useState, useEffect, useRef } from "react";
import { login, forgotPassword, resetPassword } from "../services/api";
import { validateEmail, validatePassword } from "../utils/validators";
import "../App.css";

function Login({ embedded = false, footer = null, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const [view, setView] = useState("login"); 
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({ otp: "", newPassword: "", confirmPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const timerRef = useRef();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
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
      const res = await login(payload);
      setStatus(res.data.message);
      setStatusType("success");
      onSuccess?.(payload.email);
    } catch (err) {
      setStatus(err.response?.data?.error || "Unable to login. Please try again.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === "reset" && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [view, timer]);


  const handleResendOtp = async () => {
    setIsLoading(true);
    setStatus("");
    setStatusType("");
    try {
      await forgotPassword({ email: forgotEmail.trim() });
      setStatus("OTP resent to your email");
      setStatusType("success");
      setTimer(60);
      setResetForm({ otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus(err.response?.data?.error || "Unable to resend OTP. Please try again.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

    const handleForgotSubmit = async (e) => {
      e.preventDefault();
      setStatus("");
      setStatusType("");

      const emailError = validateEmail(forgotEmail.trim());
      if (emailError) {
        setStatus(emailError);
        setStatusType("error");
        return;
      }

      setIsLoading(true);
      try {
        await forgotPassword({ email: forgotEmail.trim() });
        setStatus("OTP sent to your email");
        setStatusType("success");
        setView("reset");
      } catch (err) {
        setStatus(err.response?.data?.error || "Unable to send OTP. Please try again.");
        setStatusType("error");
      } finally {
        setIsLoading(false);
      }
    };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setStatusType("");

    if (!resetForm.otp.trim()) {
      setStatus("OTP is required");
      setStatusType("error");
      return;
    }

    const passwordError = validatePassword(resetForm.newPassword);
    if (passwordError) {
      setStatus(passwordError);
      setStatusType("error");
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setStatus("Passwords do not match");
      setStatusType("error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        email: forgotEmail.trim(),
        otp: resetForm.otp.trim(),
        newPassword: resetForm.newPassword,
      });
      setStatus(res.data.message);
      setStatusType("success");
      // Go back to login after short delay
      setTimeout(() => {
        setView("login");
        setStatus("");
        setStatusType("");
        setResetForm({ otp: "", newPassword: "", confirmPassword: "" });
        setForgotEmail("");
      }, 2000);
    } catch (err) {
      setStatus(err.response?.data?.error || "Password reset failed. Please try again.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const backToLogin = () => {
    setView("login");
    setStatus("");
    setStatusType("");
    setForgotEmail("");
    setResetForm({ otp: "", newPassword: "", confirmPassword: "" });
  };

  let content;

  if (view === "forgot") {
    content = (
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email and we'll send you an OTP to reset your password.</p>
        </div>
        <form className="auth-form" onSubmit={handleForgotSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
        {status && <div className={`status ${statusType}`}>{status}</div>}
        <div className="auth-footer">
          <button className="link-button" type="button" onClick={backToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    );
  } else if (view === "reset") {
    content = (
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter the OTP sent to {forgotEmail} and your new password.</p>
        </div>
        <form className="auth-form" onSubmit={handleResetSubmit}>
          <label>
            OTP
            <input
              type="text"
              placeholder="6-digit code"
              value={resetForm.otp}
              onChange={(e) => setResetForm({ ...resetForm, otp: e.target.value })}
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
          <label>
            New Password
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
              required
            />
          </label>
          <label>
            Confirm Password
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={resetForm.confirmPassword}
              onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
              required
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={showNewPassword}
              onChange={(e) => setShowNewPassword(e.target.checked)}
            />
            Show password
          </label>
          <button className="btn btn-primary" type="submit" disabled={isLoading || timer === 0}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {status && <div className={`status ${statusType}`}>{status}</div>}
        <div className="auth-footer">
          <button className="link-button" type="button" onClick={backToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Login to continue managing your e-waste flow.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", margin: 0 }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>
            <button
              className="link-button"
              type="button"
              onClick={() => { setView("forgot"); setStatus(""); setStatusType(""); }}
              style={{ fontSize: "14px" }}
            >
              Forgot Password?
            </button>
          </div>

          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {status && <div className={`status ${statusType}`}>{status}</div>}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    );
  }

  if (embedded) {
    return content;
  }

  return <div className="page auth-page">{content}</div>;
}

export default Login;
