import { useEffect, useState } from "react";
import { getThreats } from "./api";
import "./Threats.css";

function Threats() {
  const [threats, setThreats] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadThreats() {
    try {
      setLoading(true);

      const data = await getThreats();

      setThreats(data.threats || []);
    } catch (error) {
      console.error("Failed to load threats:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadThreats();

    const interval = setInterval(loadThreats, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredThreats =
    filter === "all"
      ? threats
      : threats.filter(
          (threat) =>
            threat.risk_level?.toLowerCase() === filter
        );

  function getRiskClass(level) {
    switch (level?.toLowerCase()) {
      case "critical":
        return "critical";

      case "high":
        return "high";

      case "medium":
        return "medium";

      case "low":
        return "low";

      default:
        return "unknown";
    }
  }

  return (
    <div className="threats-page">

      <div className="threats-header">
        <div>
          <h1>Threats</h1>
          <p>
            Monitor and investigate detected security threats
          </p>
        </div>

        <button onClick={loadThreats}>
          Refresh
        </button>
      </div>

      <div className="threat-filters">

        {["all", "critical", "high", "medium", "low"].map(
          (level) => (
            <button
              key={level}
              className={
                filter === level ? "filter active" : "filter"
              }
              onClick={() => setFilter(level)}
            >
              {level === "all"
                ? "All"
                : level.charAt(0).toUpperCase() +
                  level.slice(1)}
            </button>
          )
        )}

      </div>

      <div className="threats-card">

        {loading ? (
          <div className="empty-state">
            Loading threats...
          </div>
        ) : filteredThreats.length === 0 ? (
          <div className="empty-state">
            No threats found.
          </div>
        ) : (
          <div className="threat-table-wrapper">

            <table className="threat-table">

              <thead>
                <tr>
                  <th>Source IP</th>
                  <th>Destination IP</th>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Classification</th>
                  <th>Risk</th>
                  <th>Anomaly Score</th>
                </tr>
              </thead>

              <tbody>

                {filteredThreats.map((threat, index) => (

                  <tr key={threat.id ?? index}>

                    <td>
                      {threat.source_ip || "Unknown"}
                    </td>

                    <td>
                      {threat.destination_ip || "Unknown"}
                    </td>

                    <td>
                      {threat.event_type || "Unknown"}
                    </td>

                    <td>
                      {threat.status || "Unknown"}
                    </td>

                    <td>
                      {threat.classification || "Unknown"}
                    </td>

                    <td>
                      <span
                        className={`risk-badge ${getRiskClass(
                          threat.risk_level
                        )}`}
                      >
                        {threat.risk_level || "Unknown"}
                      </span>
                    </td>

                    <td>
                      {threat.anomaly_score !== undefined
                        ? Number(
                            threat.anomaly_score
                          ).toFixed(4)
                        : "N/A"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Threats;