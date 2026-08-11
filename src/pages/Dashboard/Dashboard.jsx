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
import api from "../../services/api";
import CountUp from "../../components/CountUp/CountUp";

import "./Dashboard.css";

const emptyDashboard = {
  totalProducts: 0,
  totalBookings: 0,
  totalGallery: 0,
  totalReviews: 0,
  totalMessages: 0,
  totalChatLeads: 0,
};

const ONLINE_POLL_INTERVAL_MS = 10 * 1000;

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [onlineCount, setOnlineCount] = useState(0);
  const [visitsToday, setVisitsToday] = useState(0);
  const [visitsThisMonth, setVisitsThisMonth] = useState(0);

  useEffect(() => {
    loadDashboard();
    loadAnalyticsSummary();
  }, []);

  useEffect(() => {
    loadOnlineCount();
    const interval = setInterval(loadOnlineCount, ONLINE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const loadOnlineCount = async () => {
    try {
      const response = await api.get("/analytics/online-count");
      setOnlineCount(response.data.onlineCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAnalyticsSummary = async () => {
    try {
      const response = await api.get("/analytics/summary");
      setVisitsToday(response.data.visitsToday || 0);
      setVisitsThisMonth(response.data.visitsThisMonth || 0);
    } catch (error) {
      console.log(error);
    }
  };

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

      <div className="dashboard-analytics-preview glass-card">
        <div className="dap-header">
          <div>
            <h3>Live Analytics</h3>
            <p>Quick pulse on today's website traffic.</p>
          </div>
          <button className="dap-view-btn" onClick={() => navigate("/analytics")}>
            View Full Analytics →
          </button>
        </div>

        <div className="dap-stats">
          <div className="dap-stat online">
            <span className="dap-dot" />
            <h2><CountUp end={onlineCount} duration={0.8} /></h2>
            <p>Online Right Now</p>
          </div>
          <div className="dap-stat">
            <h2><CountUp end={visitsToday} duration={1.2} /></h2>
            <p>Visits Today</p>
          </div>
          <div className="dap-stat">
            <h2><CountUp end={visitsThisMonth} duration={1.2} /></h2>
            <p>Visits This Month</p>
          </div>
        </div>
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
