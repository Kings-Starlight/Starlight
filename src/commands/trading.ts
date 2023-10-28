import {
    AutocompleteInteraction,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { Planets, Satellites, UEXTradePorts } from "@api/uexAPI";
import { Planet, Tradeport } from "@/src/types/uex";
import { blue } from "@utilities/general";

module.exports = {
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
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        const choices: { name: string; value: string }[] = UEXTradePorts.map(
            (tradeport: Tradeport) => ({
                name: tradeport.name,
                value: tradeport.code,
            })
        );
        const filtered = choices
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((choice) =>
                choice.name.toLowerCase().startsWith(focusedValue)
            );
        await interaction.respond(
            filtered.slice(0, 24).map((choice) => ({
                name: choice.name,
                value: choice.value,
            }))
        );
    },
    async execute(interaction: CommandInteraction) {
        switch (interaction.options.data[0].name) {
            case "tradeport":
                const tradeport = UEXTradePorts.filter(
                    (e) =>
                        e.code === interaction.options.data[0].options[0].value
                )[0];
                const planet: Planet = Planets.filter(
                    (e) => e.code == tradeport.planet
                )[0];
                var satellite: Planet | null = tradeport.satellite
                    ? Satellites.filter((e) => e.code == tradeport.satellite)[0]
                    : null;
                const embeds = [],
                    infoEmbed = new EmbedBuilder()
                        .setTitle(tradeport.name)
                        .setDescription(
                            `${tradeport.name_short} is a${
                                tradeport.space
                                    ? " space station, orbiting " +
                                      "`" +
                                      planet.name +
                                      "`"
                                    : `n outpost, located on ${
                                          tradeport.satellite
                                              ? `\`${planet.name} > ${satellite?.name}\``
                                              : "`" + planet.name + "`"
                                      }`
                            }`
                        )
                        .setColor(blue)
                        .setTimestamp()
                        .setFooter({ text: "Powered by UEX" });

                if (tradeport.prices) {
                    infoEmbed.addFields(
                        {
                            name: "Buying",
                            value: `${tradeport.prices
                                .filter((e) => e.operation == "sell")
                                .map(
                                    (e) =>
                                        `- ${e.name} (${
                                            e.kind
                                        }): aUEC ${Intl.NumberFormat(
                                            "en"
                                        ).format(e.price_sell)}\n`
                                )
                                .join("")}`,
                            inline: true,
                        },
                        {
                            name: "Selling",
                            value: `${tradeport.prices
                                .filter((e) => e.operation == "buy")
                                .map(
                                    (e) =>
                                        `- ${e.name} (${
                                            e.kind
                                        }): aUEC ${Intl.NumberFormat(
                                            "en"
                                        ).format(e.price_buy)}\n`
                                )
                                .join("")}`,
                            inline: true,
                        }
                    );

                    embeds.push(infoEmbed);
                } else {
                    infoEmbed.addFields({
                        name: "Well, snap!",
                        value: "This location doesnt appear to be buying or selling anything!",
                    });
                    embeds.push(infoEmbed);
                }

                interaction.reply({ embeds });
                break;
        }
    },
};
