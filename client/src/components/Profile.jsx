import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import Navbar from "./Navbar";

const catEmoji = { beach:"🏖️", mountain:"🏔️", city:"🏙️", historical:"🏛️", nature:"🌿", cultural:"🎭", adventure:"🧗", other:"📍" };

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    Promise.all([
      apiClient.get("/users/me"),
      apiClient.get("/users/me/stats"),
    ]).then(([uRes, sRes]) => {
      setUser(uRes.data.user);
      setStats(sRes.data);
      setForm({
        name: uRes.data.user.name || "",
        bio: uRes.data.user.bio || "",
        avatarUrl: uRes.data.user.avatarUrl || "",
      });
    }).catch(() => navigate("/login"));
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await apiClient.put("/users/me", form);
      setUser(res.data.user);
      setEditing(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Failed to save changes."); }
    finally { setSaving(false); }
  };

  if (!user) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-950 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  const initials = user.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="page-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Profile hero */}
        <div className="glass-card p-8 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500/30"
                  onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white select-none">
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#020617]" />
            </div>

            {/* Info or edit form */}
            <div className="flex-1 min-w-0">
              {!editing ? (
                <>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-blue-400/50 text-sm mt-0.5">{user.email}</p>
                  {user.bio
                    ? <p className="text-blue-200/60 text-sm mt-2 max-w-md leading-relaxed">{user.bio}</p>
                    : <p className="text-blue-500/30 text-sm mt-2 italic">No bio yet — add one to tell your travel story.</p>
                  }
                  <p className="text-blue-500/25 text-xs mt-3">Member since {joinDate}</p>
                </>
              ) : (
                <form onSubmit={handleSave} className="space-y-3 w-full max-w-md">
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Your name" className="input-field text-sm" />
                  <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                    placeholder="Short bio (e.g. 'Explorer from Mumbai, 12 countries and counting')"
                    rows="2" className="input-field text-sm resize-none" maxLength={200} />
                  <input value={form.avatarUrl} onChange={e => setForm({...form, avatarUrl: e.target.value})}
                    placeholder="Avatar image URL (optional)" className="input-field text-sm" />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => { setEditing(false); setError(""); }} className="btn-secondary text-sm px-5 py-2">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary text-sm px-4 py-2 shrink-0">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {success && (
          <div className="glass-card border border-emerald-500/30 p-4 mb-6 text-emerald-400 text-sm animate-fade-in">
            {success}
          </div>
        )}

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Places Saved", value: stats.totalPlaces, color: "text-white" },
              { label: "Visited", value: stats.visitedPlaces, color: "text-emerald-300" },
              { label: "Trips", value: stats.tripCount, color: "text-blue-300" },
              { label: "Badges", value: user.badges?.length || 0, color: "text-amber-300" },
            ].map(s => (
              <div key={s.label} className="glass-card p-5 text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-blue-400/50 text-xs mt-1 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Badges */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest">Earned Badges</p>
              <button onClick={() => navigate("/badges")} className="text-xs text-blue-400/50 hover:text-blue-300 transition-colors">
                View all →
              </button>
            </div>
            {!user.badges?.length ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2">🏆</p>
                <p className="text-blue-400/40 text-sm">No badges yet — start exploring!</p>
                <button onClick={() => navigate("/badges")} className="mt-3 text-xs text-blue-400/50 hover:text-blue-300 transition-colors">
                  See available badges →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {user.badges.slice(0, 9).map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-950/30 border border-blue-500/15 text-center hover:border-blue-500/35 transition-colors">
                    <span className="text-2xl">{b.icon}</span>
                    <p className="text-white text-xs font-semibold leading-tight">{b.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category breakdown */}
          {stats && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest">Places by Category</p>
                <button onClick={() => navigate("/stats")} className="text-xs text-blue-400/50 hover:text-blue-300 transition-colors">
                  Full stats →
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(stats.categories)
                  .filter(([, v]) => v > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => {
                    const pct = stats.totalPlaces ? Math.round((count / stats.totalPlaces) * 100) : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-blue-200/70 capitalize">{catEmoji[cat]} {cat}</span>
                          <span className="text-blue-400/50">{count} · {pct}%</span>
                        </div>
                        <div className="h-1.5 bg-blue-950/60 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                {!Object.values(stats.categories).some(v => v > 0) && (
                  <p className="text-blue-400/40 text-sm text-center py-6">Add places to see your category breakdown.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recent places */}
        {stats?.recentPlaces?.length > 0 && (
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest">Recently Added</p>
              <button onClick={() => navigate("/places")} className="text-xs text-blue-400/50 hover:text-blue-300 transition-colors">
                View all →
              </button>
            </div>
            <div className="space-y-2">
              {stats.recentPlaces.map(p => (
                <div key={p._id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-950/30 border border-blue-500/10 hover:border-blue-500/25 transition-colors">
                  <span className="text-lg shrink-0">{catEmoji[p.category] || "📍"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.name}</p>
                    <p className="text-blue-400/50 text-xs truncate">{p.location}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs shrink-0 ${p.visited ? "bg-emerald-500/15 text-emerald-300" : "bg-blue-500/15 text-blue-300"}`}>
                    {p.visited ? "Visited" : "Wishlist"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
