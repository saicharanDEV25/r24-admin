import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Star,
  AlertTriangle,
} from "lucide-react";

import Layout from "../../components/Layout/Layout";

import "./Products.css";

import api from "../../services/api";

/* ==========================================
            INITIAL PRODUCT
========================================== */

const initialProduct = {

  id: null,

  name: "",

  category: "",

  price: "",

  description: "",

  stock: "",

  featured: false,

  active: true,

  imageUrl: "",

};

/* ==========================================
            COMPONENT
========================================== */

function Products() {

  /* ---------------- STATES ---------------- */

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [product, setProduct] = useState(initialProduct);

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {

    loadProducts();

    loadCategories();

  }, []);

  /* ==========================================
              LOAD PRODUCTS
  ========================================== */

  const loadProducts = async () => {

    try {

      setLoading(true);

      const response = await api.get("/products");

      setProducts(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* ==========================================
              LOAD CATEGORIES
  ========================================== */

  const loadCategories = async () => {

    try {

      const response = await api.get("/categories");

      setCategories(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* ==========================================
              HANDLE INPUT
  ========================================== */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({

      ...prev,

      [name]: type === "checkbox"
        ? checked
        : value,

    }));

  };

  /* ==========================================
              IMAGE SELECT
  ========================================== */

  const handleFileChange = (e) => {

    setSelectedFile(e.target.files[0]);

  };

  /* ==========================================
              IMAGE UPLOAD
  ========================================== */

  const uploadImage = async () => {

    if (!selectedFile) return "";

    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await api.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;

  };

  /* ==========================================
          NEXT PART STARTS HERE
  ========================================== */
    /* ==========================================
              OPEN ADD MODAL
  ========================================== */

  const openAddModal = () => {

    setProduct(initialProduct);

    setSelectedFile(null);

    setShowModal(true);

  };

  /* ==========================================
              CLOSE MODAL
  ========================================== */

  const closeModal = () => {

    setShowModal(false);

    setSelectedFile(null);

    setProduct(initialProduct);

  };

  /* ==========================================
              SAVE PRODUCT
  ========================================== */

  const saveProduct = async () => {

    if (
      !product.name ||
      !product.category ||
      !product.price
    ) {

      alert("Please fill all required fields.");

      return;

    }

    try {

      let imageName = product.imageUrl;

      if (selectedFile) {

        imageName = await uploadImage();

      }

      const payload = {

        name: product.name,

        category: {

          id: Number(product.category),

        },

        price: Number(product.price),

        description: product.description,

        stock: Number(product.stock),

        imageUrl: imageName,

        featured: product.featured,

        active: product.active,

      };

      if (product.id) {

        await api.put(
          `/products/${product.id}`,
          payload
        );

      } else {

        await api.post(
          "/products",
          payload
        );

      }

      closeModal();

      loadProducts();

    } catch (error) {

      console.log(error);

      alert("Unable to save product.");

    }

  };

  /* ==========================================
              EDIT PRODUCT
  ========================================== */

  const editProduct = (item) => {

    setProduct({

      id: item.id,

      name: item.name,

      category: item.category?.id || "",

      price: item.price,

      description: item.description,

      stock: item.stock,

      featured: item.featured,

      active: item.active,

      imageUrl: item.imageUrl,

    });

    setSelectedFile(null);

    setShowModal(true);

  };

  /* ==========================================
              DELETE PRODUCT
  ========================================== */

  const deleteProduct = async (id) => {

    const ok = window.confirm(

      "Are you sure you want to delete this product?"

    );

    if (!ok) return;

    try {

      await api.delete(`/products/${id}`);

      loadProducts();

    } catch (error) {

      console.log(error);

    }

  };

  /* ==========================================
              FILTER PRODUCTS
  ========================================== */

  const filteredProducts = products.filter((item) => {

    const matchSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      categoryFilter === ""
        ? true
        : item.category?.id === Number(categoryFilter);

    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? item.active
        : !item.active;

    return (
      matchSearch &&
      matchCategory &&
      matchStatus
    );

  });

  /* ==========================================
              DASHBOARD STATS
  ========================================== */

  const totalProducts = products.length;

  const featuredProducts =
    products.filter(
      (item) => item.featured
    ).length;

  const lowStockProducts =
    products.filter(
      (item) => item.stock <= 5
    ).length;

  const activeProducts =
    products.filter(
      (item) => item.active
    ).length;

  /* ==========================================
              JSX STARTS
  ========================================== */

  return (
    <>

      <div className="products-page-header">

        <div>

          <h1 className="page-title">
            Products Management
          </h1>

          <p className="page-subtitle">
            Manage all KTM spare parts, accessories & modification products.
          </p>

        </div>

        <button
          className="add-product-btn"
          onClick={openAddModal}
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>

      </div>



      <div className="product-stats">

        <div className="stat-card">

          <Package size={34} />

          <div>

            <h2>{totalProducts}</h2>

            <p>Total Products</p>

          </div>

        </div>

        <div className="stat-card">

          <Star size={34} />

          <div>

            <h2>{featuredProducts}</h2>

            <p>Featured Products</p>

          </div>

        </div>

        <div className="stat-card">

          <AlertTriangle size={34} />

          <div>

            <h2>{lowStockProducts}</h2>

            <p>Low Stock</p>

          </div>

        </div>

        <div className="stat-card">

          <Package size={34} />

          <div>

            <h2>{activeProducts}</h2>

            <p>Active Products</p>

          </div>

        </div>

      </div>

      {/* ==========================================
                  FILTERS
      ========================================== */}

      <div className="filter-bar">

        <div className="search-wrapper">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >

          <option value="">All Categories</option>

          {categories.map((cat) => (

            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>

          ))}

        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >

          <option value="all">All Status</option>

          <option value="active">Active</option>

          <option value="inactive">Inactive</option>

        </select>

      </div>

      {/* ==========================================
                  PRODUCTS TABLE
      ========================================== */}

      <div className="table-container">

        <table className="products-table">

          <thead>

            <tr>

              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>
                        {loading ? (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "50px",
                  }}
                >
                  Loading Products...
                </td>

              </tr>

            ) : filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "50px",
                  }}
                >
                  No Products Found
                </td>

              </tr>

            ) : (

              filteredProducts.map((item) => (

                <tr key={item.id}>

                  <td>

                    <img
                     src={item.imageUrl}
                      alt={item.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/70x70?text=No+Image";
                      }}
                    />

                  </td>

                  <td>

                    <strong>

                      {item.name}

                    </strong>

                  </td>

                  <td>

                    {item.category?.name}

                  </td>

                  <td>

                    ₹ {item.price}

                  </td>

                  <td>

                    <span
                      className={
                        item.stock <= 5
                          ? "badge danger"
                          : "badge success"
                      }
                    >
                      {item.stock}
                    </span>

                  </td>

                  <td>

                    <span
                      className={
                        item.active
                          ? "badge success"
                          : "badge danger"
                      }
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>

                  </td>

                  <td>

                    <span
                      className={
                        item.featured
                          ? "badge featured"
                          : "badge normal"
                      }
                    >
                      {item.featured ? "Yes" : "No"}
                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() => editProduct(item)}
                      >

                        <Pencil size={18} />

                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteProduct(item.id)}
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ==========================================
                  MODAL STARTS
      ========================================== */}

      {showModal && (

        <div className="modal">

          <div className="modal-content">

            <h2>

              {product.id
                ? "Update Product"
                : "Add Product"}

            </h2>
                        <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
            />

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
            >

              <option value="">
                Select Category
              </option>

              {categories.map((cat) => (

                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </option>

              ))}

            </select>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={product.stock}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              rows="4"
              value={product.description}
              onChange={handleChange}
            />

            <input
              type="file"
              onChange={handleFileChange}
            />

            {selectedFile && (

              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="preview-image"
              />

            )}

            {!selectedFile && product.imageUrl && (

              <img
                src={product.imageUrl}
                alt=""
                className="preview-image"
              />

            )}

            <div className="checkbox-group">

              <label>

                <input
                  type="checkbox"
                  name="featured"
                  checked={product.featured}
                  onChange={handleChange}
                />

                Featured Product

              </label>

              <label>

                <input
                  type="checkbox"
                  name="active"
                  checked={product.active}
                  onChange={handleChange}
                />

                Active Product

              </label>

            </div>

                       <div className="modal-buttons">

              <button
                className="save-btn"
                onClick={saveProduct}
              >
                {product.id
                  ? "Update Product"
                  : "Save Product"}
              </button>

              <button
                className="cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}

export default Products;