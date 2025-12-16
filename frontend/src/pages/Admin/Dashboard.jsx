import { useEffect, useState } from "react";
import api from "../../api/axios";

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
            const res = await api.get("/analytics/dashboard");

            const totalMovies = res.data.totalMovies || 0;
            const totalUsers = res.data.totalUsers || 0;
            const avgRating = parseFloat(res.data.averageRating) || 0;

            const topRated = (res.data.topRated || [])
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);

            const recent = (res.data.recentMovies || [])
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setStats({
                totalMovies,
                totalUsers,
                averageRating: avgRating,
                topRatedMovies: topRated,
                recentMovies: recent
            });
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            padding: '1rem 0.75rem'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: window.innerWidth < 640 ? '0 0.5rem' : window.innerWidth < 1024 ? '0 1rem' : '0'
            }}>
                <div style={{
                    marginBottom: window.innerWidth < 640 ? '1.5rem' : '2rem'
                }}>
                    <h1 style={{
                        color: 'white',
                        fontSize: window.innerWidth < 640 ? '1.75rem' : window.innerWidth < 1024 ? '2rem' : '2.5rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Admin Dashboard
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem',
                        margin: 0
                    }}>
                        Overview of your movie database and user activity
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: window.innerWidth < 640 ? '3rem 0' : '5rem 0' }}>
                        <div style={{
                            display: 'inline-block',
                            width: window.innerWidth < 640 ? '40px' : '60px',
                            height: window.innerWidth < 640 ? '40px' : '60px',
                            border: '4px solid #334155',
                            borderTopColor: '#f59e0b',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{
                            color: '#94a3b8',
                            marginTop: '1rem',
                            fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem'
                        }}>Loading dashboard...</p>
                        <style>
                            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                        </style>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth < 640 ? '1fr' : window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: window.innerWidth < 640 ? '1rem' : '1.5rem',
                            marginBottom: window.innerWidth < 640 ? '1.5rem' : '2rem'
                        }}>
                            <StatCard
                                icon="🎬"
                                title="Total Movies"
                                value={stats.totalMovies}
                                color="#f59e0b"
                                subtitle="in database"
                            />
                            <StatCard
                                icon="👥"
                                title="Total Users"
                                value={stats.totalUsers}
                                color="#3b82f6"
                                subtitle="registered"
                            />
                            <StatCard
                                icon="⭐"
                                title="Avg Rating"
                                value={stats.averageRating.toFixed(1)}
                                color="#fbbf24"
                                subtitle="across all movies"
                            />
                            <StatCard
                                icon="📈"
                                title="Growth"
                                value="+24%"
                                color="#10b981"
                                subtitle="this month"
                            />
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : 'repeat(auto-fit, minmax(500px, 1fr))',
                            gap: window.innerWidth < 640 ? '1rem' : '1.5rem'
                        }}>
                            {/* Top Rated */}
                            <MovieListSection
                                title="Top Rated Movies"
                                subtitle="Highest rated content"
                                icon="⭐"
                                color="#fbbf24"
                                movies={stats.topRatedMovies}
                                showRank={true}
                                showDate={false}
                            />

                            {/* Recently Added */}
                            <MovieListSection
                                title="Recently Added"
                                subtitle="Latest additions to database"
                                icon="📅"
                                color="#10b981"
                                movies={stats.recentMovies}
                                showRank={false}
                                showDate={true}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color, subtitle }) {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = window.innerWidth < 640;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: '#1e293b',
                border: `1px solid ${isHovered ? color : '#334155'}`,
                borderRadius: isMobile ? '0.75rem' : '1rem',
                padding: isMobile ? '1.25rem' : '1.5rem',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? `0 12px 24px ${color}33` : 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem' }}>
                <div style={{
                    background: `${color}20`,
                    padding: isMobile ? '0.625rem' : '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: isMobile ? '1.5rem' : '1.75rem'
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        margin: '0 0 0.25rem 0'
                    }}>
                        {title}
                    </p>
                    <h3 style={{
                        color: 'white',
                        fontSize: isMobile ? '1.5rem' : '2rem',
                        fontWeight: '700',
                        margin: '0',
                        lineHeight: 1
                    }}>
                        {value}
                    </h3>
                    {subtitle && (
                        <p style={{
                            color: '#64748b',
                            fontSize: isMobile ? '0.65rem' : '0.7rem',
                            margin: '0.25rem 0 0 0'
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function MovieListSection({ title, subtitle, icon, color, movies, showRank, showDate }) {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    return (
        <div style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: isMobile ? '0.75rem' : '1rem',
            padding: isMobile ? '1.25rem' : '1.5rem'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '0.75rem' : '1rem',
                marginBottom: isMobile ? '1.25rem' : '1.5rem'
            }}>
                <div style={{
                    background: `${color}20`,
                    padding: isMobile ? '0.625rem' : '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: isMobile ? '1.25rem' : '1.5rem'
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{
                        color: 'white',
                        fontSize: isMobile ? '1rem' : isTablet ? '1.125rem' : '1.25rem',
                        fontWeight: '700',
                        margin: '0 0 0.25rem 0'
                    }}>
                        {title}
                    </h3>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        margin: 0
                    }}>
                        {subtitle}
                    </p>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '0.75rem' : '1rem'
            }}>
                {movies.length > 0 ? (
                    movies.map((movie, index) => (
                        <MovieItem
                            key={movie._id}
                            movie={movie}
                            index={index}
                            showRank={showRank}
                            showDate={showDate}
                        />
                    ))
                ) : (
                    <p style={{
                        color: '#64748b',
                        textAlign: 'center',
                        padding: isMobile ? '1.5rem 0' : '2rem 0',
                        fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                        No movies found
                    </p>
                )}
            </div>
        </div>
    );
}

function MovieItem({ movie, index, showRank, showDate }) {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    const getRankColor = (idx) => {
        if (idx === 0) return '#f59e0b';
        if (idx === 1) return '#94a3b8';
        if (idx === 2) return '#cd7f32';
        return '#334155';
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: '#0f172a',
                border: `1px solid ${isHovered ? '#475569' : '#334155'}`,
                borderRadius: '0.5rem',
                padding: isMobile ? '0.75rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '0.75rem' : '1rem',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                cursor: 'pointer'
            }}
        >
            {showRank && (
                <div style={{
                    minWidth: isMobile ? '28px' : '36px',
                    height: isMobile ? '28px' : '36px',
                    borderRadius: '50%',
                    background: getRankColor(index),
                    color: index < 3 ? 'black' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.75rem' : '0.9rem'
                }}>
                    {index + 1}
                </div>
            )}

            <div style={{
                width: isMobile ? '35px' : '45px',
                height: isMobile ? '52px' : '67px',
                borderRadius: '0.25rem',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
                <img
                    src={movie.poster || 'https://via.placeholder.com/45x67/1e293b/64748b?text=No'}
                    alt={movie.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/45x67/1e293b/64748b?text=No';
                    }}
                />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: isMobile ? '0.8rem' : isTablet ? '0.875rem' : '0.95rem',
                    margin: '0 0 0.5rem 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {movie.title}
                </h4>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                }}>
                    {movie.releaseDate && (
                        <span style={{
                            background: '#334155',
                            color: '#94a3b8',
                            padding: isMobile ? '0.2rem 0.4rem' : '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: isMobile ? '0.65rem' : '0.7rem',
                            fontWeight: '500'
                        }}>
                            📅 {movie.releaseDate.split('-')[0]}
                        </span>
                    )}
                    {showDate && movie.createdAt && (
                        <span style={{
                            color: '#64748b',
                            fontSize: isMobile ? '0.65rem' : '0.7rem'
                        }}>
                            {new Date(movie.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: isMobile ? '2-digit' : 'numeric'
                            })}
                        </span>
                    )}
                </div>
            </div>

            {movie.rating && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: '#334155',
                    padding: isMobile ? '0.4rem 0.6rem' : '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>⭐</span>
                    <span style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}>
                        {movie.rating.toFixed(1)}
                    </span>
                </div>
            )}
        </div>
    );
}