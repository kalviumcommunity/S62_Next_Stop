import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function TravelDestinations() {
    const [places, setPlaces] = useState([]);
    const navigate = useNavigate(); 
    const fetchPlaces = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/places');
            setPlaces(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleAddPlace = () => {
        navigate('/addEntity'); // Navigate to AddEntityPage
    };

    return (
        <div className="p-6 font-sans bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen text-white">
    <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Travel Destinations</h1>

    {/* Add Place Button */}
    <div className="flex justify-center mb-6">
        <button 
            onClick={handleAddPlace} 
            className="bg-purple-600 hover:bg-purple-700 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
        >
            + Add Destination
        </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {places.length > 0 ? (
            places.map((place, index) => (
                <div key={index} className="flex flex-col p-6 border border-gray-700 rounded-lg shadow-lg bg-gray-800">
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">{place.name}</h3>
                    <p className="text-gray-300 mb-1">
                        <span className="font-medium text-purple-400">Location:</span> {place.location}
                    </p>
                    <p className="text-gray-300 mb-1">
                        <span className="font-medium text-purple-400">Description:</span> {place.description}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium text-purple-400">Status:</span> {place.visited ? "Visited" : "Not Visited"}
                    </p>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-400">No destinations found.</p>
        )}
    </div>
</div>

    );
}

export default TravelDestinations;
