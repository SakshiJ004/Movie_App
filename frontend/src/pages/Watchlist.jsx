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
    const [activeTab, setActiveTab] = useState(0);

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
                <Box sx={{
                    maxWidth: '1280px',
                    mx: 'auto',
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1, sm: 1.5 }
                }}>
                    <Typography variant="h4" sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                    }}>
                        My Watchlist
                    </Typography>
                </Box>
            </Box>

            <Box sx={{
                maxWidth: '1280px',
                mx: 'auto',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 2, sm: 3, md: 4 }
            }}>
                {/* Stats Card */}
                <Box sx={{
                    bgcolor: '#1e293b',
                    borderRadius: { xs: 1.5, sm: 2 },
                    p: { xs: 2, sm: 3 },
                    mb: { xs: 3, sm: 4 },
                    border: '1px solid #334155'
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                    }}>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" sx={{
                                color: 'white',
                                fontWeight: 600,
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}>
                                Progress
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: '#94a3b8',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                                {stats.watched} of {stats.total} movies watched
                            </Typography>
                        </Box>
                        <Typography variant="h4" sx={{
                            color: '#f59e0b',
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}>
                            {stats.percentage}%
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={stats.percentage}
                        sx={{
                            height: { xs: 8, sm: 10 },
                            borderRadius: 1,
                            bgcolor: '#334155',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#f59e0b',
                                borderRadius: 1
                            }
                        }}
                    />

                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 2, sm: 3 },
                        mt: { xs: 2, sm: 3 },
                        flexWrap: 'wrap',
                        justifyContent: { xs: 'space-around', sm: 'flex-start' }
                    }}>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="body2" sx={{
                                color: '#94a3b8',
                                mb: 0.5,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                                Total Movies
                            </Typography>
                            <Typography variant="h5" sx={{
                                color: 'white',
                                fontWeight: 600,
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}>
                                {stats.total}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="body2" sx={{
                                color: '#94a3b8',
                                mb: 0.5,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                                Watched
                            </Typography>
                            <Typography variant="h5" sx={{
                                color: '#10b981',
                                fontWeight: 600,
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}>
                                {stats.watched}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="body2" sx={{
                                color: '#94a3b8',
                                mb: 0.5,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                                To Watch
                            </Typography>
                            <Typography variant="h5" sx={{
                                color: '#f59e0b',
                                fontWeight: 600,
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}>
                                {stats.total - stats.watched}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, val) => setActiveTab(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                color: '#94a3b8',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                minWidth: { xs: 100, sm: 120 }
                            },
                            '& .Mui-selected': { color: '#f59e0b' },
                            '& .MuiTabs-indicator': { bgcolor: '#f59e0b' }
                        }}
                    >
                        <Tab label={`All (${watchlist.length})`} />
                        <Tab
                            icon={<CheckCircle sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                            iconPosition="start"
                            label={`Watched (${stats.watched})`}
                        />
                        <Tab
                            icon={<WatchLater sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                            iconPosition="start"
                            label={`To Watch (${stats.total - stats.watched})`}
                        />
                    </Tabs>
                </Box>

                {/* Movie List */}
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 10 } }}>
                        <Typography sx={{
                            color: '#94a3b8',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                            Loading...
                        </Typography>
                    </Box>
                ) : filteredWatchlist.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
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
                    <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 10 } }}>
                        <Typography sx={{
                            color: '#94a3b8',
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            mb: 2
                        }}>
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
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                px: { xs: 2, sm: 3 },
                                py: { xs: 1, sm: 1.25 },
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

