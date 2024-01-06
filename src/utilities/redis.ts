import { log } from "@logging/logger";
import { createClient } from "redis";

export const RedisClient = createClient({
    url:
        process.env.NODE_ENV === "production"
            ? `redis://${process.env.REDIS_AUTH_USERNAME}:${process.env.REDIS_AUTH_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
            : "",
});

RedisClient.on("error", (err: any) => log.error(err));

export async function SetupRedisClient() {
    RedisClient.connect();
    if (process.env.NODE_ENV !== "production") {
        RedisClient.auth({
            username: process.env.REDIS_AUTH_USERNAME,
            password: process.env.REDIS_AUTH_PASSWORD,
        });
    }
    const me = await RedisClient.ACL_WHOAMI();

    log.info(`Logged into Redis as ${me}`);
}
