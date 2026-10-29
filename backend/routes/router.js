const express = require("express");
const mongoose = require("mongoose");
const Place = require("../models/itemModel");

const router = express.Router();

const PLACE_FIELDS = ["name", "location", "description", "imageUrl", "status", "visited", "favorite"];
const REVIEW_FIELDS = ["author", "rating", "comment"];

const pick = (obj = {}, keys) =>
  keys.reduce((acc, k) => (obj[k] !== undefined ? { ...acc, [k]: obj[k] } : acc), {});

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid place id" });
  }
  next();
};

const handleError = (res, err, label) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  console.error(`Error ${label}:`, err);
  return res.status(500).json({ message: "Something went wrong" });
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ✅ Get all places   GET /api/places?status=visited&q=paris&favorite=true
router.get("/places", async (req, res) => {
  try {
    const { status, q, favorite } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (favorite === "true") filter.favorite = true;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { location: rx }];
    }
    const places = await Place.find(filter).sort({ updatedAt: -1 });
    return res.status(200).json(places);
  } catch (err) {
    return handleError(res, err, "fetching places");
  }
});

// ✅ Get one place
router.get("/places/:id", validId, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    return res.status(200).json(place);
  } catch (err) {
    return handleError(res, err, "fetching place");
  }
});

// ✅ Add a new place (/new-places is the original route, kept for compatibility)
const createPlace = async (req, res) => {
  try {
    const place = await Place.create(pick(req.body, PLACE_FIELDS));
    return res.status(201).json({ message: "Place added successfully", savedPlace: place });
  } catch (err) {
    return handleError(res, err, "adding place");
  }
};
router.post("/places", createPlace);
router.post("/new-places", createPlace);

// ✅ Update place
router.put("/places/:id", validId, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    place.set(pick(req.body, PLACE_FIELDS));
    await place.save();
    return res.status(200).json({ message: "Place updated successfully", updatedPlace: place });
  } catch (err) {
    return handleError(res, err, "updating place");
  }
});

// ✅ Delete place
router.delete("/places/:id", validId, async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) return res.status(404).json({ message: "Place not found" });
    return res.status(200).json({ message: "Place deleted successfully", deletedPlace });
  } catch (err) {
    return handleError(res, err, "deleting place");
  }
});

// ✅ Reviews (stored inside each place). Each returns the updated place.
const withPlace = (fn) => async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    const earlyResponse = fn(place, req, res);
    if (earlyResponse) return earlyResponse;
    await place.save();
    return res.status(200).json(place);
  } catch (err) {
    return handleError(res, err, "saving review");
  }
};

const findReview = (place, req, res) => {
  const review = place.reviews.id(req.params.reviewId);
  if (!review) res.status(404).json({ message: "Review not found" });
  return review;
};

router.post(
  "/places/:id/reviews",
  validId,
  withPlace((place, req) => {
    place.reviews.push(pick(req.body, REVIEW_FIELDS));
  })
);

router.put(
  "/places/:id/reviews/:reviewId",
  validId,
  withPlace((place, req, res) => {
    const review = findReview(place, req, res);
    if (!review) return res;
    review.set(pick(req.body, REVIEW_FIELDS));
  })
);

router.delete(
  "/places/:id/reviews/:reviewId",
  validId,
  withPlace((place, req, res) => {
    const review = findReview(place, req, res);
    if (!review) return res;
    review.deleteOne();
  })
);

module.exports = router;
