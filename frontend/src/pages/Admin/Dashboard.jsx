// import { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Grid,
//     Paper,
//     Card,
//     CardContent,
//     LinearProgress
// } from "@mui/material";
// import {
//     Movie as MovieIcon,
//     People as PeopleIcon,
//     TrendingUp,
//     Star,
//     Visibility
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import { toast } from "react-toastify";

// export default function Dashboard() {
//     const navigate = useNavigate();
//     const [stats, setStats] = useState({
//         totalMovies: 0,
//         totalUsers: 0,
//         averageRating: 0,
//         topRatedMovies: [],
//         recentMovies: []
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadDashboardData();
//     }, []);

//     // Replace the loadDashboardData function:

//     const loadDashboardData = async () => {
//         try {
//             setLoading(true);

//             // Fetch all movies
//             const moviesRes = await api.get("/movies", { params: { limit: 1000 } });
//             const movies = moviesRes.data.movies || [];

//             // Calculate average rating
//             const avgRating = movies.length > 0
//                 ? movies.reduce((sum, m) => sum + (m.rating || 0), 0) / movies.length
//                 : 0;

//             // Get top rated movies
//             const topRated = [...movies]
//                 .filter(m => m.rating)
//                 .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//                 .slice(0, 5);

//             // Get recent movies
//             const recent = [...movies]
//                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                 .slice(0, 5);

//             // Try to get analytics from backend
//             let totalUsers = 0;
//             try {
//                 const analyticsRes = await api.get("/analytics/dashboard");
//                 totalUsers = analyticsRes.data.totalUsers || 0;
//             } catch (err) {
//                 console.log("Analytics endpoint not available, using defaults");
//             }

//             setStats({
//                 totalMovies: movies.length,
//                 totalUsers: totalUsers,
//                 averageRating: avgRating,
//                 topRatedMovies: topRated,
//                 recentMovies: recent
//             });
//         } catch (error) {
//             console.error("Error loading dashboard:", error);
//             toast.error("Failed to load dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const StatCard = ({ icon, title, value, color, subtitle }) => (
//         <Paper
//             elevation={3}
//             sx={{
//                 p: 3,
//                 bgcolor: '#1e293b',
//                 border: '1px solid #334155',
//                 borderRadius: 2,
//                 transition: 'all 0.3s',
//                 '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
//                     borderColor: color
//                 }
//             }}
//         >
//             <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
//                 <Box>
//                     <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
//                         {title}
//                     </Typography>
//                     <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
//                         {value}
//                     </Typography>
//                     {subtitle && (
//                         <Typography variant="caption" sx={{ color: '#64748b' }}>
//                             {subtitle}
//                         </Typography>
//                     )}
//                 </Box>
//                 <Box
//                     sx={{
//                         bgcolor: `${color}20`,
//                         p: 1.5,
//                         borderRadius: 2,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                     }}
//                 >
//                     {icon}
//                 </Box>
//             </Box>
//         </Paper>
//     );

//     return (
//         <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 4 }}>
//             <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
//                 {/* Header */}
//                 <Box sx={{ mb: 4 }}>
//                     <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
//                         Admin Dashboard
//                     </Typography>
//                     <Typography sx={{ color: '#94a3b8' }}>
//                         Overview of your movie database
//                     </Typography>
//                 </Box>

