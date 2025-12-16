// import { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import api from "../api/axios";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Grid,
//   Chip,
//   Button,
//   Card,
//   CardMedia,
//   CardContent,
//   Divider,
//   CircularProgress
// } from "@mui/material";
// import {
//   Star,
//   StarBorder,
//   ArrowBack,
//   PlayArrow,
//   Add
// } from "@mui/icons-material";

// const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

// export default function MovieDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const isTmdbMovie = !id.match(/^[0-9a-fA-F]{24}$/);

//   const getImageUrl = (path, size = "w500") => {
//     if (!path || path === "undefined") return "https://via.placeholder.com/300x450/333/666?text=No+Image";
//     if (path.startsWith("http")) return path;
//     return `https://image.tmdb.org/t/p/${size}${path}`;
//   };

//   const [movie, setMovie] = useState(null);
//   const [similar, setSimilar] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { token } = useContext(AuthContext);
//   const [inWatchlist, setInWatchlist] = useState(false);

//   const loadMovie = async () => {
//     try {
//       setLoading(true);
//       let res;

//       if (isTmdbMovie) {
//         res = await axios.get(
//           `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&append_to_response=credits,videos`
//         );
//       } else {
//         res = await api.get(`/movies/${id}`);
//       }

//       setMovie(res.data);
//       console.log("Movie data:", res.data);

//       const sim = await axios.get(
//         `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_KEY}`
//       );

//       setSimilar(sim.data.results.slice(0, 6));
//     } catch (error) {
//       console.error("Error loading movie:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkWatchlistStatus = async () => {
//     try {
//       const res = await api.get('/watchlist');
//       const watchlistItem = res.data.find(item => item.movieId === `tmdb-${id}`);
//       setInWatchlist(!!watchlistItem);
//     } catch (err) {
//       console.error('Error checking watchlist:', err);
//     }
//   };

//   const handleAddToWatchlist = async () => {
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     try {
//       if (inWatchlist) {
//         await api.delete(`/watchlist/tmdb-${id}`);
//         setInWatchlist(false);
//       } else {
//         await api.post('/watchlist', { movieId: `tmdb-${id}` });
//         setInWatchlist(true);
//       }
//     } catch (err) {
//       console.error('Error updating watchlist:', err);
//       alert(err.response?.data?.message || 'Error updating watchlist');
//     }
//   };
//   useEffect(() => {
//     loadMovie();
//     if (token) {
//       checkWatchlistStatus();
//     }
//   }, [id, token]); // Add token dependency

//   if (loading) {
//     return (
//       <Box sx={{
//         minHeight: '100vh',
//         bgcolor: '#0f172a',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}>
//         <CircularProgress sx={{ color: '#f59e0b' }} />
//       </Box>
//     );
//   }

//   if (!movie) {
//     return (
//       <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', p: 4 }}>
//         <Typography sx={{ color: 'white' }}>Movie not found</Typography>
//       </Box>
//     );
//   }

//   const director = isTmdbMovie
//     ? movie.credits?.crew?.find(c => c.job === "Director")
//     : movie.director;

//   const cast = isTmdbMovie
//     ? movie.credits?.cast?.slice(0, 10)
//     : movie.cast || [];

//   const trailer = movie.videos?.results?.find(v => v.type === "Trailer");

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a' }}>
//       {/* Header */}
//       <Box sx={{
//         bgcolor: 'black',
//         borderBottom: '1px solid #1e293b',
//         position: 'sticky',
//         top: 0,
//         zIndex: 50
//       }}>
//         <Box sx={{
//           maxWidth: '1280px',
//           mx: 'auto',
//           px: 2,
//           py: 1.5,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between'
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
//             <Box sx={{
//               bgcolor: '#f59e0b',
//               color: 'black',
//               fontWeight: 'bold',
//               px: 1,
//               py: 0.5,
//               borderRadius: 1,
//               fontSize: '1.25rem',
//               cursor: 'pointer'
//             }}
//               onClick={() => navigate('/')}
//             >
//               IMDb
//             </Box>
//             <Button
//               startIcon={<ArrowBack />}
//               onClick={() => navigate(-1)}
//               sx={{ color: 'white', textTransform: 'none' }}
//             >
//               Back
//             </Button>
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Button
//               component={Link}
//               to="/watchlist"
//               sx={{ color: 'white', textTransform: 'none' }}
//             >
//               Watchlist
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* Backdrop */}
//       {(isTmdbMovie ? movie.backdrop_path : movie.backdrop) && (
//         <Box sx={{
//           position: 'relative',
//           height: 400,
//           background: `linear-gradient(to bottom, rgba(15, 23, 42, 0.3), #0f172a),
// url(${getImageUrl(isTmdbMovie ? movie.backdrop_path : movie.backdrop, "original")})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center'
//         }} />
//       )}

