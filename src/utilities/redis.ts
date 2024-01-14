import { log } from "@logging/logger";
import { createClient } from "redis";

export const RedisClient = createClient(
  process.env.NODE_ENV === "production"
    ? {
        username: process.env.REDIS_AUTH_USERNAME, // use your Redis user. More info https://redis.io/docs/management/security/acl/
        password: process.env.REDIS_AUTH_PASSWORD, // use your password here
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      }
    : {}
);

RedisClient.on("error", (err: any) =>
  log.error(`A redis error occured: ${err}`)
);

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