//                 {loading ? (
//                     <Box sx={{ textAlign: 'center', py: 10 }}>
//                         <Typography sx={{ color: '#94a3b8' }}>Loading dashboard...</Typography>
//                     </Box>
//                 ) : (
//                     <>
//                         {/* Stats Cards */}
//                         <Grid container spacing={3} sx={{ mb: 4 }}>
//                             <Grid item xs={12} sm={6} md={3}>
//                                 <StatCard
//                                     icon={<MovieIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
//                                     title="Total Movies"
//                                     value={stats.totalMovies}
//                                     color="#f59e0b"
//                                     subtitle="in database"
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6} md={3}>
//                                 <StatCard
//                                     icon={<PeopleIcon sx={{ fontSize: 32, color: '#3b82f6' }} />}
//                                     title="Total Users"
//                                     value={stats.totalUsers || "N/A"}
//                                     color="#3b82f6"
//                                     subtitle="registered"
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6} md={3}>
//                                 <StatCard
//                                     icon={<Star sx={{ fontSize: 32, color: '#fbbf24' }} />}
//                                     title="Avg Rating"
//                                     value={stats.averageRating.toFixed(1)}
//                                     color="#fbbf24"
//                                     subtitle="across all movies"
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6} md={3}>
//                                 <StatCard
//                                     icon={<TrendingUp sx={{ fontSize: 32, color: '#10b981' }} />}
//                                     title="Growth"
//                                     value="+12%"
//                                     color="#10b981"
//                                     subtitle="this month"
//                                 />
//                             </Grid>
//                         </Grid>

//                         <Grid container spacing={3}>
//                             {/* Top Rated Movies */}
//                             <Grid item xs={12} md={6}>
//                                 <Paper
//                                     elevation={3}
//                                     sx={{
//                                         p: 3,
//                                         bgcolor: '#1e293b',
//                                         border: '1px solid #334155',
//                                         borderRadius: 2
//                                     }}
//                                 >
//                                     <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
//                                         🏆 Top Rated Movies
//                                     </Typography>

//                                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                                         {stats.topRatedMovies.map((movie, index) => (
//                                             <Card
//                                                 key={movie._id}
//                                                 onClick={() => navigate(`/movie/${movie._id}`)}
//                                                 sx={{
//                                                     bgcolor: '#0f172a',
//                                                     border: '1px solid #334155',
//                                                     cursor: 'pointer',
//                                                     transition: 'all 0.2s',
//                                                     '&:hover': {
//                                                         borderColor: '#475569',
//                                                         transform: 'translateX(4px)'
//                                                     }
//                                                 }}
//                                             >
//                                                 <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//                                                     <Typography
//                                                         sx={{
//                                                             color: '#f59e0b',
//                                                             fontWeight: 'bold',
//                                                             fontSize: '1.5rem',
//                                                             minWidth: 30
//                                                         }}
//                                                     >
//                                                         #{index + 1}
//                                                     </Typography>
//                                                     <img
//                                                         src={movie.poster || 'https://via.placeholder.com/60x90/333/666?text=No+Image'}
//                                                         alt={movie.title}
//                                                         style={{ width: 40, height: 60, borderRadius: 4, objectFit: 'cover' }}
//                                                     />
//                                                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                                                         <Typography
//                                                             sx={{
//                                                                 color: 'white',
//                                                                 fontWeight: 600,
//                                                                 overflow: 'hidden',
//                                                                 textOverflow: 'ellipsis',
//                                                                 whiteSpace: 'nowrap'
//                                                             }}
//                                                         >
//                                                             {movie.title}
//                                                         </Typography>
//                                                         <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//                                                             {movie.releaseDate?.split('-')[0]}
//                                                         </Typography>
//                                                     </Box>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                                         <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
//                                                         <Typography sx={{ color: 'white', fontWeight: 600 }}>
//                                                             {movie.rating?.toFixed(1)}
//                                                         </Typography>
//                                                     </Box>
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </Box>
//                                 </Paper>
//                             </Grid>

//                             {/* Recently Added */}
//                             <Grid item xs={12} md={6}>
//                                 <Paper
//                                     elevation={3}
//                                     sx={{
//                                         p: 3,
//                                         bgcolor: '#1e293b',
//                                         border: '1px solid #334155',
//                                         borderRadius: 2
//                                     }}
//                                 >
//                                     <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
//                                         🆕 Recently Added
//                                     </Typography>

