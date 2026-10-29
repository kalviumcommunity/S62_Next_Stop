import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import PlaceCard from "./PlaceCard";
import Navbar from "./Navbar";

const Recommendations = () => {
  const [recommended, setRecommended] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    apiClient.get("/places/recommendations")
      .then((res) => { setRecommended(res.data.recommended || []); setPreferences(res.data.preferences || null); })
      .catch(() => setError("Could not load recommendations."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleFav = async (id) => {
    const p = recommended.find((x) => x._id === id);
    if (!p) return;
    try {
      const res = await apiClient.put(`/places/${id}`, { favorite: !p.favorite });
      setRecommended(recommended.map((x) => (x._id === id ? res.data.place : x)));
    } catch (err) { console.error(err); }
  };

  const catEmoji = { beach:"🏖️", mountain:"🏔️", city:"🏙️", historical:"🏛️", nature:"🌿", cultural:"🎭", adventure:"🧗", other:"📍" };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-1">Personalised For You</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            ✨ <span className="gradient-text">Recommendations</span>
          </h1>
          <p className="text-blue-300/50 mt-2 text-sm max-w-xl">
            Based on your saved places and travel style, here are destinations you might want to visit next.
          </p>
        </div>

        {/* Preference pills */}
        {preferences && (
          <div className="glass-card p-5 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-blue-300/70 text-sm font-medium">Your top interests:</span>
              {preferences.topCategories?.slice(0, 4).map((cat) => (
                <span key={cat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-300 text-sm">
                  <span>{catEmoji[cat] || "📍"}</span>
                  <span className="capitalize">{cat}</span>
                </span>
              ))}
              {preferences.totalSaved !== undefined && (
                <span className="ml-auto text-blue-500/40 text-xs">{preferences.totalSaved} places saved</span>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-400/60">Calculating your picks...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
          </div>
        ) : recommended.length === 0 ? (
          <div className="glass-card p-14 text-center">
            <span className="text-7xl">✨</span>
            <h3 className="text-2xl font-bold text-white mt-4 mb-2">No Recommendations Yet</h3>
            <p className="text-blue-400/50 mb-2">Save more places across different categories to get personalised picks.</p>
            <p className="text-blue-500/40 text-sm mb-6">
              Tip: Add places you've already visited to help us understand your preferences!
            </p>
            <button onClick={() => navigate("/addEntity")} className="btn-primary">Add Your First Place</button>
          </div>
        ) : (
          <>
            <p className="text-blue-500/40 text-sm mb-5">{recommended.length} place{recommended.length !== 1 ? "s" : ""} recommended for you</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommended.map((p) => (
                <div key={p._id} className="flex flex-col gap-2">
                  <span className="self-start px-4 py-1.5 text-xs font-semibold bg-blue-600/20 border border-blue-500/40 text-blue-300 rounded-xl flex items-center gap-1">
                    <span>✨</span> Recommended
                  </span>
                  <PlaceCard
                    id={p._id} name={p.name} location={p.location}
                    description={p.description} category={p.category}
                    visited={p.visited} rating={p.rating} favorite={p.favorite}
                    likes={p.likes || []} comments={p.comments || []}
                    onToggleFavorite={handleFav}
                    onUpdate={(id) => navigate(`/updateEntity/${id}`)}
                    showActions
                  />
                </div>
              ))}
            </div>

            {/* How it works note */}
            <div className="mt-10 glass-card p-5 flex items-start gap-3 border-blue-400/15">
              <span className="text-2xl shrink-0">🤖</span>
              <div>
                <p className="text-white font-semibold text-sm">How recommendations work</p>
                <p className="text-blue-400/50 text-xs mt-0.5 leading-relaxed">
                  We look at the categories you save most and suggest unvisited places from those categories,
                  ranked by your ratings. The more places you save, the better your recommendations get!
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
