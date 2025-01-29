import React from "react";
import { Link } from "react-router-dom";

const PlaceCard = ({ id, name, description }) => {
  return (
    <Link
      to={`/places/${id}`}
      className="block bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 w-80 text-center hover:bg-gray-700 transition"
    >
      <h3 className="text-xl font-semibold text-cyan-300">{name}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </Link>
  );
};

export default PlaceCard;
