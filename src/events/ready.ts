import { log } from "@logging/logger";
import { Events } from "discord.js";

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: any) {
        log.info(`Ready! Logged in as ${client.user.tag}`);
    },
};
