require("dotenv").config();
const mongoose = require("mongoose");
const movieQueue = require("../queues/movieQueue");
const Movie = require("../models/Movie");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Worker connected to MongoDB"))
    .catch(err => console.error("MongoDB error:", err));

console.log("🎬 Movie Worker is running...");

movieQueue.process(async (job) => {
    console.log("🔥 JOB RECEIVED:", job.data);

    const { action, data, movieId } = job.data;

    switch (action) {
        case "ADD_MOVIE":
            const movie = await Movie.create(data);
            console.log("Movie saved:", movie.title);
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
