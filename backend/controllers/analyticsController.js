const Movie = require("../models/Movie");
const User = require("../models/User");
const Watchlist = require("../models/Watchlist");

exports.getDashboardStats = async (req, res) => {
    try {
        // Total movies
        const totalMovies = await Movie.countDocuments();

        // Total users
        const totalUsers = await User.countDocuments();

        // Average rating
        const movies = await Movie.find({}, 'rating');
        const avgRating = movies.length > 0
            ? movies.reduce((sum, m) => sum + (m.rating || 0), 0) / movies.length
            : 0;

        // Top rated movies
        const topRated = await Movie.find()
            .sort({ rating: -1 })
            .limit(5)
            .select('title poster rating releaseDate');

        // Recent movies
        const recentMovies = await Movie.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title poster rating createdAt');

        // Genre distribution
        const allMovies = await Movie.find({}, 'genres');
        const genreCount = {};
        allMovies.forEach(movie => {
            movie.genres?.forEach(genre => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        });

        const topGenres = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([genre, count]) => ({ genre, count }));

        // Movies by year
        const moviesByYear = {};
        allMovies.forEach(movie => {
            if (movie.releaseDate) {
                const year = movie.releaseDate.split('-')[0];
                moviesByYear[year] = (moviesByYear[year] || 0) + 1;
            }
        });

        res.json({
            totalMovies,
            totalUsers,
            averageRating: avgRating.toFixed(2),
            topRated,
            recentMovies,
            topGenres,
            moviesByYear
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMovieStats = async (req, res) => {
    try {
        const { id } = req.params;

        // Get movie
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Count watchlists
        const watchlistCount = await Watchlist.countDocuments({ movieId: id });

        res.json({
            movie,
            watchlistCount,
            popularity: movie.popularity || 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};