import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import Navbar from "./Navbar";

const catEmoji = { beach:"🏖️", mountain:"🏔️", city:"🏙️", historical:"🏛️", nature:"🌿", cultural:"🎭", adventure:"🧗", other:"📍" };
const catColors = {
  beach: "from-amber-500 to-orange-400",
  mountain: "from-slate-400 to-blue-400",
  city: "from-blue-500 to-indigo-400",
  historical: "from-yellow-600 to-amber-500",
  nature: "from-emerald-500 to-green-400",
  cultural: "from-pink-500 to-rose-400",
  adventure: "from-red-500 to-orange-500",
  other: "from-blue-400 to-cyan-400",
};

const Donut = ({ pct, size = 120, color = "#3b82f6", bg = "#0f2044", label, sub }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth="10" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{pct}%</span>
        </div>
      </div>
      <p className="text-white text-sm font-semibold">{label}</p>
      {sub && <p className="text-blue-400/50 text-xs">{sub}</p>}
    </div>
  );
};

const Stats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    apiClient.get("/users/me/stats")
      .then(res => setStats(res.data))
      .catch(() => setError("Could not load stats."))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <div className="page-bg min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-400/60">Crunching your travel data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="page-bg min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
      </div>
    </div>
  );

  const visitedPct = stats.totalPlaces ? Math.round((stats.visitedPlaces / stats.totalPlaces) * 100) : 0;
  const budgetPct = stats.totalBudget ? Math.min(100, Math.round((stats.totalSpent / stats.totalBudget) * 100)) : 0;
  const completedPct = stats.tripCount ? Math.round((stats.completedTrips / stats.tripCount) * 100) : 0;

  const topCategories = Object.entries(stats.categories)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const maxCatCount = topCategories[0]?.[1] || 1;

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-1">Your Journey</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Travel <span className="gradient-text">Stats</span>
          </h1>
          <p className="text-blue-300/50 mt-2 text-sm">A snapshot of your adventures so far.</p>
        </div>

        {/* Big number row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Places Saved", value: stats.totalPlaces, sub: `${stats.visitedPlaces} visited`, color: "text-white" },
            { label: "Trips Planned", value: stats.tripCount, sub: `${stats.completedTrips} completed`, color: "text-blue-300" },
            { label: "Avg. Rating", value: stats.averageRating || "—", sub: "across all places", color: "text-amber-300" },
            { label: "Total Budget", value: stats.totalBudget ? `₹${(stats.totalBudget/1000).toFixed(1)}k` : "₹0", sub: `₹${(stats.totalSpent/1000).toFixed(1)}k spent`, color: "text-cyan-300" },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-blue-400/50 text-xs uppercase tracking-widest mt-1">{s.label}</p>
              <p className="text-blue-500/35 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Donut charts row */}
        <div className="glass-card p-8 mb-6">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-8">Overview</p>
          <div className="flex flex-wrap justify-around gap-10">
            <Donut pct={visitedPct} color="#10b981" bg="#0a2a1c"
              label="Places Visited"
              sub={`${stats.visitedPlaces} of ${stats.totalPlaces}`} />
            <Donut pct={completedPct} color="#3b82f6" bg="#0f2044"
              label="Trips Completed"
              sub={`${stats.completedTrips} of ${stats.tripCount}`} />
            <Donut pct={budgetPct} color={budgetPct >= 90 ? "#ef4444" : "#22d3ee"} bg="#0a1f2a"
              label="Budget Used"
              sub={`₹${Number(stats.totalSpent).toLocaleString()} of ₹${Number(stats.totalBudget).toLocaleString()}`} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Category breakdown */}
          <div className="glass-card p-6">
            <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-5">Places by Category</p>
            {topCategories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-2">📍</p>
                <p className="text-blue-400/40 text-sm">Add places to see your breakdown.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCategories.map(([cat, count]) => {
                  const pct = Math.round((count / maxCatCount) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-blue-200/80 capitalize flex items-center gap-1.5">
                          <span>{catEmoji[cat]}</span> {cat}
                        </span>
                        <span className="text-blue-400/50 text-xs font-semibold">{count} place{count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-2 bg-blue-950/60 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${catColors[cat] || "from-blue-500 to-cyan-400"} transition-all duration-700`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trip status breakdown */}
          <div className="glass-card p-6">
            <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-5">Trip Status</p>
            {stats.tripCount === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-2">✈️</p>
                <p className="text-blue-400/40 text-sm">Plan a trip to see your stats.</p>
                <button onClick={() => navigate("/trips")} className="mt-3 text-xs text-blue-400/50 hover:text-blue-300 transition-colors">
                  Plan a trip →
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {[
                  { label: "Planned", value: stats.plannedTrips, color: "bg-blue-500", textColor: "text-blue-300" },
                  { label: "Ongoing", value: stats.activeTrips, color: "bg-emerald-500", textColor: "text-emerald-300" },
                  { label: "Completed", value: stats.completedTrips, color: "bg-cyan-500", textColor: "text-cyan-300" },
                ].map(s => {
                  const pct = stats.tripCount ? Math.round((s.value / stats.tripCount) * 100) : 0;
                  return (
                    <div key={s.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className={`font-medium ${s.textColor}`}>{s.label}</span>
                        <span className="text-blue-400/50">{s.value} trip{s.value !== 1 ? "s" : ""} · {pct}%</span>
                      </div>
                      <div className="h-2.5 bg-blue-950/60 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color} transition-all duration-700`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}

                {/* Budget summary */}
                {stats.totalBudget > 0 && (
                  <div className="pt-4 border-t border-blue-500/10 space-y-2">
                    <p className="text-blue-400/60 text-xs uppercase tracking-widest">Budget Summary</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200/60">Total Budget</span>
                      <span className="text-white font-semibold">₹{Number(stats.totalBudget).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200/60">Total Spent</span>
                      <span className={`font-semibold ${stats.totalSpent > stats.totalBudget ? "text-red-400" : "text-emerald-400"}`}>
                        ₹{Number(stats.totalSpent).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200/60">Remaining</span>
                      <span className="text-cyan-300 font-semibold">
                        ₹{Math.max(0, stats.totalBudget - stats.totalSpent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming trips */}
        {stats.upcomingTrips?.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest">Upcoming Trips</p>
              <button onClick={() => navigate("/trips")} className="text-xs text-blue-400/50 hover:text-blue-300 transition-colors">
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {stats.upcomingTrips.map((t, i) => {
                const daysUntil = Math.ceil((new Date(t.startDate) - new Date()) / 86400000);
                return (
                  <div key={t._id || i} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-blue-950/30 border border-blue-500/10">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/25 flex items-center justify-center shrink-0">
                      <span className="text-blue-300 text-xs font-bold">{daysUntil > 0 ? `${daysUntil}d` : "Now"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{t.name}</p>
                      <p className="text-blue-400/50 text-xs truncate">{t.destination || "No destination set"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-blue-300/60 text-xs">{new Date(t.startDate).toLocaleDateString()}</p>
                      {t.budget > 0 && <p className="text-blue-500/40 text-xs">₹{Number(t.budget).toLocaleString()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wishlist vs visited */}
        <div className="glass-card p-6">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-4">Wishlist vs Visited</p>
          {stats.totalPlaces === 0 ? (
            <p className="text-blue-400/40 text-sm text-center py-4">No places saved yet.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-emerald-300 text-sm w-20 shrink-0">Visited</span>
                <div className="flex-1 h-3 bg-blue-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${visitedPct}%` }} />
                </div>
                <span className="text-blue-400/50 text-xs w-16 text-right shrink-0">
                  {stats.visitedPlaces} ({visitedPct}%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-300 text-sm w-20 shrink-0">Wishlist</span>
                <div className="flex-1 h-3 bg-blue-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${100 - visitedPct}%` }} />
                </div>
                <span className="text-blue-400/50 text-xs w-16 text-right shrink-0">
                  {stats.wishlistPlaces} ({100 - visitedPct}%)
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Stats;
