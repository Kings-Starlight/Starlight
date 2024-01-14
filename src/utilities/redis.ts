import { log } from "@logging/logger";
import { createClient } from "redis";

export const RedisClient = createClient(
    process.env.NODE_ENV === "production"
        ? {
              url: process.env.REDIS_URL,
          }
        : {}
);

RedisClient.on("error", (err: any) =>
    log.error(`A redis error occured: ${err}`)
);

export async function SetupRedisClient() {
    await Promise.all([RedisClient.connect()]);

    if (process.env.NODE_ENV !== "production") {
        RedisClient.auth({
            username: process.env.REDIS_AUTH_USERNAME,
            password: process.env.REDIS_AUTH_PASSWORD,
        });
    }
    const me = await RedisClient.ACL_WHOAMI();

    log.info(`Logged into Redis as ${me}`);
}
