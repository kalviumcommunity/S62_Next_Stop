
import React from "react";

const PlaceCard = ({ place }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-semibold text-cyan-300">{place.name}</h3>
      <p className="mt-2 text-gray-300">{place.description}</p>
    </div>
  );
};

export default PlaceCard;
