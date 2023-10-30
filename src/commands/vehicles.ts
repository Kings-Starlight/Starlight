import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    CommandInteractionOption,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import { SearchResponse, WikiShip } from "@/src/types/sc_wiki";
import { UEXShip } from "@/src/types/uex";
import {
    FetchVehicleSerie,
    SearchGalactapedia,
    manufacturers,
    ships,
} from "@api/wikiAPI";
import { RetrieveVehicleInfo } from "@api/wikiAPI";
import { blue, msToTime } from "@utilities/general";
import { UEXShips } from "@api/uexAPI";
import { log } from "@logging/logger";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vehicles")
        .setDescription(
            "Get information about all the various vehicles in the 'verse"
        )
        .addSubcommand((sub) =>
            sub
                .setName("search")
                .setDescription(
                    "Search for information about a specific vehicle."
                )
                .addStringOption((option) =>
                    option
                        .setName("vehicle")
                        .setDescription(
                            "The name of the vehicle you wish to retrieve information on."
                        )
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("compare")
                .setDescription("Compare basic stats of 2 vehicles.")
                .addStringOption((option) =>
                    option
                        .setName("first")
                        .setDescription(
                            "The name of the vehicle you wish to retrieve information on."
                        )
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("second")
                        .setDescription(
                            "The name of the vehicle you wish to retrieve information on."
                        )
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ),
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        const choices: { name: string; value: string }[] = ships.map(
            (ship: SearchResponse) => ({
                name: ship.name,
                value: ship.uuid ? ship.uuid : ship.name,
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
    async selectInteraction(interaction: AnySelectMenuInteraction) {
        interaction.deferUpdate();
        const { embed } = await CreateShipEmbed(interaction.values[0]);

        if (interaction.customId !== "vehicles_compare") {
            const { components } = await CreateShipComponents(
                interaction.values[0]
            );

            try {
                interaction.editReply({ embeds: [embed], components });
            } catch (error) {
                log.error("failed to update message:\n", error);
                interaction.message.edit({ embeds: [embed], components });
            }
            return;
        }
        try {
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            log.error("failed to update message:\n", error);
            interaction.message.edit({ embeds: [embed] });
        }
    },
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();

        switch (interaction.options.data[0].name) {
            case "search":
                var { embed } = await CreateShipEmbed(
                    String(interaction.options.data[0].options[0].value)
                );
                var { components } = await CreateShipComponents(
                    String(interaction.options.data[0].options[0].value)
                );
                interaction.editReply({ embeds: [embed], components });
                break;
            case "compare":
                var { embed } = await CreateShipEmbed(
                    interaction.options.data[0].options[0].value
                );
                var { components } = await CreateCompareComponents(
                    interaction.options.data[0].options
                );
                interaction.editReply({ embeds: [embed], components });
                break;
        }
    },
};

async function RetrieveFromAPI(name: string) {
    const WikiInfo: WikiShip = await RetrieveVehicleInfo(name);
    const UEXInfo: UEXShip = UEXShips.filter((ship) =>
        ship.name.includes(WikiInfo.name)
    )[0];
    const RSI = await SearchGalactapedia(WikiInfo.name);

    return { WikiInfo, UEXInfo, RSI };
}

/** Creates a message embed for a specified ship. */
async function CreateShipEmbed(name: string): Promise<{ embed: EmbedBuilder }> {
    const { WikiInfo, UEXInfo } = await RetrieveFromAPI(name);

    var embed: EmbedBuilder;

    if (WikiInfo.production_status.en_EN != "flight-ready") {
        embed = new EmbedBuilder()
            .setTitle(
                `${WikiInfo.manufacturer.name} (${WikiInfo.manufacturer.code})`
            )
            .setColor(blue)

            .setDescription(
                `# ${WikiInfo.name} — Concept\n### Please be aware that this information can change at any time and is not indicitive of the final outcome!\n ${WikiInfo.description.en_EN}`
            )
            .addFields(
                {
                    name: "Size",
                    value: `${WikiInfo.size.en_EN} (S${WikiInfo.size_class})`,
                    inline: true,
                },
                {
                    name: "Type",
                    value: WikiInfo.type.en_EN,
                    inline: true,
                },
                {
                    name: "Role",
                    value: WikiInfo.foci
                        .map((foci) => `- ${foci.en_EN}`)
                        .join("\n"),
                    inline: true,
                },
                {
                    name: "Crew Capacity",
                    value: `${WikiInfo.crew.min}`,
                    inline: true,
                },
                {
                    name: "Pledge Price (USD)",
                    value: `$${WikiInfo.msrp}`,
                    inline: true,
                },
                {
                    name: "Cargo Capacity (SCU)",
                    value: `${WikiInfo.cargo_capacity}`,
                    inline: true,
                },
                {
                    name: "Length (metres)",
                    value: WikiInfo.sizes.length.toString(),
                    inline: true,
                },
                {
                    name: "Height (metres)",
                    value: WikiInfo.sizes.height.toString(),
                    inline: true,
                },
                {
                    name: "Beam (metres)",
                    value: WikiInfo.sizes.beam.toString(),
                    inline: true,
                },
                {
                    name: "Production Status",
                    value: `${
                        WikiInfo.production_status
                            ? WikiInfo.production_status.en_EN
                            : "Unknown"
                    }`,
                }
            );

        if (UEXInfo !== undefined && UEXInfo.photos !== null) {
            embed.setImage(
                UEXInfo.photos
                    .split(",")[0]
                    .replaceAll("\\", "")
                    .replaceAll("[", "")
                    .replaceAll('"', "")
            );
        }
    } else {
        /** At which locations can the specified ship be rented at? */
        var rentable = WikiInfo.shops.filter(
                (shop) =>
                    shop.items.filter((item) => item.rentable == true).length !=
                    0
            ),
            /** At which locations can the specified ship be bought at */
            buyable = WikiInfo.shops.filter(
                (shop) =>
                    shop.items.filter((item) => item.buyable == true).length !=
                    0
            );

        embed = new EmbedBuilder()
            .setDescription(`# ${WikiInfo.name}\n${WikiInfo.description.en_EN}`)
            .setTitle(
                `${WikiInfo.manufacturer.name} (${WikiInfo.manufacturer.code})`
            )
            .setColor(blue)
            .addFields(
                {
                    name: "Size",
                    value: WikiInfo.size.en_EN,
                    inline: true,
                },
                { name: "Type", value: WikiInfo.type.en_EN, inline: true },
                {
                    name: "Role",
                    value: WikiInfo.foci
                        .map((foci) => `- ${foci.en_EN}`)
                        .join("\n"),
                    inline: true,
                },
                {
                    name: "Crew Capacity",
                    value: WikiInfo.crew.min.toString(),
                    inline: true,
                },
                {
                    name: "Pledge Price (USD)",
                    value: `$${WikiInfo.msrp}`,
                    inline: true,
                },
                {
                    name: "Cargo Capacity (SCU)",
                    value: WikiInfo.cargo_capacity.toString(),
                    inline: true,
                },
                {
                    name: "Where to buy",
                    value:
                        buyable.length != 0 && buyable != undefined
                            ? buyable
                                  .map(
                                      (shop) =>
                                          `${shop.name_raw}: ${shop.items[0].base_price} aUEC`
                                  )
                                  .join("\n")
                            : "This vehicle is not available for purchase...",
                },
                {
                    name: "Where to rent",
                    value:
                        rentable.length != 0 && rentable != undefined
                            ? rentable
                                  .map(
                                      (shop) =>
                                          `- ${shop.name_raw}:\n - 1d: ${
                                              shop.items[0].rental_price_days
                                                  .duration_1
                                                  ? shop.items[0]
                                                        .rental_price_days
                                                        .duration_1 + "aUEC"
                                                  : "not available"
                                          }\n - 3d: ${
                                              shop.items[0].rental_price_days
                                                  .duration_3
                                                  ? shop.items[0]
                                                        .rental_price_days
                                                        .duration_3 + "aUEC"
                                                  : "not available"
                                          }\n - 7d: ${
                                              shop.items[0].rental_price_days
                                                  .duration_7
                                                  ? shop.items[0]
                                                        .rental_price_days
                                                        .duration_7 + "aUEC"
                                                  : "not available"
                                          }\n - 30d: ${
                                              shop.items[0].rental_price_days
                                                  .duration_30
                                                  ? shop.items[0]
                                                        .rental_price_days
                                                        .duration_30 + "aUEC"
                                                  : "not available"
                                          }`
                                  )
                                  .join("\n")
                            : "This vehicle is not available for rent...",
                },
                {
                    name: "Length (metres)",
                    value: WikiInfo.sizes.length.toString(),
                    inline: true,
                },
                {
                    name: "Height (metres)",
                    value: WikiInfo.sizes.height.toString(),
                    inline: true,
                },
                {
                    name: "Beam (metres)",
                    value: WikiInfo.sizes.beam.toString(),
                    inline: true,
                },
                {
                    name: "Health",
                    value: Intl.NumberFormat("en").format(WikiInfo.health),
                    inline: true,
                },
                {
                    name: "Shield Health",
                    value: Intl.NumberFormat("en").format(WikiInfo.shield_hp),
                    inline: true,
                },
                {
                    name: "Speed (m/s)",
                    value: `SCM: ${WikiInfo.speed.scm} | Max: ${WikiInfo.speed.max}`,
                    inline: true,
                },
                {
                    name: "Mass",
                    value:
                        Intl.NumberFormat("en").format(WikiInfo.mass) + " kg",
                    inline: true,
                },
                {
                    name: "Hydrogen",
                    value: `Capacity: ${Intl.NumberFormat("en").format(
                        WikiInfo.fuel.capacity
                    )} L\n**Hydrogen Usage**\nMain: ${
                        WikiInfo.fuel.usage.main
                    } | Retro: ${WikiInfo.fuel.usage.retro}\nManeuvering: ${
                        WikiInfo.fuel.usage.maneuvering
                    } |  VTOL: ${WikiInfo.fuel.usage.vtol}`,
                    inline: true,
                },
                {
                    name: "Quantum",
                    value: WikiInfo.quantum
                        ? `Speed: ${Intl.NumberFormat("en").format(
                              WikiInfo.quantum.quantum_speed / 1000
                          )} km/s\nSpool Time: ${msToTime(
                              WikiInfo.quantum.quantum_spool_time * 1000
                          )}\nFuel Capacity: ${Intl.NumberFormat("en").format(
                              WikiInfo.quantum.quantum_fuel_capacity
                          )} L\nRange: ${Intl.NumberFormat("en").format(
                              WikiInfo.quantum.quantum_range
                          )}`
                        : "This vehicle has no quantum stats.",
                    inline: true,
                },
                {
                    name: "Emissions",
                    value: `IR: ${WikiInfo.emission.ir}\nEM Idle: ${WikiInfo.emission.em_idle} | EM Max: ${WikiInfo.emission.em_max}`,
                },
                {
                    name: "Insurance",
                    value: `Claim Time: ${msToTime(
                        WikiInfo.insurance.claim_time * 1000 * 60
                    )}\nExpedite Time: ${msToTime(
                        WikiInfo.insurance.expedite_time * 1000 * 60
                    )} | Expedite Cost: ${Intl.NumberFormat("en").format(
                        WikiInfo.insurance.expedite_cost
                    )} aUEC`,
                },
                {
                    name: "Production Status",
                    value:
                        WikiInfo.production_status.en_EN +
                        " since " +
                        WikiInfo.version,
                }
            );
        if (UEXInfo !== undefined) {
            embed.setImage(
                UEXInfo.photos
                    .split(",")[0]
                    .replaceAll("\\", "")
                    .replaceAll("[", "")
                    .replaceAll('"', "")
            );
        }
    }

    return { embed };
}
/** Generates the components for a single ship*/
async function CreateShipComponents(name: string): Promise<{ components: [] }> {
    const { WikiInfo, UEXInfo, RSI } = await RetrieveFromAPI(name);

    const disabledLink = (item: string) => {
        return new ButtonBuilder()
            .setLabel(item + " unavailable")
            .setStyle(ButtonStyle.Link)
            .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            .setDisabled(true);
    };

    const buttons = [
        UEXInfo !== undefined && UEXInfo.store_url
            ? new ButtonBuilder()
                  .setURL(UEXInfo.store_url)
                  .setLabel("Go to store page")
                  .setStyle(ButtonStyle.Link)
            : disabledLink("Store"),
        new ButtonBuilder()
            .setURL(
                "https://starcitizen.tools/" +
                    WikiInfo.name.replaceAll(" ", "_")
            )
            .setLabel("View wiki page")
            .setStyle(ButtonStyle.Link),
        RSI && RSI.length > 0
            ? new ButtonBuilder()
                  .setURL(RSI[0].rsi_url)
                  .setLabel("View Galactapedia entry")
                  .setStyle(ButtonStyle.Link)
            : disabledLink("Galactapedia"),
    ];
    var select: StringSelectMenuBuilder,
        selectRow: ActionRowBuilder,
        serieRow: ActionRowBuilder,
        serieSelect: StringSelectMenuBuilder,
        components: any = [],
        serieFilter = (await FetchVehicleSerie(WikiInfo.chassis_id)).filter(
            (ship) => ship.name !== WikiInfo.name
        );

    if (serieFilter.length != 0) {
        serieSelect = new StringSelectMenuBuilder()
            .setCustomId("vehicles_variant")
            .setPlaceholder("Select variant")
            .addOptions(
                serieFilter.map((ship) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(ship.name)
                        .setValue(
                            ship.link.split(
                                "https://api.star-citizen.wiki/api/v2/vehicles/"
                            )[1]
                        );
                })
            );
        serieRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                serieSelect
            );
        components.push(serieRow);
    }

    if (WikiInfo.loaner && WikiInfo.loaner?.length != 0) {
        select = new StringSelectMenuBuilder()
            .setCustomId("vehicles_loaner")
            .setPlaceholder("Select Loaner")
            .addOptions(
                WikiInfo.loaner.map((ship) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(ship.name)
                        .setValue(
                            ship.link.split(
                                "https://api.star-citizen.wiki/api/v2/vehicles/"
                            )[1]
                        )
                )
            );
        selectRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                select
            );
        components.push(selectRow);
    }

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        buttons
    );

    components.push(buttonRow);

    return { components };
}

async function CreateCompareComponents(
    options: CommandInteractionOption[]
): Promise<{ components: [] }> {
    const selectOptions = await Promise.all(
        options.map(async (ship) => {
            const { WikiInfo } = await RetrieveFromAPI(String(ship.value));
            return new StringSelectMenuOptionBuilder()
                .setLabel(WikiInfo.name)
                .setValue(WikiInfo.uuid);
        })
    );
    var components: any = [],
        select = new StringSelectMenuBuilder()
            .setCustomId("vehicles_compare")
            .setPlaceholder("Select vehicle to compare")
            .addOptions(selectOptions),
        selectRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                select
            );
    components.push(selectRow);

    return { components };
}
