import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationCenter.css";

function NotificationCenter() {
  const { toasts, dismissToast } = useNotifications();
  const navigate = useNavigate();

  if (!toasts || toasts.length === 0) return null;

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
