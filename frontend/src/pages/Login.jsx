// import { useState, useContext } from "react";
// import { TextField, Button, Box, Typography } from "@mui/material";
// import { AuthContext } from "../context/AuthContext";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [data, setData] = useState({ email: "", password: "" });

//   const submit = async () => {
//     const res = await api.post("/auth/login", data);
//     login(res.data.token, res.data.user);
//     navigate("/");
//   };

//   return (
//     <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
//       <Typography variant="h4">Login</Typography>

//       <TextField
//         label="Email"
//         fullWidth
//         sx={{ mt: 2 }}
//         onChange={(e) => setData({ ...data, email: e.target.value })}
//       />

//       <TextField
//         label="Password"
//         fullWidth
//         type="password"
//         sx={{ mt: 2 }}
//         onChange={(e) => setData({ ...data, password: e.target.value })}
//       />

//       <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={submit}>
//         Login
//       </Button>
//     </Box>
//   );
// }



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

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
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
      setServerError(
        err.response?.data?.message || "Login failed. Please try again."
      );
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
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 4,
          borderRadius: 3,
          bgcolor: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#f59e0b",
              color: "black",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            <Movie sx={{ fontSize: 32 }} />
            MovieApp
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{ color: "white", fontWeight: "bold", mb: 1, textAlign: "center" }}
        >
          Welcome Back
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4, textAlign: "center" }}>
          Sign in to continue to MovieApp
        </Typography>

        {/* Server Error Alert */}
        {serverError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#475569" },
              "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
            },
            "& .MuiInputLabel-root": { color: "#94a3b8" },
            "& .MuiFormHelperText-root": { color: "#f87171" },
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
            mb: 3,
            "& .MuiOutlinedInput-root": {
              bgcolor: "#0f172a",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#475569" },
              "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
            },
            "& .MuiInputLabel-root": { color: "#94a3b8" },
            "& .MuiFormHelperText-root": { color: "#f87171" },
          }}
        />

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={submit}
          disabled={loading}
          sx={{
            py: 1.5,
            bgcolor: "#f59e0b",
            color: "black",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": { bgcolor: "#d97706" },
            "&:disabled": { bgcolor: "#334155", color: "#64748b" },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#64748b" }} /> : "Login"}
        </Button>

        {/* Register Link */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography sx={{ color: "#94a3b8" }}>
            Don't have an account?{" "}
            <Button
              onClick={() => navigate("/register")}
              sx={{
                color: "#f59e0b",
                fontWeight: 600,
                textTransform: "none",
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