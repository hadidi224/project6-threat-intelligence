const API_BASE_URL = "http://127.0.0.1:8000";

export async function getThreats() {
  const response = await fetch(`${API_BASE_URL}/api/threats`);

  if (!response.ok) {
    throw new Error("Failed to fetch threats");
  }

  return response.json();
}

export async function getThreatStats() {
  const response = await fetch(
    `${API_BASE_URL}/api/threats/stats`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch threat statistics");
  }

  return response.json();
}

export async function detectThreat(data) {
  const response = await fetch(
    `${API_BASE_URL}/api/detect`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.detail || "Threat detection failed"
    );
  }

  return response.json();
}