import dotenv from "dotenv";
import { InitiateBot } from "./runtime";
import { InitiateLogger, log } from "@logging/logger";
import { FetchUEXVehicles } from "@api/uexAPI";
import {
    FetchArmour,
    FetchClothes,
    FetchFPSItems,
    FetchFPSWeaponAttachments,
    FetchFPSWeapons,
    FetchFood,
    FetchManufacturers,
    FetchVehicleItems,
    FetchVehicleWeapons,
    FetchVehicles,
} from "@api/wikiAPI";
import { RedisClient, SetupRedisClient } from "@utilities/redis";
import { initiateGithub } from "./utilities/octokit";
import { time_week_seconds } from "./utilities/general";

dotenv.config();

InitiateLogger();

log.debug(`Bot is running in ${process.env.NODE_ENV === "production" ? "prod" : "dev"} mode`);

const intervals = new Map<string, NodeJS.Timer>();

// Set up a timeout for all of these requests to update

(async () => {
    // initiate a Redis Client
    await SetupRedisClient();

    // initiate github connection
    await initiateGithub();

    // Fetch From API.

    // Items, Components and Equipment
    FetchArmour();
    FetchClothes();
    FetchVehicleWeapons();
    FetchVehicleItems();
    FetchFPSWeapons();
    FetchFPSWeaponAttachments();
    FetchFood();
    FetchFPSItems();
    intervals.set(
        "Wiki-Equipment",
        setInterval(() => {
            FetchArmour();
            FetchClothes();
            FetchVehicleWeapons();
            FetchVehicleItems();
            FetchFPSWeapons();
            FetchFPSWeaponAttachments();
            FetchFood();
            FetchFPSItems();
        }, time_week_seconds * 26)
    );

    // Fetch Vehicle Information
    FetchUEXVehicles();
    intervals.set(
        "UEX-Vehicles",
        setInterval(() => FetchUEXVehicles(), time_week_seconds * 2)
    );

    FetchVehicles();
    intervals.set(
        "Wiki-Vehicles",
        setInterval(() => FetchVehicles(), time_week_seconds * 2)
    );
    FetchManufacturers();
    intervals.set(
        "Wiki-Manufacturers",
        setInterval(() => FetchManufacturers(), time_week_seconds * 26)
    );
})();

InitiateBot();

process.on("SIGINT", async () => {
    // Disconnect from redis
    await RedisClient.quit();
    // stop all intervals
    intervals.forEach((_, interval) => {
        clearInterval(interval);
    });
    log.info("Preparing for shutdown!");

    log.info("Flushing logs...");
    log.on("finish", () => {
        process.exit;
    });
    log.end("Goodbye!");
});
