// const Queue = require('bull');
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

// // Add movie to queue
// exports.addMovieToQueue = async (movieData) => {
//     return await movieQueue.add('ADD_MOVIE', {
//         action: 'ADD_MOVIE',
//         data: movieData
//     }, {
//         attempts: 3,
//         backoff: {
//             type: 'exponential',
//             delay: 2000
//         }
//     });
// };

// // Update movie in queue
// exports.updateMovieInQueue = async (movieId, movieData) => {
//     return await movieQueue.add('UPDATE_MOVIE', {
//         action: 'UPDATE_MOVIE',
//         movieId,
//         data: movieData
//     });
// };

// // Delete movie in queue
// exports.deleteMovieInQueue = async (movieId) => {
//     return await movieQueue.add('DELETE_MOVIE', {
//         action: 'DELETE_MOVIE',
//         movieId
//     });
// };

// module.exports.movieQueue = movieQueue;

const movieQueue = require("../queues/movieQueue");

exports.addMovieToQueue = (movieData) => {
    return movieQueue.add({
        action: "ADD_MOVIE",
        data: movieData,
    });
};

exports.updateMovieInQueue = (movieId, movieData) => {
    return movieQueue.add({
        action: "UPDATE_MOVIE",
        movieId,
        data: movieData,
    });
};

exports.deleteMovieInQueue = (movieId) => {
    return movieQueue.add({
        action: "DELETE_MOVIE",
        movieId,
    });
};
