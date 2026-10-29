// Adds a few sample places. Usage: npm run seed   (add -- --reset to clear existing places first)
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Place = require("./models/itemModel");

const samples = [
  {
    name: "Kyoto",
    location: "Japan",
    description: "Temples, gardens and the Arashiyama bamboo grove.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    status: "wishlist",
    favorite: true,
  },
  {
    name: "Santorini",
    location: "Greece",
    description: "Whitewashed villages above the caldera, famous sunsets in Oia.",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    status: "visited",
    reviews: [{ author: "Danushri", rating: 5, comment: "Unreal sunsets. Go in shoulder season." }],
  },
  {
    name: "Munnar",
    location: "Kerala, India",
    description: "Rolling tea estates and misty hills in the Western Ghats.",
    status: "revisit",
    reviews: [{ author: "Arun", rating: 4, comment: "Beautiful, but roads are slow. Stay 3+ days." }],
  },
];

(async () => {
  await mongoose.connect(process.env.DB_URI || process.env.DB_URL);
  if (process.argv.includes("--reset")) await Place.deleteMany({});
  await Place.create(samples);
  console.log(`Seeded ${samples.length} places`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
