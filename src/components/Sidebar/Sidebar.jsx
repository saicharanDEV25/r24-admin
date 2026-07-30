import {
  FaTachometerAlt,
  FaTags,
  FaBoxOpen,
  FaImages,
  FaCalendarCheck,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    marginBottom: "10px",
    color: isActive ? "#000" : "#FFD700",
    background: isActive ? "#FFD700" : "transparent",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
  });

  return (
    <div
      style={{
        width: "250px",
        background: "#000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#FFD700", marginBottom: "30px" }}>
        R24 Admin
      </h2>

      <NavLink to="/dashboard" style={linkStyle}>
        <FaTachometerAlt />
        Dashboard
      </NavLink>

      <NavLink to="/categories" style={linkStyle}>
        <FaTags />
        Categories
      </NavLink>

      <NavLink to="/products" style={linkStyle}>
        <FaBoxOpen />
        Products
      </NavLink>

      <NavLink to="/gallery" style={linkStyle}>
        <FaImages />
        Gallery
      </NavLink>

      <NavLink to="/bookings" style={linkStyle}>
        <FaCalendarCheck />
        Bookings
      </NavLink>

      <NavLink to="/contact-messages" style={linkStyle}>
        <FaEnvelope />
        Messages
      </NavLink>

      <div
        style={{
          marginTop: "40px",
          color: "#FFD700",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
      >
        <FaSignOutAlt />
        Logout
      </div>
    </div>
  );
}

export default Sidebar;