import { useState, useContext, useEffect } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import { Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function MovieCard({ movie, index, showRank = true, source = "admin" }) {
    const [imageError, setImageError] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [watched, setWatched] = useState(false);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = () => {
        if (source === "tmdb" || movie._id?.startsWith?.("tmdb-")) {
            const tmdbId = movie.id || movie._id.replace("tmdb-", "");
            navigate(`/tmdb/${tmdbId}`);
        } else {
            navigate(`/movie/${movie._id}`);
        }
    };

    // Check if movie is in watchlist
    useEffect(() => {
        if (token) {
            checkWatchlistStatus();
        }
    }, [token, movie._id]);

    const checkWatchlistStatus = async () => {
        try {
            const res = await api.get('/watchlist');
            const watchlistItem = res.data.find(item => item.movieId === movie._id);
            if (watchlistItem) {
                setInWatchlist(true);
                setWatched(watchlistItem.watched);
            }
        } catch (err) {
            console.error('Error checking watchlist:', err);
        }
    };

    const handleAddToWatchlist = async (e) => {
        e.stopPropagation(); // Prevent navigation
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            if (inWatchlist) {
                await api.delete(`/watchlist/${movie._id}`);
                setInWatchlist(false);
                setWatched(false);
            } else {
                await api.post('/watchlist', { movieId: movie._id });
                setInWatchlist(true);
            }
        } catch (err) {
            console.error('Error updating watchlist:', err);
        }
    };

    const handleToggleWatched = async (e) => {
        e.stopPropagation(); // Prevent navigation
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const newWatchedStatus = !watched;
            await api.patch(`/watchlist/${movie._id}/watched`, { watched: newWatchedStatus });
            setWatched(newWatchedStatus);
            if (!inWatchlist) {
                setInWatchlist(true);
            }
        } catch (err) {
            console.error('Error toggling watched:', err);
        }
    };

    return (
        <Box
            onClick={handleClick}
            sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                bgcolor: '#1e293b',
                borderRadius: 2,
                border: '1px solid #334155',
                '&:hover': { bgcolor: '#293548' },
                transition: 'background-color 0.2s'
            }}>
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
                {showRank && (
                    <Box sx={{
                        position: 'absolute',
                        left: -8,
                        top: -8,
                        bgcolor: '#f59e0b',
                        color: 'black',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        fontSize: '0.875rem',
                        zIndex: 10
                    }}>
                        #{index + 1}
                    </Box>
                )}

                <img
                    src={imageError ? "https://via.placeholder.com/150x225/333/666?text=No+Image" : movie.poster}
                    alt={movie.title}
                    onError={() => setImageError(true)}
                    style={{ width: 128, height: 192, objectFit: 'cover', borderRadius: 4 }}
                />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                    {movie.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    {movie.releaseDate && (
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {movie.releaseDate.split('-')[0]}
                        </Typography>
                    )}
                    {movie.duration && (
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {movie.duration}
                        </Typography>
                    )}
                    <Box sx={{
                        px: 1,
                        py: 0.25,
                        border: '1px solid #475569',
                        borderRadius: 0.5,
                        fontSize: '0.75rem',
                        color: '#94a3b8'
                    }}>
                        R
                    </Box>
                </Box>

                <Typography variant="body2" sx={{
                    color: '#cbd5e1',
                    mb: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {movie.description}
                </Typography>

                {movie.genres?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                        {movie.genres.map((genre, i) => (
                            <Chip
                                key={i}
                                label={genre}
                                size="small"
                                sx={{
                                    bgcolor: '#334155',
                                    color: '#cbd5e1',
                                    fontSize: '0.75rem',
                                    height: 24
                                }}
                            />
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {movie.rating?.toFixed(1)}
                        </Typography>
                    </Box>

                    {token && (
                        <>
                            <Button
                                size="small"
                                onClick={handleAddToWatchlist}
                                sx={{
                                    color: inWatchlist ? '#10b981' : '#60a5fa',
                                    textTransform: 'none',
                                    fontWeight: inWatchlist ? 600 : 400
                                }}
                            >
                                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
                            </Button>

                            <Button
                                size="small"
                                onClick={handleToggleWatched}
                                sx={{
                                    color: watched ? '#10b981' : '#94a3b8',
                                    textTransform: 'none',
                                    fontWeight: watched ? 600 : 400
                                }}
                            >
                                {watched ? '✓ Watched' : 'Mark as watched'}
                            </Button>
                        </>
                    )}

                    {!token && (
                        <Button
                            size="small"
                            onClick={() => navigate('/login')}
                            sx={{ color: '#60a5fa', textTransform: 'none' }}
                        >
                            Login to track
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
