// import { useState } from "react";
// import api from "../../api/axios";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Grid,
//   Chip,
//   Alert,
//   Paper,
//   Divider,
//   Container
// } from "@mui/material";
// import { Movie, ImageOutlined, StarOutline, CalendarToday } from "@mui/icons-material";
// import { toast } from "react-toastify";

// export default function AddMovie() {
//   const [movie, setMovie] = useState({
//     id: "",
//     title: "",
//     originalTitle: "",
//     tagline: "",
//     description: "",
//     releaseDate: "",
//     runtime: "",
//     rating: "",
//     voteCount: "",
//     popularity: "",
//     poster: "",
//     backdrop: "",
//     genres: [],
//     imdbId: "",
//     homepage: "",
//     budget: "",
//     revenue: "",
//     status: "",
//     adult: false,
//   });

//   const [genreInput, setGenreInput] = useState("");

//   const handleChange = (key, value) => {
//     setMovie({ ...movie, [key]: value });
//   };

//   const addGenre = () => {
//     if (!genreInput.trim()) return;
//     if (movie.genres.includes(genreInput.trim())) {
//       setError("Genre already added");
//       return;
//     }
//     setMovie({ ...movie, genres: [...movie.genres, genreInput.trim()] });
//     setGenreInput("");
//     setError("");
//   };

//   const removeGenre = (g) => {
//     setMovie({ ...movie, genres: movie.genres.filter((v) => v !== g) });
//   };

//   const submit = async () => {

//     if (!movie.title) {
//       setError("Title is required");
//       return;
//     }

//     try {
//       const payload = {
//         ...movie,
//         id: movie.id ? Number(movie.id) : undefined,
//         runtime: movie.runtime ? Number(movie.runtime) : undefined,
//         rating: movie.rating ? Number(movie.rating) : undefined,
//         voteCount: movie.voteCount ? Number(movie.voteCount) : undefined,
//         popularity: movie.popularity ? Number(movie.popularity) : undefined,
//         budget: movie.budget ? Number(movie.budget) : undefined,
//         revenue: movie.revenue ? Number(movie.revenue) : undefined,
//       };

//       await api.post("/movies", payload);
//       toast.success("Movie added successfully!");

//       setTimeout(() => {
//         setMovie({
//           id: "",
//           title: "",
//           originalTitle: "",
//           tagline: "",
//           description: "",
//           releaseDate: "",
//           runtime: "",
//           rating: "",
//           voteCount: "",
//           popularity: "",
//           poster: "",
//           backdrop: "",
//           genres: [],
//           imdbId: "",
//           homepage: "",
//           budget: "",
//           revenue: "",
//           status: "",
//           adult: false,
//         });
//       }, 1500);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add movie");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         py: 5,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Paper
//           elevation={8}
//           sx={{
//             p: { xs: 3, md: 5 },
//             borderRadius: 3,
//             background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
//             <Movie sx={{ fontSize: 40, color: "#667eea", mr: 2 }} />
//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: 700,
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 backgroundClip: "text",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               Add New Movie
//             </Typography>
//           </Box>

//           <Divider sx={{ mb: 4 }} />

//           <Grid container spacing={3}>
//             {/* LEFT COLUMN - Basic Info */}
//             <Grid item xs={12} md={6}>
//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 3,
//                   borderRadius: 2,
//                   border: "1px solid #e0e0e0",
//                   height: "100%",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{ mb: 3, fontWeight: 600, color: "#667eea" }}
//                 >
//                   📋 Basic Information
//                 </Typography>

//                 <TextField
//                   label="TMDB ID"
//                   fullWidth
//                   type="number"
//                   value={movie.id}
//                   onChange={(e) => handleChange("id", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   helperText="Optional: TMDB movie ID"
//                   variant="outlined"
//                 />

//                 <TextField
//                   label="Title"
//                   fullWidth
//                   value={movie.title}
//                   onChange={(e) => handleChange("title", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   required
//                   variant="outlined"
//                 />

//                 <TextField
//                   label="Original Title"
//                   fullWidth
//                   value={movie.originalTitle}
//                   onChange={(e) => handleChange("originalTitle", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   variant="outlined"
//                 />

