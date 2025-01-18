import { Events, type Interaction } from "discord.js";
import { ErrorResponse } from "@utilities/errors";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                ErrorResponse(interaction, `No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                ErrorResponse(interaction, "Failed to execute command.", error);
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                ErrorResponse(interaction, `No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                ErrorResponse(interaction, "There was an error responding to this autocomplete interaction", error);
            }
        } else if (interaction.isAnySelectMenu()) {
            const command = interaction.client.commands.get(interaction.customId.split("_")[0]);

            if (!command) {
                ErrorResponse(interaction, `No command matching ${interaction.customId.split("_")[0]} was found.`);
                return;
            }

            try {
                await command.selectInteraction(interaction);
            } catch (error) {
                ErrorResponse(interaction, "There was an error responding to this StringSelect interaction ", error);
            }
        } else if (interaction.isButton()) {
            const command = interaction.client.commands.get(interaction.customId.split("_")[0]);

            if (!command) {
                ErrorResponse(interaction, `No command matching ${interaction.customId.split("_")[0]} was found.`);
                return;
            }
            try {
                await command.buttonInteraction(interaction);
            } catch (error) {
                ErrorResponse(interaction, "There was an error responding to this Button interaction ", error);
            }
        } else if (interaction.isModalSubmit()) {
            const command = interaction.client.commands.get(interaction.customId.split("_")[0]);

            if (!command) {
                ErrorResponse(interaction, `No command matching ${interaction.customId.split("_")[0]} was found.`);
                return;
            }
            try {
                await command.modalInteraction(interaction);
            } catch (error) {
                ErrorResponse(interaction, "There was an error responding to this Button interaction ", error);
            }
        } else {
            ErrorResponse(interaction, "There was an error responding to this interaction ");
        }
    },
};