//       <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 4, py: 4, mt: movie.backdrop_path ? -15 : 0 }}>
//         <Grid container spacing={4}>

//           {/* Poster */}
//           <Grid item xs={12} md={3}>
//             <Card sx={{
//               bgcolor: '#1e293b',
//               border: '1px solid #334155',
//               boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
//             }}>
//               <CardMedia
//                 component="img"
//                 image={getImageUrl(isTmdbMovie ? movie.poster_path : movie.poster)}
//                 alt={movie.title}
//                 sx={{ width: '100%' }}
//               />
//             </Card>

//             {/* Action Buttons */}
//             <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 startIcon={<Add />}
//                 onClick={handleAddToWatchlist}
//                 disabled={!token}
//                 sx={{
//                   bgcolor: inWatchlist ? '#10b981' : '#f59e0b',
//                   color: inWatchlist ? 'white' : 'black',
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   '&:hover': { bgcolor: inWatchlist ? '#059669' : '#d97706' },
//                   '&:disabled': { bgcolor: '#334155', color: '#64748b' }
//                 }}
//               >
//                 {!token ? 'Login to Add' : (inWatchlist ? '✓ In Watchlist' : 'Add to Watchlist')}
//               </Button>

//               {trailer && (
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<PlayArrow />}
//                   sx={{
//                     borderColor: '#334155',
//                     color: 'white',
//                     textTransform: 'none',
//                     '&:hover': { borderColor: '#475569', bgcolor: '#1e293b' }
//                   }}
//                   onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
//                 >
//                   Watch Trailer
//                 </Button>
//               )}
//             </Box>
//           </Grid>

//           {/* Info */}
//           <Grid item xs={12} md={9}>
//             <Box>
//               {/* Title and Rating */}
//               <Box sx={{ mb: 3 }}>
//                 <Typography
//                   variant="h3"
//                   sx={{
//                     color: 'white',
//                     fontWeight: 'bold',
//                     mb: 1
//                   }}
//                 >
//                   {movie.title}
//                 </Typography>

//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//                   {movie.release_date && (
//                     <Typography sx={{ color: '#94a3b8' }}>
//                       {(movie.release_date || movie.releaseDate)?.slice(0, 4)}
//                     </Typography>
//                   )}
//                   {movie.runtime && (
//                     <>
//                       <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569' }} />
//                       <Typography sx={{ color: '#94a3b8' }}>
//                         {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
//                       </Typography>
//                     </>
//                   )}
//                   {movie.adult !== undefined && (
//                     <>
//                       <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569' }} />
//                       <Box sx={{
//                         px: 1,
//                         py: 0.25,
//                         border: '1px solid #475569',
//                         borderRadius: 0.5,
//                         fontSize: '0.75rem',
//                         color: '#94a3b8'
//                       }}>
//                         {movie.adult ? '18+' : 'PG-13'}
//                       </Box>
//                     </>
//                   )}
//                 </Box>

//                 {/* Rating */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
//                   <Box sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1,
//                     bgcolor: '#1e293b',
//                     px: 2,
//                     py: 1,
//                     borderRadius: 1,
//                     border: '1px solid #334155'
//                   }}>
//                     <Star sx={{ color: '#f59e0b', fontSize: 24 }} />
//                     <Box>
//                       <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
//                         {(movie.vote_average ?? movie.rating)?.toFixed(1)}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//                         /10
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Button
//                     startIcon={<StarBorder />}
//                     sx={{
//                       color: '#60a5fa',
//                       textTransform: 'none',
//                       fontWeight: 600
//                     }}
//                   >
//                     Rate
//                   </Button>
//                 </Box>
//               </Box>

