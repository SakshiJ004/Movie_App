// const Queue = require('bull');
// const Movie = require('../models/Movie');
// require('dotenv').config();

// const movieQueue = new Queue('movie-processing', {
//     redis: {
//         host: process.env.REDIS_HOST,
//         port: parseInt(process.env.REDIS_PORT),
//         password: process.env.REDIS_PASSWORD,
//         tls: process.env.REDIS_TLS === 'true' ? {} : undefined, // Upstash needs TLS
//         maxRetriesPerRequest: 3,
//         enableOfflineQueue: false
//     }
// });

// // Process jobs
// movieQueue.process(async (job) => {
//     const { action, data, movieId } = job.data;

//     console.log(`Processing ${action} job for movie:`, data?.title || movieId);

//     try {
//         switch (action) {
//             case 'ADD_MOVIE':
//                 const newMovie = await Movie.create(data);
//                 console.log('Movie added successfully:', newMovie.title);
//                 return { success: true, movie: newMovie };

//             case 'UPDATE_MOVIE':
//                 const updatedMovie = await Movie.findByIdAndUpdate(
//                     movieId,
//                     data,
//                     { new: true }
//                 );
//                 console.log('Movie updated successfully:', updatedMovie.title);
//                 return { success: true, movie: updatedMovie };

//             case 'DELETE_MOVIE':
//                 await Movie.findByIdAndDelete(movieId);
//                 console.log('Movie deleted successfully');
//                 return { success: true };

//             default:
//                 throw new Error('Unknown action');
//         }
//     } catch (error) {
//         console.error('Job processing error:', error);
//         throw error;
//     }
// });

// // Event listeners
// movieQueue.on('completed', (job, result) => {
//     console.log(`Job ${job.id} completed:`, result);
// });

// movieQueue.on('failed', (job, err) => {
//     console.error(`Job ${job.id} failed:`, err.message);
// });

// console.log('Movie Worker is running...');

// module.exports = movieQueue;

require("dotenv").config();
const mongoose = require("mongoose");
const movieQueue = require("../queues/movieQueue");
const Movie = require("../models/Movie");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Worker connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB error:", err));

console.log("🎬 Movie Worker is running...");

movieQueue.process(async (job) => {
    console.log("🔥 JOB RECEIVED:", job.data);

    const { action, data, movieId } = job.data;

    switch (action) {
        case "ADD_MOVIE":
            const movie = await Movie.create(data);
            console.log("✅ Movie inserted:", movie.title);
            return movie;

        case "UPDATE_MOVIE":
            return await Movie.findByIdAndUpdate(movieId, data, { new: true });

        case "DELETE_MOVIE":
            await Movie.findByIdAndDelete(movieId);
            return true;

        default:
            throw new Error("Unknown job action");
    }
});
