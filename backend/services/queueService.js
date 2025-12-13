const Queue = require('bull');
require('dotenv').config();

const movieQueue = new Queue('movie-processing', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined
    }
});

// Add movie to queue
exports.addMovieToQueue = async (movieData) => {
    return await movieQueue.add('ADD_MOVIE', {
        action: 'ADD_MOVIE',
        data: movieData
    }, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        }
    });
};

// Update movie in queue
exports.updateMovieInQueue = async (movieId, movieData) => {
    return await movieQueue.add('UPDATE_MOVIE', {
        action: 'UPDATE_MOVIE',
        movieId,
        data: movieData
    });
};

// Delete movie in queue
exports.deleteMovieInQueue = async (movieId) => {
    return await movieQueue.add('DELETE_MOVIE', {
        action: 'DELETE_MOVIE',
        movieId
    });
};

module.exports.movieQueue = movieQueue;