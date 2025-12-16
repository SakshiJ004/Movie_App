// import { useState, useContext } from "react";
// import {
//     TextField,
//     Button,
//     Box,
//     Typography,
//     Alert,
//     CircularProgress,
//     InputAdornment,
//     IconButton,
//     Paper,
// } from "@mui/material";
// import { Visibility, VisibilityOff, Movie } from "@mui/icons-material";
// import { AuthContext } from "../context/AuthContext";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//     const { login } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const [data, setData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [serverError, setServerError] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     // Email validation
//     const validateEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     // Password strength check
//     const checkPasswordStrength = (password) => {
//         if (password.length < 6) return "Password must be at least 6 characters";
//         if (!/[A-Z]/.test(password)) return "Password should contain at least one uppercase letter";
//         if (!/[a-z]/.test(password)) return "Password should contain at least one lowercase letter";
//         if (!/[0-9]/.test(password)) return "Password should contain at least one number";
//         return "";
//     };

//     // Validate form
//     const validate = () => {
//         const newErrors = {};

//         if (!data.name) {
//             newErrors.name = "Name is required";
//         } else if (data.name.length < 2) {
//             newErrors.name = "Name must be at least 2 characters";
//         }

//         if (!data.email) {
//             newErrors.email = "Email is required";
//         } else if (!validateEmail(data.email)) {
//             newErrors.email = "Invalid email format";
//         }

//         if (!data.password) {
//             newErrors.password = "Password is required";
//         } else {
//             const strengthError = checkPasswordStrength(data.password);
//             if (strengthError) newErrors.password = strengthError;
//         }

//         if (!data.confirmPassword) {
//             newErrors.confirmPassword = "Please confirm your password";
//         } else if (data.password !== data.confirmPassword) {
//             newErrors.confirmPassword = "Passwords do not match";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // const submit = async () => {
//     //     if (!validate()) return;

//     //     setLoading(true);
//     //     setServerError("");

//     //     try {
//     //         const res = await api.post("/auth/register", {
//     //             name: data.name,
//     //             email: data.email,
//     //             password: data.password,
//     //         });
//     //         login(res.data.token, res.data.user);
//     //         navigate("/");
//     //     } catch (err) {
//     //         setServerError(
//     //             err.response?.data?.message || "Registration failed. Please try again."
//     //         );
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };


//     const submit = async () => {
//         if (!validate()) return;

//         setLoading(true);
//         setServerError("");

//         try {
//             const res = await api.post("/auth/register", {
//                 name: data.name,
//                 email: data.email,
//                 password: data.password
//             });
//             login(res.data.token, res.data.user);
//             navigate("/");
//         } catch (err) {
//             // Better error messages
//             if (err.response?.status === 400) {
//                 setServerError("User already exists with this email");
//             } else if (err.response?.data?.message) {
//                 setServerError(err.response.data.message);
//             } else {
//                 setServerError("Registration failed. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === "Enter") {
//             submit();
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 minHeight: "100vh",
//                 bgcolor: "#0f172a",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 p: 2,
//             }}
//         >
//             <Paper
//                 elevation={8}
//                 sx={{
//                     maxWidth: 450,
//                     width: "100%",
//                     p: 4,
//                     borderRadius: 3,
//                     bgcolor: "#1e293b",
//                     border: "1px solid #334155",
//                 }}
//             >
//                 {/* Logo */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
//                     <Box
//                         sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 1,
//                             bgcolor: "#f59e0b",
//                             color: "black",
//                             px: 2,
//                             py: 1,
//                             borderRadius: 2,
//                             fontWeight: "bold",
//                             fontSize: "1.5rem",
//                         }}
//                     >
//                         <Movie sx={{ fontSize: 32 }} />
//                         MovieApp
//                     </Box>
//                 </Box>

//                 <Typography
//                     variant="h4"
//                     sx={{ color: "white", fontWeight: "bold", mb: 1, textAlign: "center" }}
//                 >
//                     Create Account
//                 </Typography>
//                 <Typography sx={{ color: "#94a3b8", mb: 4, textAlign: "center" }}>
//                     Sign up to start your movie journey
//                 </Typography>

