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
