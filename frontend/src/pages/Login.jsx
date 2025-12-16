import { useState, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Movie } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors = {};

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setServerError("Invalid email or password. Please check your credentials.");
      } else if (err.response?.status === 400) {
        setServerError("Please enter valid email and password.");
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2 }, 
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: { xs: 3, sm: 4 }, 
          borderRadius: { xs: 2, sm: 3 }, 
          bgcolor: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#f59e0b",
              color: "black",
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.75, sm: 1 },
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: { xs: "1.25rem", sm: "1.5rem" }, 
            }}
          >
            <Movie sx={{ fontSize: { xs: 28, sm: 32 } }} />
            MovieApp
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 1,
            textAlign: "center",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } 
          }}
        >
          Welcome Back
        </Typography>
        <Typography sx={{
          color: "#94a3b8",
          mb: { xs: 3, sm: 4 }, 
          textAlign: "center",
          fontSize: { xs: "0.875rem", sm: "1rem" } 
        }}>
          Sign in to continue to MovieApp
        </Typography>

        {/* Server Error Alert */}
        {serverError && (
          <Alert
            severity="error"
            sx={{
              mb: { xs: 2, sm: 3 },
              borderRadius: 2,
              fontSize: { xs: "0.875rem", sm: "1rem" } 
            }}
          >
            {serverError}
          </Alert>
        )}

        {/* Email Field */}
        <TextField
          label="Email Address"
          fullWidth
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          onKeyPress={handleKeyPress}
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              bgcolor: "#0f172a",
              color: "white",
              fontSize: { xs: "0.875rem", sm: "1rem" }, 
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#475569" },
              "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
            },
            "& .MuiInputLabel-root": {
              color: "#94a3b8",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            },
            "& .MuiFormHelperText-root": {
              color: "#f87171",
              fontSize: { xs: "0.75rem", sm: "0.875rem" }
            },
          }}
        />

        {/* Password Field */}
        <TextField
          label="Password"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
          onKeyPress={handleKeyPress}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: "#94a3b8" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: { xs: 2, sm: 3 },
            "& .MuiOutlinedInput-root": {
              bgcolor: "#0f172a",
              color: "white",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#475569" },
              "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
            },
            "& .MuiInputLabel-root": {
              color: "#94a3b8",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            },
            "& .MuiFormHelperText-root": {
              color: "#f87171",
              fontSize: { xs: "0.75rem", sm: "0.875rem" }
            },
          }}
        />

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={submit}
          disabled={loading}
          sx={{
            py: { xs: 1.25, sm: 1.5 }, 
            bgcolor: "#f59e0b",
            color: "black",
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "1rem" }, 
            textTransform: "none",
            "&:hover": { bgcolor: "#d97706" },
            "&:disabled": { bgcolor: "#334155", color: "#64748b" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#64748b" }} />
          ) : (
            "Login"
          )}
        </Button>

        {/* Register Link */}
        <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: "center" }}>
          <Typography sx={{
            color: "#94a3b8",
            fontSize: { xs: "0.875rem", sm: "1rem" }
          }}>
            Don't have an account?{" "}
            <Button
              onClick={() => navigate("/register")}
              sx={{
                color: "#f59e0b",
                fontWeight: 600,
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                p: 0,
                minWidth: "auto",
                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
              }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
