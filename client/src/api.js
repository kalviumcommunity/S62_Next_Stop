// Base URL of the backend. Set VITE_API_URL in client/.env for other environments.
export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Is the backend running on port 8080?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.msg || `Request failed (${res.status})`);
  return data;
}

export const api = {
  listPlaces: () => request("/places"),
  getPlace: (id) => request(`/places/${id}`),
  createPlace: (place) => request("/places", { method: "POST", body: place }).then((d) => d.savedPlace),
  updatePlace: (id, changes) =>
    request(`/places/${id}`, { method: "PUT", body: changes }).then((d) => d.updatedPlace),
  deletePlace: (id) => request(`/places/${id}`, { method: "DELETE" }),
  addReview: (id, review) => request(`/places/${id}/reviews`, { method: "POST", body: review }),
  updateReview: (id, reviewId, review) =>
    request(`/places/${id}/reviews/${reviewId}`, { method: "PUT", body: review }),
  deleteReview: (id, reviewId) => request(`/places/${id}/reviews/${reviewId}`, { method: "DELETE" }),

  signup: (user) => request("/auth/signup", { method: "POST", body: user }),
  login: (creds) => request("/auth/login", { method: "POST", body: creds }),
};
