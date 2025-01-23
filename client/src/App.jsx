
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-6 text-white">
      {/* Hero Section */}
      <header className="text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-amber-400">Next Stop: Travel Planner</h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90 text-gray-300">
          Plan, organize, and track your dream destinations. Discover new places, save favorites, and relive your travel experiences.
        </p>
        <Link
          to="/places"
          className="mt-6 inline-block bg-emerald-500 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-emerald-600 transition"
        >
          Explore Places
        </Link>
      </header>

      {/* Features Section */}
      <section className="mt-12 max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-400">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Add Places", desc: "Save destinations to your travel wishlist.", color: "bg-blue-900" },
            { title: "Read Reviews", desc: "Check reviews from fellow travelers.", color: "bg-indigo-800" },
            { title: "Update Places & Reviews", desc: "Modify your wishlist anytime.", color: "bg-gray-800" },
            { title: "Delete Unpopular Places", desc: "Remove places you’re no longer interested in.", color: "bg-blue-800" },
            { title: "Mark as Visited", desc: "Track places you’ve been to.", color: "bg-teal-800" },
            { title: "Revisit List", desc: "Save places you want to revisit.", color: "bg-gray-900" },
          ].map((feature, index) => (
            <div key={index} className={`${feature.color} p-4 rounded-lg shadow-md text-white border border-gray-600`}>
              <h3 className="text-xl font-semibold text-cyan-300">{feature.title}</h3>
              <p className="mt-2 opacity-90 text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-sm opacity-80">
        <p>© 2025 Next Stop: Travel Planner | Made with ❤️</p>
      </footer>
    </div>
  );
};

const PlacesPage = () => {
  const [places] = useState([
    { id: 1, name: "Paris", description: "The city of light" },
    { id: 2, name: "New York", description: "The Big Apple" },
    { id: 3, name: "Tokyo", description: "The Land of the Rising Sun" },
  ]);

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-5xl font-bold text-amber-400 mt-12">Discover Places</h1>
      <div className="mt-6 space-y-4">
        {places.length === 0 ? (
          <p className="text-gray-300">No places found.</p>
        ) : (
          places.map((place) => (
            <Link key={place.id} to={`/places/${place.id}`} className="block bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 w-80 text-center hover:bg-gray-700 transition">
              <h3 className="text-xl font-semibold text-cyan-300">{place.name}</h3>
              <p className="text-gray-300 mt-2">{place.description}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const placeDetails = {
    1: { name: "Paris", description: "The city of light", details: "Famous for the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral." },
    2: { name: "New York", description: "The Big Apple", details: "Famous for the Statue of Liberty, Central Park, and Times Square." },
    3: { name: "Tokyo", description: "The Land of the Rising Sun", details: "Known for Mount Fuji, Tokyo Tower, and Akihabara." },
  };

  const place = placeDetails[id];

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center px-6">
      {place ? (
        <div className="max-w-2xl text-center">
          <h2 className="text-4xl font-semibold text-amber-400">{place.name}</h2>
          <p className="text-lg text-gray-300 mt-4">{place.description}</p>
          <p className="text-md text-gray-400 mt-4">{place.details}</p>
          <Link
            to="/places"
            className="mt-6 inline-block bg-emerald-500 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-emerald-600 transition"
          >
            Back to Places
          </Link>
        </div>
      ) : (
        <p className="text-gray-300 text-center mt-12">Place not found</p>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/places/:id" element={<PlaceDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
