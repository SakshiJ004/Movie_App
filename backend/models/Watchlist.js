const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movieId: {
        type: String, // Can be MongoDB _id or TMDB id
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure a user can't add the same movie twice
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);