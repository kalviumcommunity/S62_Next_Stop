import React from "react";

const App = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-6 text-white">
      {/* Hero Section */}
      <header className="text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-amber-400">Next Stop: Travel Planner</h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90 text-gray-300">
          Plan, organize, and track your dream destinations. Discover new places, save favorites, and relive your travel experiences.
        </p>
        <a
          href="https://s62-next-stop.onrender.com/ping"
          className="mt-6 inline-block bg-emerald-500 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-emerald-600 transition"
        >
          Explore Now
        </a>
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

export default App;
