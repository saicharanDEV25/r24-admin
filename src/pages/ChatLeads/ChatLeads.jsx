import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ChatLeads.css";

function ChatLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="chat-leads-page">
      <div className="chat-leads-header">
        <h1 className="page-title">AI Chatbot Enquiries</h1>
        <p className="page-subtitle">
          Leads captured by the AI chatbot on the website — name, phone and
          what they were interested in.
        </p>
      </div>

      <div className="table-container">
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
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>
                  Loading Enquiries...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>
                  No Enquiries Yet
                </td>
              </tr>
            ) : (
              leads.map((item) => (
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
                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </td>
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
