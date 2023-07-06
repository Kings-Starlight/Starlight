import dotenv from "dotenv";
import "./runtime";
import { InitiateBot } from "./runtime";
import { InitiateLogger, log } from "./logging/logger";
import { FetchUEXVehicles } from "./api/uex";

dotenv.config();

InitiateLogger();
InitiateBot();

process.on("SIGINT", () => {
    log.info("Preparing for shutdown!");

    log.info("Flushing logs...");
    log.on("finish", () => {
        process.exit;
    });
    log.end("Goodbye!");
});