//                 {/* Server Error Alert */}
//                 {serverError && (
//                     <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//                         {serverError}
//                     </Alert>
//                 )}

//                 {/* Name Field */}
//                 <TextField
//                     label="Full Name"
//                     fullWidth
//                     value={data.name}
//                     onChange={(e) => {
//                         setData({ ...data, name: e.target.value });
//                         if (errors.name) setErrors({ ...errors, name: "" });
//                     }}
//                     onKeyPress={handleKeyPress}
//                     error={!!errors.name}
//                     helperText={errors.name}
//                     sx={{
//                         mb: 2.5,
//                         "& .MuiOutlinedInput-root": {
//                             bgcolor: "#0f172a",
//                             color: "white",
//                             "& fieldset": { borderColor: "#334155" },
//                             "&:hover fieldset": { borderColor: "#475569" },
//                             "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
//                         },
//                         "& .MuiInputLabel-root": { color: "#94a3b8" },
//                         "& .MuiFormHelperText-root": { color: "#f87171" },
//                     }}
//                 />

//                 {/* Email Field */}
//                 <TextField
//                     label="Email Address"
//                     fullWidth
//                     value={data.email}
//                     onChange={(e) => {
//                         setData({ ...data, email: e.target.value });
//                         if (errors.email) setErrors({ ...errors, email: "" });
//                     }}
//                     onKeyPress={handleKeyPress}
//                     error={!!errors.email}
//                     helperText={errors.email}
//                     sx={{
//                         mb: 2.5,
//                         "& .MuiOutlinedInput-root": {
//                             bgcolor: "#0f172a",
//                             color: "white",
//                             "& fieldset": { borderColor: "#334155" },
//                             "&:hover fieldset": { borderColor: "#475569" },
//                             "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
//                         },
//                         "& .MuiInputLabel-root": { color: "#94a3b8" },
//                         "& .MuiFormHelperText-root": { color: "#f87171" },
//                     }}
//                 />

//                 {/* Password Field */}
//                 <TextField
//                     label="Password"
//                     fullWidth
//                     type={showPassword ? "text" : "password"}
//                     value={data.password}
//                     onChange={(e) => {
//                         setData({ ...data, password: e.target.value });
//                         if (errors.password) setErrors({ ...errors, password: "" });
//                     }}
//                     onKeyPress={handleKeyPress}
//                     error={!!errors.password}
//                     helperText={errors.password}
//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <IconButton
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     edge="end"
//                                     sx={{ color: "#94a3b8" }}
//                                 >
//                                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                                 </IconButton>
//                             </InputAdornment>
//                         ),
//                     }}
//                     sx={{
//                         mb: 2.5,
//                         "& .MuiOutlinedInput-root": {
//                             bgcolor: "#0f172a",
//                             color: "white",
//                             "& fieldset": { borderColor: "#334155" },
//                             "&:hover fieldset": { borderColor: "#475569" },
//                             "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
//                         },
//                         "& .MuiInputLabel-root": { color: "#94a3b8" },
//                         "& .MuiFormHelperText-root": { color: "#f87171" },
//                     }}
//                 />

//                 {/* Confirm Password Field */}
//                 <TextField
//                     label="Confirm Password"
//                     fullWidth
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={data.confirmPassword}
//                     onChange={(e) => {
//                         setData({ ...data, confirmPassword: e.target.value });
//                         if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
//                     }}
//                     onKeyPress={handleKeyPress}
//                     error={!!errors.confirmPassword}
//                     helperText={errors.confirmPassword}
//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <IconButton
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     edge="end"
//                                     sx={{ color: "#94a3b8" }}
//                                 >
//                                     {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                                 </IconButton>
//                             </InputAdornment>
//                         ),
//                     }}
//                     sx={{
//                         mb: 3,
//                         "& .MuiOutlinedInput-root": {
//                             bgcolor: "#0f172a",
//                             color: "white",
//                             "& fieldset": { borderColor: "#334155" },
//                             "&:hover fieldset": { borderColor: "#475569" },
//                             "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
//                         },
//                         "& .MuiInputLabel-root": { color: "#94a3b8" },
//                         "& .MuiFormHelperText-root": { color: "#f87171" },
//                     }}
//                 />

