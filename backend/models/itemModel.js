const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    minlength: [3, 'Name must be at least 3 characters long'] 
  },
  location: { 
    type: String, 
    required: true, 
    minlength: [5, 'Location must be at least 5 characters long'] 
  },
  description: { 
    type: String, 
    maxlength: [100, 'Description should not exceed 500 characters'] 
  },
  visited: { 
    type: Boolean, 
    default: false 
  }
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
