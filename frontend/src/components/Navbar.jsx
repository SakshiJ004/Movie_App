// src/components/Navbar.jsx
import { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  alpha,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Movie as MovieIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  VideoLibrary as VideoLibraryIcon,
  PlaylistAdd as PlaylistAddIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "black",
        borderBottom: "1px solid #1e293b",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          py: 1,
          minHeight: { xs: 64, sm: 70 },
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "#f59e0b",
            fontWeight: "bold",
            fontSize: "1.5rem",
            flexShrink: 0,
          }}
        >
          <MovieIcon sx={{ fontSize: 32 }} />
          <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
            MovieApp
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flexGrow: 1,
            maxWidth: 600,
            display: "flex",
            alignItems: "center",
            bgcolor: "#1e293b",
            borderRadius: 3,
            border: "1px solid #334155",
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#f59e0b",
              boxShadow: "0 0 0 1px #f59e0b",
            },
            "&:focus-within": {
              borderColor: "#f59e0b",
              boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.3)",
            },
          }}
        >
          <IconButton type="submit" sx={{ p: 1.5, color: "#94a3b8" }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search movies, actors, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: "white",
              flex: 1,
              "& .MuiInputBase-input": { py: 1 },
            }}
          />
        </Box>

        {/* Right Side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          {/* +Movies Dropdown (Only for Admin) */}
          {user?.role === "admin" && (
            <>
              <Button
                onMouseEnter={handleMenuOpen}
                onClick={handleMenuOpen}
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: "#f59e0b",
                  color: "black",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 3,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#d97706" },
                }}
              >
                Movies
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                MenuListProps={{
                  onMouseLeave: handleMenuClose,
                  sx: { bgcolor: "#1e293b", border: "1px solid #334155" },
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    bgcolor: "#1e293b",
                    color: "white",
                    borderRadius: 2,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem
                  component={Link}
                  to="/admin/add"
                  onClick={handleMenuClose}
                  sx={{ "&:hover": { bgcolor: "#334155" } }}
                >
                  <ListItemIcon sx={{ color: "#f59e0b" }}>
                    <PlaylistAddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Add Movie" />
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/admin/all-movies"
                  onClick={handleMenuClose}
                  sx={{ "&:hover": { bgcolor: "#334155" } }}
                >
                  <ListItemIcon sx={{ color: "#f59e0b" }}>
                    <VideoLibraryIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="All Movies" />
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Auth Section */}
          {!token ? (
            <>
              <Button component={Link} to="/login" sx={{ color: "white", textTransform: "none" }}>
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                sx={{
                  color: "#f59e0b",
                  borderColor: "#f59e0b",
                  textTransform: "none",
                  "&:hover": { borderColor: "#d97706", bgcolor: "rgba(245,158,11,0.1)" },
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "#f59e0b",
                  color: "black",
                  fontWeight: "bold",
                  width: 40,
                  height: 40,
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <Button
                onClick={logout}
                startIcon={<LogoutIcon />}
                sx={{
                  color: "white",
                  textTransform: "none",
                  "&:hover": { bgcolor: alpha("#f59e0b", 0.15) },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}