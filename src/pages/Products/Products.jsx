import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  Folder,
} from "lucide-react";

import Layout from "../../components/Layout/Layout";
import CountUp from "../../components/CountUp/CountUp";

import "./Products.css";

import api from "../../services/api";
import { BIKE_BRANDS } from "../../constants/bikes";

const initialProduct = {

  id: null,

  name: "",

  brand: "",

  model: "",

  category: "",

  price: "",

  description: "",

  stock: "",

  active: true,

  imageUrl: "",

};

function Products() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // null viewBrand = brand folders at root, null viewModel = model folders inside a brand;
  // typing a search skips both and goes straight to the table, scoped to the current folder
  const [viewBrand, setViewBrand] = useState(null);

  const [viewModel, setViewModel] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {

    loadProducts();

  }, []);

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

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({

      ...prev,

      [name]: type === "checkbox"
        ? checked
        : value,

      // changing brand resets model since the model list depends on it
      ...(name === "brand" ? { model: "" } : {}),

    }));

  };

  const brandModels =
    BIKE_BRANDS.find((b) => b.brand === product.brand)?.models || [];

  const handleFileChange = (e) => {

    setSelectedFile(e.target.files[0]);

  };

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

  const openAddModal = () => {

    // pre-fill brand/model from the folder you're browsing in
    setProduct({
      ...initialProduct,
      brand: viewBrand || "",
      model: viewModel || "",
    });

    setSelectedFile(null);

    setShowModal(true);

  };

  const closeModal = () => {

    setShowModal(false);

    setSelectedFile(null);

    setProduct(initialProduct);

  };

  const saveProduct = async () => {

    if (
      !product.name ||
      !product.category ||
      product.price === "" ||
      product.price === null ||
      product.price === undefined
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

        brand: product.brand || null,

        model: product.model || null,

        category: {

          name: product.category.trim(),

        },

        price: Number(product.price),

        description: product.description,

        stock: Number(product.stock),

        imageUrl: imageName,

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

  const editProduct = (item) => {

    setProduct({

      id: item.id,

      name: item.name,

      brand: item.brand || "",

      model: item.model || "",

      category: item.category?.name || "",

      price: item.price,

      description: item.description,

      stock: item.stock,

      active: item.active,

      imageUrl: item.imageUrl,

    });

    setSelectedFile(null);

    setShowModal(true);

  };

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

  const openBrandFolder = (b) => {
    setViewBrand(b);
    setViewModel(null);
    setSearch("");
  };

  const openModelFolder = (m) => {
    setViewModel(m);
    setSearch("");
  };

  const goToRoot = () => {
    setViewBrand(null);
    setViewModel(null);
    setSearch("");
  };

  const goToBrandLevel = () => {
    setViewModel(null);
    setSearch("");
  };

  const brandFolderCounts = { Unassigned: 0 };
  products.forEach((item) => {
    const b = item.brand || "Unassigned";
    brandFolderCounts[b] = (brandFolderCounts[b] || 0) + 1;
  });

  const brandFolders = [
    ...BIKE_BRANDS.map((b) => b.brand),
    ...(brandFolderCounts.Unassigned > 0 ? ["Unassigned"] : []),
  ];

  const viewBrandModels =
    BIKE_BRANDS.find((b) => b.brand === viewBrand)?.models || [];

  // no model set = fits every model of its brand (same rule as the storefront)
  const modelFolderCounts = {};
  viewBrandModels.forEach((m) => {
    modelFolderCounts[m] = products.filter(
      (item) => (item.brand || "Unassigned") === viewBrand &&
        (!item.model || item.model === m)
    ).length;
  });

  const searching = search.trim().length > 0;
  const hasModelLevel = viewBrandModels.length > 1;

  const showBrandFolders = !viewBrand && !searching;
  const showModelFolders = viewBrand && !viewModel && hasModelLevel && !searching;

  let scopedProducts = products;

  if (viewBrand) {
    scopedProducts = scopedProducts.filter(
      (item) => (item.brand || "Unassigned") === viewBrand
    );

    if (viewModel) {
      scopedProducts = scopedProducts.filter(
        (item) => !item.model || item.model === viewModel
      );
    }
  }

  const filteredProducts = scopedProducts.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;

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

      <div className="folder-breadcrumb">

        <button
          className={!viewBrand ? "active" : ""}
          onClick={goToRoot}
        >
          All Products
        </button>

        {viewBrand && (
          <>
            <span className="crumb-sep">/</span>
            <button
              className={viewBrand && !viewModel ? "active" : ""}
              onClick={goToBrandLevel}
            >
              {viewBrand}
            </button>
          </>
        )}

        {viewModel && (
          <>
            <span className="crumb-sep">/</span>
            <button className="active">{viewModel}</button>
          </>
        )}

      </div>

      <div className="filter-bar">

        <div className="search-wrapper">

          <Search size={18} />

          <input
            type="text"
            placeholder={
              viewBrand
                ? `Search inside ${viewModel || viewBrand}...`
                : "Search all products..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {showBrandFolders && (
        <div className="folder-grid">

          {brandFolders.map((b) => (

            <button
              key={b}
              className="folder-card"
              onClick={() => openBrandFolder(b)}
            >
              <Folder size={36} />
              <span className="folder-name">{b}</span>
              <span className="folder-count">
                {brandFolderCounts[b] || 0} products
              </span>
            </button>

          ))}

        </div>
      )}

      {showModelFolders && (
        <div className="folder-grid">

          {viewBrandModels.map((m) => (

            <button
              key={m}
              className="folder-card"
              onClick={() => openModelFolder(m)}
            >
              <Folder size={36} />
              <span className="folder-name">{m}</span>
              <span className="folder-count">
                {modelFolderCounts[m] || 0} products
              </span>
            </button>

          ))}

        </div>
      )}

      {!showBrandFolders && !showModelFolders && (

      <div className="table-container glass-card">

        <table className="products-table">

          <thead>

            <tr>

              <th>Image</th>
              <th>Name</th>
              <th>Brand / Model</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>
                        {loading ? (

              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><span className="skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} /></td>
                  <td><span className="skeleton" style={{ width: "80%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: "70%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: "60%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 50, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 40, height: 20, borderRadius: 20 }} /></td>
                  <td><span className="skeleton" style={{ width: 60, height: 20, borderRadius: 20 }} /></td>
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

                    {item.brand ? (
                      <>
                        {item.brand}
                        {item.model && (
                          <span style={{ display: "block", opacity: 0.65, fontSize: 12 }}>
                            {item.model}
                          </span>
                        )}
                      </>
                    ) : (
                      <span style={{ opacity: 0.5 }}>—</span>
                    )}

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

      )}

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
                  <label>Brand</label>
                  <select
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                  >

                    <option value="">
                      No specific brand
                    </option>

                    {BIKE_BRANDS.map((b) => (

                      <option
                        key={b.brand}
                        value={b.brand}
                      >
                        {b.brand}
                      </option>

                    ))}

                  </select>
                </div>

                <div className="form-group">
                  <label>Model</label>
                  <select
                    name="model"
                    value={product.model}
                    onChange={handleChange}
                    disabled={!product.brand}
                  >

                    <option value="">
                      Fits every {product.brand || "brand"} model
                    </option>

                    {brandModels.map((m) => (

                      <option
                        key={m}
                        value={m}
                      >
                        {m}
                      </option>

                    ))}

                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Type a category (existing or new)"
                    value={product.category}
                    onChange={handleChange}
                    autoComplete="off"
                  />
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