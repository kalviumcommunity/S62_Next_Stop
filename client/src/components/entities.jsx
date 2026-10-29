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
    </div>
  );
}

export default TravelDestinations;
