import { useState } from "react";
import { login } from "../services/api";
import { validateEmail, validatePassword } from "../utils/validators";
import "../App.css";

function Login({ embedded = false, footer = null, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const emailError = validateEmail(form.email.trim());
    if (emailError) {
      setStatus(emailError);
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setStatus(passwordError);
      return;
    }

    setIsLoading(true);
    try {
      const payload = { email: form.email.trim(), password: form.password };
      const res = await login(payload);
      setStatus(res.data);
      if (String(res.data).startsWith("Login successful")) {
        onSuccess?.(payload.email);
      }
    } catch {
      setStatus("Unable to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
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
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show password
        </label>

        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </form>

      {status && <div className="status">{status}</div>}
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
  );

  if (embedded) {
    return content;
  }

  return <div className="page auth-page">{content}</div>;
}

export default Login;
