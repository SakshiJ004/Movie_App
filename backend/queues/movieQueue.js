const Queue = require("bull");
const IORedis = require("ioredis");

const redisOptions = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
};

const movieQueue = new Queue("movie-processing", {
    createClient: () => new IORedis(redisOptions),
});

module.exports = movieQueue;
