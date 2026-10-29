const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Place = require('../models/itemModel');
const Trip = require('../models/Trip');
const Memory = require('../models/Memory');
const protect = require('../middleware/authMiddleware');

const BADGE_DEFINITIONS = [
  { name: 'First Step', description: 'Saved your first place', icon: '✈️', check: (s) => s.totalPlaces >= 1 },
  { name: 'Explorer', description: 'Saved 5 places', icon: '🗺️', check: (s) => s.totalPlaces >= 5 },
  { name: 'Adventurer', description: 'Saved 10 places', icon: '🧭', check: (s) => s.totalPlaces >= 10 },
  { name: 'World Traveler', description: 'Saved 25 places', icon: '🌍', check: (s) => s.totalPlaces >= 25 },
  { name: 'Been There', description: 'Visited your first place', icon: '✅', check: (s) => s.visitedPlaces >= 1 },
  { name: 'Well-Traveled', description: 'Visited 5 places', icon: '🏆', check: (s) => s.visitedPlaces >= 5 },
  { name: 'Globetrotter', description: 'Visited 15 places', icon: '🌟', check: (s) => s.visitedPlaces >= 15 },
  { name: 'Trip Planner', description: 'Created your first trip', icon: '📋', check: (s) => s.totalTrips >= 1 },
  { name: 'Memory Keeper', description: 'Added your first memory photo', icon: '📸', check: (s) => s.totalMemories >= 1 },
  { name: 'Wanderer', description: 'Explored 3+ different categories', icon: '🎯', check: (s) => s.uniqueCategories >= 3 },
  { name: 'Beach Lover', description: 'Saved 3+ beach places', icon: '🏖️', check: (s) => (s.categories?.beach || 0) >= 3 },
  { name: 'Mountain Climber', description: 'Saved 3+ mountain places', icon: '🏔️', check: (s) => (s.categories?.mountain || 0) >= 3 },
  { name: 'City Explorer', description: 'Saved 3+ city places', icon: '🏙️', check: (s) => (s.categories?.city || 0) >= 3 },
];

// GET /api/badges - get user badges and check for new ones
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const places = await Place.find({ user: req.userId });
    const trips = await Trip.find({ user: req.userId });
    const memories = await Memory.find({ user: req.userId });

    const categoryCount = places.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      totalPlaces: places.length,
      visitedPlaces: places.filter(p => p.visited).length,
      totalTrips: trips.length,
      totalMemories: memories.length,
      uniqueCategories: Object.keys(categoryCount).length,
      categories: categoryCount,
    };

    const earnedBadgeNames = new Set(user.badges.map(b => b.name));
    const newBadges = [];

    for (const def of BADGE_DEFINITIONS) {
      if (!earnedBadgeNames.has(def.name) && def.check(stats)) {
        const badge = { name: def.name, description: def.description, icon: def.icon };
        user.badges.push(badge);
        newBadges.push(badge);
      }
    }

    if (newBadges.length > 0) await user.save();

    const allBadges = BADGE_DEFINITIONS.map(def => ({
      ...def,
      check: undefined,
      earned: earnedBadgeNames.has(def.name) || newBadges.some(b => b.name === def.name),
      earnedAt: user.badges.find(b => b.name === def.name)?.earnedAt || null,
    }));

    res.json({ badges: allBadges, newBadges, stats });
  } catch (err) {
    console.error('Error fetching badges:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
