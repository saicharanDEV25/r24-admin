import {
  Search,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  Settings,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

import "./Navbar.css";

function Navbar({ onMenuClick }) {

  const location = useLocation();

  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [time, setTime] = useState(new Date());

  const [search, setSearch] = useState("");

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

    "/gallery": "Gallery",

    "/reviews": "Reviews",

    "/chat-leads": "Chat Leads",

    "/bookings": "Bookings",

    "/contact-messages": "Contact Messages",

    "/analytics": "Analytics",

    "/settings": "Settings",

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