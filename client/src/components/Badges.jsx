import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import Navbar from "./Navbar";

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [newBadges, setNewBadges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    apiClient.get("/badges")
      .then((res) => { setBadges(res.data.badges || []); setNewBadges(res.data.newBadges || []); setStats(res.data.stats || null); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  const pct = badges.length ? Math.round((earned.length / badges.length) * 100) : 0;

  if (loading) return (
    <div className="page-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-blue-400/60">Loading achievements...</p>
      </div>
    </div>
  );

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-2">Achievements</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Your <span className="gradient-text">Badges</span></h1>
          <p className="text-blue-300/50 mt-2 text-sm">Earn badges by exploring the world</p>
        </div>

        {/* New badge alert */}
        {newBadges.length > 0 && (
          <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center animate-slide-up">
            <p className="text-amber-400 font-bold text-lg mb-3">🎉 New Badge{newBadges.length > 1 ? "s" : ""} Unlocked!</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {newBadges.map((b) => (
                <div key={b.name} className="flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 rounded-xl px-4 py-2">
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-amber-200 font-semibold text-sm">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-bold text-xl">Overall Progress</p>
              <p className="text-blue-400/50 text-sm mt-0.5">{earned.length} of {badges.length} badges earned</p>
            </div>
            <p className="text-4xl font-bold gradient-text">{pct}%</p>
          </div>
          <div className="w-full bg-blue-950/60 rounded-full h-3">
            <div className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>

          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[["📍", stats.totalPlaces, "Places Saved"], ["✅", stats.visitedPlaces, "Visited"], ["✈️", stats.totalTrips, "Trips"], ["📸", stats.totalMemories, "Memories"]].map(([icon, val, label]) => (
                <div key={label} className="bg-blue-950/30 border border-blue-500/10 rounded-xl p-3 text-center">
                  <span className="text-xl">{icon}</span>
                  <p className="text-white font-bold text-xl mt-1">{val}</p>
                  <p className="text-blue-400/50 text-xs">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earned */}
        {earned.length > 0 && (
          <div className="mb-8">
            <p className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span>🏆</span> Earned <span className="text-blue-400/50 text-sm font-normal ml-1">({earned.length})</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {earned.map((b) => (
                <div key={b.name} className="glass-card p-5 text-center group hover:scale-105 transition-transform duration-300 border-blue-500/25 bg-gradient-to-br from-blue-900/20 to-cyan-900/10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/25 to-cyan-600/20 border-2 border-blue-400/40 flex items-center justify-center text-3xl mx-auto mb-3 group-hover:border-blue-300/60 transition-colors">
                    {b.icon}
                  </div>
                  <p className="text-white font-bold text-sm">{b.name}</p>
                  <p className="text-blue-300/50 text-xs mt-1 leading-relaxed">{b.description}</p>
                  {b.earnedAt && (
                    <p className="text-blue-600/60 text-xs mt-2">
                      {new Date(b.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <div>
            <p className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span>🔒</span> Locked <span className="text-blue-500/40 text-sm font-normal ml-1">({locked.length})</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {locked.map((b) => (
                <div key={b.name} className="glass-card p-5 text-center opacity-40">
                  <div className="w-16 h-16 rounded-full bg-blue-950/40 border-2 border-blue-800/30 flex items-center justify-center text-3xl mx-auto mb-3 grayscale">{b.icon}</div>
                  <p className="text-blue-300 font-bold text-sm">{b.name}</p>
                  <p className="text-blue-500 text-xs mt-1 leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {earned.length === 0 && locked.length === 0 && (
          <div className="glass-card p-14 text-center">
            <span className="text-6xl">🏆</span>
            <p className="text-white font-bold text-xl mt-4">Start Earning Badges!</p>
            <p className="text-blue-400/50 mt-2">Add places, visit them, and create trips to unlock achievements.</p>
            <button onClick={() => navigate("/places")} className="btn-primary mt-6">Browse Places</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Badges;
