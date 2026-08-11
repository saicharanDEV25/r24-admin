import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBoxOpen,
  FaCalendarCheck,
  FaImages,
  FaStar,
  FaEnvelope,
  FaCommentDots,
} from "react-icons/fa";

import { getDashboardData } from "../../services/dashboardService";

import "./Dashboard.css";

const emptyDashboard = {
  totalProducts: 0,
  totalBookings: 0,
  totalGallery: 0,
  totalReviews: 0,
  totalMessages: 0,
  totalChatLeads: 0,
};

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(emptyDashboard);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardData();

      setDashboard({
        totalProducts: data.totalProducts || 0,
        totalBookings: data.totalBookings || 0,
        totalGallery: data.totalGalleryImages || 0,
        totalReviews: data.totalReviews || 0,
        totalMessages: data.totalMessages || 0,
        totalChatLeads: data.totalChatLeads || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    { icon: <FaBoxOpen />, value: dashboard.totalProducts, label: "Total Products", path: "/products" },
    { icon: <FaCalendarCheck />, value: dashboard.totalBookings, label: "Total Bookings", path: "/bookings" },
    { icon: <FaImages />, value: dashboard.totalGallery, label: "Total Gallery", path: "/gallery" },
    { icon: <FaStar />, value: dashboard.totalReviews, label: "Customer Reviews", path: "/reviews" },
    { icon: <FaEnvelope />, value: dashboard.totalMessages, label: "Contact Messages", path: "/contact-messages" },
    { icon: <FaCommentDots />, value: dashboard.totalChatLeads, label: "AI Chat Enquiries", path: "/chat-leads" },
  ];

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of products, bookings and customer activity.</p>
      </div>

      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className="dashboard-card glass-card stagger-in"
            style={{ animationDelay: `${index * 0.06}s` }}
            onClick={() => navigate(card.path)}
          >
            <span className="card-icon">{card.icon}</span>
            <div>
              <h2>{card.value}</h2>
              <span>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
