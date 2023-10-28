import {
    AutocompleteInteraction,
    EmbedBuilder,
    RepliableInteraction,
} from "discord.js";
import { log } from "@logging/logger";
import { red } from "./general";

/**
 * ErrorResponse replies to the failed interaction presenting an error message.
 * @param interaction The originating command to respond to.
 * @param error Error message to display.
 */
export function ErrorResponse(
    interaction: RepliableInteraction | AutocompleteInteraction,
    description: string,
    error?: any
): void {
    log.error(error ? description + ": " + error : description);

    const responseEmbed = new EmbedBuilder()
        .setColor(red)
        .setDescription(
            `## ${description}\nThis error has been recorded.\n${
                error ? `\`\`\`${error}\`\`\`` : ""
            }`
        )
        .setTimestamp();

    if (!interaction.isChatInputCommand()) {
        if (!interaction.channel) return;

        interaction.channel.send({
            content: `<@${interaction.user.id}>`,
            embeds: [responseEmbed],
        });
        return;
    } else {
        switch (interaction.replied || interaction.deferred) {
            case false:
                interaction.reply({ ephemeral: true, embeds: [responseEmbed] });
                break;
            default:
                interaction.followUp({
                    ephemeral: true,
                    embeds: [responseEmbed],
                });
                break;
        }
        return;
    }
}
