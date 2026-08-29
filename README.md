# project6-threat-intelligence
AI-powered Threat Intelligence Dashboard using React, FastAPI and Isolation Forest
# Threat Intelligence Dashboard

An AI-powered Threat Intelligence Dashboard for detecting, analyzing, and monitoring network security threats using **Rule-Based Detection** and **Isolation Forest Machine Learning**.

The project provides a FastAPI backend for threat detection and a React/Vite frontend for real-time visualization and monitoring.

---

## Overview

The Threat Intelligence Dashboard analyzes network security events and identifies suspicious or anomalous activity.

The system combines:

- Rule-Based Threat Detection
- Machine Learning Anomaly Detection
- Risk Assessment
- Threat Classification
- REST API
- React Dashboard
- WebSocket Communication
- Threat Statistics and Analytics

The dashboard allows security analysts to monitor detected threats and understand their severity through a simple visual interface.

---

## System Architecture

```text
                Network Security Events
                         |
                         v
              +----------------------+
              |     FastAPI API      |
              +----------+-----------+
                         |
                         v
              +----------------------+
              | Detection Service    |
              +----------+-----------+
                         |
             +-----------+-----------+
             |                       |
             v                       v
    +----------------+      +------------------+
    | Rule-Based     |      | Isolation Forest |
    | Detection      |      | ML Detection     |
    +--------+-------+      +---------+--------+
             |                        |
             +-----------+------------+
                         |
                         v
                Risk Assessment
                         |
                         v
                Threat Classification
                         |
                         v
              +----------------------+
              | Threat History       |
              +----------+-----------+
                         |
             +-----------+-----------+
             |                       |
             v                       v
      REST API Response       WebSocket Updates
             |                       |
             +-----------+-----------+
                         |
                         v
              +----------------------+
              | React Dashboard      |
              +----------------------+

Backend Setup
1. Navigate to the project
cd ~/Desktop/project6-threat-intelligence

Create/activate the virtual environment
source backend/venv/bin/activate

If the virtual environment does not exist, create one:

python3 -m venv backend/venv
source backend/venv/bin/activate
3. Install dependencies

Install the required Python packages:

pip install fastapi uvicorn pydantic scikit-learn joblib
Start the Backend

From the project root:

uvicorn backend.main:app --reload

The API will run at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs
API Endpoints
Root
GET /

Returns:

{
  "message": "Threat Intelligence Dashboard API is running"
}
Health Check
GET /health
Detect Threat
POST /api/detect

Example request:

{
  "timestamp": "2026-08-29T11:30:00",
  "source_ip": "192.168.1.100",
  "destination_ip": "192.168.1.1",
  "event_type": "SSH",
  "action": "Login",
  "port": 22,
  "status": "Failed",
  "failed_login_attempts": 15,
  "request_frequency": 150
}

Example response:

{
  "classification": "Suspicious Activity",
  "anomaly_score": -0.054,
  "risk_level": "Critical",
  "rule_based_detection": {
    "is_threat": true,
    "classification": "Suspicious Activity",
    "reasons": [
      "High number of failed login attempts",
      "Abnormally high request frequency"
    ]
  }
}
Get Threats
GET /api/threats

Returns all detected threats.

Example:

{
  "total": 1,
  "threats": [
    {
      "classification": "Suspicious Activity",
      "anomaly_score": -0.054,
      "risk_level": "Critical",
      "source_ip": "192.168.1.100"
    }
  ]
}
Get Threat Statistics
GET /api/threats/stats

Example:

{
  "total": 1,
  "normal": 0,
  "low": 0,
  "medium": 0,
  "high": 0,
  "critical": 1
}
Testing the API

After starting the backend, test the API with:

curl http://127.0.0.1:8000/

Test threat detection:

curl -X POST http://127.0.0.1:8000/api/detect \
-H "Content-Type: application/json" \
-d '{
  "timestamp": "2026-08-29T11:30:00",
  "source_ip": "192.168.1.100",
  "destination_ip": "192.168.1.1",
  "event_type": "SSH",
  "action": "Login",
  "port": 22,
  "status": "Failed",
  "failed_login_attempts": 15,
  "request_frequency": 150
}'

Check stored threats:

curl http://127.0.0.1:8000/api/threats

Check statistics:

curl http://127.0.0.1:8000/api/threats/stats
Frontend Setup

Open another terminal.

cd ~/Desktop/project6-threat-intelligence/frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The dashboard will be available at:

http://localhost:5173
Frontend API Configuration

The frontend communicates with the FastAPI backend through:

const API_BASE_URL = "http://127.0.0.1:8000";

The frontend retrieves:

/api/threats
/api/threats/stats

and refreshes the dashboard periodically.

Machine Learning Model

The project includes a trained Isolation Forest model:

backend/models/isolation_forest.joblib

The model is used by the detection service to identify anomalous network activity.

The project also includes:

backend/train.py

which can be used to train the model using the network log dataset.

Dataset:

data/network_logs.csv
Detection Example

A suspicious SSH event:

Source IP:              192.168.1.100
Destination IP:         192.168.1.1
Event Type:             SSH
Action:                 Login
Port:                   22
Status:                 Failed
Failed Login Attempts:  15
Request Frequency:      150

Detection result:

Classification: Suspicious Activity
Risk Level:    Critical
Anomaly Score: -0.054
Threat:        TRUE

Reasons:

- High number of failed login attempts
- Abnormally high request frequency
WebSocket

The backend includes WebSocket support for communicating threat events to connected dashboard clients.

The dashboard displays the connection status as:

WebSocket Connected

This allows the system to support live threat monitoring.

Testing

The backend contains several test files:

backend/test_isolation_forest.py
backend/test_risk_service.py
backend/test_rule_detector.py
backend/test_websocket.py

Run individual tests with:

python backend/test_isolation_forest.py
python backend/test_risk_service.py
python backend/test_rule_detector.py
python backend/test_websocket.py
Current System Status

The current implementation successfully demonstrates:

Rule-based threat detection
Isolation Forest anomaly detection
Threat classification
Risk assessment
FastAPI REST API
React dashboard
Threat statistics
Threat history
WebSocket connectivity
Real-time dashboard refresh
Future Improvements

Potential future improvements include:

Persistent database storage
User authentication
Advanced threat analytics
IP reputation lookup
External threat intelligence feeds
Geographic IP visualization
Advanced charts and dashboards
Alert notifications
Email/SMS security alerts
Role-based access control
Docker deployment
Cloud deployment
PostgreSQL integration
Improved WebSocket event handling
Disclaimer

This project is developed for educational and research purposes as part of a Threat Intelligence and AI security project.

It is intended to demonstrate concepts related to:

Cybersecurity
Threat Intelligence
Machine Learning
Anomaly Detection
Network Security
Security Monitoring.
