import dotenv from "dotenv";
import "./runtime";
import { InitiateBot } from "./runtime";
import { InitiateLogger, log } from "./logging/logger";
import {
    FetchPlanets,
    FetchSatellites,
    FetchUEXTradeports,
    FetchUEXVehicles,
} from "./api/uexAPI";
import { FetchManufacturers, FetchVehicles } from "./api/wikiAPI";

dotenv.config();

InitiateLogger();
InitiateBot();

(async () => {
    await FetchUEXVehicles();
    await FetchVehicles();
    await FetchManufacturers();
    await FetchUEXTradeports();
    await FetchPlanets();
    await FetchSatellites();
})();

process.on("SIGINT", () => {
    log.info("Preparing for shutdown!");

    log.info("Flushing logs...");
    log.on("finish", () => {
        process.exit;
    });
    log.end("Goodbye!");
});
