import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Tags,
  Package,
  Images,
  Star,
  MessageSquare,
  CalendarDays,
  Mail,
  BarChart3,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./Sidebar.css";

const menus = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
  {
    title: "Categories",
    icon: <Tags size={20} />,
    path: "/categories",
  },
  {
    title: "Products",
    icon: <Package size={20} />,
    path: "/products",
  },
  {
    title: "Gallery",
    icon: <Images size={20} />,
    path: "/gallery",
  },
  {
    title: "Reviews",
    icon: <Star size={20} />,
    path: "/reviews",
  },
  {
    title: "Chat Leads",
    icon: <MessageSquare size={20} />,
    path: "/chat-leads",
    badgeKey: "chatLeads",
  },
  {
    title: "Bookings",
    icon: <CalendarDays size={20} />,
    path: "/bookings",
  },
  {
    title: "Messages",
    icon: <Mail size={20} />,
    path: "/contact-messages",
  },
  {
    title: "Analytics",
    icon: <BarChart3 size={20} />,
    path: "/analytics",
  },
];

function Sidebar({ closeSidebar }) {

  const navigate = useNavigate();

  const [unreadLeads, setUnreadLeads] = useState(0);

  useEffect(() => {

    const loadUnreadCount = async () => {
      try {
        const res = await api.get("/chat-leads/unread-count");
        setUnreadLeads(res.data.count || 0);
      } catch (error) {
        console.log(error);
      }
    };

    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 20000);

    return () => clearInterval(interval);

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  const handleNavClick = () => {

    if (closeSidebar) {

      closeSidebar();

    }

  };

  return (

    <aside className="sidebar glass-card">

      {/* Logo */}

      <div className="sidebar-logo">

        <div className="logo-circle">

          R24

        </div>

        <div className="logo-text">

          <h2>R24 Automotive</h2>

          <span>Premium Admin Panel</span>

        </div>

      </div>

      {/* Navigation Starts Here */}
            <div className="sidebar-menu">

        {menus.map((item) => (

          <NavLink
            key={item.title}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "menu-item active"
                : "menu-item"
            }
          >

            <div className="menu-left">

              {item.icon}

              <span>

                {item.title}

              </span>

              {item.badgeKey === "chatLeads" && unreadLeads > 0 && (
                <span className="menu-badge">{unreadLeads}</span>
              )}

            </div>

            <ChevronRight size={18} />

          </NavLink>

        ))}

      </div>

      {/* Bottom Section */}
            <div className="sidebar-bottom">

        <div className="admin-card glass-card">

          <div className="avatar">

            A

          </div>

          <div className="admin-info">

            <h4>

              Alex

            </h4>

            <p>

              <ShieldCheck size={14} />

              Super Administrator

            </p>

          </div>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <LogOut size={18} />

          <span>

            Logout

          </span>

        </button>

      </div>

    </aside>

  );

}

export default Sidebar;