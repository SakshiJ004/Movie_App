// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from "@mui/material";
// import { Delete, Edit } from "@mui/icons-material";
// import api from "../../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function AllMovies() {
//   const [movies, setMovies] = useState([]);
//   const [deleteId, setDeleteId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadMovies();
//   }, []);

//   const loadMovies = async () => {
//     const res = await api.get("/movies");
//     setMovies(res.data.movies);
//   };

//   const confirmDelete = async () => {
//     await api.delete(`/movies/${deleteId}`);
//     setDeleteId(null);
//     loadMovies();
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//         All Movies (Admin)
//       </Typography>

//       <Grid container spacing={2}>
//         {movies.map((movie) => (
//           <Grid item xs={12} key={movie.id}>
//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 p: 2,
//                 bgcolor: "#1e293b",
//                 borderRadius: 2,
//                 border: "1px solid #334155",
//               }}
//             >
//               {/* Poster */}
//               <img
//                 src={movie.poster}
//                 alt={movie.title}
//                 style={{ width: 100, height: 150, borderRadius: 6 }}
//               />

//               {/* Movie Details */}
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
//                   {movie.title}
//                 </Typography>

//                 <Typography variant="body2" sx={{ color: "#94a3b8" }}>
//                   ⭐ Rating: {movie.rating}
//                 </Typography>

//                 <Typography variant="body2" sx={{ color: "#94a3b8" }}>
//                   Release: {movie.releaseDate?.split("T")[0]}
//                 </Typography>

//                 {/* Genres */}
//                 <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
//                   {movie.genres?.map((genre) => (
//                     <Box
//                       key={genre}
//                       sx={{
//                         bgcolor: "#334155",
//                         color: "#cbd5e1",
//                         px: 1,
//                         py: 0.3,
//                         borderRadius: 1,
//                         fontSize: "0.75rem",
//                       }}
//                     >
//                       {genre}
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>

//               {/* Actions */}
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//                 <IconButton
//                   sx={{ color: "#60a5fa" }}
//                   onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
//                 >
//                   <Edit />
//                 </IconButton>

//                 <IconButton
//                   sx={{ color: "#f43f5e" }}
//                   onClick={() => setDeleteId(movie.id)}
//                 >
//                   <Delete />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
//         <DialogTitle>Delete Movie?</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this movie? This action cannot be undone.
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteId(null)}>Cancel</Button>
//           <Button color="error" onClick={confirmDelete}>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }



