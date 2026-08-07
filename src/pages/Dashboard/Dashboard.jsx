import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBoxOpen,
  FaCalendarCheck,
  FaImages,
  FaTags,
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
  totalCategories: 0,
  totalReviews: 0,
  totalMessages: 0,
  totalChatLeads: 0,
  recentProducts: [],
  recentGallery: [],
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
        totalCategories: data.totalCategories || 0,
        totalReviews: data.totalReviews || 0,
        totalMessages: data.totalMessages || 0,
        totalChatLeads: data.totalChatLeads || 0,
        recentProducts: data.recentProducts || [],
        recentGallery: data.recentGallery || [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    { icon: <FaBoxOpen />, value: dashboard.totalProducts, label: "Total Products", path: "/products" },
    { icon: <FaCalendarCheck />, value: dashboard.totalBookings, label: "Total Bookings", path: "/bookings" },
    { icon: <FaImages />, value: dashboard.totalGallery, label: "Total Gallery", path: "/gallery" },
    { icon: <FaTags />, value: dashboard.totalCategories, label: "Total Categories", path: "/categories" },
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
        {cards.map((card) => (
          <div
            key={card.label}
            className="dashboard-card"
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

      <div className="dashboard-content">

        <div className="dashboard-section">
          <h3>Recent Products</h3>

          <div className="recent-list">
            {dashboard.recentProducts.length > 0 ? (
              dashboard.recentProducts.map((product) => (
                <div className="recent-item" key={product.id}>
                  <span>{product.name}</span>
                  <span>₹ {product.price}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No products yet.</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Latest Gallery</h3>

          <div className="gallery-grid">
            {dashboard.recentGallery.length > 0 ? (
              dashboard.recentGallery.map((item) => (
                <div className="gallery-card" key={item.id}>
                  <img src={item.beforeImageUrl} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No gallery images yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
