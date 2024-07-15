import redis from "../lib/redis";

const cache = <T extends (args: any) => any>({
  getKey,
  expire,
  request,
  json,
}: {
  expire?: number;
  getKey: (...args: Parameters<T>) => string | Promise<string>;
  request: T;
  json?: boolean;
}) => {
  return (async (...args: any) => {
    const key = await getKey(...args);
    const redisCache = await redis.get(key);
    if (redisCache !== null) return json ? JSON.parse(redisCache) : redisCache;

    const result = await (request as any)(...args);
    const value = json ? JSON.stringify(result) : result;

    expire ? redis.set(key, value, "EX", expire) : redis.set(key, value);

    return result;
  }) as T;
};

export const write = <T extends (...args: any) => any>({
  getKey,
  expire,
  request,
  json,
}: {
  expire?: number;
  getKey: (...args: Parameters<T>) => string | Promise<string>;
  request: T;
  json?: boolean;
}) => {
  return (async (...args: any) => {
    const key = await getKey(...args);

    const result = await (request as any)(...args);
    const value = json ? JSON.stringify(result) : result;

    expire ? redis.set(key, value, "EX", expire) : redis.set(key, value);

    return result;
  }) as T;
};

export default cache;
