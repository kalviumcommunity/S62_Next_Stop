import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Entities from "./components/entities";
import AddEntityPage from "./components/AddEntityPage";
import UpdateEntityPage from "./components/UpdateEntityPage";
import NavBar from "./components/NavBar";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./components/Dashboard";
import TripManager from "./components/TripManager";
import Memories from "./components/Memories";
import Badges from "./components/Badges";
import HiddenGems from "./components/HiddenGems";
import Recommendations from "./components/Recommendations";
import Profile from "./components/Profile";
import Stats from "./components/Stats";
import Navbar from "./components/Navbar";

const features = [
  { icon: "📍", title: "Save Places", desc: "Bookmark destinations for future adventures" },
  { icon: "✈️", title: "Plan Trips", desc: "Build day-wise itineraries with budgets" },
  { icon: "💰", title: "Budget Tracker", desc: "Stay on top of every travel expense" },
  { icon: "📸", title: "Travel Memories", desc: "Attach photos and notes to visited places" },
  { icon: "🏆", title: "Earn Badges", desc: "Unlock achievements as you explore more" },
  { icon: "💎", title: "Hidden Gems", desc: "Rediscover your forgotten wishlist places" },
  { icon: "✨", title: "Smart Picks", desc: "Personalised recommendations just for you" },
  { icon: "❤️", title: "Likes & Comments", desc: "Interact and leave notes on any place" },
];

const FEATURES = [
  { title: "Add Places", desc: "Save destinations to your travel wishlist.", to: "/addEntity", color: "bg-blue-900 hover:bg-blue-950" },
  { title: "Read Reviews", desc: "Open any place to read and write reviews.", to: "/places", color: "bg-indigo-800 hover:bg-indigo-900" },
  { title: "Update Places & Reviews", desc: "Edit a place or your reviews anytime.", to: "/places", color: "bg-gray-800 hover:bg-gray-950" },
  { title: "Delete Unpopular Places", desc: "Remove places you're no longer interested in.", to: "/places", color: "bg-violet-800 hover:bg-violet-900" },
  { title: "Mark as Visited", desc: "Track places you've been to.", to: "/places?tab=wishlist", color: "bg-teal-800 hover:bg-teal-900" },
  { title: "Revisit List", desc: "Places you want to go back to.", to: "/places?tab=revisit", color: "bg-rose-800 hover:bg-rose-900" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <NavBar />
      <div className="flex flex-col items-center px-6 py-16">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg text-amber-400">Next Stop: Travel Planner</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90 text-gray-300">
            Plan, organize, and track your dream destinations. Discover new places, save favorites, and relive your travel experiences.
          </p>
          <button
            onClick={() => navigate("/places")}
            className="mt-6 inline-block bg-emerald-500 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-emerald-400 transition"
          >
            Explore Places
          </button>
        </header>

        <section className="mt-12 w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-400">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <button
                key={f.title}
                onClick={() => navigate(f.to)}
                className={`${f.color} p-4 rounded-lg shadow-md text-left border border-gray-600 transition`}
              >
                <h3 className="text-lg font-semibold text-cyan-300">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-300">{f.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <footer className="mt-12 text-gray-400 text-sm opacity-80">
          <p>© {new Date().getFullYear()} Next Stop: Travel Planner | Made with ❤️</p>
        </footer>
      </div>
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="page-bg overflow-hidden">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 py-20">
        {/* Background glows */}
        <div className="glow-orb w-[560px] h-[560px] bg-blue-600/12 -top-20 left-1/2 -translate-x-1/2" />
        <div className="glow-orb w-[380px] h-[380px] bg-cyan-500/8 bottom-0 right-10" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-300 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Your Ultimate Travel Companion
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none">
            <span className="text-white">Explore the</span>
            <br />
            <span className="gradient-text">World Your Way</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-200/70 max-w-2xl mx-auto leading-relaxed">
            Plan adventures, capture memories, track budgets, and discover hidden gems —
            all in one sleek app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
              className="btn-primary text-lg px-10 py-4 rounded-2xl"
            >
              {isLoggedIn ? "Open Dashboard →" : "Get Started Free →"}
            </button>
            <button
              onClick={() => navigate(isLoggedIn ? "/places" : "/login")}
              className="btn-secondary text-lg px-10 py-4 rounded-2xl"
            >
              {isLoggedIn ? "My Places" : "Sign In"}
            </button>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap justify-center gap-10 pt-8">
            {[["∞", "Places to Save"], ["13", "Badges to Earn"], ["100%", "Free Forever"]].map(
              ([v, l]) => (
                <div key={l}>
                  <p className="text-3xl font-bold gradient-text">{v}</p>
                  <p className="text-blue-400/60 text-sm mt-1">{l}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── Features grid ────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Built for <span className="gradient-text">Real Travelers</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="glass-card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-blue-300/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="glow-orb w-72 h-72 bg-blue-600/15 -top-16 -right-16" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-blue-200/60 text-xl mb-8">
                Plan smarter. Travel better. Remember everything.
              </p>
              <button
                onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
                className="btn-primary text-lg px-12 py-4 rounded-2xl"
              >
                {isLoggedIn ? "Go to Dashboard →" : "Create Free Account →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 py-8 text-center text-blue-500/50 text-sm">
        © 2026 Next Stop Travel Planner · Made for wanderers everywhere
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/places" element={<Entities />} />
        <Route path="/places/:id" element={<Entities />} />
        <Route path="/addEntity" element={<AddEntityPage />} />
        <Route path="/updateEntity/:id" element={<UpdateEntityPage />} />
        {/* Old placeholder routes now point at the real lists */}
        <Route path="/readReviews" element={<Navigate to="/places" replace />} />
        <Route path="/deletePlaces" element={<Navigate to="/places" replace />} />
        <Route path="/markVisited" element={<Navigate to="/places?tab=wishlist" replace />} />
        <Route path="/revisitList" element={<Navigate to="/places?tab=revisit" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trips" element={<TripManager />} />
      <Route path="/places" element={<Entities />} />
      <Route path="/addEntity" element={<AddEntityPage />} />
      <Route path="/updateEntity/:id" element={<UpdateEntityPage />} />
      <Route path="/memories" element={<Memories />} />
      <Route path="/memories/:placeId" element={<Memories />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="/hidden-gems" element={<HiddenGems />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  </Router>
);

export default App;
