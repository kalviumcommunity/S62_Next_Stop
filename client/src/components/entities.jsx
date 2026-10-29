import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api";
import NavBar from "./NavBar";
import PlaceCard from "./PlaceCard";
import PlaceDetail from "./PlaceDetail";
import { Button, ConfirmDialog, Toast, inputCls } from "./ui";

const TABS = [
  { key: "all", label: "All" },
  { key: "wishlist", label: "Wishlist" },
  { key: "visited", label: "Visited" },
  { key: "revisit", label: "Revisit" },
  { key: "favorites", label: "Favorites" },
];

const STATUS_MSG = { visited: "Marked as visited", revisit: "Added to revisit list", wishlist: "Moved to wishlist" };

const EMPTY_TEXT = {
  all: "Your list is empty. Add the first place you want to visit.",
  wishlist: "Nothing on your wishlist yet.",
  visited: "No visited places yet. Mark a wishlist place as visited.",
  revisit: "Your revisit list is empty. Add visited places you'd go back to.",
  favorites: "No favorites yet. Tap ♡ on a place.",
};

function TravelDestinations() {
  const navigate = useNavigate();
  const { id: detailId } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.key === params.get("tab")) ? params.get("tab") : "all";

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const toastTimer = useRef();
  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setPlaces(await api.listPlaces());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Show "Place added/updated" after returning from the form pages, then clean the URL.
  useEffect(() => {
    const saved = params.get("saved");
    if (!saved) return;
    notify(saved === "updated" ? "Place updated" : "Place added");
    const next = new URLSearchParams(params);
    next.delete("saved");
    setParams(next, { replace: true });
  }, [params, setParams, notify]);

  const setTab = (key) => {
    const next = new URLSearchParams(params);
    if (key === "all") next.delete("tab");
    else next.set("tab", key);
    setParams(next);
  };

  const search = params.toString() ? `?${params.toString()}` : "";
  const openPlace = (id) => navigate(`/places/${id}${search}`);
  const closePlace = () => navigate(`/places${search}`);

  const replace = (updated) => setPlaces((ps) => ps.map((p) => (p._id === updated._id ? updated : p)));

  const counts = useMemo(
    () => ({
      all: places.length,
      wishlist: places.filter((p) => p.status === "wishlist").length,
      visited: places.filter((p) => p.status === "visited").length,
      revisit: places.filter((p) => p.status === "revisit").length,
      favorites: places.filter((p) => p.favorite).length,
    }),
    [places]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = places.filter((p) => {
      if (tab === "favorites" && !p.favorite) return false;
      if (!["all", "favorites"].includes(tab) && p.status !== tab) return false;
      return !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    });
    const sorters = {
      recent: (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
      name: (a, b) => a.name.localeCompare(b.name),
      rating: (a, b) => (b.averageRating || 0) - (a.averageRating || 0),
    };
    return [...list].sort(sorters[sort]);
  }, [places, tab, query, sort]);

  const detail = places.find((p) => p._id === detailId);

  const run = async (fn, okMsg) => {
    try {
      await fn();
      if (okMsg) notify(okMsg);
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const changeStatus = (place, status) =>
    run(async () => replace(await api.updatePlace(place._id, { status })), STATUS_MSG[status]);

  const toggleFavorite = (place) =>
    run(
      async () => replace(await api.updatePlace(place._id, { favorite: !place.favorite })),
      place.favorite ? "Removed from favorites" : "Added to favorites"
    );

  const doConfirm = async () => {
    setBusy(true);
    await run(confirm.action, confirm.okMsg);
    setBusy(false);
    setConfirm(null);
  };

  const askDeletePlace = (place) =>
    setConfirm({
      title: "Delete place?",
      message: `"${place.name}" and its ${place.reviews?.length || 0} review(s) will be permanently removed.`,
      okMsg: "Place deleted",
      action: async () => {
        await api.deletePlace(place._id);
        setPlaces((ps) => ps.filter((p) => p._id !== place._id));
        if (detailId === place._id) closePlace();
      },
    });

  const askDeleteReview = (place, reviewId) =>
    setConfirm({
      title: "Delete review?",
      message: "This review will be permanently removed.",
      okMsg: "Review deleted",
      action: async () => replace(await api.deleteReview(place._id, reviewId)),
    });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar>
        <Button onClick={() => navigate("/addEntity")}>+ Add place</Button>
      </NavBar>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="sr-only">Travel destinations</h1>
        <div className="grid grid-cols-3 gap-3 sm:max-w-md">
          {[
            ["Wishlist", counts.wishlist, "text-amber-300"],
            ["Visited", counts.visited, "text-emerald-300"],
            ["Revisit", counts.revisit, "text-indigo-300"],
          ].map(([label, n, color]) => (
            <div key={label} className="rounded-xl bg-gray-800/60 px-4 py-3 ring-1 ring-gray-700">
              <div className={`text-2xl font-bold ${color}`}>{n}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:px-0" aria-label="Lists">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  tab === t.key ? "bg-gray-100 text-gray-900" : "text-gray-300 hover:bg-gray-800"
                }`}
                aria-current={tab === t.key ? "page" : undefined}
              >
                {t.label} <span className="text-gray-500">{counts[t.key]}</span>
              </button>
            ))}
          </nav>
          <div className="flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or location"
              className={`${inputCls} min-w-0 flex-1 lg:w-64 lg:flex-none`}
              aria-label="Search places"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="shrink-0 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white ring-1 ring-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Sort"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <section className="mt-6">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-800/60" />
              ))}
            </div>
          ) : loadError ? (
            <div className="rounded-xl bg-rose-500/10 p-6 text-center ring-1 ring-rose-500/30">
              <p className="text-rose-300">{loadError}</p>
              <Button variant="secondary" className="mt-4" onClick={load}>Try again</Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-700 p-10 text-center">
              <p className="text-gray-400">{query ? "No places match your search." : EMPTY_TEXT[tab]}</p>
              {!query && tab !== "favorites" && (
                <Button className="mt-4" onClick={() => navigate("/addEntity")}>+ Add place</Button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <PlaceCard
                  key={p._id}
                  place={p}
                  onOpen={() => openPlace(p._id)}
                  onEdit={() => navigate(`/updateEntity/${p._id}`)}
                  onDelete={() => askDeletePlace(p)}
                  onStatus={(s) => changeStatus(p, s)}
                  onFavorite={() => toggleFavorite(p)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {detail && !confirm && (
        <PlaceDetail
          place={detail}
          onClose={closePlace}
          onEdit={() => navigate(`/updateEntity/${detail._id}`)}
          onAddReview={async (review) => {
            replace(await api.addReview(detail._id, review));
            notify("Review posted");
          }}
          onUpdateReview={async (reviewId, review) => {
            replace(await api.updateReview(detail._id, reviewId, review));
            notify("Review updated");
          }}
          onDeleteReview={(reviewId) => askDeleteReview(detail, reviewId)}
        />
      )}

      {!loading && detailId && !detail && !loadError && (
        <ConfirmDialog
          title="Place not found"
          message="This place doesn't exist or was deleted."
          confirmLabel="Back to places"
          onConfirm={closePlace}
          onCancel={closePlace}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          busy={busy}
          onConfirm={doConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <Toast toast={toast} />
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
