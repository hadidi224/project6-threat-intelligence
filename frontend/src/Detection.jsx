import { useState } from "react";
import { detectThreat } from "./api";
import "./Detection.css";

function Detection() {
  const [form, setForm] = useState({
    timestamp: new Date().toISOString().slice(0, 19),
    source_ip: "192.168.1.100",
    destination_ip: "192.168.1.1",
    event_type: "SSH",
    action: "Login",
    port: 22,
    status: "Failed",
    failed_login_attempts: 15,
    request_frequency: 150,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "port" ||
        name === "failed_login_attempts" ||
        name === "request_frequency"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await detectThreat(form);

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to run threat detection."
      );
    } finally {
      setLoading(false);
    }
  }

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
    <div className="detection-page">

      <div className="detection-header">

        <div>
          <h1>Threat Detection</h1>

          <p>
            Analyze a network event using Rule-Based
            Detection and Isolation Forest AI.
          </p>
        </div>

        <div className="detection-status">
          <span className="status-dot"></span>
          Detection Engine Active
        </div>

      </div>


      <div className="detection-grid">

        {/* FORM */}

        <div className="detection-card">

          <div className="card-title">
            <h2>Network Event</h2>

            <p>
              Enter event information to analyze
              potential threats.
            </p>
          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Source IP
                </label>

                <input
                  name="source_ip"
                  value={form.source_ip}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Destination IP
                </label>

                <input
                  name="destination_ip"
                  value={form.destination_ip}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Event Type
                </label>

                <select
                  name="event_type"
                  value={form.event_type}
                  onChange={handleChange}
                >
                  <option value="SSH">SSH</option>
                  <option value="HTTP">HTTP</option>
                  <option value="HTTPS">HTTPS</option>
                  <option value="FTP">FTP</option>
                  <option value="DNS">DNS</option>
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                </select>

              </div>


              <div className="form-group">

                <label>
                  Action
                </label>

                <input
                  name="action"
                  value={form.action}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Port
                </label>

                <input
                  type="number"
                  name="port"
                  min="1"
                  max="65535"
                  value={form.port}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Failed">
                    Failed
                  </option>

                  <option value="Success">
                    Success
                  </option>

                  <option value="Blocked">
                    Blocked
                  </option>

                  <option value="Allowed">
                    Allowed
                  </option>
                </select>

              </div>


              <div className="form-group">

                <label>
                  Failed Login Attempts
                </label>

                <input
                  type="number"
                  name="failed_login_attempts"
                  min="0"
                  value={form.failed_login_attempts}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Request Frequency
                </label>

                <input
                  type="number"
                  name="request_frequency"
                  min="0"
                  value={form.request_frequency}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <button
              className="detect-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Analyzing..."
                : "Run Threat Detection"}
            </button>

          </form>

        </div>


        {/* RESULT */}

        <div className="detection-card result-card">

          <div className="card-title">

            <h2>
              Detection Result
            </h2>

            <p>
              AI and rule-based analysis
            </p>

          </div>


          {error && (

            <div className="detection-error">
              {error}
            </div>

          )}


          {!result && !error && (

            <div className="result-empty">

              <div className="result-icon">
                ?
              </div>

              <strong>
                No detection yet
              </strong>

              <span>
                Submit a network event to
                start analysis.
              </span>

            </div>

          )}


          {result && (

            <div className="result-content">

              <div className="result-main">

                <span>
                  Classification
                </span>

                <strong>
                  {result.classification}
                </strong>

              </div>


              <div className="result-risk">

                <span>
                  Risk Level
                </span>

                <strong
                  className={`risk-result ${getRiskClass(
                    result.risk_level
                  )}`}
                >
                  {result.risk_level}
                </strong>

              </div>


              <div className="score-box">

                <span>
                  Anomaly Score
                </span>

                <strong>
                  {Number(
                    result.anomaly_score
                  ).toFixed(4)}
                </strong>

              </div>


              <div className="rule-box">

                <div className="rule-header">

                  <strong>
                    Rule-Based Detection
                  </strong>

                  <span
                    className={
                      result.rule_based_detection
                        ?.is_threat
                        ? "threat-active"
                        : "threat-safe"
                    }
                  >
                    {result.rule_based_detection
                      ?.is_threat
                      ? "THREAT DETECTED"
                      : "NO THREAT"}
                  </span>

                </div>


                {result.rule_based_detection
                  ?.reasons?.length > 0 && (

                  <div className="reasons">

                    <span>
                      Detection Reasons
                    </span>

                    <ul>

                      {result.rule_based_detection.reasons.map(
                        (reason, index) => (
                          <li key={index}>
                            {reason}
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Detection;