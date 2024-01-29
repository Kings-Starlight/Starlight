import {
    CommandInteraction,
    RepliableInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { ErrorResponse } from "@utilities/errors";

module.exports = {
    flags: {
        dev: true,
    },
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads a command.")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("The command to reload.")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        if (interaction.member?.user.id !== process.env.CREATOR_ID) {
            ErrorResponse(
                interaction as RepliableInteraction,
                "You do not have permission to execute this command."
            );
        }
        const commandName: string = interaction.options.get("command", true)
            .value as string;
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(
                `There is no command with name \`${commandName}\`!`
            );
        }

        delete require.cache[require.resolve(`./${command.data.name}.ts`)];

        try {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(`./${command.data.name}.ts`);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({
                content: `Command \`${newCommand.data.name}\` was reloaded!`,
                ephemeral: true,
            });
            // biome-ignore lint/suspicious/noExplicitAny: catch value must be "any" or "unknown" if specified
        } catch (error: any) {
            ErrorResponse(
                interaction as RepliableInteraction,
                "Failed to reload the specified command",
                error
            );
        }
    },
};
