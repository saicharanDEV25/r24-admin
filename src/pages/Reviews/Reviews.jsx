import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "../../services/api";
import "./Reviews.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews");
      setReviews(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/reviews/${id}`);
      loadReviews();
    } catch (error) {
      console.log(error);
      alert("Unable to delete review.");
    }
  };

  return (
    <div className="reviews-page">
      <div className="reviews-page-header">
        <h1 className="page-title">Customer Reviews</h1>
        <p className="page-subtitle">
          Moderate reviews submitted by customers on the website. Delete
          anything inappropriate or spammy.
        </p>
      </div>

      <div className="table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>
                  Loading Reviews...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>
                  No Reviews Yet
                </td>
              </tr>
            ) : (
              reviews.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>

                  <td>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={star <= item.rating ? "#f59e0b" : "none"}
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                  </td>

                  <td className="review-message-cell">{item.message}</td>

                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteReview(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reviews;
