import {
    type AutocompleteInteraction,
    type CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

module.exports = {
    flags: {
        dev: true,
    },
    data: new SlashCommandBuilder()
        .setName("trading")
        .setDescription(
            "View information and reported statistics for various commodities"
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("tradeport")
                .setDescription(
                    "View information about a specific tradport and its goods."
                )
                .addStringOption((option) =>
                    option
                        .setName("code")
                        .setDescription(
                            "The identifying code for the tradport to query"
                        )
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        ),
    async autocomplete(interaction: AutocompleteInteraction) {},
    async execute(interaction: CommandInteraction) {},
};
