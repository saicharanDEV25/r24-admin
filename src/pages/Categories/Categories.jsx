import { useEffect, useState } from "react";

import { Plus, Search, Pencil, Trash2, FolderOpen } from "lucide-react";

import "../Products/Products.css";
import "./Categories.css";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const initialCategory = {
  id: null,
  name: "",
  description: "",
  imageUrl: "",
  active: true,
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(initialCategory);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setCategory(initialCategory);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCategory(initialCategory);
  };

  const editCategory = (item) => {
    setCategory({
      id: item.id,
      name: item.name,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      active: item.active,
    });
    setShowModal(true);
  };

  const saveCategory = async () => {
    if (!category.name) {
      alert("Please enter a category name.");
      return;
    }

    try {
      const payload = {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        active: category.active,
      };

      if (category.id) {
        await updateCategory(category.id, payload);
      } else {
        await addCategory(payload);
      }

      closeModal();
      loadCategories();
    } catch (error) {
      console.log(error);
      alert("Unable to save category.");
    }
  };

  const removeCategory = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!ok) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.log(error);
      alert("Unable to delete category. It may still have products linked to it.");
    }
  };

  const filteredCategories = categories.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="products-page-header">
        <div>
          <h1 className="page-title">Categories Management</h1>
          <p className="page-subtitle">
            Manage the product categories customers filter by, e.g. KTM
            Genuine Parts.
          </p>
        </div>

        <button className="add-product-btn" onClick={openAddModal}>
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>
                  Loading Categories...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>
                  No Categories Found
                </td>
              </tr>
            ) : (
              filteredCategories.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/70x70?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="category-icon-fallback">
                        <FolderOpen size={26} />
                      </div>
                    )}
                  </td>

                  <td>
                    <strong>{item.name}</strong>
                  </td>

                  <td className="category-description-cell">
                    {item.description || "—"}
                  </td>

                  <td>
                    <span
                      className={item.active ? "badge success" : "badge danger"}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => editCategory(item)}>
                        <Pencil size={18} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => removeCategory(item.id)}
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
          <div className="modal">
            <div className="modal-header">
              <h2>{category.id ? "Update Category" : "Add Category"}</h2>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Category Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Air Filters"
                    value={category.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Short description shown to customers"
                    rows="3"
                    value={category.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="https://..."
                    value={category.imageUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="active"
                  checked={category.active}
                  onChange={handleChange}
                />
                <label>Active Category</label>
              </div>

              <div className="modal-buttons">
                <button className="save-btn" onClick={saveCategory}>
                  {category.id ? "Update Category" : "Save Category"}
                </button>

                <button className="cancel-btn" onClick={closeModal}>
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

export default Categories;