import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Menu,
  MenuItem,
  Pagination
} from "@mui/material";
import {
  Delete,
  Edit,
  Search as SearchIcon,
  FilterList,
  Sort,
  Add,
  Star,
  KeyboardArrowDown
} from "@mui/icons-material";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [allGenres, setAllGenres] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  useEffect(() => {
    loadMovies();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [movies, searchQuery, selectedGenre, sortBy]);

  const loadMovies = async () => {
    try {
      const res = await api.get("/movies", {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      const movieData = res.data.movies || [];
      setMovies(movieData);
      setTotalPages(res.data.totalPages || 1);

      // Extract unique genres
      const genres = new Set();
      movieData.forEach(m => m.genres?.forEach(g => genres.add(g)));
      setAllGenres([...genres]);
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...movies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter(m => m.genres?.includes(selectedGenre));
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "title":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "releaseDate":
        filtered.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilteredMovies(filtered);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/movies/${deleteId}`);
      toast.success("Movie deleted successfully!");
      setDeleteId(null);
      loadMovies();
    } catch (error) {
      toast.error("Failed to delete movie")
      console.error("Error deleting movie:", error);
    }
  };

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a' }}>
      {/* Header */}
      <Box sx={{
        bgcolor: 'black',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 64,
        zIndex: 40
      }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Movie Management
              </Typography>
              <Typography sx={{ color: '#94a3b8', mt: 0.5 }}>
                Total: {movies.length} movies
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/admin/add')}
              sx={{
                bgcolor: '#f59e0b',
                color: 'black',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              Add New Movie
            </Button>
          </Box>

          {/* Filters Bar */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Search */}
            <TextField
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#1e293b',
                  color: 'white',
                  '& fieldset': { borderColor: '#334155' },
                  '&:hover fieldset': { borderColor: '#475569' },
                  '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                )
              }}
            />

            {/* Sort Dropdown */}
            <Button
              endIcon={<KeyboardArrowDown />}
              onClick={handleSortMenuOpen}
              sx={{
                bgcolor: '#1e293b',
                color: 'white',
                border: '1px solid #334155',
                textTransform: 'none',
                px: 2,
                '&:hover': { bgcolor: '#334155' }
              }}
            >
              <Sort sx={{ mr: 1, fontSize: 18 }} />
              Sort: {sortBy === "rating" ? "Rating" : sortBy === "title" ? "Title" : sortBy === "releaseDate" ? "Release Date" : "Latest"}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSortMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: '#1e293b',
                  color: 'white',
                  border: '1px solid #334155'
                }
              }}
            >
              <MenuItem onClick={() => { setSortBy("createdAt"); handleSortMenuClose(); }}>
                Latest Added
              </MenuItem>
              <MenuItem onClick={() => { setSortBy("rating"); handleSortMenuClose(); }}>
                Highest Rating
              </MenuItem>
              <MenuItem onClick={() => { setSortBy("title"); handleSortMenuClose(); }}>
                Title (A-Z)
              </MenuItem>
              <MenuItem onClick={() => { setSortBy("releaseDate"); handleSortMenuClose(); }}>
                Release Date
              </MenuItem>
            </Menu>
          </Box>

          {/* Genre Filter Chips */}
          {allGenres.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip
                label="All Genres"
                onClick={() => setSelectedGenre("")}
                sx={{
                  bgcolor: !selectedGenre ? '#f59e0b' : '#1e293b',
                  color: !selectedGenre ? 'black' : '#cbd5e1',
                  fontWeight: !selectedGenre ? 600 : 400,
                  border: '1px solid #334155',
                  '&:hover': { bgcolor: !selectedGenre ? '#d97706' : '#334155' }
                }}
              />
              {allGenres.slice(0, 8).map(genre => (
                <Chip
                  key={genre}
                  label={genre}
                  onClick={() => setSelectedGenre(genre)}
                  sx={{
                    bgcolor: selectedGenre === genre ? '#f59e0b' : '#1e293b',
                    color: selectedGenre === genre ? 'black' : '#cbd5e1',
                    fontWeight: selectedGenre === genre ? 600 : 400,
                    border: '1px solid #334155',
                    '&:hover': { bgcolor: selectedGenre === genre ? '#d97706' : '#334155' }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Movies Grid */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: 4 }}>
        {filteredMovies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              No movies found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                <Card
                  sx={{
                    bgcolor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                      borderColor: '#475569'
                    }
                  }}
                >
                  {/* Movie Poster */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="320"
                      image={movie.poster || 'https://via.placeholder.com/300x450/333/666?text=No+Image'}
                      alt={movie.title}
                      sx={{ objectFit: 'cover' }}
                    />

                    {/* Rating Badge */}
                    {movie.rating && (
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
                          {movie.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    )}

                    {/* Action Buttons Overlay */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      '&:hover': { opacity: 1 }
                    }}>
                      <IconButton
                        onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
                        sx={{
                          bgcolor: '#60a5fa',
                          color: 'white',
                          '&:hover': { bgcolor: '#3b82f6' }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteId(movie._id)}
                        sx={{
                          bgcolor: '#f43f5e',
                          color: 'white',
                          '&:hover': { bgcolor: '#e11d48' }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Movie Info */}
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {movie.releaseDate && (
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          {movie.releaseDate.split('-')[0]}
                        </Typography>
                      )}
                      {movie.runtime && (
                        <>
                          <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#475569' }} />
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {movie.runtime} min
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Genres */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {movie.genres?.slice(0, 3).map((genre, i) => (
                        <Chip
                          key={i}
                          label={genre}
                          size="small"
                          sx={{
                            bgcolor: '#334155',
                            color: '#cbd5e1',
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#cbd5e1',
                  borderColor: '#334155',
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>
          Delete Movie?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1' }}>
            Are you sure you want to delete this movie? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{ color: '#94a3b8', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              bgcolor: '#f43f5e',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: '#e11d48' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}