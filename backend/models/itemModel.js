const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    location: { type: String, required: true, minlength: 5 },
    description: { type: String, maxlength: 500 },
    visited: { type: Boolean, default: false }
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
