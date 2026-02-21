const API_BASE =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://api.cinegates.com"
    : "http://localhost:4010";

export async function createDemoSession(payload = {}) {
  const res = await fetch(`${API_BASE}/api/demo/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${res.status})`);
  }

  return data;
}