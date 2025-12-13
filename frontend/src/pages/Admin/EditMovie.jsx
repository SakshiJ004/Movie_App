import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [genreInput, setGenreInput] = useState("");

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      const res = await api.get(`/movies/${ id}`);
      setMovie(res.data);
    } catch (err) {
      alert("Movie not found in DB");
      navigate("/admin/all-movies");
    }
  };

  const handleChange = (key, value) => {
    setMovie({ ...movie, [key]: value });
  };

  const addGenre = () => {
    if (!genreInput.trim()) return;
    setMovie({ ...movie, genres: [...movie.genres, genreInput.trim()] });
    setGenreInput("");
  };

  const removeGenre = (g) => {
    setMovie({
      ...movie,
      genres: movie.genres.filter((genre) => genre !== g),
    });
  };

  const saveChanges = async () => {
    try {
      await api.put(`/movies/${movie._id}`, movie);
      alert("Movie updated successfully!");
      navigate("/admin/all-movies");
    } catch (err) {
      alert("Error updating movie");
    }
  };

  if (!movie) return <Typography sx={{ p: 3 }}>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Edit Movie
      </Typography>

      <Grid container spacing={2}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title"
            value={movie.title}
            onChange={(e) => handleChange("title", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Tagline"
            value={movie.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={movie.description}
            onChange={(e) => handleChange("description", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Release Date"
            value={movie.releaseDate?.split("T")[0] || ""}
            onChange={(e) => handleChange("releaseDate", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Runtime (minutes)"
            value={movie.runtime}
            onChange={(e) => handleChange("runtime", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Rating"
            value={movie.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Poster URL"
            value={movie.poster}
            onChange={(e) => handleChange("poster", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Backdrop URL"
            value={movie.backdrop}
            onChange={(e) => handleChange("backdrop", e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* GENRES */}
          <Typography sx={{ mb: 1 }}>Genres</Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="Add Genre"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="outlined" onClick={addGenre}>
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {movie.genres?.map((g) => (
              <Chip
                key={g}
                label={g}
                onDelete={() => removeGenre(g)}
                sx={{ bgcolor: "#334155", color: "#cbd5e1" }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Poster Preview */}
      {movie.poster && (
        <Box sx={{ mt: 3 }}>
          <Typography>Poster Preview:</Typography>
          <img
            src={movie.poster}
            alt="poster"
            style={{ width: 180, borderRadius: 8, marginTop: 10 }}
          />
        </Box>
      )}

      {/* Save Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 4, py: 1.2 }}
        onClick={saveChanges}
      >
        Save Changes
      </Button>
    </Box>
  );
}
