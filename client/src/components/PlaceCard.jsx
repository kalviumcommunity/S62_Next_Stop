import React from "react";

const PlaceCard = ({ place }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold text-cyan-300">{place?.name}</h3>
      <p className="mt-2 text-gray-400"><span className="font-medium text-white">Location:</span> {place?.location || "Unknown"}</p>
      <p className="mt-1 text-gray-400"><span className="font-medium text-white">Reviews:</span> {place?.reviews || "No reviews yet"}</p>
      <p className="mt-1 text-gray-400"><span className="font-medium text-white">Status:</span> {place?.visited ? "Visited" : "Not Visited"}</p>
    </div>
  );
};

export default PlaceCard;
