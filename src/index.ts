import dotenv from "dotenv";
import { InitiateBot } from "./runtime";
import { InitiateLogger, log } from "@logging/logger";
import {
    FetchPlanets,
    FetchSatellites,
    FetchUEXTradeports,
    FetchUEXVehicles,
} from "@api/uexAPI";
import { FetchManufacturers, FetchVehicles } from "@api/wikiAPI";
import { RedisClient, SetupRedisClient } from "@utilities/redis";
import { initiateGithub } from "./utilities/octokit";

dotenv.config();

InitiateLogger();

(async () => {
    // initiate a Redis Client
    await SetupRedisClient();

    // initiate github connection
    await initiateGithub();
    await FetchUEXVehicles();
    await FetchUEXTradeports();
    await FetchPlanets();
    await FetchSatellites();
    await FetchVehicles();
    await FetchManufacturers();
})();

InitiateBot();

process.on("SIGINT", async () => {
    await RedisClient.quit();
    log.info("Preparing for shutdown!");

    log.info("Flushing logs...");
    log.on("finish", () => {
        process.exit;
    });
    log.end("Goodbye!");
});
