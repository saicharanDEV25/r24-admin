import {
  Bell,
  Search,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  Settings,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";

import "./Navbar.css";

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function Navbar({ onMenuClick }) {

  const location = useLocation();

  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const { notifications, unreadCount, markAllRead } = useNotifications();

  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef(null);

  const [time, setTime] = useState(new Date());

  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {

    const interval = setInterval(() => {

      setTime(new Date());

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  const pageTitles = {

    "/dashboard": "Dashboard",

    "/products": "Products",

    "/categories": "Categories",

    "/orders": "Orders",

    "/customers": "Customers",

    "/gallery": "Gallery",

    "/reviews": "Reviews",

    "/contact": "Contact Messages",

    "/settings": "Settings",

    "/profile": "Profile",

  };

  const currentTitle = pageTitles[location.pathname] || "R24 Automotive";

  const currentDate = time.toLocaleDateString("en-IN", {

    weekday: "long",

    day: "numeric",

    month: "long",

    year: "numeric",

  });

  const currentTime = time.toLocaleTimeString("en-IN", {

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",

  });

  return (

    <header className="navbar">

      {/* Left Section Starts */}
            <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={onMenuClick}
        >

          <Menu size={22} />

        </button>

        <div className="navbar-title">

          <h2>

            {currentTitle}

          </h2>

          <p>

            {currentDate}

          </p>

        </div>

      </div>

      {/* Center Section Starts */}

      <div className="navbar-center">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Right Section Starts */}
            <div className="navbar-right">

        <div className="time-box">

          <span className="time-label">

            Live Time

          </span>

          <h4>

            {currentTime}

          </h4>

        </div>

        <div className="notification-menu" ref={notifRef}>

          <button
            className="icon-btn"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              if (!notifOpen) markAllRead();
            }}
          >

            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="notification-dot"></span>
            )}

          </button>

          {notifOpen && (
            <div className="notification-dropdown">

              <div className="notification-dropdown-header">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <p className="notification-empty">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    className="notification-item"
                    onClick={() => {
                      navigate(n.path);
                      setNotifOpen(false);
                    }}
                  >
                    <span>{n.message}</span>
                    <small>{timeAgo(n.createdAt)}</small>
                  </button>
                ))
              )}

            </div>
          )}

        </div>

        <button
          className="icon-btn"
          onClick={() => navigate("/settings")}
          title="Settings"
        >

          <Settings size={20} />

        </button>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >

          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}

        </button>

        <div className="profile-card">

          <div className="profile-avatar">

            A

          </div>

          <div className="profile-info">

            <h4>

              Alex

            </h4>

            <span>

              Super Administrator

            </span>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>

  );

}

export default Navbar;