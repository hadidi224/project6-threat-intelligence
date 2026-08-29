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
