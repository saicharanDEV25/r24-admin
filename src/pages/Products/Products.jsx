import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Products.css";
import api from "../../services/api";

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
const [search, setSearch] = useState("");   
  const [showModal, setShowModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {

    setSelectedFile(e.target.files[0]);

  };

  const uploadImage = async () => {

    if (!selectedFile) return "";

    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const openAddModal = () => {

    setProduct(initialProduct);

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
  !product.price
) {
  alert("Please fill all required fields");
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
        imageUrl: imageName,
        stock: Number(product.stock),
        featured: product.featured,
        active: product.active,
      };

      if (product.id) {

        await api.put(`/products/${product.id}`, payload);

      } else {

        await api.post("/products", payload);

      }

      closeModal();

      loadProducts();

    } catch (e) {

      console.log(e);

      alert("Unable to Save Product");

    }

  };

  const editProduct = (item) => {

    setProduct({
      id: item.id,
      name: item.name,
      category: item.category?.id,
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

  const deleteProduct = async (id) => {

    const ok = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!ok) return;

    try {

      await api.delete(`/products/${id}`);

      loadProducts();

    } catch (e) {

      console.log(e);

    }

  };

 const filteredProducts = products.filter((p) =>
  (p.name || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);
  return (

    <Layout>

      <h1 className="page-title">Products</h1>

      <div className="products-header">

        <input
  type="text"
  placeholder="Search Product..."
  className="search-box"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

        <button
          className="add-btn"
          onClick={openAddModal}
        >
          + Add Product
        </button>

      </div>

      <table className="products-table">

        <thead>

          <tr>

            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Featured</th>
            <th>Active</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {filteredProducts.map((product) => (
                        <tr key={product.id}>

              <td>

               <img
 src={`https://r24-backend.onrender.com/uploads/${product.imageUrl}`}
  alt={product.name}
  width="70"
  height="70"
  style={{
    objectFit: "cover",
    borderRadius: "8px",
  }}
  onError={(e) => {
    e.target.src = "https://placehold.co/70x70?text=No+Image";
  }}
/>

              </td>

              <td>{product.name}</td>

              <td>{product.category?.name}</td>

              <td>₹ {product.price}</td>

              <td>{product.stock}</td>

              <td>{product.featured ? "Yes" : "No"}</td>

              <td>{product.active ? "Yes" : "No"}</td>

              <td>

                <button
                  style={{
                    background: "#FFD700",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginRight: "10px",
                    fontWeight: "bold",
                  }}
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>

                <button
                  style={{
                    background: "#ff3b30",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {showModal && (

        <div className="modal">

          <div className="modal-content">

            <h2>

              {product.id ? "Edit Product" : "Add Product"}

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

            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={product.stock}
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
    width="120"
    height="120"
  />
)}

{!selectedFile && product.imageUrl && (
  <img
  src={`${
    import.meta.env.DEV
      ? "http://localhost:8080"
      : "https://r24-backend.onrender.com"
  }/uploads/${product.imageUrl}`}
  alt=""
  width="120"
  height="120"
  style={{
    objectFit: "cover",
    borderRadius: "8px",
  }}
/>
)}

<label>
  <input
    type="checkbox"
    name="featured"
    checked={product.featured}
    onChange={handleChange}
  />
  Featured
</label>

            <label>

              <input
                type="checkbox"
                name="active"
                checked={product.active}
                onChange={handleChange}
              />

              Active

            </label>
                        <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              <button
                className="add-btn"
                onClick={saveProduct}
              >
                {product.id ? "Update Product" : "Save Product"}
              </button>

              <button
                style={{
                  background: "#666",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={closeModal}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </Layout>

  );

}

export default Products;