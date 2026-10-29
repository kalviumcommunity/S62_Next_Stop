const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    destination: { type: String },
    notes: { type: String },
    itinerary: [
      {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        details: { type: String },
      }
    ],
    places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["planned", "ongoing", "completed"], default: "planned" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
