import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { getDashboardData } from "../../services/dashboardService";
import { playNotificationSound } from "../../utils/notificationSound";
import "./NotificationCenter.css";

const POLL_INTERVAL_MS = 20 * 1000;
const TOAST_LIFETIME_MS = 6 * 1000;

const WATCHED_COUNTS = [
  { key: "totalBookings", label: "New service booking received", path: "/bookings" },
  { key: "totalMessages", label: "New contact message received", path: "/contact-messages" },
  { key: "totalReviews", label: "New customer review submitted", path: "/reviews" },
  { key: "totalChatLeads", label: "New AI chat enquiry captured", path: "/chat-leads" },
];

function NotificationCenter() {
  const [toasts, setToasts] = useState([]);
  const prevCounts = useRef(null);
  const navigate = useNavigate();

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pushToast = (message, path) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, path }]);
    setTimeout(() => dismissToast(id), TOAST_LIFETIME_MS);
  };

  const checkForUpdates = async () => {
    if (!localStorage.getItem("isLoggedIn")) return;

    try {
      const data = await getDashboardData();

      const current = {
        totalBookings: data.totalBookings || 0,
        totalMessages: data.totalMessages || 0,
        totalReviews: data.totalReviews || 0,
        totalChatLeads: data.totalChatLeads || 0,
      };

      if (prevCounts.current) {
        let hasNew = false;

        WATCHED_COUNTS.forEach(({ key, label, path }) => {
          if (current[key] > prevCounts.current[key]) {
            pushToast(label, path);
            hasNew = true;
          }
        });

        if (hasNew) {
          playNotificationSound();
        }
      }

      prevCounts.current = current;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForUpdates();
    const interval = setInterval(checkForUpdates, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="notification-toast-stack">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className="notification-toast"
          onClick={() => {
            navigate(toast.path);
            dismissToast(toast.id);
          }}
        >
          <Bell size={18} />
          <span>{toast.message}</span>
        </button>
      ))}
    </div>
  );
}

export default NotificationCenter;
