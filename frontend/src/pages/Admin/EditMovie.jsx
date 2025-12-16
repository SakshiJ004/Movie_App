// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Chip,
//   Grid,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../api/axios";

// export default function EditMovie() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [movie, setMovie] = useState(null);
//   const [genreInput, setGenreInput] = useState("");

//   useEffect(() => {
//     loadMovie();
//   }, [id]);

//   const loadMovie = async () => {
//     try {
//       const res = await api.get(`/movies/${ id}`);
//       setMovie(res.data);
//     } catch (err) {
//       alert("Movie not found in DB");
//       navigate("/admin/all-movies");
//     }
//   };

//   const handleChange = (key, value) => {
//     setMovie({ ...movie, [key]: value });
//   };

//   const addGenre = () => {
//     if (!genreInput.trim()) return;
//     setMovie({ ...movie, genres: [...movie.genres, genreInput.trim()] });
//     setGenreInput("");
//   };

//   const removeGenre = (g) => {
//     setMovie({
//       ...movie,
//       genres: movie.genres.filter((genre) => genre !== g),
//     });
//   };

//   const saveChanges = async () => {
//     try {
//       await api.put(`/movies/${movie._id}`, movie);
//       alert("Movie updated successfully!");
//       navigate("/admin/all-movies");
//     } catch (err) {
//       alert("Error updating movie");
//     }
//   };

//   if (!movie) return <Typography sx={{ p: 3 }}>Loading...</Typography>;

//   return (
//     <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//         Edit Movie
//       </Typography>

//       <Grid container spacing={2}>
//         {/* LEFT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             label="Title"
//             value={movie.title}
//             onChange={(e) => handleChange("title", e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             label="Tagline"
//             value={movie.tagline}
//             onChange={(e) => handleChange("tagline", e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             multiline
//             minRows={3}
//             label="Description"
//             value={movie.description}
//             onChange={(e) => handleChange("description", e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             label="Release Date"
//             value={movie.releaseDate?.split("T")[0] || ""}
//             onChange={(e) => handleChange("releaseDate", e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             label="Runtime (minutes)"
//             value={movie.runtime}
//             onChange={(e) => handleChange("runtime", e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             label="Rating"
//             value={movie.rating}
//             onChange={(e) => handleChange("rating", e.target.value)}
//             sx={{ mb: 2 }}
//           />
//         </Grid>

//         {/* RIGHT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             label="Poster URL"
//             value={movie.poster}
//             onChange={(e) => handleChange("poster", e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             label="Backdrop URL"
//             value={movie.backdrop}
//             onChange={(e) => handleChange("backdrop", e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           {/* GENRES */}
//           <Typography sx={{ mb: 1 }}>Genres</Typography>
//           <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
//             <TextField
//               label="Add Genre"
//               value={genreInput}
//               onChange={(e) => setGenreInput(e.target.value)}
//               sx={{ flex: 1 }}
//             />
//             <Button variant="outlined" onClick={addGenre}>
//               Add
//             </Button>
//           </Box>

//           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//             {movie.genres?.map((g) => (
//               <Chip
//                 key={g}
//                 label={g}
//                 onDelete={() => removeGenre(g)}
//                 sx={{ bgcolor: "#334155", color: "#cbd5e1" }}
//               />
//             ))}
//           </Box>
//         </Grid>
//       </Grid>

//       {/* Poster Preview */}
//       {movie.poster && (
//         <Box sx={{ mt: 3 }}>
//           <Typography>Poster Preview:</Typography>
//           <img
//             src={movie.poster}
//             alt="poster"
//             style={{ width: 180, borderRadius: 8, marginTop: 10 }}
//           />
//         </Box>
//       )}

//       {/* Save Button */}
//       <Button
//         variant="contained"
//         fullWidth
//         sx={{ mt: 4, py: 1.2 }}
//         onClick={saveChanges}
//       >
//         Save Changes
//       </Button>
//     </Box>
//   );
// }



