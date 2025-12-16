import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  TextField,
  Box,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Collapse,
  IconButton
} from "@mui/material";
import { Search as SearchIcon, FilterList, ExpandMore, ExpandLess } from "@mui/icons-material";
import api from "../api/axios";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState({ db: [], tmdb: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showFilters, setShowFilters] = useState(!isMobile);

  // Filters
  const [selectedGenre, setSelectedGenre] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [minRating, setMinRating] = useState("");

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music",
    "Mystery", "Romance", "Science Fiction", "Thriller", "War", "Western"
  ];

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    if (!query) {
      setResults({ db: [], tmdb: [] });
      return;
    }
    const timer = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, selectedGenre, yearFrom, yearTo, minRating]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ db: [], tmdb: [] });
      return;
    }
    setLoading(true);

    try {
      const params = { q: searchQuery, source: "all" };
      if (selectedGenre) params.genre = selectedGenre;
      if (yearFrom) params.yearFrom = yearFrom;
      if (yearTo) params.yearTo = yearTo;
      if (minRating) params.minRating = minRating;

      const res = await api.get("/movies/search-all", { params });
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const clearFilters = () => {
    setSelectedGenre("");
    setYearFrom("");
    setYearTo("");
    setMinRating("");
  };

  const allResults = [...results.db, ...results.tmdb];
  const displayResults = activeTab === 0 ? allResults : activeTab === 1 ? results.db : results.tmdb;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a" }}>
      {/* Header */}
      <Box sx={{
        bgcolor: "black",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <Box sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 3 }
        }}>
          <Box sx={{
            bgcolor: "#f59e0b",
            color: "black",
            fontWeight: "bold",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" }
          }}>
            IMDb
          </Box>
          <Typography variant="h6" sx={{
            color: "white",
            fontSize: { xs: "1rem", sm: "1.25rem" }
          }}>
            Search Movies
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 1.5, sm: 2 }, py: { xs: 2, sm: 4 } }}>
        {/* Search Bar */}
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <TextField
            fullWidth
            placeholder={isMobile ? "Search movies..." : "Search for movies, actors, genres..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams({ q: e.target.value });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#1e293b",
                color: "white",
                fontSize: { xs: "0.875rem", sm: "1.1rem" },
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#475569" },
                "&.Mui-focused fieldset": { borderColor: "#f59e0b" }
              }
            }}
          />
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              "& .MuiTab-root": {
                color: "#94a3b8",
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                minWidth: { xs: "auto", sm: 120 }
              },
              "& .Mui-selected": { color: "#f59e0b" },
              "& .MuiTabs-indicator": { bgcolor: "#f59e0b" }
            }}
          >
            <Tab label={isMobile ? `All (${allResults.length})` : `All (${allResults.length})`} />
            <Tab label={isMobile ? `DB (${results.db.length})` : `Database (${results.db.length})`} />
            <Tab label={`TMDB (${results.tmdb.length})`} />
          </Tabs>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          {/* Filter Toggle for Mobile */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                cursor: "pointer",
                color: "#94a3b8"
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterList />
              <Typography sx={{ fontWeight: 600, flex: 1 }}>Filters</Typography>
              {showFilters ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}

          <Collapse in={showFilters}>
            <Box sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
              alignItems: "center"
            }}>
              {!isMobile && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FilterList sx={{ color: "#94a3b8" }} />
                  <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>Filters:</Typography>
                </Box>
              )}

              {/* Genre Filter */}
              <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
                <InputLabel sx={{ color: "#94a3b8" }}>Genre</InputLabel>
                <Select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  label="Genre"
                  sx={{
                    bgcolor: "#1e293b",
                    color: "white",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" }
                  }}
                >
                  <MenuItem value="">All Genres</MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Year From */}
              <TextField
                size="small"
                label="Year From"
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="1990"
                sx={{
                  width: { xs: "48%", sm: 120 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#1e293b",
                    color: "white",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "& fieldset": { borderColor: "#334155" },
                    "&:hover fieldset": { borderColor: "#475569" }
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8" }
                }}
              />

              {/* Year To */}
              <TextField
                size="small"
                label="Year To"
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="2024"
                sx={{
                  width: { xs: "48%", sm: 120 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#1e293b",
                    color: "white",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "& fieldset": { borderColor: "#334155" },
                    "&:hover fieldset": { borderColor: "#475569" }
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8" }
                }}
              />

              {/* Min Rating */}
              <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 130 } }}>
                <InputLabel sx={{ color: "#94a3b8" }}>Min Rating</InputLabel>
                <Select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  label="Min Rating"
                  sx={{
                    bgcolor: "#1e293b",
                    color: "white",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" }
                  }}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="5">5+ ⭐</MenuItem>
                  <MenuItem value="6">6+ ⭐</MenuItem>
                  <MenuItem value="7">7+ ⭐</MenuItem>
                  <MenuItem value="8">8+ ⭐</MenuItem>
                  <MenuItem value="9">9+ ⭐</MenuItem>
                </Select>
              </FormControl>

              {/* Clear Filters */}
              {(selectedGenre || yearFrom || yearTo || minRating) && (
                <Chip
                  label="Clear Filters"
                  onClick={clearFilters}
                  sx={{
                    bgcolor: "#334155",
                    color: "#cbd5e1",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&:hover": { bgcolor: "#475569" }
                  }}
                />
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: { xs: 6, sm: 10 } }}>
            <CircularProgress sx={{ color: "#f59e0b" }} />
          </Box>
        )}

        {/* Results */}
        {!loading && query && (
          <>
            {displayResults.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
                {displayResults.map((movie, index) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    index={index}
                    showRank={false}
                    source={movie._id?.startsWith("tmdb-") ? "tmdb" : "admin"}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: { xs: 6, sm: 10 } }}>
                <Typography sx={{
                  color: "#94a3b8",
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  mb: 1
                }}>
                  No results found for "{query}"
                </Typography>
                <Typography sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                }}>
                  Try adjusting your filters or search term
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !query && (
          <Box sx={{ textAlign: "center", py: { xs: 10, sm: 15 } }}>
            <SearchIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: "#334155", mb: 2 }} />
            <Typography sx={{
              color: "#94a3b8",
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              mb: 1
            }}>
              Search for movies
            </Typography>
            <Typography sx={{
              color: "#64748b",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}>
              Enter a movie title, actor, or genre to get started
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}