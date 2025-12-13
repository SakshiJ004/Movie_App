const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const {
  getAllMovies,
  getSortedMovies,
  searchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getMovieByTmdbId,
  searchAllMovies,
} = require("../controllers/movieController");


// PUBLIC
router.get("/", getAllMovies);
router.get("/sorted", getSortedMovies);
router.get("/search", searchMovies);
router.get("/search-all", searchAllMovies)
router.get("/:id", getMovieById);
router.get("/movie/:id", getMovieByTmdbId);

// ADMIN ONLY
router.post("/", auth, allowRoles("admin"), addMovie);
router.put("/:id", auth, allowRoles("admin"), updateMovie);
router.delete("/:id", auth, allowRoles("admin"), deleteMovie);

module.exports = router;
