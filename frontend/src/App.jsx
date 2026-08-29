import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { getThreats, getThreatStats } from "./api";

function App() {
  const [threats, setThreats] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const [threatData, statsData] = await Promise.all([
        getThreats(),
        getThreatStats(),
      ]);

      const threatList = Array.isArray(threatData?.threats)
        ? threatData.threats
        : [];

      setThreats(threatList);

      /*
       * Use statistics returned by the backend.
       * If a value is missing, calculate it from the threat list.
       */
      const countRisk = (risk) =>
        threatList.filter(
          (threat) =>
            String(threat?.risk_level || "").toLowerCase() === risk
        ).length;

      setStats({
        total:
          statsData?.total ??
          threatData?.total ??
          threatList.length,

        critical:
          statsData?.critical ??
          countRisk("critical"),

        high:
          statsData?.high ??
          countRisk("high"),

        medium:
          statsData?.medium ??
          countRisk("medium"),

        low:
          statsData?.low ??
          countRisk("low"),
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        "Unable to connect to the Threat Intelligence API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Initial load + automatic refresh
   */
  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  /*
   * Return CSS class according to risk level
   */
  function getRiskClass(level) {
    const risk = String(level || "").toLowerCase();

    switch (risk) {
      case "critical":
        return "critical-badge";

      case "high":
        return "high-badge";

      case "medium":
        return "medium-badge";

      case "low":
        return "low-badge";

      default:
        return "medium-badge";
    }
  }

  /*
   * Format anomaly score
   */
  function formatScore(score) {
    if (score === null || score === undefined || score === "") {
      return "N/A";
    }

    const number = Number(score);

    if (Number.isNaN(number)) {
      return "N/A";
    }

    return number.toFixed(4);
  }

  /*
   * Format timestamp
   */
  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return "Unknown";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString();
  }

  return (
    <div className="dashboard">

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">T</div>

          <div>
            <h2>ThreatIntel</h2>
            <span>Security Dashboard</span>
          </div>
        </div>

        <nav>
          <a href="#" className="active">
            Dashboard
          </a>

          <a href="#threats">
            Threats
          </a>

          <a href="#detection">
            Detection
          </a>

          <a href="#analytics">
            Analytics
          </a>
        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>API Connected</small>
            </div>

          </div>

        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">

          <div>
            <h1>Threat Intelligence Dashboard</h1>

            <p>
              Monitor and analyze network security threats
            </p>
          </div>

          <div className="header-right">

            <div className="header-status">
              <span className="status-dot"></span>
              Live Monitoring
            </div>

            {lastUpdated && (
              <small className="last-updated">
                Updated{" "}
                {lastUpdated.toLocaleTimeString()}
              </small>
            )}

          </div>

        </header>


        {/* =========================
            ERROR MESSAGE
        ========================== */}
        {error && (
          <div className="error-message">
            <strong>Connection Error:</strong>{" "}
            {error}

            <button
              onClick={loadDashboard}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        )}


        {/* =========================
            KPI CARDS
        ========================== */}
        <section className="kpi-grid">

          {/* Total */}
          <div className="kpi-card">

            <span className="kpi-label">
              Total Threats
            </span>

            <strong className="kpi-value">
              {loading ? "..." : stats.total}
            </strong>

            <span className="kpi-info">
              Detected threats
            </span>

          </div>


          {/* Critical */}
          <div className="kpi-card">

            <span className="kpi-label">
              Critical
            </span>

            <strong className="kpi-value critical">
              {loading ? "..." : stats.critical}
            </strong>

            <span className="kpi-info">
              Immediate attention
            </span>

          </div>


          {/* High */}
          <div className="kpi-card">

            <span className="kpi-label">
              High Risk
            </span>

            <strong className="kpi-value high">
              {loading ? "..." : stats.high}
            </strong>

            <span className="kpi-info">
              Requires attention
            </span>

          </div>


          {/* Medium */}
          <div className="kpi-card">

            <span className="kpi-label">
              Medium Risk
            </span>

            <strong className="kpi-value medium">
              {loading ? "..." : stats.medium}
            </strong>

            <span className="kpi-info">
              Suspicious activity
            </span>

          </div>

        </section>


        {/* =========================
            CONTENT GRID
        ========================== */}
        <section className="content-grid">

          {/* =========================
              THREAT TABLE
          ========================== */}
          <div className="panel" id="threats">

            <div className="panel-header">

              <div>
                <h2>Threat Overview</h2>

                <p>
                  Recent detected security events
                </p>
              </div>

              <button
                className="view-button"
                onClick={loadDashboard}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>

            </div>


            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Source IP</th>
                    <th>Classification</th>
                    <th>Risk</th>
                    <th>Score</th>
                  </tr>
                </thead>


                <tbody>

                  {/* Loading */}
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        Loading threats...
                      </td>
                    </tr>
                  ) : threats.length === 0 ? (

                    /* No threats */
                    <tr>
                      <td colSpan="4" className="empty-state">
                        <div>
                          <strong>No threats detected.</strong>

                          <p>
                            The system has not detected
                            any threats yet.
                          </p>
                        </div>
                      </td>
                    </tr>

                  ) : (

                    /* Threats */
                    threats.map((threat, index) => (

                      <tr
                        key={
                          threat.id ??
                          `${threat.source_ip}-${index}`
                        }
                      >

                        {/* Source IP */}
                        <td className="source-ip">
                          {threat.source_ip ??
                            threat.src_ip ??
                            "Unknown"}
                        </td>


                        {/* Classification */}
                        <td>
                          {threat.classification ??
                            "Unknown"}
                        </td>


                        {/* Risk */}
                        <td>

                          <span
                            className={`badge ${getRiskClass(
                              threat.risk_level
                            )}`}
                          >
                            {threat.risk_level ??
                              "Unknown"}
                          </span>

                        </td>


                        {/* Score */}
                        <td className="score">
                          {formatScore(
                            threat.anomaly_score
                          )}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* =========================
              DETECTION ENGINE
          ========================== */}
          <div
            className="panel system-panel"
            id="detection"
          >

            <div className="panel-header">

              <div>
                <h2>Detection Engine</h2>

                <p>
                  Current system status
                </p>
              </div>

            </div>


            {/* Main engine status */}
            <div className="engine-status">

              <div className="engine-icon">
                ✓
              </div>

              <div>

                <strong>
                  Detection Active
                </strong>

                <span>
                  Rule-Based + AI
                </span>

              </div>

            </div>


            {/* Rule Based */}
            <div className="engine-item">

              <span>
                Rule-Based Detector
              </span>

              <strong className="active-text">
                Active
              </strong>

            </div>


            {/* Isolation Forest */}
            <div className="engine-item">

              <span>
                Isolation Forest
              </span>

              <strong className="active-text">
                Active
              </strong>

            </div>


            {/* WebSocket */}
            <div className="engine-item">

              <span>
                WebSocket
              </span>

              <strong className="active-text">
                Connected
              </strong>

            </div>

          </div>

        </section>


        {/* =========================
            ANALYTICS
        ========================== */}
        <section
          className="panel analytics-panel"
          id="analytics"
        >

          <div className="panel-header">

            <div>
              <h2>Threat Analytics</h2>

              <p>
                Current threat distribution
              </p>
            </div>

          </div>


          <div className="analytics-grid">

            <div className="analytics-item">
              <span>Critical</span>
              <strong>{stats.critical}</strong>
            </div>

            <div className="analytics-item">
              <span>High</span>
              <strong>{stats.high}</strong>
            </div>

            <div className="analytics-item">
              <span>Medium</span>
              <strong>{stats.medium}</strong>
            </div>

            <div className="analytics-item">
              <span>Low</span>
              <strong>{stats.low}</strong>
            </div>

          </div>

        </section>


        {/* =========================
            FOOTER
        ========================== */}
        <footer className="dashboard-footer">

          <span>
            ThreatIntel Security Dashboard
          </span>

          <span>
            API: 127.0.0.1:8000
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;