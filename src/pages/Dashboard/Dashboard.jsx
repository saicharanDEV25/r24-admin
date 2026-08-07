import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaBoxOpen,
  FaCalendarCheck,
  FaImages,
  FaTags,
  FaStar,
  FaEnvelope,
  FaCommentDots,
} from "react-icons/fa";

import {
  MdDashboard,
} from "react-icons/md";

import { getDashboardData } from "../../services/dashboardService";
import CountUp from "../../components/CountUp/CountUp";

import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({

    totalProducts: 0,

    totalBookings: 0,

    totalGallery: 0,

    totalCategories: 0,

    totalReviews: 0,

    totalMessages: 0,

    totalChatLeads: 0,

    recentProducts: [],

    recentGallery: [],

  });

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    try {

      const data =
        await getDashboardData();

      setDashboard({

        totalProducts:
          data.totalProducts || 0,

        totalBookings:
          data.totalBookings || 0,

        totalGallery:
          data.totalGalleryImages || 0,

        totalCategories:
          data.totalCategories || 0,

        totalReviews:
          data.totalReviews || 0,

        totalMessages:
          data.totalMessages || 0,

        totalChatLeads:
          data.totalChatLeads || 0,

        recentProducts:
          data.recentProducts || [],

        recentGallery:
          data.recentGallery || [],

      });

    } catch (error) {

      console.log(error);

    }

  };

  const cardVariants = {

    hidden: {

      opacity: 0,

      y: 40,

    },

    visible: (index) => ({

      opacity: 1,

      y: 0,

      transition: {

        delay: index * 0.12,

        duration: 0.6,

      },

    }),

  };

  return (

    <div className="dashboard">

      {/* Banner */}

      <motion.div

        className="dashboard-banner glass-card"

        initial={{
          opacity: 0,
          y: -40,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: .6,
        }}

      >

        <div className="banner-content">

          <span className="banner-tag">

            R24 AUTOMOTIVE

          </span>

          <h1>

            Premium Admin Dashboard

          </h1>

          <p>

            Manage products,
            categories,
            gallery
            and services
            from one place.

          </p>

        </div>

        <div className="banner-icon">

          <MdDashboard size={90} />

        </div>

      </motion.div>

      {/* Summary Cards */}
            <div className="dashboard-cards">

        {/* Products Card */}

        <motion.div
          className="dashboard-card glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          onClick={() => navigate("/products")}
          style={{ cursor: "pointer" }}
        >

          <div className="card-icon gold">
            <FaBoxOpen />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalProducts}
                duration={2}
              />
            </h2>

            <span>Total Products</span>

            <p>
              Products available
            </p>

          </div>

          <small>

            Active

          </small>

        </motion.div>

        {/* Bookings Card */}

        <motion.div
          className="dashboard-card glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          onClick={() => navigate("/bookings")}
          style={{ cursor: "pointer" }}
        >

          <div className="card-icon blue">
            <FaCalendarCheck />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalBookings}
                duration={2}
              />
            </h2>

            <span>Total Bookings</span>

            <p>
              Service Bookings
            </p>

          </div>

          <small>

            Active

          </small>

        </motion.div>
                {/* Gallery Card */}

        <motion.div
          className="dashboard-card glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          onClick={() => navigate("/gallery")}
          style={{ cursor: "pointer" }}
        >

          <div className="card-icon green">
            <FaImages />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalGallery}
                duration={2}
              />
            </h2>

            <span>Total Gallery</span>

            <p>
              Uploaded Images
            </p>

          </div>

          <small>

            Active

          </small>

        </motion.div>

        {/* Categories Card */}

        <motion.div
          className="dashboard-card glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          onClick={() => navigate("/categories")}
          style={{ cursor: "pointer" }}
        >

          <div className="card-icon orange">
            <FaTags />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalCategories}
                duration={2}
              />
            </h2>

            <span>Total Categories</span>

            <p>
              Active Categories
            </p>

          </div>

          <small>

            Active

          </small>

        </motion.div>

        {/* Reviews Card */}

        <motion.div
          className="dashboard-card glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={4}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          onClick={() => navigate("/reviews")}
          style={{ cursor: "pointer" }}
        >

          <div className="card-icon gold">
            <FaStar />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalReviews}
                duration={2}
              />
            </h2>

            <span>Customer Reviews</span>

            <p>
              Submitted Reviews
            </p>

          </div>

          <small>

            Live

          </small>

        </motion.div>

        {/* Messages Card */}

        <motion.div
          className="dashboard-card glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={5}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          onClick={() => navigate("/contact-messages")}
          style={{ cursor: "pointer" }}
        >

          <div className="card-icon blue">
            <FaEnvelope />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalMessages}
                duration={2}
              />
            </h2>

            <span>Contact Messages</span>

            <p>
              From Contact Form
            </p>

          </div>

          <small>

            Live

          </small>

        </motion.div>

        {/* Chat Leads Card */}

        <motion.div
          className="dashboard-card glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={6}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          onClick={() => navigate("/chat-leads")}
          style={{ cursor: "pointer" }}
        >

          <div className="card-icon green">
            <FaCommentDots />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalChatLeads}
                duration={2}
              />
            </h2>

            <span>AI Chat Enquiries</span>

            <p>
              Captured by Chatbot
            </p>

          </div>

          <small>

            Live

          </small>

        </motion.div>

      </div>

      {/* Recent Products & Gallery */}

      <div className="dashboard-content">
              {/* Recent Products */}

        <motion.div
          className="dashboard-section glass-card"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <div className="section-header">

            <h3>Recent Products</h3>

            <span>Latest Added</span>

          </div>

          <div className="recent-list">

            {dashboard.recentProducts.length > 0 ? (

              dashboard.recentProducts.map((product, index) => (

                <motion.div
                  key={product.id}
                  className="recent-item"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.02,
                  }}
                >

                  <div className="recent-icon">
                    <FaBoxOpen />
                  </div>

                  <div className="recent-details">

                    <h4>{product.name}</h4>

                    <p>

                      ₹

                      <CountUp
                        end={product.price || 0}
                        duration={1.5}
                        separator={true}
                      />

                    </p>

                  </div>

                  <div className="recent-status">

                    <span className="status-active">

                      Available

                    </span>

                  </div>

                </motion.div>

              ))

            ) : (

              <div className="empty-box">

                <FaBoxOpen
                  size={45}
                  style={{
                    opacity: 0.35,
                    marginBottom: "15px",
                  }}
                />

                <h4>No Products Available</h4>

                <p>

                  Add your first product to display here.

                </p>

              </div>

            )}

          </div>

        </motion.div>
                {/* Latest Gallery */}

        <motion.div
          className="dashboard-section glass-card"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <div className="section-header">

            <h3>Latest Gallery</h3>

            <span>Recent Uploads</span>

          </div>

          <div className="gallery-grid">

            {dashboard.recentGallery.length > 0 ? (

              dashboard.recentGallery.map((item, index) => (

                <motion.div
                  key={item.id}
                  className="gallery-card"
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -8,
                  }}
                >

                  <img
                    src={item.beforeImageUrl}
                    alt={item.title}
                  />

                  <div className="gallery-overlay">

                    <h4>{item.title}</h4>

                    <span>Before Image</span>

                  </div>

                </motion.div>

              ))

            ) : (

              <div className="empty-box">

                <FaImages
                  size={45}
                  style={{
                    opacity: 0.35,
                    marginBottom: "15px",
                  }}
                />

                <h4>No Gallery Images</h4>

                <p>

                  Upload showroom images to showcase your work.

                </p>

              </div>

            )}

          </div>

        </motion.div>

      </div>
          </div>

  );

}

export default Dashboard;