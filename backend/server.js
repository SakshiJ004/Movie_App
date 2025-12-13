require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Movie App API is running",
    status: "active",
    endpoints: {
      auth: "/api/auth",
      movies: "/api/movies",
      watchlist: "/api/watchlist"
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
