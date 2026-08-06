import { useEffect, useState } from "react";
import { Eye, Users, TrendingUp } from "lucide-react";
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
  last7Days: [],
};

const cardDefs = [
  { key: "visitsToday", label: "Visits Today", icon: Eye },
  { key: "uniqueVisitorsToday", label: "Unique Visitors Today", icon: Users },
  { key: "visitsThisWeek", label: "Visits This Week", icon: TrendingUp },
  { key: "uniqueVisitorsThisWeek", label: "Unique Visitors This Week", icon: Users },
  { key: "visitsThisMonth", label: "Visits This Month (30d)", icon: Eye },
  { key: "uniqueVisitorsThisMonth", label: "Unique Visitors This Month", icon: Users },
];

function Analytics() {
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadSummary();
  }, []);

  const maxVisits = Math.max(1, ...summary.last7Days.map((d) => d.visits));

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { weekday: "short" });
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1 className="page-title">Website Analytics</h1>
        <p className="page-subtitle">
          How many people are visiting the website, and when.
        </p>
      </div>

      {loading ? (
        <>
          <div className="analytics-cards">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="analytics-card glass-card" key={i}>
                <span className="skeleton" style={{ width: 50, height: 50, borderRadius: 14 }} />
                <div style={{ flex: 1 }}>
                  <span className="skeleton" style={{ width: "60%", height: 22, marginBottom: 8 }} />
                  <span className="skeleton" style={{ width: "80%", height: 12 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="analytics-chart-card glass-card">
            <span className="skeleton" style={{ width: 120, height: 18, marginBottom: 24 }} />
            <div className="analytics-chart">
              {Array.from({ length: 7 }).map((_, i) => (
                <div className="analytics-bar-col" key={i}>
                  <span
                    className="skeleton"
                    style={{ width: "100%", maxWidth: 36, height: `${40 + (i % 3) * 30}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
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

          <div className="analytics-chart-card glass-card">
            <h3>Last 7 Days</h3>

            <div className="analytics-chart">
              {summary.last7Days.map((day) => (
                <div className="analytics-bar-col" key={day.date}>
                  <span className="analytics-bar-value">{day.visits}</span>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar-fill"
                      style={{
                        height: `${(day.visits / maxVisits) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="analytics-bar-label">
                    {formatDay(day.date)}
                  </span>
                </div>
              ))}

              {summary.last7Days.length === 0 && (
                <p className="analytics-empty">No visits recorded yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
