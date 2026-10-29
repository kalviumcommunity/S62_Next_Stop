import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import PlaceCard from "./PlaceCard";
import Navbar from "./Navbar";

const HiddenGems = () => {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    apiClient.get("/places/hidden-gems")
      .then((res) => setGems(res.data.gems || []))
      .catch(() => setError("Could not load hidden gems."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleFav = async (id) => {
    const g = gems.find((x) => x._id === id);
    if (!g) return;
    try {
      const res = await apiClient.put(`/places/${id}`, { favorite: !g.favorite });
      setGems(gems.map((x) => (x._id === id ? res.data.place : x)));
    } catch (err) { console.error(err); }
  };

  const markVisited = async (id) => {
    try {
      const res = await apiClient.put(`/places/${id}`, { visited: true });
      setGems(gems.filter((x) => x._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-1">Rediscover</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Hidden <span className="gradient-text">Gems</span>
          </h1>
          <p className="text-blue-300/50 mt-2 text-sm max-w-xl">
            Places you saved but haven't visited yet — your forgotten wishlist, rediscovered.
            These are off-the-beaten-path destinations waiting for you.
          </p>
        </div>

        {/* Info card */}
        <div className="glass-card p-5 mb-8 flex items-start gap-4 border-blue-400/20">
          <span className="text-3xl shrink-0">💎</span>
          <div>
            <p className="text-white font-semibold">What are Hidden Gems?</p>
            <p className="text-blue-300/50 text-sm mt-0.5">
              These are places from your wishlist — especially older saves, nature spots, historical sites,
              and adventure destinations — that deserve another look. Mark them visited when you go!
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-400/60">Finding your hidden gems...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
          </div>
        ) : gems.length === 0 ? (
          <div className="glass-card p-14 text-center">
            <span className="text-7xl">💎</span>
            <h3 className="text-2xl font-bold text-white mt-4 mb-2">No Gems Found</h3>
            <p className="text-blue-400/50 mb-6">
              {`Add more places to your wishlist — especially nature, historical, and adventure spots — to see them here!`}
            </p>
            <button onClick={() => navigate("/addEntity")} className="btn-primary">Add New Place</button>
          </div>
        ) : (
          <>
            <p className="text-blue-500/40 text-sm mb-5">{gems.length} hidden gem{gems.length !== 1 ? "s" : ""} found in your wishlist</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gems.map((g) => (
                <div key={g._id} className="flex flex-col gap-2">
                  <button
                    onClick={() => markVisited(g._id)}
                    className="self-start px-4 py-1.5 text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-colors"
                  >
                    ✓ Mark as Visited
                  </button>
                  <PlaceCard
                    id={g._id} name={g.name} location={g.location}
                    description={g.description} category={g.category}
                    visited={g.visited} rating={g.rating} favorite={g.favorite}
                    likes={g.likes || []} comments={g.comments || []}
                    onToggleFavorite={handleFav}
                    onUpdate={(id) => navigate(`/updateEntity/${id}`)}
                    showActions
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HiddenGems;
