const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  visited: { type: Boolean, default: false }
});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;