//               {/* Genres */}
//               {movie.genres && movie.genres.length > 0 && (
//                 <Box sx={{ mb: 3 }}>
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                     {movie.genres.map((genre) => (
//                       <Chip
//                         key={genre.id}
//                         label={genre.name}
//                         sx={{
//                           bgcolor: '#1e293b',
//                           color: '#cbd5e1',
//                           border: '1px solid #334155',
//                           fontWeight: 500
//                         }}
//                       />
//                     ))}
//                   </Box>
//                 </Box>
//               )}

//               <Divider sx={{ bgcolor: '#334155', mb: 3 }} />

//               {/* Overview */}
//               <Box sx={{ mb: 4 }}>
//                 <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
//                   Storyline
//                 </Typography>
//                 <Typography sx={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1rem' }}>
//                   {movie.overview || movie.description || 'No overview available.'}
//                 </Typography>
//               </Box>

//               {/* Credits */}
//               <Grid container spacing={3}>
//                 {director && (
//                   <Grid item xs={12} sm={6}>
//                     <Box sx={{
//                       display: 'flex',
//                       gap: 2,
//                       alignItems: 'center',
//                       bgcolor: '#1e293b',
//                       p: 2,
//                       borderRadius: 2,
//                       border: '1px solid #334155'
//                     }}>
//                       <Avatar
//                         src={getImageUrl(director.profile_path || director.profilePath, "w185")}
//                         sx={{ width: 56, height: 56 }}
//                       />
//                       <Box>
//                         <Typography
//                           variant="caption"
//                           sx={{ color: '#94a3b8', textTransform: 'uppercase' }}
//                         >
//                           Director
//                         </Typography>
//                         <Typography sx={{ color: 'white', fontWeight: 600 }}>
//                           {director.name}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 )}

//                 {movie.production_companies && movie.production_companies.length > 0 && (
//                   <Grid item xs={12} sm={6}>
//                     <Box sx={{
//                       bgcolor: '#1e293b',
//                       p: 2,
//                       borderRadius: 2,
//                       border: '1px solid #334155'
//                     }}>
//                       <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
//                         Production
//                       </Typography>
//                       <Typography sx={{ color: 'white', fontWeight: 600, mt: 0.5 }}>
//                         {movie.production_companies[0].name}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 )}

//                 {movie.budget > 0 && (
//                   <Grid item xs={12} sm={6}>
//                     <Box sx={{
//                       bgcolor: '#1e293b',
//                       p: 2,
//                       borderRadius: 2,
//                       border: '1px solid #334155'
//                     }}>
//                       <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
//                         Budget
//                       </Typography>
//                       <Typography sx={{ color: 'white', fontWeight: 600, mt: 0.5 }}>
//                         ${(movie.budget / 1000000).toFixed(0)}M
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 )}

//                 {movie.revenue > 0 && (
//                   <Grid item xs={12} sm={6}>
//                     <Box sx={{
//                       bgcolor: '#1e293b',
//                       p: 2,
//                       borderRadius: 2,
//                       border: '1px solid #334155'
//                     }}>
//                       <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
//                         Box Office
//                       </Typography>
//                       <Typography sx={{ color: 'white', fontWeight: 600, mt: 0.5 }}>
//                         ${(movie.revenue / 1000000).toFixed(0)}M
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 )}
//               </Grid>

//               {/* Cast */}
//               {cast.length > 0 && (
//                 <Box sx={{ mt: 4 }}>
//                   <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
//                     Top Cast
//                   </Typography>
//                   <Box sx={{
//                     display: 'flex',
//                     gap: 2,
//                     overflowX: 'auto',
//                     pb: 2,
//                     '&::-webkit-scrollbar': {
//                       height: 8
//                     },
//                     '&::-webkit-scrollbar-track': {
//                       bgcolor: '#1e293b'
//                     },
//                     '&::-webkit-scrollbar-thumb': {
//                       bgcolor: '#475569',
//                       borderRadius: 1
//                     }
//                   }}>
//                     {cast.map((person) => (
//                       <Box
//                         key={person.id}
//                         sx={{
//                           minWidth: 140,
//                           bgcolor: '#1e293b',
//                           borderRadius: 2,
//                           overflow: 'hidden',
//                           border: '1px solid #334155',
//                           cursor: 'pointer',
//                           '&:hover': {
//                             borderColor: '#475569',
//                             transform: 'translateY(-4px)',
//                             transition: 'all 0.2s'
//                           }
//                         }}
//                       >
//                         <img
//                           src={getImageUrl(person.profile_path || person.profilePath, "w185")}
//                           alt={person.name}
//                           style={{ width: '100%', height: 200, objectFit: 'cover' }}
//                         />
//                         <Box sx={{ p: 1.5 }}>
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               color: 'white',
//                               fontWeight: 600,
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             {person.name}
//                           </Typography>
//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: '#94a3b8',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                               display: 'block'
//                             }}
//                           >
//                             {person.character}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               )}
//             </Box>
//           </Grid>
//         </Grid>

