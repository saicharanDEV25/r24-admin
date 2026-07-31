import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  FaBoxOpen,
  FaTools,
  FaImages,
  FaTags,
} from "react-icons/fa";

import {
  MdDashboard,
} from "react-icons/md";

import { getDashboardData } from "../../services/dashboardService";

import "./Dashboard.css";

/* ===========================================
      Custom CountUp
=========================================== */

function CountUp({
  end = 0,
  duration = 2,
  separator = false,
}) {

  const [count, setCount] = useState(0);

  const frameRef = useRef(null);

  useEffect(() => {

    const target = Number(end) || 0;

    const durationMs = duration * 1000;

    let startTime = null;

    const animate = (time) => {

      if (!startTime) startTime = time;

      const progress = Math.min(
        (time - startTime) / durationMs,
        1
      );

      setCount(
        Math.floor(progress * target)
      );

      if (progress < 1) {

        frameRef.current =
          requestAnimationFrame(animate);

      } else {

        setCount(target);

      }

    };

    frameRef.current =
      requestAnimationFrame(animate);

    return () => {

      if (frameRef.current) {

        cancelAnimationFrame(
          frameRef.current
        );

      }

    };

  }, [end, duration]);

  return (
    <>
      {separator
        ? count.toLocaleString("en-IN")
        : count}
    </>
  );

}

/* ===========================================
          Dashboard
=========================================== */

function Dashboard() {

  const [dashboard, setDashboard] = useState({

    totalProducts: 0,

    totalServices: 0,

    totalGallery: 0,

    totalCategories: 0,

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

        totalServices:
          data.totalServices || 0,

        totalGallery:
          data.totalGallery || 0,

        totalCategories:
          data.totalCategories || 0,

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

      {/* =========================
            Banner
      ========================= */}

      <motion.div

        className="dashboard-banner"

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

      {/* ==========================================
            SUMMARY CARDS STARTS HERE
            PART-2
      ========================================== */}
            <div className="dashboard-cards">

        {/* Products Card */}

        <motion.div
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
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

        {/* Services Card */}

        <motion.div
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
        >

          <div className="card-icon blue">
            <FaTools />
          </div>

          <div className="card-content">

            <h2>
              <CountUp
                end={dashboard.totalServices}
                duration={2}
              />
            </h2>

            <span>Total Services</span>

            <p>
              Premium Services
            </p>

          </div>

          <small>

            Active

          </small>

        </motion.div>
                {/* Gallery Card */}

        <motion.div
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
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
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
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

      </div>

      {/* ==========================================
            RECENT PRODUCTS & GALLERY
      ========================================== */}

      <div className="dashboard-content">
              {/* ===========================
              Recent Products
        ============================ */}

        <motion.div
          className="dashboard-section"
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
                {/* ===========================
              Latest Gallery
        ============================ */}

        <motion.div
          className="dashboard-section"
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
                    src={`http://localhost:8080/uploads/${item.beforeImageUrl}`}
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