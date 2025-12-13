import { useState } from "react";
import api from "../../api/axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Alert,
  Paper,
  Divider,
  Container
} from "@mui/material";
import { Movie, ImageOutlined, StarOutline, CalendarToday } from "@mui/icons-material";

export default function AddMovie() {
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
    status: "",
    adult: false,
  });

  const [genreInput, setGenreInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (key, value) => {
    setMovie({ ...movie, [key]: value });
  };

  const addGenre = () => {
    if (!genreInput.trim()) return;
    if (movie.genres.includes(genreInput.trim())) {
      setError("Genre already added");
      return;
    }
    setMovie({ ...movie, genres: [...movie.genres, genreInput.trim()] });
    setGenreInput("");
    setError("");
  };

  const removeGenre = (g) => {
    setMovie({ ...movie, genres: movie.genres.filter((v) => v !== g) });
  };

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!movie.title) {
      setError("Title is required");
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
      setSuccess("Movie added successfully!");
      
      setTimeout(() => {
        setMovie({
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
          status: "",
          adult: false,
        });
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Movie sx={{ fontSize: 40, color: "#667eea", mr: 2 }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Add New Movie
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

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

          <Grid container spacing={3}>
            {/* LEFT COLUMN - Basic Info */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: "#667eea" }}
                >
                  📋 Basic Information
                </Typography>

                <TextField
                  label="TMDB ID"
                  fullWidth
                  type="number"
                  value={movie.id}
                  onChange={(e) => handleChange("id", e.target.value)}
                  sx={{ mb: 2.5 }}
                  helperText="Optional: TMDB movie ID"
                  variant="outlined"
                />

                <TextField
                  label="Title"
                  fullWidth
                  value={movie.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  sx={{ mb: 2.5 }}
                  required
                  variant="outlined"
                />

                <TextField
                  label="Original Title"
                  fullWidth
                  value={movie.originalTitle}
                  onChange={(e) => handleChange("originalTitle", e.target.value)}
                  sx={{ mb: 2.5 }}
                  variant="outlined"
                />

                <TextField
                  label="Tagline"
                  fullWidth
                  value={movie.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  sx={{ mb: 2.5 }}
                  variant="outlined"
                />

                <TextField
                  label="Description"
                  multiline
                  minRows={4}
                  fullWidth
                  value={movie.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  sx={{ mb: 2.5 }}
                  variant="outlined"
                />

                <TextField
                  label="Release Date"
                  fullWidth
                  value={movie.releaseDate}
                  onChange={(e) => handleChange("releaseDate", e.target.value)}
                  sx={{ mb: 2.5 }}
                  placeholder="YYYY-MM-DD"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, color: "#999" }} />,
                  }}
                />

                <TextField
                  label="Status"
                  fullWidth
                  value={movie.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  sx={{ mb: 2.5 }}
                  placeholder="Released, Post Production, etc."
                  variant="outlined"
                />

                <TextField
                  label="Runtime (minutes)"
                  fullWidth
                  type="number"
                  value={movie.runtime}
                  onChange={(e) => handleChange("runtime", e.target.value)}
                  variant="outlined"
                />
              </Paper>
            </Grid>

            {/* RIGHT COLUMN - Ratings & Financial */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: "#764ba2" }}
                >
                  ⭐ Ratings & Popularity
                </Typography>

                <TextField
                  label="Rating"
                  fullWidth
                  type="number"
                  inputProps={{ step: 0.1, min: 0, max: 10 }}
                  value={movie.rating}
                  onChange={(e) => handleChange("rating", e.target.value)}
                  sx={{ mb: 2.5 }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <StarOutline sx={{ mr: 1, color: "#ffc107" }} />,
                  }}
                />

                <TextField
                  label="Vote Count"
                  fullWidth
                  type="number"
                  value={movie.voteCount}
                  onChange={(e) => handleChange("voteCount", e.target.value)}
                  sx={{ mb: 2.5 }}
                  variant="outlined"
                />

                <TextField
                  label="Popularity"
                  fullWidth
                  type="number"
                  inputProps={{ step: 0.1 }}
                  value={movie.popularity}
                  onChange={(e) => handleChange("popularity", e.target.value)}
                  variant="outlined"
                />
              </Paper>

              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: "#4caf50" }}
                >
                  💰 Financial Info
                </Typography>

                <TextField
                  label="Budget"
                  fullWidth
                  type="number"
                  value={movie.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  sx={{ mb: 2.5 }}
                  variant="outlined"
                  helperText="in USD"
                />

                <TextField
                  label="Revenue"
                  fullWidth
                  type="number"
                  value={movie.revenue}
                  onChange={(e) => handleChange("revenue", e.target.value)}
                  variant="outlined"
                  helperText="in USD"
                />
              </Paper>
            </Grid>

            {/* FULL WIDTH - Media & Links */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: "#ff9800" }}
                >
                  🎬 Media & Links
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Poster URL"
                      fullWidth
                      value={movie.poster}
                      onChange={(e) => handleChange("poster", e.target.value)}
                      sx={{ mb: 2.5 }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <ImageOutlined sx={{ mr: 1, color: "#999" }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Backdrop URL"
                      fullWidth
                      value={movie.backdrop}
                      onChange={(e) => handleChange("backdrop", e.target.value)}
                      sx={{ mb: 2.5 }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <ImageOutlined sx={{ mr: 1, color: "#999" }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="IMDb ID"
                      fullWidth
                      value={movie.imdbId}
                      onChange={(e) => handleChange("imdbId", e.target.value)}
                      placeholder="tt1234567"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Homepage URL"
                      fullWidth
                      value={movie.homepage}
                      onChange={(e) => handleChange("homepage", e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* GENRES */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "#e91e63" }}
                >
                  🎭 Genres
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    label="Add Genre"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addGenre()}
                    sx={{ flex: 1 }}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    onClick={addGenre}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      px: 4,
                    }}
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
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontWeight: 500,
                        "& .MuiChip-deleteIcon": {
                          color: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            color: "white",
                          },
                        },
                      }}
                    />
                  ))}
                  {movie.genres.length === 0 && (
                    <Typography sx={{ color: "#999", fontStyle: "italic" }}>
                      No genres added yet
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* POSTER PREVIEW */}
            {movie.poster && (
              <Grid item xs={12}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "#667eea" }}
                  >
                    🖼️ Poster Preview
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 2,
                      background: "#f5f5f5",
                      borderRadius: 2,
                    }}
                  >
                    <img
                      src={movie.poster}
                      alt="poster"
                      style={{
                        maxWidth: 250,
                        borderRadius: 12,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        setError("Invalid poster URL");
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* SUBMIT BUTTON */}
          <Button
            variant="contained"
            fullWidth
            onClick={submit}
            sx={{
              mt: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add Movie
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}