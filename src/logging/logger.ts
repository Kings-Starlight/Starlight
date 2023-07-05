import { createLogger, transports, format, type Logger } from "winston";

export var log: Logger;

export function InitiateLogger(): void {
    log = createLogger({
        level: "info",
        format: format.json(),
        transports: [
            new transports.File({
                filename: "error.log",
                level: "error",
            }),
            new transports.File({ filename: "combined.log" }),
            new transports.Console({ format: format.simple(), level: "silly" }),
        ],

        exceptionHandlers: [
            new transports.File({ filename: "exceptions.log" }),
        ],
    });

    log.info("Logger initiated successfully!");
}
