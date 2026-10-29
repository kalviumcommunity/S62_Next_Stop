import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Entities from "./components/entities";
import AddEntityPage from "./components/AddEntityPage";
import UpdateEntityPage from "./components/UpdateEntityPage";
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

const HomePage = () => {
  const navigate = useNavigate();
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
