exports.transformTmdbMovie = (tmdbMovie, details = {}) => {
  return {
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    rating: tmdbMovie.vote_average,
    releaseDate: tmdbMovie.release_date,
    duration: details.runtime || null,

    genres: (details.genres || []).map(g => g.name),

    director: (() => {
      const directorData = (details.credits?.crew || []).find(c => c.job === "Director");
      return directorData ? {
        id: directorData.id,
        name: directorData.name,
        profilePath: directorData.profile_path,
        department: "Directing"
      } : { name: "Unknown", profilePath: "" };
    })(),

    cast: (details.credits?.cast || [])
      .slice(0, 10)
      .map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path,
        order: actor.order,
        gender: actor.gender
      })),

    poster: tmdbMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      : null,

    backdrop: tmdbMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${tmdbMovie.backdrop_path}`
      : null,

    tmdbId: tmdbMovie.id
  };
};