//                                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                                         {stats.recentMovies.map((movie) => (
//                                             <Card
//                                                 key={movie._id}
//                                                 onClick={() => navigate(`/movie/${movie._id}`)}
//                                                 sx={{
//                                                     bgcolor: '#0f172a',
//                                                     border: '1px solid #334155',
//                                                     cursor: 'pointer',
//                                                     transition: 'all 0.2s',
//                                                     '&:hover': {
//                                                         borderColor: '#475569',
//                                                         transform: 'translateX(4px)'
//                                                     }
//                                                 }}
//                                             >
//                                                 <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//                                                     <img
//                                                         src={movie.poster || 'https://via.placeholder.com/60x90/333/666?text=No+Image'}
//                                                         alt={movie.title}
//                                                         style={{ width: 40, height: 60, borderRadius: 4, objectFit: 'cover' }}
//                                                     />
//                                                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                                                         <Typography
//                                                             sx={{
//                                                                 color: 'white',
//                                                                 fontWeight: 600,
//                                                                 overflow: 'hidden',
//                                                                 textOverflow: 'ellipsis',
//                                                                 whiteSpace: 'nowrap'
//                                                             }}
//                                                         >
//                                                             {movie.title}
//                                                         </Typography>
//                                                         <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//                                                             Added {new Date(movie.createdAt).toLocaleDateString()}
//                                                         </Typography>
//                                                     </Box>
//                                                     {movie.rating && (
//                                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                                             <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
//                                                             <Typography sx={{ color: 'white', fontWeight: 600 }}>
//                                                                 {movie.rating.toFixed(1)}
//                                                             </Typography>
//                                                         </Box>
//                                                     )}
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </Box>
//                                 </Paper>
//                             </Grid>
//                         </Grid>
//                     </>
//                 )}
//             </Box>
//         </Box>
//     );
// }


import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    LinearProgress,
    Avatar,
    Chip
} from "@mui/material";
import {
    Movie as MovieIcon,
    People as PeopleIcon,
    TrendingUp,
    Star,
    CalendarToday
} from "@mui/icons-material";

