import { log } from "@logging/logger";
import { Events } from "discord.js";

module.exports = {
    name: Events.ClientReady,
    once: true,
    // biome-ignore lint/suspicious/noExplicitAny: Client type is unknown atm.
    execute(client: any) {
        log.info(`Ready! Logged in as ${client.user.tag}`);
    },
};
