import dotenv from "dotenv";
import "./runtime";
import { InitiateBot } from "./runtime";
import { InitiateLogger, log } from "./logging/logger";
import { SetupEventHandlers } from "./events/events";

dotenv.config();

InitiateLogger();
InitiateBot();
SetupEventHandlers();

process.on("SIGINT", () => {
    log.info("Preparing for shutdown!");

    log.info("Flushing logs...");
    log.on("finish", () => {
        process.exit;
    });
    log.end("Goodbye!");
});
