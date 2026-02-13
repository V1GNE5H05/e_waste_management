import { useState, useEffect } from "react";
import "./App.css";
import Launch from "./pages/Launch";
import HomePage from "./pages/HomePage";
import { logout } from "./services/api";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ewaste_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState(user ? "development" : "launch");

  // Listen for auth expiration (401 responses)
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setView("launch");
    };
    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // clears JWT cookie on server
    } catch {
      // ignore errors, still clear local state
    }
    localStorage.removeItem("ewaste_user");
    setUser(null);
    setView("launch");
  };

  if (view === "development") {
    return (
      <HomePage
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Launch
      onLoginSuccess={(email) => {
        const nextUser = { email };
        localStorage.setItem("ewaste_user", JSON.stringify(nextUser));
        setUser(nextUser);
        setView("development");
      }}
    />
  );
}

export default App;
