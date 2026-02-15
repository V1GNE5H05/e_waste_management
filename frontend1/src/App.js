import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Launch from "./pages/Launch";
import HomePage from "./pages/HomePage";
import { logout } from "./services/api";

function AppRoutes() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ewaste_user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthExpired = () => {
      localStorage.removeItem("ewaste_user");
      setUser(null);
      navigate("/", { replace: true });
    };
    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      
    }
    localStorage.removeItem("ewaste_user");
    setUser(null);
    navigate("/", { replace: true });
  };

  const handleLoginSuccess = (email) => {
    const nextUser = { email };
    localStorage.setItem("ewaste_user", JSON.stringify(nextUser));
    setUser(nextUser);
    navigate("/home", { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to="/home" replace /> : <Launch onLoginSuccess={handleLoginSuccess} />
        }
      />
      <Route
        path="/home"
        element={
          user ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      />
      {}
      <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
