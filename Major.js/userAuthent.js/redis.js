const { createClient } = require("redis");

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL must be set");
}

const redisclient = createClient({ url: process.env.REDIS_URL });
redisclient.on("error", (error) => console.error("Redis error:", error.message));

module.exports = redisclient;
