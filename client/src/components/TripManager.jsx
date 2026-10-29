import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import Navbar from "./Navbar";

const statusColors = {
  planned:   "bg-blue-500/15 border-blue-500/30 text-blue-300",
  ongoing:   "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  completed: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
};

const TripManager = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [places, setPlaces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapError, setMapError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newItineraryItem, setNewItineraryItem] = useState({ title: "", date: "", details: "", expense: "" });

  const emptyForm = { name: "", destination: "", startDate: "", endDate: "", budget: "", totalSpent: "", status: "planned", notes: "", itinerary: [], places: [] };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    fetchTrips();
    fetchPlaces();
  }, [navigate]);

  const fetchTrips = async () => {
    try {
      const res = await apiClient.get("/trips");
      setTrips(res.data.trips || []);
    } catch { setError("Unable to load trips."); }
  };

  const fetchPlaces = async () => {
    try {
      const res = await apiClient.get("/places");
      setPlaces(res.data.places || []);
    } catch {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addItineraryItem = () => {
    if (!newItineraryItem.title || !newItineraryItem.date) return;
    setForm({ ...form, itinerary: [...form.itinerary, { ...newItineraryItem, expense: Number(newItineraryItem.expense || 0) }] });
    setNewItineraryItem({ title: "", date: "", details: "", expense: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name || !form.startDate || !form.endDate) { setError("Trip name and dates are required."); return; }
    try {
      const itineraryExpenses = form.itinerary.reduce((s, i) => s + (Number(i.expense) || 0), 0);
      const payload = { ...form, budget: Number(form.budget) || 0, totalSpent: form.totalSpent !== "" ? Number(form.totalSpent) : itineraryExpenses };
      let res;
      if (editingTripId) {
        res = await apiClient.put(`/trips/${editingTripId}`, payload);
        setTrips(trips.map(t => t._id === editingTripId ? res.data.trip : t));
        setSuccess("Trip updated.");
      } else {
        res = await apiClient.post("/trips", payload);
        setTrips([res.data.trip, ...trips]);
        setSuccess("Trip created!");
      }
      setForm(emptyForm); setEditingTripId(null); setShowForm(false);
    } catch (err) { setError(err.response?.data?.msg || "Failed to save trip."); }
  };

  const startEditing = (trip) => {
    setForm({
      name: trip.name || "", destination: trip.destination || "",
      startDate: trip.startDate?.split("T")[0] || "", endDate: trip.endDate?.split("T")[0] || "",
      budget: trip.budget || "", totalSpent: trip.totalSpent || "",
      status: trip.status || "planned", notes: trip.notes || "",
      itinerary: trip.itinerary?.map(i => ({ ...i, date: i.date?.split("T")[0] || "" })) || [],
      places: trip.places?.map(p => p._id || p) || [],
    });
    setEditingTripId(trip._id);
    setShowForm(true);
    setError(""); setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await apiClient.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t._id !== id));
    } catch { setError("Failed to delete."); }
  };

  const openMap = async (dest) => {
    if (!dest) return;
    setMapError("");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(dest)}`);
      const data = await res.json();
      if (!data.length) { setMapError("Destination not found."); setSelectedLocation(null); return; }
      setSelectedLocation({ name: data[0].display_name, lat: data[0].lat, lon: data[0].lon });
    } catch { setMapError("Map lookup failed."); }
  };

  const getDays = (trip) => Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1);
  const getBudgetPct = (trip) => {
    const b = Number(trip.budget), s = Number(trip.totalSpent);
    if (!b) return 0;
    return Math.min(100, Math.round((s / b) * 100));
  };

  const summary = {
    total: trips.length,
    planned: trips.filter(t => t.status === "planned").length,
    ongoing: trips.filter(t => t.status === "ongoing").length,
    completed: trips.filter(t => t.status === "completed").length,
  };

  const filtered = trips.filter(t => {
    const q = searchQuery.trim().toLowerCase();
    return (!q || t.name.toLowerCase().includes(q) || (t.destination || "").toLowerCase().includes(q))
      && (statusFilter === "all" || t.status === statusFilter);
  });

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-1">Plan & Track</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              My <span className="gradient-text">Trips</span>
            </h1>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditingTripId(null); setForm(emptyForm); }}
            className="btn-primary px-5 py-2.5 text-sm">
            {showForm ? "✕ Cancel" : "+ New Trip"}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trips", value: summary.total, color: "text-white" },
            { label: "Planned", value: summary.planned, color: "text-blue-300" },
            { label: "Ongoing", value: summary.ongoing, color: "text-emerald-300" },
            { label: "Completed", value: summary.completed, color: "text-cyan-300" },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <p className="text-blue-400/50 text-xs uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {error && <div className="glass-card border-red-500/30 p-4 mb-4 text-red-400 text-sm">{error}</div>}
        {success && <div className="glass-card border-emerald-500/30 p-4 mb-4 text-emerald-400 text-sm">{success}</div>}

        {/* Form */}
        {showForm && (
          <div className="glass-card p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-5">{editingTripId ? "Edit Trip" : "New Trip"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Trip name *" className="input-field" />
                <input name="destination" value={form.destination} onChange={handleChange} placeholder="Destination" className="input-field" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-400/60 text-xs mb-1 block">Start Date *</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="text-blue-400/60 text-xs mb-1 block">End Date *</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="budget" value={form.budget} onChange={handleChange} placeholder="Budget (₹)" type="number" className="input-field" />
                <input name="totalSpent" value={form.totalSpent} onChange={handleChange} placeholder="Amount spent (₹)" type="number" className="input-field" />
              </div>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder="Notes or checklist..." className="input-field resize-none" />

              {/* Itinerary builder */}
              <div className="glass-card p-4 space-y-3">
                <p className="text-white font-semibold text-sm">Itinerary</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={newItineraryItem.title} onChange={e => setNewItineraryItem({...newItineraryItem, title: e.target.value})} placeholder="Activity title" className="input-field text-sm" />
                  <input type="date" value={newItineraryItem.date} onChange={e => setNewItineraryItem({...newItineraryItem, date: e.target.value})} className="input-field text-sm" />
                  <input value={newItineraryItem.details} onChange={e => setNewItineraryItem({...newItineraryItem, details: e.target.value})} placeholder="Details" className="input-field text-sm" />
                  <input value={newItineraryItem.expense} onChange={e => setNewItineraryItem({...newItineraryItem, expense: e.target.value})} placeholder="Expense (₹)" type="number" className="input-field text-sm" />
                </div>
                <button type="button" onClick={addItineraryItem} className="btn-secondary text-sm px-4 py-2">+ Add Activity</button>
                {form.itinerary.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {form.itinerary.map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-blue-950/30 rounded-xl border border-blue-500/15 text-sm">
                        <div>
                          <span className="text-white font-medium">{item.title}</span>
                          <span className="text-blue-400/50 ml-2 text-xs">{item.date} · ₹{item.expense || 0}</span>
                        </div>
                        <button type="button" onClick={() => setForm({...form, itinerary: form.itinerary.filter((_, idx) => idx !== i)})}
                          className="text-red-400/60 hover:text-red-400 text-xs ml-4">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assign places */}
              {places.length > 0 && (
                <div className="glass-card p-4">
                  <p className="text-white font-semibold text-sm mb-3">Assign Places</p>
                  <div className="grid sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {places.map(p => (
                      <label key={p._id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-950/30 border border-blue-500/10 hover:border-blue-500/25 cursor-pointer transition-colors">
                        <input type="checkbox" checked={form.places.includes(p._id)}
                          onChange={e => setForm({...form, places: e.target.checked ? [...form.places, p._id] : form.places.filter(id => id !== p._id)})}
                          className="accent-blue-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white text-sm truncate">{p.name}</p>
                          <p className="text-blue-400/50 text-xs truncate">{p.location}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1 py-3">{editingTripId ? "Update Trip" : "Create Trip"}</button>
                {editingTripId && (
                  <button type="button" onClick={() => { setForm(emptyForm); setEditingTripId(null); setShowForm(false); }}
                    className="btn-secondary px-6 py-3">Cancel</button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search trips..." className="input-field flex-1" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field sm:w-44">
            <option value="all">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Trip list */}
        {filtered.length === 0 ? (
          <div className="glass-card p-14 text-center">
            <span className="text-7xl">✈️</span>
            <h3 className="text-2xl font-bold text-white mt-4 mb-2">No Trips Yet</h3>
            <p className="text-blue-400/50 mb-6">Start planning your next adventure!</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Plan a Trip</button>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map(trip => {
              const pct = getBudgetProgress(trip) || getBudgetPct(trip);
              return (
                <div key={trip._id} className="glass-card-hover p-5 flex flex-col gap-4">
                  {/* Trip header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg truncate">{trip.name}</h3>
                      {trip.destination && (
                        <p className="text-blue-300/50 text-sm flex items-center gap-1 mt-0.5">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                          {trip.destination}
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${statusColors[trip.status]}`}>
                      {trip.status}
                    </span>
                  </div>

                  {/* Dates + duration */}
                  <div className="flex flex-wrap gap-3 text-xs text-blue-300/60">
                    <span>📅 {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}</span>
                    <span className="text-blue-400/40">· {getDays(trip)} days</span>
                  </div>

                  {/* Budget bar */}
                  {trip.budget > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-blue-400/50 mb-1.5">
                        <span>₹{Number(trip.totalSpent || 0).toLocaleString()} spent</span>
                        <span>₹{Number(trip.budget).toLocaleString()} budget · {getBudgetPct(trip)}%</span>
                      </div>
                      <div className="h-1.5 bg-blue-950/60 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${getBudgetPct(trip) >= 100 ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-cyan-400"}`}
                          style={{ width: `${getBudgetPct(trip)}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {trip.notes && <p className="text-blue-200/50 text-sm line-clamp-2">{trip.notes}</p>}

                  {/* Itinerary preview */}
                  {trip.itinerary?.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-blue-400/50 text-xs uppercase tracking-widest">Itinerary ({trip.itinerary.length} activities)</p>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {trip.itinerary.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-blue-200/60 px-2 py-1.5 bg-blue-950/30 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/40 shrink-0" />
                            <span className="flex-1 truncate">{item.title}</span>
                            {item.expense > 0 && <span className="text-blue-400/40 shrink-0">₹{item.expense}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned places */}
                  {trip.places?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {trip.places.map((p, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs truncate max-w-[140px]">
                          {p.name || p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1 border-t border-blue-500/10">
                    <button onClick={() => openMap(trip.destination)}
                      className="flex-1 py-2 text-xs bg-blue-600/10 border border-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-600/20 transition-colors">
                      View on Map
                    </button>
                    <button onClick={() => startEditing(trip)}
                      className="flex-1 py-2 text-xs bg-blue-600/15 border border-blue-500/25 text-blue-300 rounded-xl hover:bg-blue-600/30 transition-colors font-medium">
                      Edit
                    </button>
                    <button onClick={() => deleteTrip(trip._id)}
                      className="flex-1 py-2 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Map preview */}
        {(selectedLocation || mapError) && (
          <div className="glass-card p-5 mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-semibold">Map Preview</p>
              <button onClick={() => { setSelectedLocation(null); setMapError(""); }} className="text-blue-400/50 hover:text-white text-sm">✕ Close</button>
            </div>
            {mapError ? (
              <p className="text-red-400 text-sm">{mapError}</p>
            ) : (
              <>
                <p className="text-blue-400/50 text-xs mb-3 truncate">{selectedLocation.name}</p>
                <div className="rounded-xl overflow-hidden border border-blue-500/15">
                  <iframe
                    title="map"
                    src={`https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lon}&hl=en&z=13&output=embed`}
                    className="w-full h-72 sm:h-96"
                    loading="lazy"
                  />
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TripManager;
