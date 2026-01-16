const redis=require ("redis");

const redisclient = redis.createClient({
    username: 'default',
    password: "7SV5OE9GFpyhZDdVHYuAa4M8Df9TnIyC",
    socket: {
        host: 'redis-15683.c273.us-east-1-2.ec2.cloud.redislabs.com',
        port: 15683
    }
});

module.exports = redisclient;
