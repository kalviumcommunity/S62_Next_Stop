import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import PlaceCard from "./PlaceCard";
import Navbar from "./Navbar";

const cats = [
  { value: "beach", label: "🏖️ Beach" },
  { value: "mountain", label: "🏔️ Mountain" },
  { value: "city", label: "🏙️ City" },
  { value: "historical", label: "🏛️ Historical" },
  { value: "nature", label: "🌿 Nature" },
  { value: "cultural", label: "🎭 Cultural" },
  { value: "adventure", label: "🧗 Adventure" },
];

function TravelDestinations() {
  const [places, setPlaces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", visited: "", sortBy: "dateAdded" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchPlaces(); }, []);
  useEffect(() => { applyFilters(); }, [places, filters]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/places");
      setPlaces(res.data.places || res.data);
    } catch { setError("Unable to load places."); }
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    let r = [...places];
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (filters.category) r = r.filter((p) => p.category === filters.category);
    if (filters.visited) r = r.filter((p) => filters.visited === "visited" ? p.visited : !p.visited);
    r.sort((a, b) => {
      if (filters.sortBy === "name") return a.name.localeCompare(b.name);
      if (filters.sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFiltered(r);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this place?")) return;
    try {
      await apiClient.delete(`/places/${id}`);
      setPlaces(places.filter((p) => p._id !== id));
    } catch { setError("Failed to delete place."); }
  };

  const handleFav = async (id) => {
    const p = places.find((x) => x._id === id);
    if (!p) return;
    try {
      const res = await apiClient.put(`/places/${id}`, { favorite: !p.favorite });
      setPlaces(places.map((x) => (x._id === id ? res.data.place : x)));
    } catch (err) { console.error(err); }
  };

  const setFilter = (k, v) => setFilters((prev) => ({ ...prev, [k]: v }));
  const clearFilters = () => setFilters({ search: "", category: "", visited: "", sortBy: "dateAdded" });
  const activeCount = [filters.category, filters.visited].filter(Boolean).length;

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-1">Your Collection</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              My <span className="gradient-text">Destinations</span>
            </h1>
          </div>
          <button onClick={() => navigate("/addEntity")} className="btn-primary self-start sm:self-auto flex items-center gap-2">
            <span className="font-bold text-lg">+</span> Add Destination
          </button>
        </div>

        {error && <div className="mb-5 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">{error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { l: "Total", v: places.length, c: "text-blue-400" },
            { l: "Visited", v: places.filter((p) => p.visited).length, c: "text-emerald-400" },
            { l: "Wishlist", v: places.filter((p) => !p.visited).length, c: "text-cyan-400" },
            { l: "Favorites", v: places.filter((p) => p.favorite).length, c: "text-pink-400" },
          ].map((s) => (
            <div key={s.l} className="glass-card p-4 text-center">
              <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
              <p className="text-blue-400/50 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400/50">🔍</span>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
              showFilters || activeCount > 0
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-[#0a1628] border-blue-500/15 text-blue-300/60 hover:border-blue-500/30"
            }`}
          >
            <span>⚙️</span> Filters
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">{activeCount}</span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="glass-card p-6 mb-6 space-y-5 animate-slide-up">
            <div>
              <p className="text-blue-200/70 text-sm font-medium mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                <FilterBtn active={!filters.category} onClick={() => setFilter("category", "")}>All</FilterBtn>
                {cats.map((c) => (
                  <FilterBtn key={c.value} active={filters.category === c.value} onClick={() => setFilter("category", c.value)}>
                    {c.label}
                  </FilterBtn>
                ))}
              </div>
            </div>
            <div>
              <p className="text-blue-200/70 text-sm font-medium mb-3">Status</p>
              <div className="flex gap-2">
                {[["", "All"], ["visited", "✓ Visited"], ["wishlist", "☐ Wishlist"]].map(([v, l]) => (
                  <FilterBtn key={v} active={filters.visited === v} onClick={() => setFilter("visited", v)}>{l}</FilterBtn>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <p className="text-blue-200/70 text-sm font-medium mb-2">Sort By</p>
                <select value={filters.sortBy} onChange={(e) => setFilter("sortBy", e.target.value)} className="input-field">
                  <option value="dateAdded">Latest Added</option>
                  <option value="name">Name (A–Z)</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
              <button onClick={clearFilters} className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-colors">
                Clear
              </button>
            </div>
          </div>
        )}

        {!loading && (
          <p className="text-blue-500/40 text-sm mb-4">Showing {filtered.length} of {places.length} destinations</p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-400/60">Loading destinations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-7xl">🗺️</span>
            <h3 className="text-2xl font-bold text-white mt-4 mb-2">No destinations found</h3>
            <p className="text-blue-400/50 mb-6">{places.length === 0 ? "Start by adding your first place!" : "Try adjusting your filters."}</p>
            {places.length === 0 && <button onClick={() => navigate("/addEntity")} className="btn-primary">Add First Place</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <PlaceCard
                key={p._id} id={p._id} name={p.name} location={p.location}
                description={p.description} category={p.category} visited={p.visited}
                rating={p.rating} favorite={p.favorite}
                likes={p.likes || []} comments={p.comments || []}
                onToggleFavorite={handleFav}
                onUpdate={(id) => navigate(`/updateEntity/${id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const FilterBtn = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
      active
        ? "bg-blue-600/25 border-blue-500/40 text-blue-300"
        : "bg-[#0a1628] border-blue-500/15 text-blue-400/60 hover:border-blue-500/30"
    }`}
  >
    {children}
  </button>
);

export default TravelDestinations;
