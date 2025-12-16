const Watchlist = require("../models/Watchlist");
const Movie = require("../models/Movie");

exports.getWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.find({ userId: req.user._id })
            .sort({ addedAt: -1 });

        const moviesWithDetails = await Promise.all(
            watchlist.map(async (item) => {
                let movie = null;

                if (item.movieId.startsWith('tmdb-')) {
                    const tmdbId = item.movieId.replace('tmdb-', '');
                    try {
                        const axios = require('axios');
                        const res = await axios.get(
                            `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`
                        );
                        movie = {
                            _id: item.movieId,
                            id: res.data.id,
                            title: res.data.title,
                            description: res.data.overview,
                            poster: res.data.poster_path ? `https://image.tmdb.org/t/p/w500${res.data.poster_path}` : null,
                            rating: res.data.vote_average,
                            releaseDate: res.data.release_date,
                            genres: res.data.genres?.map(g => g.name) || []
                        };
                    } catch (err) {
                        console.error(`Failed to fetch TMDB movie ${tmdbId}:`, err);
                    }
                } else {
                    movie = await Movie.findById(item.movieId);
                }

                return {
                    ...item.toObject(),
                    movie
                };
            })
        );

        res.json(moviesWithDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToWatchlist = async (req, res) => {
    try {
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required" });
        }

        const existing = await Watchlist.findOne({
            userId: req.user._id,
            movieId
        });

        if (existing) {
            return res.status(409).json({ message: "Movie already in watchlist" });
        }

        const watchlistItem = await Watchlist.create({
            userId: req.user._id,
            movieId
        });

        res.status(201).json(watchlistItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeFromWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;

        const result = await Watchlist.findOneAndDelete({
            userId: req.user._id,
            movieId
        });

        if (!result) {
            return res.status(404).json({ message: "Movie not in watchlist" });
        }

        res.json({ message: "Removed from watchlist" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.toggleWatched = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { watched } = req.body;

        let watchlistItem = await Watchlist.findOne({
            userId: req.user._id,
            movieId
        });

        if (!watchlistItem) {
            watchlistItem = await Watchlist.create({
                userId: req.user._id,
                movieId,
                watched
            });
        } else {
            watchlistItem.watched = watched;
            await watchlistItem.save();
        }

        res.json(watchlistItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getWatchlistStats = async (req, res) => {
    try {
        const total = await Watchlist.countDocuments({ userId: req.user._id });
        const watched = await Watchlist.countDocuments({
            userId: req.user._id,
            watched: true
        });

        res.json({
            total,
            watched,
            unwatched: total - watched,
            percentage: total > 0 ? Math.round((watched / total) * 100) : 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};