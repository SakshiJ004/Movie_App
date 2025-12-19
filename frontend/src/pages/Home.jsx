import { useEffect, useMemo, useState } from "react";
import {
  GridView,
  ViewList,
  KeyboardArrowDown,
  Star as StarIcon,
} from "@mui/icons-material";
import { Box, Typography, Button, Chip, IconButton, Menu, MenuItem, Pagination } from "@mui/material";
import api from "../api/axios";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import MovieCard from "../components/MovieCard";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function Home() {
  const [topRated, setTopRated] = useState([]);
  const [allAdminMovies, setAllAdminMovies] = useState([]);
  const [totalMoviesCount, setTotalMoviesCount] = useState(0)
  const [selectedGenre, setSelectedGenre] = useState("");
  const [adminGenres, setAdminGenres] = useState([]);
  const [tmdbGenresMap, setTmdbGenresMap] = useState({});
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tmdb");
  const [sortBy, setSortBy] = useState("rating");
  const [watchlistStats, setWatchlistStats] = useState({ total: 0, watched: 0, percentage: 0 });
  const [userWatchlistMovies, setUserWatchlistMovies] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;


  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchTopRatedFromTMDB();
    loadAdminMovies();
    if (user) {
      loadWatchlistStats();
      if (user.role !== 'admin') {
        loadUserWatchlistMovies();
      }
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "admin" && (user?.role === "admin" || user?.role === "user")) {
      loadAdminMovies();
    }
  }, [currentPage, activeTab]);

  const loadWatchlistStats = async () => {
    try {
      const res = await api.get("/watchlist/stats");
      setWatchlistStats(res.data);
    } catch (err) {
      console.error("Error loading watchlist stats:", err);
    }
  };

  const fetchTopRatedFromTMDB = async () => {
    try {
      setLoading(true);

      const genreRes = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}&language=en-US`
      );
      const genreMap = {};
      genreRes.data.genres.forEach((g) => {
        genreMap[g.id] = g.name;
      });
      setTmdbGenresMap(genreMap);

      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_KEY}&language=en-US&page=1`
      );

      const formatted = res.data.results.map((m) => ({
        _id: `tmdb-${m.id}`,
        id: m.id,
        title: m.title,
        description: m.overview,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        rating: m.vote_average,
        releaseDate: m.release_date,
        duration: null,
        genres: (m.genre_ids || []).map((id) => genreMap[id]).filter(Boolean),
      }));

      setTopRated(formatted);
    } catch (error) {
      console.error("Error fetching TMDB movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminMovies = async () => {
    try {
      const res = await api.get("/movies/", {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      const movies = res.data.movies || [];
      setAllAdminMovies(movies);
      setTotalPages(res.data.totalPages || 1);
      setTotalMoviesCount(res.data.total || 0);

      const g = new Set();
      movies.forEach((m) => m.genres?.forEach((genre) => g.add(genre)));
      setAdminGenres([...g]);
    } catch (error) {
      console.error("Error loading admin movies:", error);
    }
  };

  const loadUserWatchlistMovies = async () => {
    if (!user || user.role === 'admin') return;

    try {
      const res = await api.get('/watchlist');
      const movies = res.data
        .filter(item => item.movie !== null)
        .map(item => item.movie);
      setUserWatchlistMovies(movies);
    } catch (err) {
      console.error('Error loading user watchlist movies:', err);
    }
  };

  const genres = useMemo(() => {
    if (activeTab === "tmdb") {
      return Array.from(new Set(Object.values(tmdbGenresMap).filter(Boolean)));
    } else {
      return adminGenres;
    }
  }, [activeTab, tmdbGenresMap, adminGenres]);

  const sourceMovies = activeTab === "tmdb"
    ? topRated
    : (user?.role === "admin" ? allAdminMovies : userWatchlistMovies);

  const filteredByGenre = selectedGenre
    ? sourceMovies.filter((m) => (m.genres || []).includes(selectedGenre))
    : sourceMovies;

  const displayMovies = useMemo(() => {
    const copy = [...filteredByGenre];

    switch (sortBy) {
      case "rating":
        copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "title":
        copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "releaseDate":
        copy.sort((a, b) => {
          const dateA = new Date(a.releaseDate || 0);
          const dateB = new Date(b.releaseDate || 0);
          return dateB - dateA;
        });
        break;
      case "runtime":
        copy.sort((a, b) => {
          const runtimeA = parseInt(a.runtime || a.duration || 0);
          const runtimeB = parseInt(b.runtime || b.duration || 0);
          return runtimeB - runtimeA;
        });
        break;
      default:
        break;
    }

    return copy;
  }, [filteredByGenre, sortBy]);

  const avgRating = displayMovies.length > 0
    ? (displayMovies.reduce((sum, m) => sum + (m.rating || 0), 0) / displayMovies.length).toFixed(1)
    : 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a' }}>
      <Box sx={{
        bgcolor: 'black',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <Box sx={{
          maxWidth: '1280px',
          mx: 'auto',
          px: 0,
          // px: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 } }}>
            <Box sx={{
              bgcolor: '#f59e0b',
              color: 'black',
              fontWeight: 'bold',
              px: { xs: 0.75, sm: 1 },
              py: 0.5,
              borderRadius: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              IMDb
            </Box>
            <Button sx={{
              color: 'white',
              textTransform: 'none',
              display: { xs: 'none', sm: 'inline-flex' }
            }}>
              All
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Button
              component={Link}
              to="/watchlist"
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              Watchlist
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{
        maxWidth: '1280px',
        mx: 'auto',
        px: { xs: 1, sm: 2 },
        py: { xs: 2, sm: 3 }
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 2, sm: 3 }
        }}>
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography variant="caption" sx={{
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 1,
                display: 'block',
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}>
                Movie Charts
              </Typography>
              <Typography variant="h3" sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
              }}>
                {activeTab === "tmdb" ? "TMDB Top Rated Movies" : "Database Movies"}
              </Typography>
              <Typography sx={{
                color: '#94a3b8',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                {activeTab === "tmdb"
                  ? "As rated by TMDB users."
                  : "Movies from your collection."}
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 }
            }}>
              <Button
                onClick={() => { setActiveTab("tmdb"); setSelectedGenre(""); }}
                variant={activeTab === "tmdb" ? "contained" : "outlined"}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  ...(activeTab === "tmdb"
                    ? { bgcolor: '#f59e0b', color: 'black', '&:hover': { bgcolor: '#d97706' } }
                    : {
                      bgcolor: '#1e293b',
                      color: '#cbd5e1',
                      borderColor: '#334155',
                      '&:hover': { bgcolor: '#334155', borderColor: '#334155' }
                    }
                  )
                }}
              >
                TMDB Top Rated ({topRated.length})
              </Button>

              <Button
                onClick={() => { setActiveTab("admin"); setSelectedGenre(""); }}
                variant={activeTab === "admin" ? "contained" : "outlined"}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  ...(activeTab === "admin"
                    ? { bgcolor: '#f59e0b', color: 'black', '&:hover': { bgcolor: '#d97706' } }
                    : {
                      bgcolor: '#1e293b',
                      color: '#cbd5e1',
                      borderColor: '#334155',
                      '&:hover': { bgcolor: '#334155', borderColor: '#334155' }
                    }
                  )
                }}
              >
                {user?.role === "admin"
                  ? `Database Movies (${totalMoviesCount})`
                  : `My Collection (${userWatchlistMovies.length})`
                }
              </Button>
            </Box>

            {/* Watchlist Stats */}
            <Box sx={{
              bgcolor: '#1e293b',
              borderRadius: 2,
              p: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
              border: '1px solid #334155'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{
                  color: '#94a3b8',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  {user ? `${watchlistStats.watched} OF ${watchlistStats.total} WATCHED` : '0 OF 0 WATCHED'}
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#94a3b8',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  {user ? `${watchlistStats.percentage}%` : '0%'}
                </Typography>
              </Box>
              <Box sx={{
                width: '100%',
                bgcolor: '#334155',
                borderRadius: 1,
                height: { xs: 6, sm: 8 }
              }}>
                <Box sx={{
                  bgcolor: '#f59e0b',
                  height: { xs: 6, sm: 8 },
                  borderRadius: 1,
                  width: `${user ? watchlistStats.percentage : 0}%`
                }} />
              </Box>
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              mb: 2,
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  {displayMovies.length} Titles
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
                justifyContent: { xs: 'space-between', sm: 'flex-start' }
              }}>
                <Typography variant="body2" sx={{
                  color: '#94a3b8',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}>
                  Sort by
                </Typography>
                <Button
                  endIcon={<KeyboardArrowDown />}
                  sx={{
                    color: '#60a5fa',
                    textTransform: 'none',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 }
                  }}
                  onClick={handleOpenMenu}
                >
                  {sortBy === "rating" ? "Rating" :
                    sortBy === "title" ? "Title" :
                      sortBy === "releaseDate" ? "Release Date" :
                        sortBy === "runtime" ? "Duration" : "None"}
                </Button>
                <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
                  <MenuItem onClick={() => { setSortBy("rating"); handleCloseMenu(); }}>
                    Rating (High to Low)
                  </MenuItem>
                  <MenuItem onClick={() => { setSortBy("title"); handleCloseMenu(); }}>
                    Title (A to Z)
                  </MenuItem>
                  <MenuItem onClick={() => { setSortBy("releaseDate"); handleCloseMenu(); }}>
                    Release Date (Newest First)
                  </MenuItem>
                  <MenuItem onClick={() => { setSortBy("runtime"); handleCloseMenu(); }}>
                    Duration (Longest First)
                  </MenuItem>
                  <MenuItem onClick={() => { setSortBy("none"); handleCloseMenu(); }}>
                    None
                  </MenuItem>
                </Menu>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  ml: { xs: 0, sm: 2 }
                }}>
                  <IconButton
                    onClick={() => setViewMode('list')}
                    sx={{
                      bgcolor: viewMode === 'list' ? '#2563eb' : '#334155',
                      '&:hover': { bgcolor: viewMode === 'list' ? '#2563eb' : '#475569' },
                      borderRadius: 1,
                      p: { xs: 0.75, sm: 1 }
                    }}
                  >
                    <ViewList sx={{ color: 'white', fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    sx={{
                      bgcolor: viewMode === 'grid' ? '#2563eb' : '#334155',
                      '&:hover': { bgcolor: viewMode === 'grid' ? '#2563eb' : '#475569' },
                      borderRadius: 1,
                      p: { xs: 0.75, sm: 1 }
                    }}
                  >
                    <GridView sx={{ color: 'white', fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Genre Filter - Responsive */}
            {genres.length > 0 && (
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1 } }}>
                  <Chip
                    label="All"
                    onClick={() => setSelectedGenre("")}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: 28, sm: 32 },
                      ...((!selectedGenre)
                        ? { bgcolor: '#f59e0b', color: 'black', fontWeight: 600 }
                        : {
                          bgcolor: '#1e293b',
                          color: '#cbd5e1',
                          border: '1px solid #334155',
                          '&:hover': { bgcolor: '#334155' }
                        }
                      )
                    }}
                  />
                  {genres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onClick={() => setSelectedGenre(genre)}
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        height: { xs: 28, sm: 32 },
                        ...(selectedGenre === genre
                          ? { bgcolor: '#f59e0b', color: 'black', fontWeight: 600 }
                          : {
                            bgcolor: '#1e293b',
                            color: '#cbd5e1',
                            border: '1px solid #334155',
                            '&:hover': { bgcolor: '#334155' }
                          }
                        )
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Loading */}
            {loading && activeTab === "tmdb" && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 6, sm: 10 } }}>
                <CircularProgress sx={{ color: '#f59e0b' }} />
              </Box>
            )}

            {/* Movie List */}
            {!loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                {displayMovies.length > 0 ? (
                  displayMovies.map((movie, index) => (
                    <MovieCard key={movie._id} movie={movie} index={index} source={activeTab} />
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 10 } }}>
                    {activeTab === "admin" && !user ? (
                      <>
                        <Typography sx={{
                          color: '#94a3b8',
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          mb: 2
                        }}>
                          Login to see your collection
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate('/login')}
                          sx={{
                            bgcolor: '#f59e0b',
                            color: 'black',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            '&:hover': { bgcolor: '#d97706' }
                          }}
                        >
                          Login Now
                        </Button>
                      </>
                    ) : activeTab === "admin" && allAdminMovies.length === 0 ? (
                      <>
                        <Typography sx={{
                          color: '#94a3b8',
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          mb: 2
                        }}>
                          Your collection is empty
                        </Typography>
                        <Typography sx={{
                          color: '#64748b',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          Add movies from TMDB or watchlist!
                        </Typography>
                      </>
                    ) : (
                      <Typography sx={{
                        color: '#94a3b8',
                        fontSize: { xs: '1rem', sm: '1.125rem' }
                      }}>
                        No movies found
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {activeTab === "admin" && totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, sm: 4 } }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                  size={{ xs: 'small', sm: 'medium', md: 'large' }}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#cbd5e1',
                      borderColor: '#334155',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': { bgcolor: '#334155' }
                    },
                    '& .Mui-selected': {
                      bgcolor: '#f59e0b !important',
                      color: 'black',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Sidebar - Hide on mobile, show on large screens */}
          <Box sx={{
            width: { lg: 320 },
            flexShrink: 0,
            display: { xs: 'none', lg: 'block' }
          }}>
            <Box sx={{
              bgcolor: '#1e293b',
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: '1px solid #334155'
            }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                Chart insights
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#94a3b8' }}>
                  Average IMDb rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                  <Typography sx={{ color: 'white', fontWeight: 600 }}>
                    {avgRating}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{
              bgcolor: '#1e293b',
              borderRadius: 2,
              p: 2,
              border: '1px solid #334155'
            }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                More to explore
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  Popular charts
                </Typography>
                <Box sx={{
                  color: '#94a3b8',
                  p: 2,
                  bgcolor: '#0f172a',
                  borderRadius: 1
                }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Switch between tabs to explore:
                  </Typography>
                  <Box component="ul" sx={{ mt: 1, pl: 2, '& li': { mb: 0.5 } }}>
                    <li>• TMDB Top Rated Movies</li>
                    <li>• Movie Collection</li>
                    <li>• Filter by genres</li>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}