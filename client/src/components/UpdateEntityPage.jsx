
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateEntityPage() {
  const { id } = useParams(); // Extracts the ID from the URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    visited: false,
  });

  useEffect(() => {
    const fetchEntity = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/places/${id}`);
        setFormData(response.data); 
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    fetchEntity();
  }, [id]); // Fetch data when the ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/places/${id}`, formData);
      navigate("/places"); // Redirect back to places after successful update
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  return (
    <div className="p-6 font-sans bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Update Place</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-purple-300 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-purple-300 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-purple-300 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-300 font-medium mb-2">Visited</label>
          <div className="flex space-x-4">
          <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, visited: true }))}
              className={`px-4 py-2 rounded-lg shadow-md font-semibold ${
                formData.visited ? "bg-purple-500 text-gray-900" : "bg-gray-700 text-gray-400"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, visited: false }))}
              className={`px-4 py-2 rounded-lg shadow-md font-semibold ${
                !formData.visited ? "bg-purple-800 text-white" : "bg-gray-700 text-gray-400"
              }`}
            >
              No
            </button>

          </div>
        </div>

        <div className="flex justify-between">
        <button
         type="submit"
         className="px-6 py-2 bg-purple-600 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
        Update
        </button>

        </div>
      </form>
    </div>
  );
}

export default UpdateEntityPage;
