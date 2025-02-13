import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Entities from "./components/entities";
import AddEntityPage from "./components/AddEntityPage";
import UpdateEntityPage from "./components/UpdateEntityPage";
import Signup from "./Signup";
import Login from "./Login";

const HomePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center px-6 text-white relative">
      {!isLoggedIn && (
        <button
          onClick={() => navigate("/login")}
          className="absolute top-4 right-6 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-blue-600 transition"
        >
          Login
        </button>
      )}
      <header className="text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-amber-400">Next Stop: Travel Planner</h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90 text-gray-300">
          Plan, organize, and track your dream destinations. Discover new places, save favorites, and relive your travel experiences.
        </p>
        <button
          onClick={() => navigate("/places")}
          className="mt-6 inline-block bg-emerald-500 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-emerald-600 transition"
        >
          Explore Places
        </button>
      </header>

      <section className="mt-12 max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-400">Key Features</h2>
        <TravelActions navigate={navigate} />
      </section>

      <footer className="mt-12 text-gray-400 text-sm opacity-80">
        <p>© 2025 Next Stop: Travel Planner | Made with ❤️</p>
      </footer>
    </div>
  );
};

const TravelActions = ({ navigate }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-lg">
      <button onClick={() => navigate("/addEntity")} className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-950 transition">Add Places</button>
      <button onClick={() => navigate("/places")} className="bg-sky-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-sky-900 transition">Read Reviews</button>
      <button onClick={() => navigate("/updateEntity/1")} className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-950 transition">Update Places & Reviews</button>
      <button onClick={() => navigate("/places")} className="bg-violet-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-violet-900 transition">Delete Unpopular Places</button>
      <button onClick={() => navigate("/updateEntity/1")} className="bg-cyan-800 text-gray-900 px-6 py-3 rounded-lg shadow-md hover:bg-cyan-900 transition">Mark as Visited</button>
      <button onClick={() => navigate("/revisitList")} className="bg-rose-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-rose-900 transition">Revisit List</button>
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
        <Route path="/addEntity" element={<AddEntityPage />} />
        <Route path="/updateEntity/:id" element={<UpdateEntityPage />} />
        <Route path="/readReviews" element={<div className="text-white text-center mt-20">Read Reviews Page</div>} />
        <Route path="/deletePlaces" element={<div className="text-white text-center mt-20">Delete Places Page</div>} />
        <Route path="/markVisited" element={<div className="text-white text-center mt-20">Mark Visited Page</div>} />
        <Route path="/revisitList" element={<div className="text-white text-center mt-20">Revisit List Page</div>} />
      </Routes>
    </Router>
  );
};

export default App;