//                 <TextField
//                   label="Tagline"
//                   fullWidth
//                   value={movie.tagline}
//                   onChange={(e) => handleChange("tagline", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   variant="outlined"
//                 />

//                 <TextField
//                   label="Description"
//                   multiline
//                   minRows={4}
//                   fullWidth
//                   value={movie.description}
//                   onChange={(e) => handleChange("description", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   variant="outlined"
//                 />

//                 <TextField
//                   label="Release Date"
//                   fullWidth
//                   type="date"
//                   value={movie.releaseDate}
//                   onChange={(e) => handleChange("releaseDate", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   placeholder="YYYY-MM-DD"
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                   InputProps={{
//                     startAdornment: <CalendarToday sx={{ mr: 1, color: "#999" }} />,
//                   }}
//                 />

//                 <TextField
//                   label="Status"
//                   fullWidth
//                   value={movie.status}
//                   onChange={(e) => handleChange("status", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   placeholder="Released, Post Production, etc."
//                   variant="outlined"
//                 />

//                 <TextField
//                   label="Runtime (minutes)"
//                   fullWidth
//                   type="number"
//                   value={movie.runtime}
//                   onChange={(e) => handleChange("runtime", e.target.value)}
//                   variant="outlined"
//                 />
//               </Paper>
//             </Grid>

//             {/* RIGHT COLUMN - Ratings & Financial */}
//             <Grid item xs={12} md={6}>
//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 3,
//                   borderRadius: 2,
//                   border: "1px solid #e0e0e0",
//                   mb: 3,
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{ mb: 3, fontWeight: 600, color: "#764ba2" }}
//                 >
//                   ⭐ Ratings & Popularity
//                 </Typography>

//                 <TextField
//                   label="Rating"
//                   fullWidth
//                   type="number"
//                   inputProps={{ step: 0.1, min: 0, max: 10 }}
//                   value={movie.rating}
//                   onChange={(e) => handleChange("rating", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   variant="outlined"
//                   InputProps={{
//                     startAdornment: <StarOutline sx={{ mr: 1, color: "#ffc107" }} />,
//                   }}
//                 />

//                 <TextField
//                   label="Vote Count"
//                   fullWidth
//                   type="number"
//                   value={movie.voteCount}
//                   onChange={(e) => handleChange("voteCount", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   variant="outlined"
//                 />

//                 <TextField
//                   label="Popularity"
//                   fullWidth
//                   type="number"
//                   inputProps={{ step: 0.1 }}
//                   value={movie.popularity}
//                   onChange={(e) => handleChange("popularity", e.target.value)}
//                   variant="outlined"
//                 />
//               </Paper>

//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 3,
//                   borderRadius: 2,
//                   border: "1px solid #e0e0e0",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{ mb: 3, fontWeight: 600, color: "#4caf50" }}
//                 >
//                   💰 Financial Info
//                 </Typography>

//                 <TextField
//                   label="Budget"
//                   fullWidth
//                   type="number"
//                   value={movie.budget}
//                   onChange={(e) => handleChange("budget", e.target.value)}
//                   sx={{ mb: 2.5 }}
//                   variant="outlined"
//                   helperText="in USD"
//                 />

//                 <TextField
//                   label="Revenue"
//                   fullWidth
//                   type="number"
//                   value={movie.revenue}
//                   onChange={(e) => handleChange("revenue", e.target.value)}
//                   variant="outlined"
//                   helperText="in USD"
//                 />
//               </Paper>
//             </Grid>

//             {/* FULL WIDTH - Media & Links */}
//             <Grid item xs={12}>
//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 3,
//                   borderRadius: 2,
//                   border: "1px solid #e0e0e0",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{ mb: 3, fontWeight: 600, color: "#ff9800" }}
//                 >
//                   🎬 Media & Links
//                 </Typography>

//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Poster URL"
//                       fullWidth
//                       value={movie.poster}
//                       onChange={(e) => handleChange("poster", e.target.value)}
//                       sx={{ mb: 2.5 }}
//                       variant="outlined"
//                       InputProps={{
//                         startAdornment: <ImageOutlined sx={{ mr: 1, color: "#999" }} />,
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Backdrop URL"
//                       fullWidth
//                       value={movie.backdrop}
//                       onChange={(e) => handleChange("backdrop", e.target.value)}
//                       sx={{ mb: 2.5 }}
//                       variant="outlined"
//                       InputProps={{
//                         startAdornment: <ImageOutlined sx={{ mr: 1, color: "#999" }} />,
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="IMDb ID"
//                       fullWidth
//                       value={movie.imdbId}
//                       onChange={(e) => handleChange("imdbId", e.target.value)}
//                       placeholder="tt1234567"
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Homepage URL"
//                       fullWidth
//                       value={movie.homepage}
//                       onChange={(e) => handleChange("homepage", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>

//             {/* GENRES */}
//             <Grid item xs={12}>
//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 3,
//                   borderRadius: 2,
//                   border: "1px solid #e0e0e0",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{ mb: 2, fontWeight: 600, color: "#e91e63" }}
//                 >
//                   🎭 Genres
//                 </Typography>

//                 <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
//                   <TextField
//                     label="Add Genre"
//                     value={genreInput}
//                     onChange={(e) => setGenreInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && addGenre()}
//                     sx={{ flex: 1 }}
//                     variant="outlined"
//                   />
//                   <Button
//                     variant="contained"
//                     onClick={addGenre}
//                     sx={{
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                       px: 4,
//                     }}
//                   >
//                     Add
//                   </Button>
//                 </Box>

//                 <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                   {movie.genres.map((g) => (
//                     <Chip
//                       key={g}
//                       label={g}
//                       onDelete={() => removeGenre(g)}
//                       sx={{
//                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         color: "white",
//                         fontWeight: 500,
//                         "& .MuiChip-deleteIcon": {
//                           color: "rgba(255,255,255,0.7)",
//                           "&:hover": {
//                             color: "white",
//                           },
//                         },
//                       }}
//                     />
//                   ))}
//                   {movie.genres.length === 0 && (
//                     <Typography sx={{ color: "#999", fontStyle: "italic" }}>
//                       No genres added yet
//                     </Typography>
//                   )}
//                 </Box>
//               </Paper>
//             </Grid>

//             {/* POSTER PREVIEW */}
//             {movie.poster && (
//               <Grid item xs={12}>
//                 <Paper
//                   elevation={2}
//                   sx={{
//                     p: 3,
//                     borderRadius: 2,
//                     border: "1px solid #e0e0e0",
//                   }}
//                 >
//                   <Typography
//                     variant="h6"
//                     sx={{ mb: 2, fontWeight: 600, color: "#667eea" }}
//                   >
//                     🖼️ Poster Preview
//                   </Typography>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "center",
//                       p: 2,
//                       background: "#f5f5f5",
//                       borderRadius: 2,
//                     }}
//                   >
//                     <img
//                       src={movie.poster}
//                       alt="poster"
//                       style={{
//                         maxWidth: 250,
//                         borderRadius: 12,
//                         boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//                       }}
//                       onError={(e) => {
//                         e.target.style.display = "none";
//                         setError("Invalid poster URL");
//                       }}
//                     />
//                   </Box>
//                 </Paper>
//               </Grid>
//             )}
//           </Grid>

//           {/* SUBMIT BUTTON */}
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={submit}
//             sx={{
//               mt: 4,
//               py: 2,
//               fontSize: "1.1rem",
//               fontWeight: 600,
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
//                 boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
//               },
//               transition: "all 0.3s ease",
//             }}
//           >
//             Add Movie
//           </Button>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }


import { useState } from "react";
import api from "../../api/axios";
import { toast } from 'react-toastify';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Paper,
  Divider,
  Container,
  IconButton,
  Card,
  CardContent
} from "@mui/material";
import {
  Movie,
  ImageOutlined,
  StarOutline,
  CalendarToday,
  Delete,
  Add,
  ArrowBack
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AddMovie() {
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    id: "",
    title: "",
    originalTitle: "",
    tagline: "",
    description: "",
    releaseDate: "",
    runtime: "",
    rating: "",
    voteCount: "",
    popularity: "",
    poster: "",
    backdrop: "",
    genres: [],
    imdbId: "",
    homepage: "",
    budget: "",
    revenue: "",
    status: "Released",
    adult: false,
    director: { name: "", profilePath: "" },
    cast: [],
    crew: [],
    trailer: { key: "", name: "", site: "YouTube", type: "Trailer" },
    videos: [],
    productionCompanies: []
  });

  const [genreInput, setGenreInput] = useState("");
  const [castInput, setCastInput] = useState({ name: "", character: "", profilePath: "" });
  const [crewInput, setCrewInput] = useState({ name: "", job: "", department: "", profilePath: "" });
  const [videoInput, setVideoInput] = useState({ key: "", name: "", site: "YouTube", type: "Trailer" });
  const [companyInput, setCompanyInput] = useState({ name: "", logo: "", originCountry: "" });

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
    if (movie.genres.includes(genreInput.trim())) {
      toast.error("Genre already added");
      return;
    }
    setMovie({ ...movie, genres: [...movie.genres, genreInput.trim()] });
    setGenreInput("");
  };

  const removeGenre = (g) => {
    setMovie({ ...movie, genres: movie.genres.filter((v) => v !== g) });
  };

  const addCast = () => {
    if (!castInput.name.trim()) {
      toast.error("Cast name is required");
      return;
    }
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
    if (!crewInput.name.trim()) {
      toast.error("Crew name is required");
      return;
    }
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
    if (!videoInput.key.trim()) {
      toast.error("Video key/ID is required");
      return;
    }
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
    if (!companyInput.name.trim()) {
      toast.error("Company name is required");
      return;
    }
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

  const submit = async () => {
    if (!movie.title) {
      toast.error("Title is required");
      return;
    }

    try {
      const payload = {
        ...movie,
        id: movie.id ? Number(movie.id) : undefined,
        runtime: movie.runtime ? Number(movie.runtime) : undefined,
        rating: movie.rating ? Number(movie.rating) : undefined,
        voteCount: movie.voteCount ? Number(movie.voteCount) : undefined,
        popularity: movie.popularity ? Number(movie.popularity) : undefined,
        budget: movie.budget ? Number(movie.budget) : undefined,
        revenue: movie.revenue ? Number(movie.revenue) : undefined,
      };

      await api.post("/movies", payload);
      toast.success("✅ Movie added successfully!");

      setTimeout(() => {
        navigate('/admin/all-movies', { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to add movie");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: '#0f172a', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/all-movies')}
            sx={{ color: '#94a3b8', mb: 2, textTransform: 'none' }}
          >
            Back to Movies
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Movie sx={{ fontSize: 40, color: '#f59e0b' }} />
            <Box>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                Add New Movie
              </Typography>
              <Typography sx={{ color: '#94a3b8', mt: 0.5 }}>
                Fill in all movie details including cast, crew, and media
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                📋 Basic Information
              </Typography>

              <TextField
                fullWidth
                label="TMDB ID (Optional)"
                type="number"
                value={movie.id}
                onChange={(e) => handleChange("id", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Title *"
                value={movie.title}
                onChange={(e) => handleChange("title", e.target.value)}
                sx={{ mb: 2.5 }}
                required
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
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
                label="Original Title"
                value={movie.originalTitle}
                onChange={(e) => handleChange("originalTitle", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Tagline"
                value={movie.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
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
                value={movie.description}
                onChange={(e) => handleChange("description", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
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
                value={movie.releaseDate}
                onChange={(e) => handleChange("releaseDate", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ shrink: true, style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Status"
                value={movie.status}
                onChange={(e) => handleChange("status", e.target.value)}
                sx={{ mb: 2.5 }}
                placeholder="Released, Post Production"
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Runtime (minutes)"
                type="number"
                value={movie.runtime}
                onChange={(e) => handleChange("runtime", e.target.value)}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />
            </Paper>
          </Grid>

          {/* Ratings & Financial */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                ⭐ Ratings & Popularity
              </Typography>

              <TextField
                fullWidth
                label="Rating (0-10)"
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 10 }}
                value={movie.rating}
                onChange={(e) => handleChange("rating", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Vote Count"
                type="number"
                value={movie.voteCount}
                onChange={(e) => handleChange("voteCount", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Popularity"
                type="number"
                inputProps={{ step: 0.1 }}
                value={movie.popularity}
                onChange={(e) => handleChange("popularity", e.target.value)}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                💰 Financial Info
              </Typography>

              <TextField
                fullWidth
                label="Budget (USD)"
                type="number"
                value={movie.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Revenue (USD)"
                type="number"
                value={movie.revenue}
                onChange={(e) => handleChange("revenue", e.target.value)}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                InputProps={{
                  style: { color: 'white' },
                  sx: {
                    bgcolor: '#0f172a',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#475569' }
                  }
                }}
              />
            </Paper>
          </Grid>

          {/* Media URLs */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                🎬 Media & Links
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Poster URL"
                    value={movie.poster}
                    onChange={(e) => handleChange("poster", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#475569' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Backdrop URL"
                    value={movie.backdrop}
                    onChange={(e) => handleChange("backdrop", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#475569' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="IMDb ID"
                    value={movie.imdbId}
                    onChange={(e) => handleChange("imdbId", e.target.value)}
                    placeholder="tt1234567"
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
                      sx: {
                        bgcolor: '#0f172a',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#475569' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Homepage URL"
                    value={movie.homepage}
                    onChange={(e) => handleChange("homepage", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
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
                    style: { color: 'white' },
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
                {movie.genres.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    onDelete={() => removeGenre(g)}
                    sx={{
                      bgcolor: '#334155',
                      color: '#cbd5e1',
                      '& .MuiChip-deleteIcon': { color: '#94a3b8' }
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
                    value={movie.director.name}
                    onChange={(e) => handleNestedChange("director", "name", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
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
                    value={movie.director.profilePath}
                    onChange={(e) => handleNestedChange("director", "profilePath", e.target.value)}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
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

          {/* Cast */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                👥 Cast Members
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Actor Name"
                    value={castInput.name}
                    onChange={(e) => setCastInput({ ...castInput, name: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
                      sx: { bgcolor: '#0f172a', '& fieldset': { borderColor: '#334155' } }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Character Name"
                    value={castInput.character}
                    onChange={(e) => setCastInput({ ...castInput, character: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
                      sx: { bgcolor: '#0f172a', '& fieldset': { borderColor: '#334155' } }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Photo URL"
                    value={castInput.profilePath}
                    onChange={(e) => setCastInput({ ...castInput, profilePath: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    InputProps={{
                      style: { color: 'white' },
                      sx: { bgcolor: '#0f172a', '& fieldset': { borderColor: '#334155' } }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={addCast}
                    sx={{ height: "40px", bgcolor: '#f59e0b', color: 'black', minWidth: 'auto', px: 1 }}
                  >
                    <Add />
                  </Button>
                </Grid>
              </Grid>

              {movie.cast.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {movie.cast.map((member, index) => (
                    <Card key={index} sx={{ bgcolor: '#0f172a', border: '1px solid #334155' }}>
                      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            as {member.character}
                          </Typography>
                        </Box>
                        <IconButton onClick={() => removeCast(index)} sx={{ color: '#f43f5e' }}>
                          <Delete />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Poster Preview */}
          {movie.poster && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  🖼️ Poster Preview
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={movie.poster}
                    alt="poster"
                    style={{
                      maxWidth: 250,
                      borderRadius: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      toast.error("Invalid poster URL");
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/all-movies')}
            sx={{
              color: '#94a3b8',
              borderColor: '#334155',
              textTransform: 'none',
              '&:hover': { borderColor: '#475569', bgcolor: '#1e293b' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={submit}
            sx={{
              bgcolor: '#f59e0b',
              color: 'black',
              fontWeight: 600,
              px: 4,
              textTransform: 'none',
              '&:hover': { bgcolor: '#d97706' }
            }}
          >
            Add Movie
          </Button>
        </Box>
      </Container>
    </Box>
  );
}