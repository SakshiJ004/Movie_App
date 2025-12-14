import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import AddMovie from "./pages/Admin/AddMovie";
import ProtectedRoute from "./router/ProtectedRoute";
import MovieDetails from "./pages/MovieDetails";
import DBMovieDetails from "./pages/DBMovieDetails";
import AllMovies from "./pages/Admin/AllMovies";
import EditMovie from "./pages/Admin/EditMovie";
import Register from "./pages/Register";
import Watchlist from "./pages/Watchlist";
import Dashboard from "./pages/Admin/Dashboard";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tmdb/:id" element={<MovieDetails />} />
        <Route path="/movie/:id" element={<DBMovieDetails />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddMovie />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/all-movies" element={
          <ProtectedRoute adminOnly={true}>
            <AllMovies />
          </ProtectedRoute>
        } />

        <Route path="/admin/edit-movie/:id" element={
          <ProtectedRoute adminOnly={true}>
            <EditMovie />
          </ProtectedRoute>
        } />
        <Route path="/watchlist" element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        } />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}
