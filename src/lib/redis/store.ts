import redis from 'redis';
import bluebird from 'bluebird';
bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient(6379, '127.0.0.1');
client.on('error', function(err) {
    console.log('Error ' + err);
});
client.on('connect', function() {});

export default client;