//         {/* Similar Movies */}
//         {similar.length > 0 && (
//           <Box sx={{ mt: 6 }}>
//             <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
//               More Like This
//             </Typography>

//             <Grid container spacing={3}>
//               {similar.map((m) => (
//                 <Grid item xs={12} sm={6} md={4} lg={2} key={m.id}>
//                   <Card
//                     sx={{
//                       bgcolor: '#1e293b',
//                       border: '1px solid #334155',
//                       cursor: 'pointer',
//                       '&:hover': {
//                         borderColor: '#475569',
//                         transform: 'translateY(-4px)',
//                         transition: 'all 0.2s'
//                       }
//                     }}
//                     onClick={() => navigate(`/movie/${m.id}`)}
//                   >
//                     <CardMedia
//                       component="img"
//                       height="225"
//                       image={m.poster_path
//                         ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
//                         : 'https://via.placeholder.com/300x450/333/666?text=No+Image'
//                       }
//                       alt={m.title}
//                     />
//                     <CardContent>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: 'white',
//                           fontWeight: 600,
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap'
//                         }}
//                       >
//                         {m.title}
//                       </Typography>
//                       {m.vote_average > 0 && (
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
//                           <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
//                           <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//                             {m.vote_average.toFixed(1)}
//                           </Typography>
//                         </Box>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }


