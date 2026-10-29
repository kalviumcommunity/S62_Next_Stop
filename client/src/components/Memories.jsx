import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../services/api";
import Navbar from "./Navbar";

const Memories = () => {
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [loadingMem, setLoadingMem] = useState(false);
  const [form, setForm] = useState({ imageUrl: "", caption: "", notes: "" });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    fetchPlaces();
  }, [navigate]);

  useEffect(() => {
    const placeId = new URLSearchParams(location.search).get("place");
    if (placeId && places.length > 0) {
      const p = places.find((x) => x._id === placeId);
      if (p) selectPlace(p);
    }
  }, [places, location.search]);

  const fetchPlaces = async () => {
    try {
      const res = await apiClient.get("/places");
      setPlaces((res.data.places || res.data).filter((p) => p.visited));
    } catch (err) { console.error(err); }
    finally { setLoadingPlaces(false); }
  };

  const selectPlace = async (place) => {
    setSelected(place); setMemories([]); setLoadingMem(true);
    setError(""); setSuccess(""); setShowForm(false);
    try {
      const res = await apiClient.get(`/memories/${place._id}`);
      setMemories(res.data.memories || []);
    } catch (err) { console.error(err); }
    finally { setLoadingMem(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!form.imageUrl.trim()) { setError("Please enter an image URL"); return; }
    setAdding(true);
    try {
      const res = await apiClient.post("/memories", { imageUrl: form.imageUrl, caption: form.caption, notes: form.notes, placeId: selected._id });
      setMemories([res.data.memory, ...memories]);
      setForm({ imageUrl: "", caption: "", notes: "" }); setShowForm(false);
      setSuccess("Memory saved!"); setTimeout(() => setSuccess(""), 3000);
    } catch (err) { setError(err.response?.data?.message || "Failed to save memory."); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this memory?")) return;
    try {
      await apiClient.delete(`/memories/${id}`);
      setMemories(memories.filter((m) => m._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-1">Photo Gallery</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Travel <span className="gradient-text">Memories</span></h1>
          <p className="text-blue-300/50 mt-2 text-sm">Relive your journeys through photos and notes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Place list */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5">
              <p className="text-white font-bold text-lg mb-0.5">Visited Places</p>
              <p className="text-blue-400/50 text-xs mb-4">{places.length} place{places.length !== 1 ? "s" : ""} available</p>
              {loadingPlaces ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-blue-950 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : places.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-5xl">📸</span>
                  <p className="text-blue-400/60 text-sm mt-3">No visited places yet.</p>
                  <button onClick={() => navigate("/places")} className="btn-primary mt-4 text-sm px-4 py-2">Go to Places</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {places.map((p) => (
                    <button key={p._id} onClick={() => selectPlace(p)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        selected?._id === p._id
                          ? "bg-blue-600/20 border-blue-500/40"
                          : "bg-[#0a1628] border-blue-500/10 hover:border-blue-500/30"
                      }`}>
                      <p className="text-white font-medium text-sm truncate">{p.name}</p>
                      <p className="text-blue-400/50 text-xs mt-0.5 flex items-center gap-1"><span>📍</span>{p.location}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Memory area */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="glass-card p-14 text-center h-full flex flex-col items-center justify-center">
                <span className="text-7xl mb-4">📸</span>
                <h3 className="text-2xl font-bold text-white mb-2">Select a Place</h3>
                <p className="text-blue-400/50">Choose a visited place from the left to view and add memories.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="glass-card p-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                    <p className="text-blue-400/50 text-xs flex items-center gap-1"><span>📍</span>{selected.location}</p>
                  </div>
                  <button onClick={() => { setShowForm(!showForm); setError(""); }}
                    className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
                    <span>{showForm ? "✕" : "+"}</span>{showForm ? "Cancel" : "Add Memory"}
                  </button>
                </div>

                {/* Add form */}
                {showForm && (
                  <div className="glass-card p-6 animate-slide-up">
                    <p className="text-white font-bold mb-4">New Memory</p>
                    {error && <div className="mb-3 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-sm">{error}</div>}
                    {success && <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 text-sm">{success}</div>}
                    <form onSubmit={handleAdd} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-200/70 mb-1.5">Photo URL *</label>
                        <input type="url" placeholder="https://example.com/photo.jpg" value={form.imageUrl}
                          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field" required />
                        <p className="text-blue-500/40 text-xs mt-1">Paste any public image URL (Unsplash, Google Photos, etc.)</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200/70 mb-1.5">Caption</label>
                        <input type="text" placeholder="A short caption..." value={form.caption}
                          onChange={(e) => setForm({ ...form, caption: e.target.value })} className="input-field" maxLength={200} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200/70 mb-1.5">Notes</label>
                        <textarea placeholder="Your thoughts about this moment..." value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" rows={3} maxLength={1000} />
                      </div>
                      <button type="submit" disabled={adding} className="btn-primary w-full py-3">
                        {adding ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</span> : "📸 Save Memory"}
                      </button>
                    </form>
                  </div>
                )}

                {/* Gallery */}
                {loadingMem ? (
                  <div className="glass-card p-12 text-center">
                    <div className="w-10 h-10 border-2 border-blue-950 border-t-blue-500 rounded-full animate-spin mx-auto" />
                    <p className="text-blue-400/60 mt-3">Loading memories...</p>
                  </div>
                ) : memories.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <span className="text-6xl">🖼️</span>
                    <p className="text-white font-bold text-xl mt-4">No memories yet</p>
                    <p className="text-blue-400/50 mt-2 text-sm">Add your first photo for {selected.name}!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {memories.map((m) => (
                      <div key={m._id} className="glass-card-hover overflow-hidden group">
                        <div className="relative">
                          <img src={m.imageUrl} alt={m.caption || "Memory"}
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found"; }} />
                          <button onClick={() => handleDelete(m._id)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                            ✕
                          </button>
                        </div>
                        <div className="p-4">
                          {m.caption && <p className="text-white font-semibold text-sm mb-1">{m.caption}</p>}
                          {m.notes && <p className="text-blue-300/60 text-xs leading-relaxed">{m.notes}</p>}
                          <p className="text-blue-600/50 text-xs mt-2">
                            {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memories;