import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  Paper,
  Alert,
  IconButton,
  Card,
  CardContent,
  Divider,
  Container
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Delete,
  Add,
  Movie as MovieIcon,
  ImageOutlined,
  StarOutline,
  CalendarToday
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [genreInput, setGenreInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cast and crew inputs
  const [castInput, setCastInput] = useState({
    name: "",
    character: "",
    profilePath: ""
  });

  const [crewInput, setCrewInput] = useState({
    name: "",
    job: "",
    department: "",
    profilePath: ""
  });

  const [videoInput, setVideoInput] = useState({
    key: "",
    name: "",
    site: "YouTube",
    type: "Trailer"
  });

  const [companyInput, setCompanyInput] = useState({
    name: "",
    logo: "",
    originCountry: ""
  });

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/movies/${id}`);
      const movieData = res.data.movie || res.data;

      // Ensure all fields exist
      setMovie({
        ...movieData,
        cast: movieData.cast || [],
        crew: movieData.crew || [],
        videos: movieData.videos || [],
        productionCompanies: movieData.productionCompanies || [],
        director: movieData.director || { name: "", profilePath: "" },
        trailer: movieData.trailer || { key: "", name: "", site: "YouTube" }
      });
    } catch (err) {
      setError("Movie not found");
      setTimeout(() => navigate("/admin/all-movies"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setMovie({ ...movie, [key]: value });
  };

  const handleNestedChange = (parent, key, value) => {
    setMovie({
      ...movie,
      [parent]: { ...movie[parent], [key]: value }
    });
  };

  const addGenre = () => {
    if (!genreInput.trim()) return;
    if (movie.genres?.includes(genreInput.trim())) {
      setError("Genre already added");
      return;
    }
    setMovie({ ...movie, genres: [...(movie.genres || []), genreInput.trim()] });
    setGenreInput("");
    setError("");
  };

  const removeGenre = (g) => {
    setMovie({
      ...movie,
      genres: movie.genres.filter((genre) => genre !== g),
    });
  };

  const addCast = () => {
    if (!castInput.name.trim()) return;
    setMovie({
      ...movie,
      cast: [...movie.cast, { ...castInput, order: movie.cast.length }]
    });
    setCastInput({ name: "", character: "", profilePath: "" });
  };

  const removeCast = (index) => {
    setMovie({
      ...movie,
      cast: movie.cast.filter((_, i) => i !== index)
    });
  };

  const addCrew = () => {
    if (!crewInput.name.trim()) return;
    setMovie({
      ...movie,
      crew: [...movie.crew, crewInput]
    });
    setCrewInput({ name: "", job: "", department: "", profilePath: "" });
  };

  const removeCrew = (index) => {
    setMovie({
      ...movie,
      crew: movie.crew.filter((_, i) => i !== index)
    });
  };

  const addVideo = () => {
    if (!videoInput.key.trim()) return;
    const videos = [...movie.videos, videoInput];
    setMovie({
      ...movie,
      videos,
      trailer: movie.trailer.key ? movie.trailer : videoInput
    });
    setVideoInput({ key: "", name: "", site: "YouTube", type: "Trailer" });
  };

  const removeVideo = (index) => {
    setMovie({
      ...movie,
      videos: movie.videos.filter((_, i) => i !== index)
    });
  };

  const addCompany = () => {
    if (!companyInput.name.trim()) return;
    setMovie({
      ...movie,
      productionCompanies: [...movie.productionCompanies, companyInput]
    });
    setCompanyInput({ name: "", logo: "", originCountry: "" });
  };

  const removeCompany = (index) => {
    setMovie({
      ...movie,
      productionCompanies: movie.productionCompanies.filter((_, i) => i !== index)
    });
  };

  // const saveChanges = async () => {
  //   if (!movie.title) {
  //     toast.error("Title is required");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await api.put(`/movies/${movie._id}`, movie);
  //     toast.success("Movie updated successfully!");
  //     setTimeout(() => navigate("/admin/all-movies"), 1500);
  //   } catch (err) {
  //     toast.error("Error updating movie");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const saveChanges = async () => {
    if (!movie.title) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      // Only send the fields that matter
      const payload = {
        title: movie.title,
        tagline: movie.tagline,
        description: movie.description,
        releaseDate: movie.releaseDate,
        runtime: movie.runtime,
        rating: movie.rating,
        poster: movie.poster,
        backdrop: movie.backdrop,
        budget: movie.budget,
        revenue: movie.revenue,
        genres: movie.genres,
        director: {
          name: movie.director?.name,
          profilePath: movie.director?.profilePath
        },
        cast: movie.cast.map(c => ({
          name: c.name,
          character: c.character
        })),
        crew: movie.crew.map(c => ({
          name: c.name,
          job: c.job,
          department: c.department
        })),
        videos: movie.videos.map(v => ({
          key: v.key,
          name: v.name,
          site: v.site,
          type: v.type
        })),
        productionCompanies: movie.productionCompanies.map(p => ({
          name: p.name,
          logo: p.logo,
          originCountry: p.originCountry
        }))
      };


      await api.put(`/movies/${movie._id}`, payload);
      toast.success("Movie updated successfully!");
      setTimeout(() => navigate("/admin/all-movies"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Error updating movie");
    } finally {
      setLoading(false);
    }
  };


  if (loading && !movie) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'white' }}>Loading...</Typography>
      </Box>
    );
  }

  if (!movie) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: '#0f172a', py: 4 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/all-movies')}
            sx={{ color: '#94a3b8', mb: 2, textTransform: 'none', fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Back to Movies
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            <MovieIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#f59e0b' }} />
            <Box>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Edit Movie
              </Typography>
              <Typography sx={{ color: '#94a3b8', mt: 0.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Update movie information and details
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Basic Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{
                color: 'white', fontWeight: 600, mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
              }}>
                📋 Basic Information
              </Typography>

              <TextField
                fullWidth
                label="Title"
                value={movie.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                sx={{ mb: 2.5 }}
                required
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Tagline"
                value={movie.tagline || ""}
                onChange={(e) => handleChange("tagline", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Description"
                value={movie.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Release Date"
                type="date"
                value={movie.releaseDate?.split("T")[0] || ""}
                onChange={(e) => handleChange("releaseDate", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ shrink: true, style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Runtime (min)"
                    type="number"
                    value={movie.runtime || ""}
                    onChange={(e) => handleChange("runtime", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#475569' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Rating"
                    type="number"
                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                    value={movie.rating || ""}
                    onChange={(e) => handleChange("rating", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#475569' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Media & Financial */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                🎬 Media
              </Typography>

              <TextField
                fullWidth
                label="Poster URL"
                value={movie.poster || ""}
                onChange={(e) => handleChange("poster", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Backdrop URL"
                value={movie.backdrop || ""}
                onChange={(e) => handleChange("backdrop", e.target.value)}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />
            </Paper>

            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                💰 Financial
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Budget"
                    type="number"
                    value={movie.budget || ""}
                    onChange={(e) => handleChange("budget", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#475569' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Revenue"
                    type="number"
                    value={movie.revenue || ""}
                    onChange={(e) => handleChange("revenue", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#475569' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Genres */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                🎭 Genres
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  label="Add Genre"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addGenre()}
                  sx={{ flex: 1 }}
                  size="small"
                  InputLabelProps={{ style: { color: '#94a3b8' } }}
                  InputProps={{
                    style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                    sx: {
                      bgcolor: '#0f172a',
                      '& fieldset': { borderColor: '#334155' }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={addGenre}
                  startIcon={<Add />}
                  sx={{ bgcolor: '#f59e0b', color: 'black', '&:hover': { bgcolor: '#d97706' } }}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {movie.genres?.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    onDelete={() => removeGenre(g)}
                    sx={{
                      bgcolor: '#334155',
                      color: '#cbd5e1',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: 28, sm: 32 },
                      '& .MuiChip-deleteIcon': { color: '#94a3b8', fontSize: { xs: 16, sm: 18 } }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Director */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                🎬 Director
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Director Name"
                    value={movie.director?.name || ""}
                    onChange={(e) => handleNestedChange("director", "name", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Director Photo URL"
                    value={movie.director?.profilePath || ""}
                    onChange={(e) => handleNestedChange("director", "profilePath", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white', fontSize: window.innerWidth < 640 ? '0.875rem' : '1rem' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Poster Preview */}
          {movie.poster && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  🖼️ Poster Preview
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 1, sm: 2 } }}>
                  <img
                    src={movie.poster}
                    alt="poster"
                    style={{
                      maxWidth: window.innerWidth < 640 ? 180 : 250,
                      borderRadius: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 },
          mt: { xs: 3, sm: 4 },
          justifyContent: 'flex-end'
        }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/all-movies')}
            sx={{
              color: '#94a3b8',
              borderColor: '#334155',
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { borderColor: '#475569', bgcolor: '#1e293b' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveChanges}
            disabled={loading}
            sx={{
              bgcolor: '#f59e0b',
              color: 'black',
              fontWeight: 600,
              px: { xs: 3, sm: 4 },
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { bgcolor: '#d97706' },
              '&:disabled': { bgcolor: '#334155', color: '#64748b' }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}