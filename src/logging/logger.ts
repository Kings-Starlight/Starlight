import { createLogger, transports, format, type Logger } from "winston";

export var log: Logger;

export function InitiateLogger(): void {
    var date: Date = new Date();
    log = createLogger({
        exitOnError: false,
        level: "info",
        format: format.combine(format.timestamp(), format.prettyPrint()),
        transports: [
            new transports.File({
                filename: `logs/error ${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}.log`,
                level: "error",
            }),
            new transports.File({
                filename: `logs/combined ${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}.log`,
            }),
            new transports.Console({
                format: format.combine(format.colorize(), format.simple()),
                level: "info",
            }),
        ],

        exceptionHandlers: [
            new transports.File({
                filename: `logs/exceptions ${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}.log`,
            }),
        ],
    });

    log.info("Logger initiated successfully!");
}
