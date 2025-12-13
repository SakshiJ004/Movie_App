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
  DialogActions
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const res = await api.get("/movies");
    setMovies(res.data.movies);
  };

  const confirmDelete = async () => {
    await api.delete(`/movies/${deleteId}`);
    setDeleteId(null);
    loadMovies();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        All Movies (Admin)
      </Typography>

      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item xs={12} key={movie.id}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                bgcolor: "#1e293b",
                borderRadius: 2,
                border: "1px solid #334155",
              }}
            >
              {/* Poster */}
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: 100, height: 150, borderRadius: 6 }}
              />

              {/* Movie Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                  {movie.title}
                </Typography>

                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  ⭐ Rating: {movie.rating}
                </Typography>

                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  Release: {movie.releaseDate?.split("T")[0]}
                </Typography>

                {/* Genres */}
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  {movie.genres?.map((genre) => (
                    <Box
                      key={genre}
                      sx={{
                        bgcolor: "#334155",
                        color: "#cbd5e1",
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      {genre}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <IconButton
                  sx={{ color: "#60a5fa" }}
                  onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
                >
                  <Edit />
                </IconButton>

                <IconButton
                  sx={{ color: "#f43f5e" }}
                  onClick={() => setDeleteId(movie.id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Movie?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this movie? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
