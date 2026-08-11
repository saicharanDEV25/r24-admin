import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ChatLeads.css";

const LEAD_FILTERS = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
];

function isSameLocalDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get("/chat-leads");
      setLeads(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    api.put("/chat-leads/mark-all-seen").catch((error) => console.log(error));
  }, []);

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this enquiry?")) {
      return;
    }

    try {
      await api.delete(`/chat-leads/${id}`);
      loadLeads();
    } catch (error) {
      console.log(error);
      alert("Unable to delete enquiry.");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (filter === "all") return true;
    if (!lead.createdAt) return false;

    const leadDate = new Date(lead.createdAt);
    const now = new Date();

    if (filter === "today") return isSameLocalDay(leadDate, now);

    if (filter === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return isSameLocalDay(leadDate, yesterday);
    }

    return true;
  });

  return (
    <div className="chat-leads-page">
      <div className="chat-leads-header">
        <h1 className="page-title">AI Chatbot Enquiries</h1>
        <p className="page-subtitle">
          Leads captured by the AI chatbot on the website — name, phone and
          what they were interested in.
        </p>
      </div>

      <div className="chat-leads-filters">
        {LEAD_FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? "active" : ""}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="table-container glass-card">
        <table className="chat-leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Bike</th>
              <th>Category</th>
              <th>Interested In</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><span className="skeleton" style={{ width: "60%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 90, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 70, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 80, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: "70%", height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 100, height: 14 }} /></td>
                  <td><span className="skeleton" style={{ width: 60, height: 30, borderRadius: 8 }} /></td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>
                  No Enquiries Yet
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>
                  {filter === "today" ? "No enquiries today yet." : "No enquiries yesterday."}
                </td>
              </tr>
            ) : (
              filteredLeads.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    <a href={`tel:+91${item.phoneNumber}`}>
                      {item.phoneNumber}
                    </a>
                  </td>
                  <td>{item.bikeModel}</td>
                  <td>{item.category}</td>
                  <td>{item.productOrService}</td>
                  <td>{formatDateTime(item.createdAt)}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteLead(item.id)}
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

export default ChatLeads;
