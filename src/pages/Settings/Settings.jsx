import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./Settings.css";

const defaultPrefs = {
  chatLeadAlerts: true,
  bookingAlerts: true,
  reviewAlerts: false,
};

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem("admin-notification-prefs");
    return saved ? JSON.parse(saved) : defaultPrefs;
  });

  const togglePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    localStorage.setItem("admin-notification-prefs", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Manage your admin account, appearance and notification preferences.
        </p>
      </div>

      <div className="settings-grid">
        <div className="settings-card glass-card">
          <h3>Admin Profile</h3>

          <div className="settings-profile-row">
            <div className="settings-avatar">A</div>
            <div>
              <h4>Alex</h4>
              <p>
                <ShieldCheck size={14} /> Super Administrator
              </p>
            </div>
          </div>

          <button className="settings-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="settings-card glass-card">
          <h3>Appearance</h3>
          <p className="settings-card-desc">
            Switch between dark and light mode across the admin panel.
          </p>

          <div className="theme-toggle-row">
            <button
              className={theme === "dark" ? "theme-btn active" : "theme-btn"}
              onClick={() => theme !== "dark" && toggleTheme()}
            >
              <Moon size={18} /> Dark
            </button>

            <button
              className={theme === "light" ? "theme-btn active" : "theme-btn"}
              onClick={() => theme !== "light" && toggleTheme()}
            >
              <Sun size={18} /> Light
            </button>
          </div>
        </div>

        <div className="settings-card glass-card">
          <h3>Notifications</h3>
          <p className="settings-card-desc">
            Choose what shows a badge/alert in the sidebar.
          </p>

          <div className="settings-toggle-list">
            <label className="settings-toggle">
              <span>AI Chat Enquiry alerts</span>
              <input
                type="checkbox"
                checked={prefs.chatLeadAlerts}
                onChange={() => togglePref("chatLeadAlerts")}
              />
              <span className="toggle-slider" />
            </label>

            <label className="settings-toggle">
              <span>New booking alerts</span>
              <input
                type="checkbox"
                checked={prefs.bookingAlerts}
                onChange={() => togglePref("bookingAlerts")}
              />
              <span className="toggle-slider" />
            </label>

            <label className="settings-toggle">
              <span>New review alerts</span>
              <input
                type="checkbox"
                checked={prefs.reviewAlerts}
                onChange={() => togglePref("reviewAlerts")}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
