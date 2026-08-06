import { useEffect, useState } from "react";
import { Eye, Users, TrendingUp } from "lucide-react";
import api from "../../services/api";
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
        <p className="analytics-loading">Loading analytics...</p>
      ) : (
        <>
          <div className="analytics-cards">
            <div className="analytics-card">
              <div className="analytics-card-icon">
                <Eye size={26} />
              </div>
              <div>
                <h2>{summary.visitsToday}</h2>
                <span>Visits Today</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-icon">
                <Users size={26} />
              </div>
              <div>
                <h2>{summary.uniqueVisitorsToday}</h2>
                <span>Unique Visitors Today</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-icon">
                <TrendingUp size={26} />
              </div>
              <div>
                <h2>{summary.visitsThisWeek}</h2>
                <span>Visits This Week</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-icon">
                <Users size={26} />
              </div>
              <div>
                <h2>{summary.uniqueVisitorsThisWeek}</h2>
                <span>Unique Visitors This Week</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-icon">
                <Eye size={26} />
              </div>
              <div>
                <h2>{summary.visitsThisMonth}</h2>
                <span>Visits This Month (30d)</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-icon">
                <Users size={26} />
              </div>
              <div>
                <h2>{summary.uniqueVisitorsThisMonth}</h2>
                <span>Unique Visitors This Month</span>
              </div>
            </div>
          </div>

          <div className="analytics-chart-card">
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
