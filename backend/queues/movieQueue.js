const Queue = require("bull");

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in .env");
}

const movieQueue = new Queue("movie-processing", {
  redis: {
    url: process.env.REDIS_URL,
    maxRetriesPerRequest: null
  }
});

module.exports = movieQueue;
