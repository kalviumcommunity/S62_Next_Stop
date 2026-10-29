const mongoose = require("mongoose");

const STATUSES = ["wishlist", "visited", "revisit"];

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: [true, "Reviewer name is required"], trim: true, maxlength: 60 },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be 1-5"],
      max: [5, "Rating must be 1-5"],
    },
    comment: { type: String, required: [true, "Review text is required"], trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: 100,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: 100,
    },
    description: { type: String, trim: true, maxlength: [500, "Description can be at most 500 characters"], default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    // Older records only have `visited`; their status is derived from it.
    status: {
      type: String,
      enum: { values: STATUSES, message: "Status must be wishlist, visited or revisit" },
      default: function () {
        return this.visited ? "visited" : "wishlist";
      },
    },
    visited: { type: Boolean, default: false }, // kept in sync with status for backward compatibility
    favorite: { type: Boolean, default: false },
    visitedAt: { type: Date, default: null },
    reviews: [reviewSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

placeSchema.virtual("averageRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return null;
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / this.reviews.length) * 10) / 10;
});

placeSchema.pre("validate", function (next) {
  // If only the legacy `visited` flag was changed, translate it into a status.
  if (this.isModified("visited") && !this.isModified("status")) {
    if (this.visited && this.status === "wishlist") this.status = "visited";
    if (!this.visited) this.status = "wishlist";
  }
  this.visited = this.status !== "wishlist";
  if (this.visited && !this.visitedAt) this.visitedAt = new Date();
  if (!this.visited) this.visitedAt = null;
  next();
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
