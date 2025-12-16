exports.transformTmdbMovie = (tmdbMovie, details = {}) => {
  return {
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    rating: tmdbMovie.vote_average,
    releaseDate: tmdbMovie.release_date,
    duration: details.runtime || null,

    genres: (details.genres || []).map(g => g.name),

    director:
      (details.credits?.crew || []).find(c => c.job === "Director")?.name ||
      "Unknown",

    cast: (details.credits?.cast || [])
      .slice(0, 10)
      .map(actor => actor.name),

    poster: tmdbMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      : null,

    backdrop: tmdbMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${tmdbMovie.backdrop_path}`
      : null,

    tmdbId: tmdbMovie.id
  };
};
