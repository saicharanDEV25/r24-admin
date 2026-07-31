import {
  LayoutDashboard,
  Tags,
  Package,
  Images,
  CalendarDays,
  Mail,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

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
    title: "Bookings",
    icon: <CalendarDays size={20} />,
    path: "/bookings",
  },
  {
    title: "Messages",
    icon: <Mail size={20} />,
    path: "/contact-messages",
  },
];

function Sidebar({ closeSidebar }) {

  const navigate = useNavigate();

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

    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <div className="logo-circle">

          R

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

            </div>

            <ChevronRight size={18} />

          </NavLink>

        ))}

      </div>

      {/* Bottom Section */}
            <div className="sidebar-bottom">

        <div className="admin-card">

          <div className="avatar">

            SC

          </div>

          <div className="admin-info">

            <h4>

              Sai Charan

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