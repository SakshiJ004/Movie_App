import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";

export default function MovieRow({ movie, index }) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/movie/${movie._id}`)}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderBottom: "1px solid #333",
        "&:hover": { backgroundColor: "#202020", cursor: "pointer" },
      }}
    >
      {/* Rank Number */}
      <Typography sx={{ width: 50, color: "#bbb" }}>
        #{index + 1}
      </Typography>

      {/* Poster */}
      <Avatar
        variant="rounded"
        src={movie.poster}
        sx={{ width: 60, height: 90, mr: 2 }}
      />

      {/* Title + Meta */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{movie.title}</Typography>
        <Typography sx={{ color: "#999" }}>
          {movie.releaseDate?.slice(0, 4)} • {movie.duration || "N/A"} min
        </Typography>
      </Box>

      {/* Rating */}
      <Typography sx={{ color: "#f5c518", fontSize: "1.1rem" }}>
        ⭐ {movie.rating}
      </Typography>
    </Box>
  );
}
    