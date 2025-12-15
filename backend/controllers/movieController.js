const Movie = require("../models/Movie");
const axios = require("axios");
const { transformTmdbMovie } = require("../utils/transformTmdbMovie");
require("dotenv").config();
const { addMovieToQueue, updateMovieInQueue, deleteMovieInQueue } = require("../services/queueService");

/* ----------------------------------------------
   GET /movies?page=&limit=
   Paginated Movies
---------------------------------------------- */
exports.getAllMovies = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 10000);
    const skip = (page - 1) * limit;

    const total = await Movie.countDocuments();
    const movies = await Movie.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      movies,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------
   GET /movies/:id
   Find movie by Mongo _id
---------------------------------------------- */
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie)
      return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------
   GET /movies/tmdb/:id
   Find movie by TMDB id field
---------------------------------------------- */
exports.getMovieByTmdbId = async (req, res) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });

    if (!movie)
      return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------
   GET /movies/sorted?by=&order=
   Sort movies by rating, releaseDate, etc.
---------------------------------------------- */
exports.getSortedMovies = async (req, res) => {
  try {
    const by = req.query.by || "title";
    const order = req.query.order === "desc" ? -1 : 1;

    const sortOptions = {
      title: { title: order },
      rating: { rating: order },
      releaseDate: { releaseDate: order },
      runtime: { runtime: order },
      popularity: { popularity: order },
    };

    const movies = await Movie.find().sort(sortOptions[by] || { title: 1 });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------
   GET /movies/search?q=
   Search by title or description
---------------------------------------------- */
exports.searchMovies = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q)
      return res.status(400).json({ message: "Search query is required" });

    const movies = await Movie.find({
      $or: [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { tagline: new RegExp(q, "i") },
      ],
    });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------
   POST /movies
   Add Movie (Admin)
---------------------------------------------- */


exports.addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      message: "Movie added successfully",
      movie,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateMovie = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      releaseDate,
      runtime,
      rating,
      poster,
      backdrop,
      budget,
      revenue,
      genres,
      director,
      cast,
      crew,
      videos,
      productionCompanies
    } = req.body;

    const updateData = {
      title,
      tagline,
      description,
      releaseDate,
      runtime,
      rating,
      poster,
      backdrop,
      budget,
      revenue,
      genres,
      director,
      cast,
      crew,
      videos,
      productionCompanies
    };

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json({
      message: "Movie updated successfully",
      movie
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};


const Movie = require("../models/Movie");

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
      id: req.params.id
    });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ----------------------------------------------
   POST /movies/import
   IMPORT MOVIE FROM TMDB
---------------------------------------------- */
exports.importMovie = async (req, res) => {
  try {
    const movieId = req.body.id;

    if (!movieId)
      return res.status(400).json({ message: "Movie ID is required" });

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ id: movieId });
    if (existingMovie) {
      return res.status(409).json({
        message: "Movie already exists in database",
        movie: existingMovie
      });
    }

    // Fetch full TMDB data (videos + credits included)
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos`;

    const { data: tmdbMovie } = await axios.get(detailsUrl);

    // Transform TMDB → MongoDB schema format
    const movieObject = transformTmdbMovie(tmdbMovie);

    // Save movie
    const movie = await Movie.create(movieObject);

    res.json({
      message: "Movie imported successfully",
      movie,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------
   GET /movies/search-all?q=&source=
   Search both DB and TMDB movies
---------------------------------------------- */
exports.searchAllMovies = async (req, res) => {
  try {
    const { q, source = 'all', genre, yearFrom, yearTo, minRating } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let results = { db: [], tmdb: [] };

    // Search MongoDB (if source is 'all' or 'db')
    if (source === 'all' || source === 'db') {
      let dbQuery = {
        $or: [
          { title: new RegExp(q, "i") },
          { description: new RegExp(q, "i") },
          { tagline: new RegExp(q, "i") },
        ],
      };

      // Add filters
      if (genre) {
        dbQuery.genres = genre;
      }
      if (yearFrom || yearTo) {
        dbQuery.releaseDate = {};
        if (yearFrom) dbQuery.releaseDate.$gte = `${yearFrom}-01-01`;
        if (yearTo) dbQuery.releaseDate.$lte = `${yearTo}-12-31`;
      }
      if (minRating) {
        dbQuery.rating = { $gte: parseFloat(minRating) };
      }

      results.db = await Movie.find(dbQuery).limit(50);
    }

    // Search TMDB (if source is 'all' or 'tmdb')
    if (source === 'all' || source === 'tmdb') {
      try {
        const tmdbRes = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              query: q,
              page: 1,
            },
          }
        );

        let tmdbMovies = tmdbRes.data.results || [];

        // Apply filters to TMDB results
        if (genre) {
          // Fetch TMDB genres
          const genreRes = await axios.get(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
          );
          const genreMap = {};
          genreRes.data.genres.forEach((g) => {
            genreMap[g.name.toLowerCase()] = g.id;
          });

          const genreId = genreMap[genre.toLowerCase()];
          if (genreId) {
            tmdbMovies = tmdbMovies.filter((m) =>
              m.genre_ids?.includes(genreId)
            );
          }
        }

        if (yearFrom || yearTo) {
          tmdbMovies = tmdbMovies.filter((m) => {
            if (!m.release_date) return false;
            const year = parseInt(m.release_date.split("-")[0]);
            if (yearFrom && year < parseInt(yearFrom)) return false;
            if (yearTo && year > parseInt(yearTo)) return false;
            return true;
          });
        }

        if (minRating) {
          tmdbMovies = tmdbMovies.filter(
            (m) => m.vote_average >= parseFloat(minRating)
          );
        }

        // Format TMDB results
        results.tmdb = tmdbMovies.slice(0, 50).map((m) => ({
          _id: `tmdb-${m.id}`,
          id: m.id,
          title: m.title,
          description: m.overview,
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : null,
          rating: m.vote_average,
          releaseDate: m.release_date,
          genres: [], // Will be populated on details page
        }));
      } catch (err) {
        console.error("TMDB search error:", err.message);
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};