import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ContactMessages.css";

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact");
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleReplied = async (msg) => {
    try {
      await api.put(`/contact/${msg.id}`, { ...msg, replied: !msg.replied });
      loadMessages();
    } catch (error) {
      console.log(error);
      alert("Unable to update message.");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) {
      return;
    }

    try {
      await api.delete(`/contact/${id}`);
      loadMessages();
    } catch (error) {
      console.log(error);
      alert("Unable to delete message.");
    }
  };

  const filteredMessages = messages.filter((m) =>
    filter === "all" ? true : filter === "replied" ? m.replied : !m.replied
  );

  return (
    <div className="contact-messages-page">
      <div className="contact-messages-header">
        <h1 className="page-title">Contact Messages</h1>
        <p className="page-subtitle">
          Messages submitted from the website's Contact form.
        </p>
      </div>

      <div className="contact-filter">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "unreplied" ? "active" : ""}
          onClick={() => setFilter("unreplied")}
        >
          Not Replied
        </button>
        <button
          className={filter === "replied" ? "active" : ""}
          onClick={() => setFilter("replied")}
        >
          Replied
        </button>
      </div>

      <div className="messages-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div className="message-card glass-card skeleton-card" key={i}>
              <span className="skeleton" style={{ width: "50%", height: 16, marginBottom: 12 }} />
              <span className="skeleton" style={{ width: "90%", height: 12, marginBottom: 8 }} />
              <span className="skeleton" style={{ width: "70%", height: 12 }} />
            </div>
          ))
        ) : filteredMessages.length === 0 ? (
          <p className="messages-empty">No messages found.</p>
        ) : (
          filteredMessages.map((msg, index) => (
            <div
              className={
                msg.replied
                  ? "message-card glass-card replied stagger-in"
                  : "message-card glass-card stagger-in"
              }
              style={{ animationDelay: `${index * 0.05}s` }}
              key={msg.id}
            >
              <div className="message-card-header">
                <div>
                  <h4>{msg.name}</h4>
                  <span>{msg.subject}</span>
                </div>
                <span
                  className={
                    msg.replied ? "reply-badge done" : "reply-badge pending"
                  }
                >
                  {msg.replied ? "Replied" : "Pending"}
                </span>
              </div>

              <p className="message-text">{msg.message}</p>

              <div className="message-contact-info">
                <a href={`mailto:${msg.email}`}>{msg.email}</a>
                <a href={`tel:+91${msg.phone}`}>{msg.phone}</a>
              </div>

              <div className="message-actions">
                <a
                  href={`https://wa.me/91${msg.phone}?text=${encodeURIComponent(
                    `Hi ${msg.name}, thanks for reaching out to R24 Automotive regarding "${msg.subject}".`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-reply-btn"
                >
                  Reply on WhatsApp
                </a>

                <button
                  className="toggle-replied-btn"
                  onClick={() => toggleReplied(msg)}
                >
                  {msg.replied ? "Mark Unreplied" : "Mark Replied"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(msg.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactMessages;
