import { useState } from "react";
import "./App.css";
import Launch from "./pages/Launch";
import HomePage from "./pages/HomePage";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ewaste_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState(user ? "development" : "launch");

  if (view === "development") {
    return (
      <HomePage
        user={user}
        onLogout={() => {
          localStorage.removeItem("ewaste_user");
          setUser(null);
          setView("launch");
        }}
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
