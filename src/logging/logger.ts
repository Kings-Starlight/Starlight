import { createLogger, transports, format, type Logger } from "winston";
import "winston-daily-rotate-file";

export var log: Logger;

export function InitiateLogger(): void {
    log = createLogger({
        level: "info",
        format: format.combine(format.timestamp(), format.prettyPrint()),
        transports: [
            new transports.DailyRotateFile({
                filename: `logs/%DATE%/log.log`,
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "20m",
                maxFiles: "14d",
            }),
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.simple(),
                    format.errors({ stack: true })
                ),
                level: "silly",
            }),
        ],

        exceptionHandlers: [
            new transports.DailyRotateFile({
                format: format.errors({ stack: true }),
                filename: `logs/%DATE%/exceptions.log`,
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "20m",
                maxFiles: "14d",
            }),
        ],
    });

    log.info("Logger initiated successfully!");
}
