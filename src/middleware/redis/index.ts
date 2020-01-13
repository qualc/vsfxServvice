import RedisClient from '../../lib/redis';

export default function() {
    return async (req, res, next) => {
        req.redis = RedisClient;
        next();
    };
}
