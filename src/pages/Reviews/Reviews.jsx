import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "../../services/api";
import "./Reviews.css";

const REVIEW_FILTERS = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "custom", label: "Custom Date" },
];

function isSameLocalDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");

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

  const filteredReviews = reviews.filter((item) => {
    if (filter === "all") return true;
    if (!item.createdAt) return false;

    const reviewDate = new Date(item.createdAt);

    if (filter === "today") return isSameLocalDay(reviewDate, new Date());

    if (filter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return isSameLocalDay(reviewDate, yesterday);
    }

    if (filter === "custom") {
      if (!customDate) return false;
      const [y, m, d] = customDate.split("-").map(Number);
      return (
        reviewDate.getFullYear() === y &&
        reviewDate.getMonth() + 1 === m &&
        reviewDate.getDate() === d
      );
    }

    return true;
  });

  return (
    <div className="reviews-page">
      <div className="reviews-page-header">
        <h1 className="page-title">Customer Reviews</h1>
        <p className="page-subtitle">
          Moderate reviews submitted by customers on the website. Delete
          anything inappropriate or spammy.
        </p>
      </div>

      <div className="reviews-filters">
        {REVIEW_FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? "active" : ""}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}

        {filter === "custom" && (
          <input
            type="date"
            className="reviews-custom-date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            onClick={(e) => e.target.showPicker?.()}
          />
        )}
      </div>

      <div className="table-container glass-card">
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
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><span className="skeleton" style={{ width: "50%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 90, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: "80%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 70, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 60, height: 30, borderRadius: 8 }} /></td>
                </tr>
              ))
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>
                  No Reviews Yet
                </td>
              </tr>
            ) : filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>
                  {filter === "custom"
                    ? customDate
                      ? "No reviews on that date."
                      : "Pick a date to filter."
                    : filter === "today"
                    ? "No reviews today yet."
                    : "No reviews yesterday."}
                </td>
              </tr>
            ) : (
              filteredReviews.map((item) => (
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

                  <td>{formatDate(item.createdAt)}</td>

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
