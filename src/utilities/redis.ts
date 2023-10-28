import { log } from "@logging/logger";
import { createClient } from "redis";

export const RedisClient = createClient();

RedisClient.on("error", (err) => log.error(err));

export async function SetupRedisClient() {
    RedisClient.connect();
    RedisClient.auth({
        username: process.env.REDIS_AUTH_USERNAME,
        password: process.env.REDIS_AUTH_PASSWORD,
    });
    const me = await RedisClient.ACL_WHOAMI();

    log.info(`Logged into Redis as ${me}`);
}
