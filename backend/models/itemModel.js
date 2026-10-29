const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, default: "Traveler" },
  text: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  location: { type: String, required: true, minlength: 3 },
  description: { type: String, maxlength: 500 },
  visited: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["beach", "mountain", "city", "historical", "nature", "cultural", "adventure", "other"],
    default: "other",
  },
  rating: { type: Number, min: 1, max: 10 },
  imageUrl: { type: String },
  notes: { type: String, maxlength: 1000 },
  favorite: { type: Boolean, default: false },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
}, { timestamps: true });

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
