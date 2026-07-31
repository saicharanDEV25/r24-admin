import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Gallery.css";

function Gallery() {

  const initialGallery = {
    title: "",
    description: "",
    beforeImageUrl: "",
    afterImageUrl: "",
    active: true,
  };

  const [galleryList, setGalleryList] = useState([]);
  const [gallery, setGallery] = useState(initialGallery);

  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await api.get("/gallery");
      setGalleryList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setGallery({
      ...gallery,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBeforeFileChange = (e) => {
    setBeforeFile(e.target.files[0]);
  };

  const handleAfterFileChange = (e) => {
    setAfterFile(e.target.files[0]);
  };

  const uploadFile = async (file, oldImage) => {

    if (!file) {
      return oldImage;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;

    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const openAddModal = () => {
    setGallery(initialGallery);
    setBeforeFile(null);
    setAfterFile(null);
    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setGallery(initialGallery);
    setBeforeFile(null);
    setAfterFile(null);
    setEditingId(null);
    setShowModal(false);
  };
    const saveGallery = async () => {

    try {

      const beforeImage = await uploadFile(
        beforeFile,
        gallery.beforeImageUrl
      );

      const afterImage = await uploadFile(
        afterFile,
        gallery.afterImageUrl
      );

      const payload = {
        ...gallery,
        beforeImageUrl: beforeImage,
        afterImageUrl: afterImage,
      };

      if (editingId) {
        await api.put(`/gallery/${editingId}`, payload);
      } else {
        await api.post("/gallery", payload);
      }

      loadGallery();
      closeModal();

    } catch (error) {
      console.log(error);
    }

  };

  const editGallery = (item) => {

    setGallery(item);
    setEditingId(item.id);

    setBeforeFile(null);
    setAfterFile(null);

    setShowModal(true);

  };

  const deleteGallery = async (id) => {

    if (!window.confirm("Delete this gallery item?")) {
      return;
    }

    try {

      await api.delete(`/gallery/${id}`);
      loadGallery();

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <>
      <div className="gallery-page">

        <div className="gallery-header">

          <h2>Gallery Management</h2>

          <button
            className="add-btn"
            onClick={openAddModal}
          >
            + Add Gallery
          </button>

        </div>

        <table className="gallery-table">

          <thead>

            <tr>
              <th>Before</th>
              <th>After</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {galleryList.map((item) => (

              <tr key={item.id}>

                <td>

                  <img
                    src={`https://r24-backend.onrender.com/uploads/${item.beforeImageUrl}`}
                    alt=""
                    className="gallery-image"
                  />

                </td>

                <td>

                  <img
                   src={`https://r24-backend.onrender.com/uploads/${item.afterImageUrl}`}
                    alt=""
                    className="gallery-image"
                  />

                </td>

                <td>{item.title}</td>

                <td>{item.description}</td>

                <td>{item.active ? "Active" : "Inactive"}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => editGallery(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteGallery(item.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
                {showModal && (

          <div className="modal-overlay">

            <div className="gallery-modal">

              <h2>
                {editingId ? "Edit Gallery" : "Add Gallery"}
              </h2>

              <div className="form-group">

                <label>Title</label>

                <input
                  type="text"
                  name="title"
                  value={gallery.title}
                  onChange={handleChange}
                  placeholder="Enter Gallery Title"
                />

              </div>

              <div className="form-group">

                <label>Description</label>

                <textarea
                  name="description"
                  value={gallery.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter Description"
                />

              </div>

              <div className="form-group">

                <label>Before Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBeforeFileChange}
                />

              </div>

              {beforeFile ? (

                <img
                  src={URL.createObjectURL(beforeFile)}
                  alt=""
                  className="preview-image"
                />

              ) : (

                gallery.beforeImageUrl && (

                  <img
                   src={`https://r24-backend.onrender.com/uploads/${gallery.beforeImageUrl}`}
                    alt=""
                    className="preview-image"
                  />

                )

              )}

              <div className="form-group">

                <label>After Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAfterFileChange}
                />

              </div>

              {afterFile ? (

                <img
                  src={URL.createObjectURL(afterFile)}
                  alt=""
                  className="preview-image"
                />

              ) : (

                gallery.afterImageUrl && (

                  <img
                    src={`https://r24-backend.onrender.com/uploads/${gallery.afterImageUrl}`}
                    alt=""
                    className="preview-image"
                  />

                )

              )}

              <div className="checkbox-group">

                <input
                  type="checkbox"
                  name="active"
                  checked={gallery.active}
                  onChange={handleChange}
                />

                <label>Active</label>

              </div>

              <div className="modal-buttons">

                <button
                  className="save-btn"
                  onClick={saveGallery}
                >
                  {editingId ? "Update" : "Save"}
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

      </div>

    </>
  );

}

export default Gallery;