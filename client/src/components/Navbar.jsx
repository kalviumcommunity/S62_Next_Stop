import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Icons = {
  Dashboard: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Places: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Trips: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
  Memories: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Badges: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Gems: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 19 8 19 16 12 22 5 16 5 8 12 2" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="5" y1="8" x2="19" y2="8" />
    </svg>
  ),
  ForYou: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Stats: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = isLoggedIn
    ? [
        { path: "/dashboard", label: "Dashboard", icon: Icons.Dashboard },
        { path: "/places", label: "Places", icon: Icons.Places },
        { path: "/trips", label: "Trips", icon: Icons.Trips },
        { path: "/memories", label: "Memories", icon: Icons.Memories },
        { path: "/badges", label: "Badges", icon: Icons.Badges },
        { path: "/hidden-gems", label: "Gems", icon: Icons.Gems },
        { path: "/recommendations", label: "For You", icon: Icons.ForYou },
        { path: "/stats", label: "Stats", icon: Icons.Stats },
      ]
    : [];

  const active = (p) => location.pathname === p;

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-500/15 bg-[#020617]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-blue-500/20 animate-ping group-hover:bg-cyan-500/20" />
            <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10" fill="none" stroke="url(#navGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" fill="url(#navGrad)" stroke="none" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">Next Stop</span>
        </button>

        {/* Desktop links */}
        {isLoggedIn && (
          <div className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active(l.path)
                    ? "bg-blue-600/25 text-blue-300 border border-blue-500/35"
                    : "text-blue-300/60 hover:text-white hover:bg-blue-900/30"
                }`}
              >
                {l.icon}
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/addEntity")}
                className="hidden sm:flex items-center gap-1.5 btn-primary text-sm px-4 py-2"
              >
                <span className="font-bold">+</span> Add Place
              </button>
              <button
                onClick={() => navigate("/profile")}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${active("/profile") ? "bg-blue-600/30 border border-blue-500/40 text-blue-300" : "bg-blue-950/50 border border-blue-500/20 text-blue-400 hover:text-white hover:border-blue-500/40"}`}
                title="Profile"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-blue-300/70 hover:text-white border border-blue-500/20 rounded-xl hover:bg-blue-900/25 transition-all duration-200"
              >
                Logout
              </button>
              <button
                className="lg:hidden p-2 text-blue-300"
                onClick={() => setOpen(!open)}
              >
                {open ? "✕" : "☰"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="px-4 py-2 text-sm text-blue-300/70 hover:text-white border border-blue-500/20 rounded-xl hover:bg-blue-900/25 transition-all duration-200">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="btn-primary text-sm px-4 py-2">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && isLoggedIn && (
        <div className="lg:hidden border-t border-blue-500/15 px-4 pb-4 pt-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-2">
            {links.map((l) => (
              <button
                key={l.path}
                onClick={() => { navigate(l.path); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active(l.path)
                    ? "bg-blue-600/25 text-blue-300 border border-blue-500/35"
                    : "text-blue-300/70 hover:bg-blue-900/30"
                }`}
              >
                {l.icon}
                {l.label}
              </button>
            ))}
            <button
              onClick={() => { navigate("/profile"); setOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active("/profile")
                  ? "bg-blue-600/25 text-blue-300 border border-blue-500/35"
                  : "text-blue-300/70 hover:bg-blue-900/30"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </button>
            <button
              onClick={() => { navigate("/addEntity"); setOpen(false); }}
              className="col-span-2 btn-primary text-center text-sm py-2.5"
            >
              + Add New Place
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
