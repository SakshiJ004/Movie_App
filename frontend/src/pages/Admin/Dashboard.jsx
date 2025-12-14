import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    LinearProgress
} from "@mui/material";
import {
    Movie as MovieIcon,
    People as PeopleIcon,
    TrendingUp,
    Star,
    Visibility
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        averageRating: 0,
        topRatedMovies: [],
        recentMovies: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Replace the loadDashboardData function:

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Try to fetch from analytics endpoint first
            try {
                const res = await api.get("/analytics/dashboard");
                setStats({
                    totalMovies: res.data.totalMovies || 0,
                    totalUsers: res.data.totalUsers || 0,
                    averageRating: parseFloat(res.data.averageRating) || 0,
                    topRatedMovies: res.data.topRated || [],
                    recentMovies: res.data.recentMovies || []
                });
                return; // Exit if successful
            } catch (err) {
                console.log("Analytics endpoint not available, using fallback");
            }

            // Fallback: Fetch all data manually
            const moviesRes = await api.get("/movies", { params: { limit: 1000 } });
            const movies = moviesRes.data.movies || [];

            // Try to get user count
            let userCount = 0;
            try {
                const usersRes = await api.get("/users/count"); // You need to create this endpoint
                userCount = usersRes.data.count;
            } catch (err) {
                console.log("User count endpoint not available");
            }

            const avgRating = movies.length > 0
                ? movies.reduce((sum, m) => sum + (m.rating || 0), 0) / movies.length
                : 0;

            const topRated = [...movies]
                .filter(m => m.rating) // Only movies with ratings
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);

            const recent = [...movies]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setStats({
                totalMovies: movies.length,
                totalUsers: userCount,
                averageRating: avgRating,
                topRatedMovies: topRated,
                recentMovies: recent
            });
        } catch (error) {
            console.error("Error loading dashboard:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardDataFallback = async () => {
        try {
            const moviesRes = await api.get("/movies", { params: { limit: 1000 } });
            const movies = moviesRes.data.movies || [];

            const avgRating = movies.length > 0
                ? movies.reduce((sum, m) => sum + (m.rating || 0), 0) / movies.length
                : 0;

            const topRated = [...movies]
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);

            const recent = [...movies]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setStats({
                totalMovies: movies.length,
                totalUsers: 0,
                averageRating: avgRating,
                topRatedMovies: topRated,
                recentMovies: recent
            });
        } catch (error) {
            console.error("Error loading fallback data:", error);
        }
    };

    const StatCard = ({ icon, title, value, color, subtitle }) => (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                bgcolor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                    borderColor: color
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        bgcolor: `${color}20`,
                        p: 1.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 4 }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography sx={{ color: '#94a3b8' }}>
                        Overview of your movie database
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography sx={{ color: '#94a3b8' }}>Loading dashboard...</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<MovieIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
                                    title="Total Movies"
                                    value={stats.totalMovies}
                                    color="#f59e0b"
                                    subtitle="in database"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<PeopleIcon sx={{ fontSize: 32, color: '#3b82f6' }} />}
                                    title="Total Users"
                                    value={stats.totalUsers || "N/A"}
                                    color="#3b82f6"
                                    subtitle="registered"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<Star sx={{ fontSize: 32, color: '#fbbf24' }} />}
                                    title="Avg Rating"
                                    value={stats.averageRating.toFixed(1)}
                                    color="#fbbf24"
                                    subtitle="across all movies"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<TrendingUp sx={{ fontSize: 32, color: '#10b981' }} />}
                                    title="Growth"
                                    value="+12%"
                                    color="#10b981"
                                    subtitle="this month"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            {/* Top Rated Movies */}
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        bgcolor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                                        🏆 Top Rated Movies
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {stats.topRatedMovies.map((movie, index) => (
                                            <Card
                                                key={movie._id}
                                                onClick={() => navigate(`/movie/${movie._id}`)}
                                                sx={{
                                                    bgcolor: '#0f172a',
                                                    border: '1px solid #334155',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: '#475569',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography
                                                        sx={{
                                                            color: '#f59e0b',
                                                            fontWeight: 'bold',
                                                            fontSize: '1.5rem',
                                                            minWidth: 30
                                                        }}
                                                    >
                                                        #{index + 1}
                                                    </Typography>
                                                    <img
                                                        src={movie.poster || 'https://via.placeholder.com/60x90/333/666?text=No+Image'}
                                                        alt={movie.title}
                                                        style={{ width: 40, height: 60, borderRadius: 4, objectFit: 'cover' }}
                                                    />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {movie.title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                            {movie.releaseDate?.split('-')[0]}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
                                                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                                            {movie.rating?.toFixed(1)}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Recently Added */}
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        bgcolor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                                        🆕 Recently Added
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {stats.recentMovies.map((movie) => (
                                            <Card
                                                key={movie._id}
                                                onClick={() => navigate(`/movie/${movie._id}`)}
                                                sx={{
                                                    bgcolor: '#0f172a',
                                                    border: '1px solid #334155',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: '#475569',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <img
                                                        src={movie.poster || 'https://via.placeholder.com/60x90/333/666?text=No+Image'}
                                                        alt={movie.title}
                                                        style={{ width: 40, height: 60, borderRadius: 4, objectFit: 'cover' }}
                                                    />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {movie.title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                            Added {new Date(movie.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                    {movie.rating && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
                                                            <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                                                {movie.rating.toFixed(1)}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Box>
        </Box>
    );
}