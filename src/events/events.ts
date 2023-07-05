import { Events } from "discord.js";
import { client } from "../runtime";
import { log } from "../logging/logger";

export function SetupEventHandlers() {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            log.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            log.profile("Command Profile");
            await command.execute(interaction);
            log.profile("Command Profile");
        } catch (error) {
            log.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    });
}