//                 {/* Register Button */}
//                 <Button
//                     fullWidth
//                     variant="contained"
//                     onClick={submit}
//                     disabled={loading}
//                     sx={{
//                         py: 1.5,
//                         bgcolor: "#f59e0b",
//                         color: "black",
//                         fontWeight: 600,
//                         fontSize: "1rem",
//                         textTransform: "none",
//                         "&:hover": { bgcolor: "#d97706" },
//                         "&:disabled": { bgcolor: "#334155", color: "#64748b" },
//                     }}
//                 >
//                     {loading ? <CircularProgress size={24} sx={{ color: "#64748b" }} /> : "Create Account"}
//                 </Button>

//                 {/* Login Link */}
//                 <Box sx={{ mt: 3, textAlign: "center" }}>
//                     <Typography sx={{ color: "#94a3b8" }}>
//                         Already have an account?{" "}
//                         <Button
//                             onClick={() => navigate("/login")}
//                             sx={{
//                                 color: "#f59e0b",
//                                 fontWeight: 600,
//                                 textTransform: "none",
//                                 p: 0,
//                                 minWidth: "auto",
//                                 "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
//                             }}
//                         >
//                             Sign In
//                         </Button>
//                     </Typography>
//                 </Box>
//             </Paper>
//         </Box>
//     );
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

export default function Register() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const checkPasswordStrength = (password) => {
        if (password.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(password)) return "Password should contain at least one uppercase letter";
        if (!/[a-z]/.test(password)) return "Password should contain at least one lowercase letter";
        if (!/[0-9]/.test(password)) return "Password should contain at least one number";
        return "";
    };

    const validate = () => {
        const newErrors = {};

        if (!data.name) {
            newErrors.name = "Name is required";
        } else if (data.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!data.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(data.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!data.password) {
            newErrors.password = "Password is required";
        } else {
            const strengthError = checkPasswordStrength(data.password);
            if (strengthError) newErrors.password = strengthError;
        }

        if (!data.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;

        setLoading(true);
        setServerError("");

        try {
            const res = await api.post("/auth/register", {
                name: data.name,
                email: data.email,
                password: data.password
            });
            login(res.data.token, res.data.user);
            navigate("/");
        } catch (err) {
            if (err.response?.status === 400) {
                setServerError("User already exists with this email");
            } else if (err.response?.data?.message) {
                setServerError(err.response.data.message);
            } else {
                setServerError("Registration failed. Please try again.");
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
                {/* Logo */}
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
                    Create Account
                </Typography>
                <Typography sx={{
                    color: "#94a3b8",
                    mb: { xs: 3, sm: 4 },
                    textAlign: "center",
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                }}>
                    Sign up to start your movie journey
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

                {/* Name Field */}
                <TextField
                    label="Full Name"
                    fullWidth
                    value={data.name}
                    onChange={(e) => {
                        setData({ ...data, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    onKeyPress={handleKeyPress}
                    error={!!errors.name}
                    helperText={errors.name}
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

                {/* Confirm Password Field */}
                <TextField
                    label="Confirm Password"
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.confirmPassword}
                    onChange={(e) => {
                        setData({ ...data, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                    }}
                    onKeyPress={handleKeyPress}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    sx={{ color: "#94a3b8" }}
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                {/* Register Button */}
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
                        "Create Account"
                    )}
                </Button>

                {/* Login Link */}
                <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: "center" }}>
                    <Typography sx={{
                        color: "#94a3b8",
                        fontSize: { xs: "0.875rem", sm: "1rem" }
                    }}>
                        Already have an account?{" "}
                        <Button
                            onClick={() => navigate("/login")}
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
                            Sign In
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
