import { useEffect, useState } from "react";
import { Eye, TrendingUp, Globe } from "lucide-react";
import api from "../../services/api";
import CountUp from "../../components/CountUp/CountUp";
import "./Analytics.css";

const emptySummary = {
  visitsToday: 0,
  visitsThisWeek: 0,
  visitsThisMonth: 0,
  uniqueVisitorsToday: 0,
  uniqueVisitorsThisWeek: 0,
  uniqueVisitorsThisMonth: 0,
};

const cardDefs = [
  { key: "visitsToday", label: "Visits Today", icon: Eye },
  { key: "visitsThisMonth", label: "Visits This Month (30d)", icon: TrendingUp },
];

const ONLINE_POLL_INTERVAL_MS = 10 * 1000;

// A visitor (by IP) with this many total visits or more gets called out as
// a "Regular" instead of just a one-off hit.
const REGULAR_VISIT_THRESHOLD = 5;

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Analytics() {
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);

  const [visitorLog, setVisitorLog] = useState([]);
  const [visitorLogLoading, setVisitorLogLoading] = useState(true);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get("/analytics/summary");
      setSummary(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadOnlineCount = async () => {
    try {
      const response = await api.get("/analytics/online-count");
      setOnlineCount(response.data.onlineCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const loadVisitorLog = async () => {
    try {
      setVisitorLogLoading(true);
      const response = await api.get("/analytics/visitors");
      setVisitorLog(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setVisitorLogLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    loadVisitorLog();
  }, []);

  useEffect(() => {
    loadOnlineCount();
    const interval = setInterval(loadOnlineCount, ONLINE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1 className="page-title">Website Analytics</h1>
        <p className="page-subtitle">
          How many people are visiting the website, and when.
        </p>
      </div>

      <div className="analytics-live-banner glass-card">
        <span className="analytics-live-dot" />
        <div>
          <h2>
            <CountUp end={onlineCount} duration={0.8} />
          </h2>
          <span>Users online right now</span>
        </div>
      </div>

      {loading ? (
        <div className="analytics-cards">
          {Array.from({ length: 2 }).map((_, i) => (
            <div className="analytics-card glass-card" key={i}>
              <span className="skeleton" style={{ width: 50, height: 50, borderRadius: 14 }} />
              <div style={{ flex: 1 }}>
                <span className="skeleton" style={{ width: "60%", height: 22, marginBottom: 8 }} />
                <span className="skeleton" style={{ width: "80%", height: 12 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="analytics-cards">
          {cardDefs.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                className="analytics-card glass-card stagger-in"
                key={card.key}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className="analytics-card-icon">
                  <Icon size={26} />
                </div>
                <div>
                  <h2>
                    <CountUp end={summary[card.key]} duration={1.5} />
                  </h2>
                  <span>{card.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="analytics-visitor-log glass-card">
        <div className="analytics-visitor-log-header">
          <Globe size={20} />
          <div>
            <h3>Visitor Log</h3>
            <p>Every IP that has visited, and how many times — spot your regulars.</p>
          </div>
        </div>

        <div className="table-container">
          <table className="visitor-log-table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Visits</th>
                <th>First Seen</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {visitorLogLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><span className="skeleton" style={{ width: "70%", height: 14 }} /></td>
                    <td><span className="skeleton" style={{ width: 40, height: 14 }} /></td>
                    <td><span className="skeleton" style={{ width: "80%", height: 14 }} /></td>
                    <td><span className="skeleton" style={{ width: "80%", height: 14 }} /></td>
                  </tr>
                ))
              ) : visitorLog.length === 0 ? (
                <tr>
                  <td colSpan="4" className="visitor-log-empty">
                    No visits recorded yet.
                  </td>
                </tr>
              ) : (
                visitorLog.map((v) => (
                  <tr key={v.ipAddress}>
                    <td>{v.ipAddress}</td>
                    <td>
                      <span
                        className={
                          v.visitCount >= REGULAR_VISIT_THRESHOLD
                            ? "visitor-count-badge regular"
                            : "visitor-count-badge"
                        }
                      >
                        {v.visitCount}
                        {v.visitCount >= REGULAR_VISIT_THRESHOLD ? " · Regular" : ""}
                      </span>
                    </td>
                    <td>{formatDateTime(v.firstVisit)}</td>
                    <td>{formatDateTime(v.lastVisit)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
