import RedisClient from './store';

export function setItem(key, value, exprires?: number) {
    if (Array.isArray(value) || value instanceof Object) {
        value = JSON.stringify(value);
    }
    RedisClient.set(key, value);
    //设置过期 单位：秒
    if (exprires) {
        RedisClient.expire(key, exprires);
    }
}
export async function getItem(key) {
    return RedisClient.getAsync(key);
}

export function rpush(key, ...values) {
    RedisClient.rpush(key, ...values);
}
export function lrange(key, ...values) {
    return RedisClient.lrangeAsync(key);
}

export default RedisClient;
