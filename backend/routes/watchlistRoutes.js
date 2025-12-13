const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    getWatchlistStats
} = require("../controllers/watchlistController");

// All routes require authentication
router.use(auth);

router.get("/", getWatchlist);
router.get("/stats", getWatchlistStats);
router.post("/", addToWatchlist);
router.delete("/:movieId", removeFromWatchlist);
router.patch("/:movieId/watched", toggleWatched);

module.exports = router;