const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // token saved at login

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`); // will throw 401, 403, etc
  }

  return res; // raw Response
}
