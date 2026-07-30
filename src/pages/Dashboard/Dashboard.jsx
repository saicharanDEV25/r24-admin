import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaImages,
  FaTools,
  FaRupeeSign,
  FaArrowUp,
} from "react-icons/fa";
import {
  MdOutlineInventory2,
  MdDashboard,
} from "react-icons/md";
import { getDashboardData } from "../../services/dashboardService";
import "./Dashboard.css";
import { FaTags } from "react-icons/fa";

function Dashboard() {

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalServices: 0,
    totalGallery: 0,
    totalCategories: 0,
    totalRevenue: 0,
    recentProducts: [],
    recentGallery: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

   const data = await getDashboardData();

setDashboard(data);

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="dashboard">

      <div className="dashboard-banner">

        <div className="banner-content">

          <span className="banner-tag">
            R24 AUTOMOTIVE
          </span>

          <h1>
            Welcome Back 👋
          </h1>

          <p>
            Manage your showroom, products, gallery and
            services from one premium dashboard.
          </p>

        </div>

        <div className="banner-icon">

          <MdDashboard />

        </div>

      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">

          <div className="card-icon gold">

            <FaBoxOpen />

          </div>

          <div>

            <h2>{dashboard.totalProducts}</h2>

            <span>Total Products</span>

          </div>

          <small>

            <FaArrowUp />

            Active

          </small>

        </div>

        <div className="dashboard-card">

          <div className="card-icon blue">

            <FaTools />

          </div>

          <div>

            <h2>{dashboard.totalServices}</h2>

            <span>Total Services</span>

          </div>

          <small>

            <FaArrowUp />

            Available

          </small>

        </div>

        <div className="dashboard-card">

          <div className="card-icon green">

            <FaImages />

          </div>

          <div>

            <h2>{dashboard.totalGallery}</h2>

            <span>Gallery Images</span>

          </div>

          <small>

            <FaArrowUp />

            Updated

          </small>

        </div>
        <div className="dashboard-card">

  <div className="card-icon orange">

    <FaTags />

  </div>

  <div>

    <h2>{dashboard.totalCategories}</h2>

    <span>Total Categories</span>

  </div>

  <small>

    <FaArrowUp />

    Active

  </small>

</div>

      </div>
            <div className="dashboard-content">

        <div className="dashboard-section">

          <div className="section-header">

            <h3>Recent Products</h3>

          </div>

          <div className="recent-list">

            {dashboard.recentProducts && dashboard.recentProducts.length > 0 ? (

              dashboard.recentProducts.map((product) => (

                <div className="recent-item" key={product.id}>

                  <div className="recent-icon">

                    <MdOutlineInventory2 />

                  </div>

                  <div className="recent-details">

                    <h4>{product.name}</h4>

                    <p>
                      ₹ {product.price}
                    </p>

                  </div>

                </div>

              ))

            ) : (

              <div className="empty-box">

                No Products Available

              </div>

            )}

          </div>

        </div>

        <div className="dashboard-section">

          <div className="section-header">

            <h3>Latest Gallery</h3>

          </div>

          <div className="gallery-grid">

            {dashboard.recentGallery && dashboard.recentGallery.length > 0 ? (

              dashboard.recentGallery.map((item) => (

                <div className="gallery-card" key={item.id}>

                  <img
                    src={`http://localhost:8080/uploads/${item.beforeImageUrl}`}
                    alt={item.title}
                  />

                  <span>{item.title}</span>

                </div>

              ))

            ) : (

              <div className="empty-box">

                No Gallery Images

              </div>

            )}

          </div>

        </div>

      </div>

      <div className="quick-actions">

        <div className="action-card">

          <FaBoxOpen />

          <h4>Add Product</h4>

          <p>Create a new product.</p>

        </div>

        <div className="action-card">

          <FaImages />

          <h4>Add Gallery</h4>

          <p>Upload before & after images.</p>

        </div>

        <div className="action-card">

          <FaTools />

          <h4>Add Service</h4>

          <p>Create a new service.</p>

        </div>

      </div>

      <div className="stats-wrapper">

        <div className="stats-card">

          <div className="stats-head">

            <span>Products</span>

            <strong>{dashboard.totalProducts}</strong>

          </div>

          <div className="progress">

            <div
              className="progress-fill gold-fill"
              style={{ width: "90%" }}
            ></div>

          </div>

        </div>

        <div className="stats-card">

          <div className="stats-head">

            <span>Services</span>

            <strong>{dashboard.totalServices}</strong>

          </div>

          <div className="progress">

            <div
              className="progress-fill blue-fill"
              style={{ width: "75%" }}
            ></div>

          </div>

        </div>

        <div className="stats-card">

          <div className="stats-head">

            <span>Gallery</span>

            <strong>{dashboard.totalGallery}</strong>

          </div>

          <div className="progress">

            <div
              className="progress-fill green-fill"
              style={{ width: "85%" }}
            ></div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;