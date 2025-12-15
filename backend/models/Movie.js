const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  // Basic Info
  id: { type: Number, unique: true, sparse: true },
  title: { type: String, required: true },
  originalTitle: String,
  tagline: String,
  description: String,

  // Media
  poster: String,
  backdrop: String,

  // Ratings & Popularity
  rating: Number,
  voteCount: Number,
  popularity: Number,

  // Release Info
  releaseDate: String,
  status: String, // Released, Post Production, etc.

  // Duration
  runtime: Number, // in minutes
  duration: String, // formatted like "2h 30m"

  // Classification
  adult: Boolean,
  genres: [String],

  // Financial
  budget: Number,
  revenue: Number,

  // External IDs
  imdbId: String,
  homepage: String,

  // Production
  productionCompanies: [{
    id: Number,
    name: String,
    logo: String,
    originCountry: String
  }],
  productionCountries: [{
    iso: String,
    name: String
  }],
  spokenLanguages: [{
    iso: String,
    name: String
  }],

  // Credits
  director: {
    id: Number,
    name: String,
    profilePath: String,
    department: String
  },
  cast: [{
    id: Number,
    name: String,
    character: String,
    profilePath: String,
    order: Number,
    gender: Number
  }],
  crew: [{
    id: Number,
    name: String,
    job: String,
    department: String,
    profilePath: String
  }],

  // Videos
  trailer: {
    id: String,
    key: String,
    name: String,
    site: String,
    type: String,
    official: Boolean
  },
  videos: [{
    id: String,
    key: String,
    name: String,
    site: String,
    type: String,
    official: Boolean
  }],

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better search performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ id: 1 }); // FIXED: Changed from tmdbId to id
movieSchema.index({ rating: -1 });
movieSchema.index({ releaseDate: -1 });

module.exports = mongoose.model("Movie", movieSchema);