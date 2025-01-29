// require('dotenv').config();  
// const mongoose = require('mongoose');

// const dbURI = process.env.MONGO_URI;  

// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));

// const placeSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   reviews: {
//     type: [String],  
//     default: [],
//   },
//   visited: {
//     type: Boolean,
//     default: false,
//   }
// }, { timestamps: true });

// const Place = mongoose.model('Place', placeSchema);

// // Insert Sample Destinations
// const createPlaces = async () => {
//   try {
//     const places = [
//       {
//         name: 'Eiffel Tower',
//         location: 'Paris, France',
//         reviews: ['Amazing view!', 'Loved the lighting at night.'],
//         visited: false,
//       },
//       {
//         name: 'Great Wall of China',
//         location: 'China',
//         reviews: ['Breathtaking scenery!', 'A must-visit.'],
//         visited: true,
//       }
//     ];

//     await Place.insertMany(places);
//     console.log('Places saved successfully');
//   } catch (err) {
//     console.error('Error inserting places:', err);
//   }
// };

// // Fetch All Places
// const getPlaces = async () => {
//   try {
//     const places = await Place.find();
//     console.log('All travel destinations:', places);
//   } catch (err) {
//     console.error('Error fetching places:', err);
//   }
// };

// // Run functions
// createPlaces();
// getPlaces();
