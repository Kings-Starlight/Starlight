import { createLogger, transports, format, type Logger } from "winston";
import "winston-daily-rotate-file";

export let log: Logger;

const customFormat = format.printf(({ level, message, label, timestamp }) => {
    return `\x1B[35m[\x1B[0m${label}\x1B[35m]\x1B[0m | ${timestamp} | ${level}: ${message}`;
});

export function InitiateLogger(): void {
    if (process.env.NODE_ENV !== "production") {
        log = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
                format.prettyPrint()
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: "logs/%DATE%/log.log",
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                }),
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.label({ label: "Starlight" }),
                        format.errors({ stack: true }),
                        format.simple(),
                        customFormat
                    ),
                    level: "silly",
                }),
            ],

            exceptionHandlers: [
                new transports.DailyRotateFile({
                    format: format.errors({ stack: true }),
                    filename: "logs/%DATE%/exceptions.log",
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                }),
            ],
        });
    } else {
        log = createLogger({
            level: "error",
            format: format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
            transports: [new transports.Console()],
        });
    }

    log.info("Logger initiated successfully!");
}
