import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import Navbar from "./Navbar";

const StatCard = ({ title, value, icon, accent }) => (
  <div className={`glass-card p-5 border-l-4 ${accent} hover:scale-[1.02] transition-transform duration-300`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-blue-300/50 text-xs font-semibold uppercase tracking-widest">{title}</p>
        <p className="text-4xl font-bold text-white mt-2">{value ?? 0}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const QuickCard = ({ title, desc, icon, onClick, from, to }) => (
  <button
    onClick={onClick}
    className="glass-card-hover p-5 text-left w-full group"
  >
    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <p className="text-white font-bold">{title}</p>
    <p className="text-blue-300/50 text-sm mt-0.5">{desc}</p>
  </button>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    load();
  }, [navigate]);

  const load = async () => {
    try {
      const res = await apiClient.get("/users/me/stats");
      setStats(res.data);
      const n = [
        ...(res.data.upcomingTrips || []).map((t) => ({
          id: t._id, icon: "✈️",
          msg: `Trip: ${t.name} on ${new Date(t.startDate).toLocaleDateString()}`,
          action: () => navigate("/trips"),
        })),
        ...(res.data.upcomingTrips || [])
          .filter((t) => t.budget && t.totalSpent && t.totalSpent / t.budget > 0.8)
          .map((t) => ({
            id: `b-${t._id}`, icon: "⚠️",
            msg: `Budget alert: ${t.name} is ${((t.totalSpent / t.budget) * 100).toFixed(0)}% spent`,
            action: () => navigate("/trips"),
          })),
      ];
      setNotifs(n);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) { localStorage.removeItem("token"); navigate("/login"); }
      else setError("Unable to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="page-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-blue-400/60">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="page-bg flex items-center justify-center">
      <div className="glass-card p-10 text-center max-w-sm">
        <span className="text-5xl">😕</span>
        <p className="text-red-400 mt-4">{error}</p>
        <button onClick={load} className="btn-primary mt-5">Retry</button>
      </div>
    </div>
  );

  const catIcons = { beach:"🏖️", mountain:"🏔️", city:"🏙️", historical:"🏛️", nature:"🌿", cultural:"🎭", adventure:"🧗", other:"📍" };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4 animate-fade-in">
          <div>
            <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-1">Overview</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Travel <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-blue-300/50 mt-2 text-sm">Plan, explore, and track your adventures.</p>
          </div>

          {notifs.length > 0 && (
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="glass-card p-3.5 relative hover:border-blue-400/35 transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifs.length}
                </span>
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 glass-card p-4 shadow-2xl shadow-blue-900/40 z-50 animate-slide-up">
                  <p className="text-white font-bold mb-3 flex items-center gap-2"><span>🔔</span> Notifications</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifs.map((n) => (
                      <button key={n.id} onClick={n.action}
                        className="w-full text-left p-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 transition-colors text-sm text-blue-200/80 flex items-start gap-2">
                        <span>{n.icon}</span><span>{n.msg}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Place stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Saved Places" value={stats?.totalPlaces} icon="📍" accent="border-blue-500" />
          <StatCard title="Visited" value={stats?.visitedPlaces} icon="✅" accent="border-emerald-500" />
          <StatCard title="Wishlist" value={stats?.wishlistPlaces} icon="⭐" accent="border-amber-500" />
          <StatCard title="Favorites" value={stats?.favoriteCount} icon="❤️" accent="border-pink-500" />
        </div>

        {/* Trip stats */}
        {stats?.tripStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Trips" value={stats.tripStats.total} icon="✈️" accent="border-cyan-500" />
            <StatCard title="Planned" value={stats.tripStats.planned} icon="📋" accent="border-sky-500" />
            <StatCard title="Ongoing" value={stats.tripStats.ongoing} icon="🚀" accent="border-orange-500" />
            <StatCard title="Completed" value={stats.tripStats.completed} icon="🏁" accent="border-green-500" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <p className="text-white font-bold text-lg mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickCard title="New Trip" desc="Plan your next adventure" icon="✈️" onClick={() => navigate("/trips")} from="from-blue-600/30" to="to-cyan-600/20" />
            <QuickCard title="Add Place" desc="Save a new destination" icon="📍" onClick={() => navigate("/addEntity")} from="from-emerald-600/30" to="to-teal-600/20" />
            <QuickCard title="Memories" desc="Browse travel photos" icon="📸" onClick={() => navigate("/memories")} from="from-pink-600/30" to="to-rose-600/20" />
            <QuickCard title="My Badges" desc="View achievements" icon="🏆" onClick={() => navigate("/badges")} from="from-amber-600/30" to="to-yellow-600/20" />
          </div>
        </div>

        {/* Discover */}
        <div className="mb-8">
          <p className="text-white font-bold text-lg mb-4">Discover</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickCard title="Hidden Gems" desc="Rediscover forgotten places" icon="💎" onClick={() => navigate("/hidden-gems")} from="from-indigo-600/30" to="to-blue-600/20" />
            <QuickCard title="For You" desc="Personalised picks" icon="✨" onClick={() => navigate("/recommendations")} from="from-fuchsia-600/30" to="to-sky-600/20" />
            <QuickCard title="Browse All" desc="All your destinations" icon="🗺️" onClick={() => navigate("/places")} from="from-cyan-600/30" to="to-blue-600/20" />
          </div>
        </div>

        {/* Categories */}
        {stats?.categories && Object.keys(stats.categories).length > 0 && (
          <div className="glass-card p-6">
            <p className="text-white font-bold text-lg mb-4">Category Breakdown</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(stats.categories).map(([cat, count]) => (
                <div key={cat} className="bg-blue-950/30 border border-blue-500/15 rounded-xl p-4 text-center">
                  <span className="text-2xl">{catIcons[cat] || "📍"}</span>
                  <p className="text-white font-bold text-2xl mt-1">{count}</p>
                  <p className="text-blue-400/60 text-xs capitalize">{cat}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
