import axios from "axios";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export const getTopRatedMovies = async () => {
  const res = await axios.get(`${TMDB_BASE}/movie/top_rated`, {
    params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 }
  });
  return res.data.results;
};
