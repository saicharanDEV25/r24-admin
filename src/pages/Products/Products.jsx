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
import CountUp from "../../components/CountUp/CountUp";

import "./Products.css";

import api from "../../services/api";

/* Initial Product */

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

  /* Load Products */

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

  /* Load Categories */

  const loadCategories = async () => {

    try {

      const response = await api.get("/categories");

      setCategories(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* Handle Input */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({

      ...prev,

      [name]: type === "checkbox"
        ? checked
        : value,

    }));

  };

  /* Image Select */

  const handleFileChange = (e) => {

    setSelectedFile(e.target.files[0]);

  };

  /* Image Upload */

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

  /* Open Add Modal */

  const openAddModal = () => {

    setProduct(initialProduct);

    setSelectedFile(null);

    setShowModal(true);

  };

  /* Close Modal */

  const closeModal = () => {

    setShowModal(false);

    setSelectedFile(null);

    setProduct(initialProduct);

  };

  /* Save Product */

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

  /* Edit Product */

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

  /* Delete Product */

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

  /* Filter Products */

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

  /* Dashboard Stats */

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

        <div className="stat-card glass-card stagger-in">

          <Package size={34} />

          <div>

            <h2><CountUp end={totalProducts} duration={1.2} /></h2>

            <p>Total Products</p>

          </div>

        </div>

        <div className="stat-card glass-card stagger-in">

          <Star size={34} />

          <div>

            <h2><CountUp end={featuredProducts} duration={1.2} /></h2>

            <p>Featured Products</p>

          </div>

        </div>

        <div className="stat-card glass-card stagger-in">

          <AlertTriangle size={34} />

          <div>

            <h2><CountUp end={lowStockProducts} duration={1.2} /></h2>

            <p>Low Stock</p>

          </div>

        </div>

        <div className="stat-card glass-card stagger-in">

          <Package size={34} />

          <div>

            <h2><CountUp end={activeProducts} duration={1.2} /></h2>

            <p>Active Products</p>

          </div>

        </div>

      </div>

      {/* Filters */}

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

      {/* Products Table */}

      <div className="table-container glass-card">

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

              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><span className="skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} /></td>
                  <td><span className="skeleton" style={{ width: "80%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: "60%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 50, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 40, height: 20, borderRadius: 20 }} /></td>
                  <td><span className="skeleton" style={{ width: 60, height: 20, borderRadius: 20 }} /></td>
                  <td><span className="skeleton" style={{ width: 40, height: 20, borderRadius: 20 }} /></td>
                  <td><span className="skeleton" style={{ width: 60, height: 30, borderRadius: 8 }} /></td>
                </tr>
              ))

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

      {showModal && (

        <div className="modal-overlay">

          <div className="modal glass-card">

            <div className="modal-header">
              <h2>
                {product.id
                  ? "Update Product"
                  : "Add Product"}
              </h2>
            </div>

            <div className="modal-body">

              <div className="form-grid">

                <div className="form-group full-width">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
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
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={product.stock}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    rows="4"
                    value={product.description}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="image-upload">
                <input
                  type="file"
                  onChange={handleFileChange}
                />

                {selectedFile && (
                  <div className="image-preview">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                    />
                  </div>
                )}

                {!selectedFile && product.imageUrl && (
                  <div className="image-preview">
                    <img
                      src={product.imageUrl}
                      alt=""
                    />
                  </div>
                )}
              </div>

              <div className="checkbox-row">

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={product.featured}
                    onChange={handleChange}
                  />
                  <label>Featured Product</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="active"
                    checked={product.active}
                    onChange={handleChange}
                  />
                  <label>Active Product</label>
                </div>

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

        </div>

      )}

    </>

  );

}

export default Products;