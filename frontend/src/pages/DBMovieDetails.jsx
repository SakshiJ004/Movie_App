import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  Box, Typography, Button, Grid, Chip, Card, CardMedia, CardContent,
  Divider, CircularProgress
} from "@mui/material";
import { Star, StarBorder, ArrowBack, PlayArrow, Add } from "@mui/icons-material";

export default function DBMovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (token && movie) {
      checkWatchlistStatus();
    }
  }, [token, movie]);

  const checkWatchlistStatus = async () => {
    try {
      const res = await api.get('/watchlist');
      const watchlistItem = res.data.find(item => item.movieId === movie._id);
      setInWatchlist(!!watchlistItem);
    } catch (err) {
      console.error('Error checking watchlist:', err);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (inWatchlist) {
        await api.delete(`/watchlist/${movie._id}`);
        setInWatchlist(false);
      } else {
        await api.post('/watchlist', { movieId: movie._id });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  };

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/movies/${id}`); // your backend route
      const movieData = res.data.movie || res.data;

      setMovie(movieData);

      if (movieData.genres?.length > 0) {
        try {
          const simRes = await api.get("/movies", {
            params: { genre: movieData.genres[0] }
          });
          setSimilar(simRes.data.movies?.filter(m => m._id !== id).slice(0, 6) || []);
        } catch (err) {
          setSimilar([]);
        }
      }
    } catch (error) {
      console.error("Failed to load movie from DB:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#f59e0b' }} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', p: 4 }}>
        <Typography sx={{ color: 'white' }}>Movie not found in your collection</Typography>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ color: '#60a5fa', mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'black', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 50 }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 1.5, sm: 2 }, py: { xs: 1, sm: 1.5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box onClick={() => navigate('/')} sx={{ bgcolor: '#f59e0b', color: 'black', fontWeight: 'bold', px: 1, py: 0.5, borderRadius: 1, cursor: 'pointer' }}>
              IMDb
            </Box>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ color: 'white', textTransform: 'none' }}>
              Back
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Hero Backdrop */}
      {movie.backdrop && (
        <Box sx={{
          height: { xs: 300, sm: 400, md: 500 },
          background: `linear-gradient(to bottom, rgba(15,23,42,0.4), #0f172a), url(${movie.backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      )}

      <Box sx={{
        maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 }, mt: movie.backdrop ? { xs: -12, sm: -16, md: -20 } : 0
      }}>
        <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
          {/* Poster */}
          <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={movie.poster || 'https://via.placeholder.com/500x750/333/666?text=No+Poster'}
                alt={movie.title}
              />
            </Card>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button fullWidth variant="contained" startIcon={inWatchlist ? <Check /> : <Add />}
                onClick={handleAddToWatchlist}
                sx={{
                  bgcolor: inWatchlist ? '#10b981' : '#f59e0b',
                  color: inWatchlist ? 'white' : 'black',
                  fontWeight: 600,
                  '&:hover': { bgcolor: inWatchlist ? '#059669' : '#d97706' }
                }}>
                {inWatchlist ? 'In Watchlist' : 'Add to Collection'}
              </Button>
              {movie.trailer && (
                <Button fullWidth variant="outlined" startIcon={<PlayArrow />}
                  onClick={() => window.open(movie.trailer, '_blank')}
                  sx={{ borderColor: '#475569', color: 'white' }}>
                  Watch Trailer
                </Button>
              )}
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8} lg={9}>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}>
              {movie.title}
            </Typography>

            <Box sx={{
              display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 1.5, sm: 3 },
              mb: 3,
              flexWrap: 'wrap'
            }}>
              {movie.year && <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem' }}>{movie.year}</Typography>}
              {movie.duration && (
                <>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#475569' }} />
                  <Typography sx={{ color: '#94a3b8' }}>{movie.duration}</Typography>
                </>
              )}
              {movie.rating && (
                <>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#475569' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ color: '#f59e0b' }} />
                    <Typography sx={{ color: 'white', fontWeight: 600 }}>{movie.rating.toFixed(1)}</Typography>
                  </Box>
                </>
              )}
            </Box>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1 }, mb: 4 }}>
                {movie.genres.map((g, i) => (
                  <Chip key={i} label={g} sx={{
                    bgcolor: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: { xs: 28, sm: 32 }
                  }} />
                ))}
              </Box>
            )}

            <Divider sx={{ bgcolor: '#334155', mb: 4 }} />

            {/* Description */}
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Storyline</Typography>
            <Typography sx={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' } }}>
              {movie.description || "No description available."}
            </Typography>

            {/* Extra Info */}
            {(movie.director || movie.cast?.length > 0) && (
              <Box sx={{ mt: 5 }}>
                {movie.director && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      bgcolor: '#1e293b',
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #334155'
                    }}>
                      {(() => {
                        const directorName = typeof movie.director === 'string'
                          ? movie.director
                          : movie.director.name;
                        const directorPhoto = typeof movie.director === 'object'
                          ? movie.director.profilePath
                          : null;
                        const hasValidPhoto = directorPhoto && directorPhoto !== "" && directorPhoto !== "undefined";

                        return (
                          <>
                            {hasValidPhoto ? (
                              <img
                                src={directorPhoto.startsWith('http')
                                  ? directorPhoto
                                  : `https://image.tmdb.org/t/p/w185${directorPhoto}`}
                                alt={directorName}
                                style={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const placeholder = e.target.nextElementSibling;
                                  if (placeholder) placeholder.style.display = 'flex';
                                }}
                              />
                            ) : null}

                            {!hasValidPhoto && (
                              <Box sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                bgcolor: '#334155',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#64748b',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                              }}>
                                {directorName?.[0]?.toUpperCase() || 'D'}
                              </Box>
                            )}

                            <Box>
                              <Typography variant="caption" sx={{
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: 1
                              }}>
                                Director
                              </Typography>
                              <Typography sx={{ color: 'white', fontWeight: 600, mt: 0.5 }}>
                                {directorName}
                              </Typography>
                            </Box>
                          </>
                        );
                      })()}
                    </Box>
                  </Grid>
                )}
                {movie.cast?.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      Top Cast
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      gap: { xs: 1.5, sm: 2 },
                      overflowX: 'auto',
                      pb: 2,
                      '&::-webkit-scrollbar': { height: { xs: 6, sm: 8 } },
                      '&::-webkit-scrollbar-track': { bgcolor: '#1e293b' },
                      '&::-webkit-scrollbar-thumb': { bgcolor: '#475569', borderRadius: 1 }
                    }}>
                      {movie.cast.slice(0, 10).map((actor, i) => {
                        const actorName = typeof actor === 'string' ? actor : actor.name;
                        const actorChar = typeof actor === 'object' ? actor.character : '';
                        const actorPhoto = typeof actor === 'object' ? actor.profilePath : null;

                        const hasValidPhoto = actorPhoto && actorPhoto !== "" && actorPhoto !== "undefined";

                        return (
                          <Box
                            key={i}
                            sx={{
                              minWidth: { xs: 120, sm: 140 },
                              bgcolor: '#1e293b',
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: '1px solid #334155',
                            }}
                          >
                            {hasValidPhoto ? (
                              <img
                                src={actorPhoto.startsWith('http')
                                  ? actorPhoto
                                  : `https://image.tmdb.org/t/p/w185${actorPhoto}`}
                                alt={actorName}
                                style={{
                                  width: '100%',
                                  height: 200,
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const placeholder = e.target.nextElementSibling;
                                  if (placeholder) placeholder.style.display = 'flex';
                                }}
                              />
                            ) : null}

                            <Box sx={{
                              width: '100%',
                              height: 200,
                              bgcolor: '#334155',
                              display: hasValidPhoto ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#64748b',
                              fontSize: '3rem',
                              fontWeight: 'bold'
                            }}>
                              {actorName?.[0]?.toUpperCase() || '?'}
                            </Box>

                            <Box sx={{ p: 1.5 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {actorName}
                              </Typography>
                              {actorChar && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#94a3b8',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block'
                                  }}
                                >
                                  {actorChar}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>

        {similar.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
              More from Your Collection
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {similar.map((m) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={m._id}>
                  <Card
                    onClick={() => navigate(`/movie/${m._id}`)}
                    sx={{ cursor: 'pointer', bgcolor: '#1e293b', border: '1px solid #334155', '&:hover': { transform: 'translateY(-4px)', transition: '0.2s' } }}
                  >
                    <CardMedia
                      component="img"
                      height="280"
                      image={m.poster || '/placeholder.jpg'}
                      alt={m.title}
                    />
                    <CardContent>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}