// Mock API - replace with your actual API calls
const mockApi = {
    get: async (url) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (url.includes('analytics')) {
            return {
                data: {
                    totalUsers: 15,
                    totalMovies: 42,
                    averageRating: 7.8,
                    topRated: [
                        { _id: '1', title: 'The Shawshank Redemption', poster: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', rating: 9.3, releaseDate: '1994-09-23' },
                        { _id: '2', title: 'The Godfather', poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', rating: 9.2, releaseDate: '1972-03-14' },
                        { _id: '3', title: 'The Dark Knight', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0, releaseDate: '2008-07-18' },
                        { _id: '4', title: 'Pulp Fiction', poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', rating: 8.9, releaseDate: '1994-10-14' },
                        { _id: '5', title: 'Forrest Gump', poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', rating: 8.8, releaseDate: '1994-07-06' }
                    ],
                    recentMovies: [
                        { _id: '6', title: 'Oppenheimer', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', rating: 8.5, createdAt: '2024-01-15' },
                        { _id: '7', title: 'Barbie', poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', rating: 7.2, createdAt: '2024-01-14' },
                        { _id: '8', title: 'Killers of the Flower Moon', poster: 'https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg', rating: 8.0, createdAt: '2024-01-13' },
                        { _id: '9', title: 'The Holdovers', poster: 'https://image.tmdb.org/t/p/w500/4K7gQjD019xAs4q1UOZlGX4YkZ1.jpg', rating: 7.9, createdAt: '2024-01-12' },
                        { _id: '10', title: 'Poor Things', poster: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', rating: 8.1, createdAt: '2024-01-11' }
                    ]
                }
            };
        }
        return { data: { movies: [] } };
    }
};

export default function Dashboard() {
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

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const res = await mockApi.get("/analytics/dashboard");
            setStats({
                totalMovies: res.data.totalMovies || 0,
                totalUsers: res.data.totalUsers || 0,
                averageRating: parseFloat(res.data.averageRating) || 0,
                topRatedMovies: res.data.topRated || [],
                recentMovies: res.data.recentMovies || []
            });
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon, title, value, color, subtitle, progress }) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                bgcolor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 3,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${color}20`,
                    borderColor: color,
                    '& .stat-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                    }
                }
            }}
        >
            {/* Gradient Background */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                    pointerEvents: 'none'
                }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#94a3b8',
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                lineHeight: 1,
                                mb: 0.5
                            }}
                        >
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        className="stat-icon"
                        sx={{
                            bgcolor: `${color}20`,
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                {progress !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: '#334155',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: color,
                                    borderRadius: 3
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Paper>
    );

    const MovieListItem = ({ movie, index, showRank = true }) => (
        <Card
            sx={{
                bgcolor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: '#475569',
                    transform: 'translateX(8px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }
            }}
        >
            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                {showRank && (
                    <Box
                        sx={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: '#f59e0b',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                    >
                        #{index + 1}
                    </Box>
                )}

                <Box
                    sx={{
                        width: 50,
                        height: 75,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                    }}
                >
                    <img
                        src={movie.poster || 'https://via.placeholder.com/50x75/333/666?text=No'}
                        alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: 'white',
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 0.5
                        }}
                    >
                        {movie.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {movie.releaseDate && (
                            <Chip
                                icon={<CalendarToday sx={{ fontSize: 14 }} />}
                                label={movie.releaseDate?.split('-')[0]}
                                size="small"
                                sx={{
                                    bgcolor: '#334155',
                                    color: '#94a3b8',
                                    height: 24,
                                    fontSize: '0.75rem'
                                }}
                            />
                        )}
                        {movie.createdAt && (
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Added {new Date(movie.createdAt).toLocaleDateString()}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {movie.rating && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: '#334155',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1
                        }}
                    >
                        <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {movie.rating.toFixed(1)}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 4 }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontWeight: 800,
                            mb: 1,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                        Overview of your movie database and user activity
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Box sx={{
                            display: 'inline-block',
                            width: 60,
                            height: 60,
                            border: '4px solid #334155',
                            borderTopColor: '#f59e0b',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                            }
                        }} />
                        <Typography sx={{ color: '#94a3b8', mt: 2 }}>Loading dashboard...</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <Grid container spacing={3} sx={{ mb: 5 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<MovieIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
                                    title="Total Movies"
                                    value={stats.totalMovies}
                                    color="#f59e0b"
                                    subtitle="in database"
                                    progress={75}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<PeopleIcon sx={{ fontSize: 32, color: '#3b82f6' }} />}
                                    title="Total Users"
                                    value={stats.totalUsers}
                                    color="#3b82f6"
                                    subtitle="registered"
                                    progress={60}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<Star sx={{ fontSize: 32, color: '#fbbf24' }} />}
                                    title="Avg Rating"
                                    value={stats.averageRating.toFixed(1)}
                                    color="#fbbf24"
                                    subtitle="across all movies"
                                    progress={85}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    icon={<TrendingUp sx={{ fontSize: 32, color: '#10b981' }} />}
                                    title="Growth"
                                    value="+24%"
                                    color="#10b981"
                                    subtitle="this month"
                                    progress={24}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            {/* Top Rated Movies */}
                            <Grid item xs={12} lg={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        bgcolor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: 3,
                                        height: '100%'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Box
                                            sx={{
                                                bgcolor: '#fbbf2420',
                                                p: 1,
                                                borderRadius: 2,
                                                display: 'flex'
                                            }}
                                        >
                                            <Star sx={{ fontSize: 24, color: '#fbbf24' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                                Top Rated Movies
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                Highest rated content
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {stats.topRatedMovies.map((movie, index) => (
                                            <MovieListItem key={movie._id} movie={movie} index={index} showRank={true} />
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Recently Added */}
                            <Grid item xs={12} lg={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        bgcolor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: 3,
                                        height: '100%'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Box
                                            sx={{
                                                bgcolor: '#10b98120',
                                                p: 1,
                                                borderRadius: 2,
                                                display: 'flex'
                                            }}
                                        >
                                            <CalendarToday sx={{ fontSize: 24, color: '#10b981' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                                Recently Added
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                Latest additions to database
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {stats.recentMovies.map((movie, index) => (
                                            <MovieListItem key={movie._id} movie={movie} index={index} showRank={false} />
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