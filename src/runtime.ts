import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
} from "discord.js";
import { log } from "./logging/logger";
import path from "path";
import fs from "node:fs";

export var client: Client<true>;

export function InitiateBot(): void {
    log.info("Setting up bot instance");
    client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });

    client.commands = new Collection();

    client.once(Events.ClientReady, (c: Client<true>) => {
        log.info(`Logged in as ${c.user.tag}`);
    });

    client.login(process.env.TOKEN);

    // Command mapping and registration:

    var commands = [];

    const commandsPath: string = path.join(__dirname, "commands");
    const commandsFiles: string[] = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".ts"));

    for (const file of commandsFiles) {
        const filePath: string = path.join(commandsPath, file);
        const command: {
            data: SlashCommandBuilder;
            execute: () => Promise<void>;
        } = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            log.warn(
                `The command at ${filePath} is missing some required properties.`
            );
        }
    }

    const rest = new REST().setToken(process.env.TOKEN);

    (async () => {
        try {
            log.info(
                `Started refreshing ${client.commands.size} application (/) commands.`
            );

            const data: any = await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.TEST_GUILD
                ),
                { body: commands }
            );

            log.info(
                `Successfully reloaded ${data.length} application (/) commands`
            );
        } catch (err) {
            log.error(err);
        }
    })();
}
