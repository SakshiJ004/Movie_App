# MERN Stack Movie Application – Role-Based Access Control

## Project Overview

This is a full-stack **MERN Movie Application** with **role-based access control**, built as part of a technical assignment for a MERN Developer role. The application allows users to browse movies and admins to manage movie data securely.
The project uses **TMDB (The Movie Database)** instead of IMDb due to API accessibility, structured data availability, and developer-friendly usage.

---

## Live Application URL
Vercel : https://movie-app-eight-topaz.vercel.app/
Render : https://movie-app-sr0y.onrender.com/

---

## GitHub Repository

> Add your GitHub repository link here

---

## Tech Stack

### Frontend

* React.js
* Material-UI (MUI)
* React Router DOM
* Axios
* Context API

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Redis
* Bull Queue
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Cache & Queue: Redis

---

## Why TMDB Instead of IMDb?

IMDb does **not provide an official public API** for free usage. Scraping IMDb data violates their terms of service.

**TMDB** is used because:

* Official, free, and well-documented API
* Provides high-quality movie metadata (posters, ratings, cast, crew)
* Supports pagination, search, and sorting
* Widely used in production-grade applications

TMDB data is imported and stored in MongoDB for performance and customization.

---

## Why Redis & Bull Queue?

### Redis

* Used for **caching frequently accessed movie data**
* Reduces database load
* Improves API response time
* Helps handle high concurrent users

### Bull Queue

* Used for **lazy/background insertion of TMDB movie data**
* Prevents API blocking during large data imports
* Improves scalability and reliability
* Handles retries and failures efficiently

This architecture ensures **better performance and concurrency handling**.

---

## Features

### User Features

* View all movies with pagination
* View movie details
* Search movies by title or description
* Sort movies by:
  * Name
  * Rating
  * Release Date
  * Duration

### Admin Features
* Dashboard
* Add new movies
* Edit existing movies
* Delete movies
* Role-based access protection

---

## Authentication & Authorization

* JWT-based authentication
* Role-based access control (User / Admin)
* Protected admin routes on frontend and backend

### Default Admin Credentials

```
Email: admin@example.com
Password: 123456
```
---

## API Endpoints

### Public

* `GET /movies` – Get all movies (pagination)
* `GET /movies/search` – Search movies
* `GET /movies/sorted` – Sort movies

### Admin (Protected)

* `POST /movies` – Add new movie
* `PUT /movies/:id` – Update movie
* `DELETE /movies/:id` – Delete movie

---

## Concurrency & Performance

* Redis caching for optimized reads
* Bull queue for background processing
* Indexed MongoDB queries
* Scalable architecture for large datasets

---

## Installation & Setup

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm start
```

### Environment Variables

```
MONGO_URI=
JWT_SECRET=
REDIS_URL=
TMDB_API_KEY=
```
---

## Conclusion

This project demonstrates:

* Secure authentication & authorization
* Scalable backend design
* Clean, responsive UI using Material-UI
* Real-world usage of Redis and Bull Queue
* Production-ready MERN stack architecture

---

**Developed as part of a MERN Stack Developer Technical Assignment**
