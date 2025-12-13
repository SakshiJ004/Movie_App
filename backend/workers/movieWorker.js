const Queue = require('bull');
const Movie = require('../models/Movie');
require('dotenv').config();

// Create Bull Queue
const movieQueue = new Queue('movie-processing', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined
    }
});

// Process jobs
movieQueue.process(async (job) => {
    const { action, data, movieId } = job.data;

    console.log(`Processing ${action} job for movie:`, data?.title || movieId);

    try {
        switch (action) {
            case 'ADD_MOVIE':
                const newMovie = await Movie.create(data);
                console.log('Movie added successfully:', newMovie.title);
                return { success: true, movie: newMovie };

            case 'UPDATE_MOVIE':
                const updatedMovie = await Movie.findByIdAndUpdate(
                    movieId,
                    data,
                    { new: true }
                );
                console.log('Movie updated successfully:', updatedMovie.title);
                return { success: true, movie: updatedMovie };

            case 'DELETE_MOVIE':
                await Movie.findByIdAndDelete(movieId);
                console.log('Movie deleted successfully');
                return { success: true };

            default:
                throw new Error('Unknown action');
        }
    } catch (error) {
        console.error('Job processing error:', error);
        throw error;
    }
});

// Event listeners
movieQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed:`, result);
});

movieQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);
});

console.log('Movie Worker is running...');

module.exports = movieQueue;