const redis=require ("redis");

const redisclient = redis.createClient({
    username: 'default',
    password: "xsSnKKSlQGvu5JF3oQycJzcmyqioGZGV",
    socket: {
        host: 'redis-17001.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 17001
    }
});

module.exports = redisclient;