import { useEffect, useState } from "react";
import { fetchProfile } from "../services/api";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import ProfileSection from "../components/ProfileSection";
import SettingsSection from "../components/SettingsSection";
import "../App.css";

function HomePage({ user, onLogout }) {
  const [active, setActive] = useState("home");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: user?.email || "",
    mobileNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [originalProfileForm, setOriginalProfileForm] = useState({
    name: "",
    email: user?.email || "",
    mobileNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!user?.email) {
      return;
    }
    fetchProfile(user.email)
      .then((res) => {
        const profileData = {
          name: res.data.name || "",
          email: res.data.email || user.email,
          mobileNumber: res.data.mobileNumber || "",
          street: res.data.street || "",
          landmark: res.data.landmark || "",
          city: res.data.city || "",
          state: res.data.state || "",
          pincode: res.data.pincode || "",
        };
        setProfileForm(profileData);
        setOriginalProfileForm(profileData);
      })
      .catch(() => {
        setProfileForm((prev) => ({ ...prev, email: user.email }));
      });
  }, [user]);

  return (
    <div className="page home-page">
      <Sidebar
        active={active}
        setActive={setActive}
        profileName={profileForm.name}
        email={user?.email}
        onLogout={onLogout}
        onSettingsClick={() => {
          setActive("settings");
        }}
      />

      <main className="home-content">
        {active === "home" && (
          <Dashboard profileName={profileForm.name} />
        )}

        {active === "profile" && (
          <ProfileSection
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            originalProfileForm={originalProfileForm}
            setOriginalProfileForm={setOriginalProfileForm}
            email={user?.email}
          />
        )}

        {active === "settings" && (
          <SettingsSection email={user?.email} />
        )}
      </main>
    </div>
  );
}

export default HomePage;
