import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../services/api";
import Navbar from "./Navbar";

const cats = [
  { value: "beach", label: "🏖️ Beach" },
  { value: "mountain", label: "🏔️ Mountain" },
  { value: "city", label: "🏙️ City" },
  { value: "historical", label: "🏛️ Historical" },
  { value: "nature", label: "🌿 Nature" },
  { value: "cultural", label: "🎭 Cultural" },
  { value: "adventure", label: "🧗 Adventure" },
  { value: "other", label: "📍 Other" },
];

function UpdateEntityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", location: "", category: "other", rating: 5, visited: false, imageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    apiClient.get(`/places/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({ name: p.name || "", description: p.description || "", location: p.location || "", category: p.category || "other", rating: p.rating || 5, visited: p.visited || false, imageUrl: p.imageUrl || "" });
      })
      .catch(() => setError("Failed to load place details."))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name.trim() || !form.location.trim() || !form.description.trim()) { setError("Please fill in all required fields."); return; }
    setSaving(true);
    try {
      await apiClient.put(`/places/${id}`, form);
      setSuccess("Place updated!");
      setTimeout(() => navigate("/places"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update place.");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="page-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-blue-400/60">Loading place details...</p>
      </div>
    </div>
  );

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-2">Edit Mode</p>
          <h1 className="text-4xl font-bold text-white">Update <span className="gradient-text">Destination</span></h1>
        </div>

        {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm flex items-center gap-2"><span>✕</span>{error}</div>}
        {success && <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm flex items-center gap-2"><span>✓</span>{success}</div>}

        <form onSubmit={handleSubmit} className="glass-card p-7 space-y-5">
          <div>
            <label className="block text-sm font-medium text-blue-200/70 mb-1.5">Place Name *</label>
            <input name="name" type="text" value={form.name} onChange={set} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200/70 mb-1.5">Location *</label>
            <input name="location" type="text" value={form.location} onChange={set} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200/70 mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={set} rows={4} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200/70 mb-1.5">Image URL <span className="text-blue-500/40 text-xs">(optional)</span></label>
            <input name="imageUrl" type="url" placeholder="https://..." value={form.imageUrl} onChange={set} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/70 mb-3">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cats.map((c) => (
                <button key={c.value} type="button" onClick={() => setForm({ ...form, category: c.value })}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    form.category === c.value ? "bg-blue-600/25 border-blue-500/40 text-blue-200" : "bg-[#0a1628] border-blue-500/15 text-blue-400/60 hover:border-blue-500/30"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/70 mb-2">
              Rating: <span className="text-cyan-400 font-bold">{form.rating}/10</span>
              <span className="ml-2 text-amber-400 text-xs">{"⭐".repeat(Math.ceil(form.rating / 2))}</span>
            </label>
            <input type="range" name="rating" min="1" max="10" value={form.rating} onChange={set} className="w-full" />
            <div className="flex justify-between text-xs text-blue-500/40 mt-1"><span>1 Poor</span><span>10 Amazing</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/70 mb-3">Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setForm({ ...form, visited: true })}
                className={`py-3 rounded-xl text-sm font-medium border transition-all ${form.visited ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300" : "bg-[#0a1628] border-blue-500/15 text-blue-400/50 hover:border-blue-500/30"}`}>
                ✓ Visited
              </button>
              <button type="button" onClick={() => setForm({ ...form, visited: false })}
                className={`py-3 rounded-xl text-sm font-medium border transition-all ${!form.visited ? "bg-blue-600/20 border-blue-500/40 text-blue-300" : "bg-[#0a1628] border-blue-500/15 text-blue-400/50 hover:border-blue-500/30"}`}>
                ☐ Wishlist
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3.5">
              {saving ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</span> : "✓ Save Changes"}
            </button>
            <button type="button" onClick={() => navigate("/places")} className="btn-secondary px-6 py-3.5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEntityPage;
