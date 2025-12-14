const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const {
    getDashboardStats,
    getMovieStats
} = require("../controllers/analyticsController");

// Admin only
router.get("/dashboard", auth, allowRoles("admin"), getDashboardStats);
router.get("/movie/:id", auth, allowRoles("admin"), getMovieStats);

module.exports = router;