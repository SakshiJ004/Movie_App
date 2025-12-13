import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    LinearProgress,
    Tabs,
    Tab
} from "@mui/material";
import { CheckCircle, WatchLater } from "@mui/icons-material";
import api from "../api/axios";
import MovieCard from "../components/MovieCard";

export default function Watchlist() {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    const [stats, setStats] = useState({ total: 0, watched: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Watched, 2: Unwatched

    useEffect(() => {
        loadWatchlist();
        loadStats();
    }, []);

    const loadWatchlist = async () => {
        try {
            setLoading(true);
            const res = await api.get("/watchlist");
            setWatchlist(res.data);
        } catch (err) {
            console.error("Error loading watchlist:", err);
            if (err.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const res = await api.get("/watchlist/stats");
            setStats(res.data);
        } catch (err) {
            console.error("Error loading stats:", err);
        }
    };

    const filteredWatchlist = watchlist.filter(item => {
        if (activeTab === 1) return item.watched;
        if (activeTab === 2) return !item.watched;
        return true;
    });

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a' }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'black', borderBottom: '1px solid #1e293b' }}>
                <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 1.5 }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        My Watchlist
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 4 }}>
                {/* Stats Card */}
                <Box sx={{
                    bgcolor: '#1e293b',
                    borderRadius: 2,
                    p: 3,
                    mb: 4,
                    border: '1px solid #334155'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                Progress
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                {stats.watched} of {stats.total} movies watched
                            </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                            {stats.percentage}%
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={stats.percentage}
                        sx={{
                            height: 10,
                            borderRadius: 1,
                            bgcolor: '#334155',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#f59e0b',
                                borderRadius: 1
                            }
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
                        <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                                Total Movies
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                                {stats.total}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                                Watched
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 600 }}>
                                {stats.watched}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                                To Watch
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                                {stats.total - stats.watched}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, val) => setActiveTab(val)}
                        sx={{
                            '& .MuiTab-root': {
                                color: '#94a3b8',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem'
                            },
                            '& .Mui-selected': { color: '#f59e0b' },
                            '& .MuiTabs-indicator': { bgcolor: '#f59e0b' }
                        }}
                    >
                        <Tab label={`All (${watchlist.length})`} />
                        <Tab icon={<CheckCircle />} iconPosition="start" label={`Watched (${stats.watched})`} />
                        <Tab icon={<WatchLater />} iconPosition="start" label={`To Watch (${stats.total - stats.watched})`} />
                    </Tabs>
                </Box>

                {/* Movie List */}
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography sx={{ color: '#94a3b8' }}>Loading...</Typography>
                    </Box>
                ) : filteredWatchlist.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredWatchlist.map((item, index) => (
                            item.movie && (
                                <MovieCard
                                    key={item._id}
                                    movie={item.movie}
                                    index={index}
                                    showRank={false}
                                    source="admin"
                                />
                            )
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '1.125rem', mb: 2 }}>
                            {activeTab === 0 && "Your watchlist is empty"}
                            {activeTab === 1 && "No movies watched yet"}
                            {activeTab === 2 && "All movies watched!"}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/search')}
                            sx={{
                                bgcolor: '#f59e0b',
                                color: 'black',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#d97706' }
                            }}
                        >
                            Browse Movies
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}