// exports.transformTmdbMovie = (tmdbMovie, details = {}) => {
//   return {
//     title: tmdbMovie.title,
//     description: tmdbMovie.overview,
//     rating: tmdbMovie.vote_average,
//     releaseDate: tmdbMovie.release_date,
//     duration: details.runtime || null,

//     genres: (details.genres || []).map(g => g.name),

//     director:
//       (details.credits?.crew || []).find(c => c.job === "Director")?.name ||
//       "Unknown",

//     cast: (details.credits?.cast || [])
//       .slice(0, 10)
//       .map(actor => actor.name),

//     poster: tmdbMovie.poster_path
//       ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
//       : null,

//     backdrop: tmdbMovie.backdrop_path
//       ? `https://image.tmdb.org/t/p/w780${tmdbMovie.backdrop_path}`
//       : null,

//     tmdbId: tmdbMovie.id
//   };
// };


exports.transformTmdbMovie = (tmdbMovie) => {
  const director = tmdbMovie.credits?.crew?.find(
    (c) => c.job === "Director"
  );

  return {
    // TMDB ID
    id: tmdbMovie.id,

    // Basic Info
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title,
    tagline: tmdbMovie.tagline,
    description: tmdbMovie.overview,

    // Media (ONLY RELATIVE PATHS)
    poster: tmdbMovie.poster_path || "",
    backdrop: tmdbMovie.backdrop_path || "",

    // Ratings
    rating: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity,

    // Release
    releaseDate: tmdbMovie.release_date,
    status: tmdbMovie.status,
    runtime: tmdbMovie.runtime,

    // Genres
    genres: tmdbMovie.genres?.map(g => g.name) || [],

    // Director (OBJECT ✔)
    director: director
      ? {
        id: director.id,
        name: director.name,
        profilePath: director.profile_path || "",
        department: director.department
      }
      : null,

    // Cast (ARRAY OF OBJECTS ✔)
    cast: (tmdbMovie.credits?.cast || [])
      .slice(0, 10)
      .map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path || "",
        order: actor.order,
        gender: actor.gender
      })),

    // Crew (optional but good)
    crew: (tmdbMovie.credits?.crew || []).map(c => ({
      id: c.id,
      name: c.name,
      job: c.job,
      department: c.department,
      profilePath: c.profile_path || ""
    })),

    // Videos
    videos: (tmdbMovie.videos?.results || []).map(v => ({
      id: v.id,
      key: v.key,
      name: v.name,
      site: v.site,
      type: v.type,
      official: v.official
    }))
  };
};
