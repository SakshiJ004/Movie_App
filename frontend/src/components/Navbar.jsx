import { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Drawer,
  List,
  ListItem,
  Divider
} from "@mui/material";
import {
  Search as SearchIcon,
  Movie as MovieIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  VideoLibrary as VideoLibraryIcon,
  PlaylistAdd as PlaylistAddIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileDrawerOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
            gap: { xs: 1, sm: 2, md: 3 },
            py: { xs: 0.5, sm: 1 },
            minHeight: { xs: 56, sm: 64, md: 70 },
            px: { xs: 1, sm: 2 }
          }}
        >
          {/* Mobile Menu Icon */}
          <IconButton
            sx={{
              color: 'white',
              display: { xs: 'flex', md: 'none' },
              p: { xs: 0.5, sm: 1 }
            }}
            onClick={() => setMobileDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              textDecoration: "none",
              color: "#f59e0b",
              fontWeight: "bold",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              flexShrink: 0,
            }}
          >
            <MovieIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: { sm: "1.25rem", md: "1.5rem" }
              }}
            >
              MovieApp
            </Typography>
          </Box>

          {/* Search Bar - Hidden on mobile */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flexGrow: 1,
              maxWidth: { sm: 400, md: 600 },
              display: { xs: "none", sm: "flex" },
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
            <IconButton
              type="submit"
              sx={{
                p: { sm: 1, md: 1.5 },
                color: "#94a3b8"
              }}
            >
              <SearchIcon sx={{ fontSize: { sm: 20, md: 24 } }} />
            </IconButton>
            <InputBase
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                color: "white",
                flex: 1,
                fontSize: { sm: "0.875rem", md: "1rem" },
                "& .MuiInputBase-input": { py: { sm: 0.75, md: 1 } },
              }}
            />
          </Box>

          <Box sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            flexShrink: 0
          }}>
            {/* Admin Menu */}
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
                    fontSize: { md: "0.875rem", lg: "1rem" },
                    "&:hover": { bgcolor: "#d97706" },
                  }}
                >
                  Admin
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
                      minWidth: 220,
                    },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/admin/dashboard"
                    onClick={handleMenuClose}
                    sx={{
                      "&:hover": { bgcolor: "#334155" },
                      borderBottom: "1px solid #334155",
                      py: 1.5
                    }}
                  >
                    <ListItemIcon sx={{ color: "#10b981" }}>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dashboard"
                      secondary="Overview & Stats"
                      secondaryTypographyProps={{
                        sx: { color: "#64748b", fontSize: "0.75rem" }
                      }}
                    />
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/admin/add"
                    onClick={handleMenuClose}
                    sx={{ "&:hover": { bgcolor: "#334155" }, py: 1.5 }}
                  >
                    <ListItemIcon sx={{ color: "#f59e0b" }}>
                      <PlaylistAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Add Movie"
                      secondary="Create new entry"
                      secondaryTypographyProps={{
                        sx: { color: "#64748b", fontSize: "0.75rem" }
                      }}
                    />
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/admin/all-movies"
                    onClick={handleMenuClose}
                    sx={{ "&:hover": { bgcolor: "#334155" }, py: 1.5 }}
                  >
                    <ListItemIcon sx={{ color: "#3b82f6" }}>
                      <VideoLibraryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="All Movies"
                      secondary="Manage collection"
                      secondaryTypographyProps={{
                        sx: { color: "#64748b", fontSize: "0.75rem" }
                      }}
                    />
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Auth Section */}
            {!token ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontSize: { md: "0.875rem", lg: "1rem" }
                  }}
                >
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
                    fontSize: { md: "0.875rem", lg: "1rem" },
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
                    width: { md: 36, lg: 40 },
                    height: { md: 36, lg: 40 },
                    fontSize: { md: "0.875rem", lg: "1rem" }
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
                    fontSize: { md: "0.875rem", lg: "1rem" },
                    "&:hover": { bgcolor: "rgba(245, 158, 11, 0.15)" },
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Avatar/Login */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
            {token ? (
              <Avatar
                sx={{
                  bgcolor: "#f59e0b",
                  color: "black",
                  fontWeight: "bold",
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem"
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
            ) : (
              <Button
                component={Link}
                to="/login"
                size="small"
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  px: 1.5
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: '#1e293b',
            color: 'white',
            width: { xs: 280, sm: 320 },
            p: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Mobile Search */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#0f172a",
            borderRadius: 2,
            border: "1px solid #334155",
            mb: 3,
            overflow: "hidden"
          }}
        >
          <IconButton type="submit" sx={{ p: 1, color: "#94a3b8" }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: "white",
              flex: 1,
              fontSize: "0.875rem",
              "& .MuiInputBase-input": { py: 0.75 },
            }}
          />
        </Box>

        <Divider sx={{ bgcolor: '#334155', mb: 2 }} />

        <List>
          {/* Admin Links */}
          {user?.role === "admin" && (
            <>
              <ListItem
                button
                component={Link}
                to="/admin/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                <ListItemIcon sx={{ color: "#10b981", minWidth: 40 }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/admin/add"
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                <ListItemIcon sx={{ color: "#f59e0b", minWidth: 40 }}>
                  <PlaylistAddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Movie" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/admin/all-movies"
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                <ListItemIcon sx={{ color: "#3b82f6", minWidth: 40 }}>
                  <VideoLibraryIcon />
                </ListItemIcon>
                <ListItemText primary="All Movies" />
              </ListItem>

              <Divider sx={{ bgcolor: '#334155', my: 2 }} />
            </>
          )}

          {/* Auth Actions */}
          {token ? (
            <>
              <ListItem sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#f59e0b",
                      color: "black",
                      fontWeight: "bold",
                      width: 40,
                      height: 40
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  logout();
                  setMobileDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                <ListItemIcon sx={{ color: "#f87171", minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                component={Link}
                to="/login"
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                <ListItemText primary="Login" sx={{ textAlign: 'center' }} />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/register"
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 1,
                  bgcolor: '#f59e0b',
                  color: 'black',
                  '&:hover': { bgcolor: '#d97706' }
                }}
              >
                <ListItemText primary="Sign Up" sx={{ textAlign: 'center', fontWeight: 600 }} />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
