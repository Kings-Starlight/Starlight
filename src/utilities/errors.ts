import { EmbedBuilder, Interaction } from "discord.js";
import { log } from "../logging/logger";

/**
 * ErrorResponse replies to the failed interaction presenting an error message.
 * @param interaction The originating command to respond to.
 * @param error Error message to display.
 */
export function ErrorResponse(
    interaction: Interaction,
    description: string,
    error?: any
): void {
    log.error(error ? description + ": " + error : description);

    const responseEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
            `## ${description}\nThis error has been recorded.\n${
                error ? `\`\`\`${error}\`\`\`` : ""
            }`
        )
        .setTimestamp();

    if (!interaction.isAutocomplete()) {
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

    if (!interaction.channel) return;

    interaction.channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [responseEmbed],
    });

    return;
}
