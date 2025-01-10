import {
  type AutocompleteInteraction,
  EmbedBuilder,
  type RepliableInteraction,
} from "discord.js";
import { log } from "@logging/logger";
import { interactionType, red } from "./general";

/**
 * ErrorResponse replies to the failed interaction presenting an error message.
 * @param interaction The originating command to respond to.
 * @param error Error message to display.
 */
export function ErrorResponse(
  interaction: RepliableInteraction | AutocompleteInteraction,
  description: string,
  // biome-ignore lint/suspicious/noExplicitAny: Errors caught in catch blocks require a type of either "any" or "unknown"
  error?: any
): void {
  log.error(
    `An error occured when attempting to run a ${interactionType(
      interaction.type
    )} command ${error ? `${description}: ${error}` : description}`
  );

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
  }
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
