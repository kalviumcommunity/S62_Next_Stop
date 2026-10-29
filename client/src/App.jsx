import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Entities from "./components/entities";
import AddEntityPage from "./components/AddEntityPage";
import UpdateEntityPage from "./components/UpdateEntityPage";
import NavBar from "./components/NavBar";
import Signup from "./Signup";
import Login from "./Login";

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

export default App;
