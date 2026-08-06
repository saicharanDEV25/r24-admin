import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Bookings.css";

const statuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (booking, status) => {
    try {
      await api.put(`/bookings/${booking.id}`, { ...booking, status });
      loadBookings();
    } catch (error) {
      console.log(error);
      alert("Unable to update status.");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) {
      return;
    }

    try {
      await api.delete(`/bookings/${id}`);
      loadBookings();
    } catch (error) {
      console.log(error);
      alert("Unable to delete booking.");
    }
  };

  const filteredBookings = bookings.filter((b) =>
    statusFilter === "all" ? true : b.status === statusFilter
  );

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1 className="page-title">Service Bookings</h1>
        <p className="page-subtitle">
          Bookings submitted by customers — update status as you work
          through them.
        </p>
      </div>

      <div className="bookings-filter">
        <button
          className={statusFilter === "all" ? "active" : ""}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            className={statusFilter === s ? "active" : ""}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Bike</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>
                  Loading Bookings...
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>
                  No Bookings Found
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.customerName}</strong>
                  </td>
                  <td>
                    <a href={`tel:+91${b.phoneNumber}`}>{b.phoneNumber}</a>
                  </td>
                  <td>{b.bikeModel}</td>
                  <td>{b.serviceType}</td>
                  <td>
                    {b.bookingDate}
                    {b.bookingTime ? ` ${b.bookingTime}` : ""}
                  </td>
                  <td>
                    <select
                      className={`status-select status-${b.status?.toLowerCase()}`}
                      value={b.status}
                      onChange={(e) => updateStatus(b, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBooking(b.id)}
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

export default Bookings;
