import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import { playNotificationSound } from "../utils/notificationSound";

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 10 * 1000;
const TOAST_LIFETIME_MS = 6 * 1000;
const MAX_HISTORY = 30;

const WATCHED_COUNTS = [
  { key: "totalBookings", label: "New service booking received", path: "/bookings" },
  { key: "totalMessages", label: "New contact message received", path: "/contact-messages" },
  { key: "totalReviews", label: "New customer review submitted", path: "/reviews" },
  { key: "totalChatLeads", label: "New AI chat enquiry captured", path: "/chat-leads" },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const prevCounts = useRef(null);

  const pushNotification = (message, path) => {
    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      path,
      read: false,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    setToasts((prev) => [...prev, entry]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== entry.id));
    }, TOAST_LIFETIME_MS);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
            pushNotification(label, path);
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, toasts, dismissToast, markAllRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