import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Chip,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Star,
  StarBorder,
  ArrowBack,
  PlayArrow,
  Add
} from "@mui/icons-material";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const isTmdbMovie = !id.match(/^[0-9a-fA-F]{24}$/);

  const getImageUrl = (path, size = "w500") => {
    if (!path || path === "undefined") return "https://via.placeholder.com/300x450/333/666?text=No+Image";
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const [inWatchlist, setInWatchlist] = useState(false);

  const loadMovie = async () => {
    try {
      setLoading(true);
      let res;

      if (isTmdbMovie) {
        res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&append_to_response=credits,videos`
        );
      } else {
        res = await api.get(`/movies/${id}`);
      }

      setMovie(res.data);

      const sim = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_KEY}`
      );

      setSimilar(sim.data.results.slice(0, 6));
    } catch (error) {
      console.error("Error loading movie:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const res = await api.get('/watchlist');
      const watchlistItem = res.data.find(item => item.movieId === `tmdb-${id}`);
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
        await api.delete(`/watchlist/tmdb-${id}`);
        setInWatchlist(false);
      } else {
        await api.post('/watchlist', { movieId: `tmdb-${id}` });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
      alert(err.response?.data?.message || 'Error updating watchlist');
    }
  };

  useEffect(() => {
    loadMovie();
    if (token) {
      checkWatchlistStatus();
    }
  }, [id, token]);

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        bgcolor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: '#f59e0b' }} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', p: { xs: 2, sm: 4 } }}>
        <Typography sx={{ color: 'white' }}>Movie not found</Typography>
      </Box>
    );
  }

  const director = isTmdbMovie
    ? movie.credits?.crew?.find(c => c.job === "Director")
    : movie.director;

  const cast = isTmdbMovie
    ? movie.credits?.cast?.slice(0, 10)
    : movie.cast || [];

  const trailer = movie.videos?.results?.find(v => v.type === "Trailer");

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a' }}>
      {/* Header */}
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
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 } }}>
            <Box sx={{
              bgcolor: '#f59e0b',
              color: 'black',
              fontWeight: 'bold',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              cursor: 'pointer'
            }}
              onClick={() => navigate('/')}
            >
              IMDb
            </Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: 'auto',
                px: { xs: 1, sm: 2 }
              }}
            >
              {!isMobile && 'Back'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/watchlist"
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Watchlist
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Backdrop */}
      {(isTmdbMovie ? movie.backdrop_path : movie.backdrop) && (
        <Box sx={{
          position: 'relative',
          height: { xs: 250, sm: 350, md: 400 },
          background: `linear-gradient(to bottom, rgba(15, 23, 42, 0.3), #0f172a),
url(${getImageUrl(isTmdbMovie ? movie.backdrop_path : movie.backdrop, "original")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      )}

      <Box sx={{
        maxWidth: '1280px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        mt: { xs: movie.backdrop_path ? -8 : 0, md: movie.backdrop_path ? -15 : 0 }
      }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>

          {/* Poster */}
          <Grid item xs={12} sm={4} md={3}>
            <Card sx={{
              bgcolor: '#1e293b',
              border: '1px solid #334155',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
              <CardMedia
                component="img"
                image={getImageUrl(isTmdbMovie ? movie.poster_path : movie.poster)}
                alt={movie.title}
                sx={{ width: '100%' }}
              />
            </Card>

            {/* Action Buttons */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddToWatchlist}
                disabled={!token}
                sx={{
                  bgcolor: inWatchlist ? '#10b981' : '#f59e0b',
                  color: inWatchlist ? 'white' : 'black',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 },
                  '&:hover': { bgcolor: inWatchlist ? '#059669' : '#d97706' },
                  '&:disabled': { bgcolor: '#334155', color: '#64748b' }
                }}
              >
                {!token ? 'Login to Add' : (inWatchlist ? '✓ In Watchlist' : 'Add to Watchlist')}
              </Button>

              {trailer && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  sx={{
                    borderColor: '#334155',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.5 },
                    '&:hover': { borderColor: '#475569', bgcolor: '#1e293b' }
                  }}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                >
                  Watch Trailer
                </Button>
              )}
            </Box>
          </Grid>

          {/* Info */}
          <Grid item xs={12} sm={8} md={9}>
            <Box>
              {/* Title and Rating */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                    fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  {movie.title}
                </Typography>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 2 },
                  mb: 2,
                  flexWrap: 'wrap'
                }}>
                  {movie.release_date && (
                    <Typography sx={{ color: '#94a3b8', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {(movie.release_date || movie.releaseDate)?.slice(0, 4)}
                    </Typography>
                  )}
                  {movie.runtime && (
                    <>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569', display: { xs: 'none', sm: 'block' } }} />
                      <Typography sx={{ color: '#94a3b8', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </Typography>
                    </>
                  )}
                  {movie.adult !== undefined && (
                    <>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569', display: { xs: 'none', sm: 'block' } }} />
                      <Box sx={{
                        px: 1,
                        py: 0.25,
                        border: '1px solid #475569',
                        borderRadius: 0.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        color: '#94a3b8'
                      }}>
                        {movie.adult ? '18+' : 'PG-13'}
                      </Box>
                    </>
                  )}
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#1e293b',
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    borderRadius: 1,
                    border: '1px solid #334155'
                  }}>
                    <Star sx={{ color: '#f59e0b', fontSize: { xs: 20, sm: 24 } }} />
                    <Box>
                      <Typography sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        {(movie.vote_average ?? movie.rating)?.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        /10
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    startIcon={<StarBorder />}
                    sx={{
                      color: '#60a5fa',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Rate
                  </Button>
                </Box>
              </Box>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {movie.genres.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        sx={{
                          bgcolor: '#1e293b',
                          color: '#cbd5e1',
                          border: '1px solid #334155',
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          height: { xs: 26, sm: 32 }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ bgcolor: '#334155', mb: { xs: 2, sm: 3 } }} />

              {/* Overview */}
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Typography variant="h5" sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
                  Storyline
                </Typography>
                <Typography sx={{
                  color: '#cbd5e1',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  {movie.overview || movie.description || 'No overview available.'}
                </Typography>
              </Box>

              {/* Credits */}
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {director && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{
                      display: 'flex',
                      gap: { xs: 1.5, sm: 2 },
                      alignItems: 'center',
                      bgcolor: '#1e293b',
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      border: '1px solid #334155'
                    }}>
                      <Avatar
                        src={getImageUrl(director.profile_path || director.profilePath, "w185")}
                        sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 } }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          Director
                        </Typography>
                        <Typography sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          {director.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {movie.production_companies && movie.production_companies.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{
                      bgcolor: '#1e293b',
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      border: '1px solid #334155'
                    }}>
                      <Typography variant="caption" sx={{
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Production
                      </Typography>
                      <Typography sx={{
                        color: 'white',
                        fontWeight: 600,
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {movie.production_companies[0].name}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {movie.budget > 0 && (
                  <Grid item xs={6} sm={6}>
                    <Box sx={{
                      bgcolor: '#1e293b',
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      border: '1px solid #334155'
                    }}>
                      <Typography variant="caption" sx={{
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Budget
                      </Typography>
                      <Typography sx={{
                        color: 'white',
                        fontWeight: 600,
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        ${(movie.budget / 1000000).toFixed(0)}M
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {movie.revenue > 0 && (
                  <Grid item xs={6} sm={6}>
                    <Box sx={{
                      bgcolor: '#1e293b',
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      border: '1px solid #334155'
                    }}>
                      <Typography variant="caption" sx={{
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Box Office
                      </Typography>
                      <Typography sx={{
                        color: 'white',
                        fontWeight: 600,
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        ${(movie.revenue / 1000000).toFixed(0)}M
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Cast */}
              {cast.length > 0 && (
                <Box sx={{ mt: { xs: 3, sm: 4 } }}>
                  <Typography variant="h5" sx={{
                    color: 'white',
                    fontWeight: 600,
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Top Cast
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    gap: { xs: 1.5, sm: 2 },
                    overflowX: 'auto',
                    pb: 2,
                    '&::-webkit-scrollbar': {
                      height: { xs: 6, sm: 8 }
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: '#1e293b'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: '#475569',
                      borderRadius: 1
                    }
                  }}>
                    {cast.map((person) => {
                      const profilePath = person.profile_path || person.profilePath;
                      const hasValidPhoto = profilePath && profilePath !== "" && profilePath !== "undefined";

                      return (
                        <Box
                          key={person.id}
                          sx={{
                            minWidth: { xs: 120, sm: 140 },
                            bgcolor: '#1e293b',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid #334155',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: '#475569',
                              transform: 'translateY(-4px)',
                              transition: 'all 0.2s'
                            }
                          }}
                        >
                          {hasValidPhoto ? (
                            <img
                              src={getImageUrl(profilePath, "w185")}
                              alt={person.name}
                              style={{
                                width: '100%',
                                height: isMobile ? 180 : 200,
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
                            height: isMobile ? 180 : 200,
                            bgcolor: '#334155',
                            display: hasValidPhoto ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b',
                            fontSize: '3rem',
                            fontWeight: 'bold'
                          }}>
                            {person.name?.[0]?.toUpperCase() || '?'}
                          </Box>

                          <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'white',
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                              }}
                            >
                              {person.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#94a3b8',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}
                            >
                              {person.character}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Similar Movies */}
        {similar.length > 0 && (
          <Box sx={{ mt: { xs: 4, sm: 6 } }}>
            <Typography variant="h4" sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}>
              More Like This
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {similar.map((m) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={m.id}>
                  <Card
                    sx={{
                      bgcolor: '#1e293b',
                      border: '1px solid #334155',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#475569',
                        transform: 'translateY(-4px)',
                        transition: 'all 0.2s'
                      }
                    }}
                    onClick={() => navigate(`/movie/${m.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height={isMobile ? "180" : "225"}
                      image={m.poster_path
                        ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                        : 'https://via.placeholder.com/300x450/333/666?text=No+Image'
                      }
                      alt={m.title}
                    />
                    <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        {m.title}
                      </Typography>
                      {m.vote_average > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Star sx={{ fontSize: { xs: 12, sm: 14 }, color: '#f59e0b' }} />
                          <Typography variant="caption" sx={{
                            color: '#94a3b8',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}>
                            {m.vote_average.toFixed(1)}
                          </Typography>
                        </Box>
                      )}
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