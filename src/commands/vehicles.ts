import {
    ActionRowBuilder,
    type AnyComponentBuilder,
    type AnySelectMenuInteraction,
    type AttachmentBuilder,
    type AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    type CommandInteraction,
    type CommandInteractionOption,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import type { MasterItem, SearchResponse, VehicleStore, WikiShip } from "@/src/types/sc_wiki";
import type { UEXShip } from "@/src/types/uex";
import { FetchVehicleSerie, RequestImage, SearchGalactapedia, Ships } from "@api/wikiAPI";
import { RetrieveVehicleInfo } from "@api/wikiAPI";
import { blue, ensure, getBrandImage, msToTime } from "@utilities/general";
import { UEXShips } from "@api/uexAPI";
import { log } from "@logging/logger";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vehicles")
        .setDescription("Get information about all the various vehicles in the 'verse")
        .addSubcommand((sub) =>
            sub
                .setName("search")
                .setDescription("Search for information about a specific vehicle.")
                .addStringOption((option) =>
                    option
                        .setName("vehicle")
                        .setDescription("The name of the vehicle you wish to retrieve information on.")
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
                        .setDescription("The name of the vehicle you wish to retrieve information on.")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("second")
                        .setDescription("The name of the vehicle you wish to retrieve information on.")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ),
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        const choices: { name: string; value: string }[] = Ships.map((ship: SearchResponse) => ({
            name: ship.name,
            value: ship.uuid ? ship.uuid : ship.name,
        }));
        const filtered = choices
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((choice) => choice.name.toLowerCase().includes(focusedValue));
        await interaction.respond(
            filtered.slice(0, 24).map((choice) => ({
                name: choice.name,
                value: choice.value,
            }))
        );
    },
    async selectInteraction(interaction: AnySelectMenuInteraction) {
        switch (interaction.customId) {
            case "vehicles_compare": {
                interaction.deferUpdate();
                const embed = await CreateGeneralEmbed(interaction.values[0]);
                const start = Date.now();

                try {
                    interaction.editReply({
                        embeds: [
                            embed.embed.setFooter({
                                text: `took ${msToTime(Date.now() - start)}`,
                            }),
                        ],
                    });
                } catch (error) {
                    log.error("failed to update message:\n", error);
                    0;
                    interaction.message.edit({
                        embeds: [
                            embed.embed.setFooter({
                                text: `took ${msToTime(Date.now() - start)}`,
                            }),
                        ],
                    });
                }
                break;
            }
            case "vehicles_variant": {
                interaction.deferUpdate();
                const embed = await CreateGeneralEmbed(interaction.values[0]);
                const start = Date.now();

                const components = await CreateShipComponents(interaction.values[0]);

                try {
                    interaction.editReply({
                        embeds: [
                            embed.embed.setFooter({
                                text: `took ${msToTime(Date.now() - start)}`,
                            }),
                        ],
                        components,
                    });
                } catch (error) {
                    log.error("failed to update message:\n", error);
                    interaction.message.edit({
                        embeds: [
                            embed.embed.setFooter({
                                text: `took ${msToTime(Date.now() - start)}`,
                            }),
                        ],
                        components,
                    });
                }
                break;
            }
            case "vehicles_page": {
                await interaction.deferUpdate();
                const start = Date.now();

                const name = interaction.values[0].split("_")[0];
                const page = interaction.values[0].split("_")[1];
                const components = await CreateShipComponents(name, page);
                switch (page) {
                    case "General": {
                        const { embed, file } = await CreateGeneralEmbed(name);
                        interaction.editReply({
                            embeds: [
                                embed.setFooter({
                                    text: `took ${msToTime(Date.now() - start)}`,
                                }),
                            ],
                            components,
                            files: file ? [file] : [],
                        });
                        break;
                    }
                    case "Weapons": {
                        const { embed, file } = await CreateWeaponsEmbed(name);
                        interaction.editReply({
                            embeds: [
                                embed.setFooter({
                                    text: `took ${msToTime(Date.now() - start)}`,
                                }),
                            ],
                            components,
                            files: file ? [file] : [],
                        });
                        break;
                    }
                    case "Components": {
                        const { embed, file } = await CreateComponentsEmbed(name);
                        interaction.editReply({
                            embeds: [
                                embed.setFooter({
                                    text: `took ${msToTime(Date.now() - start)}`,
                                }),
                            ],
                            components,
                            files: file ? [file] : [],
                        });
                        break;
                    }
                }

                break;
            }
        }
    },
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        const start = Date.now();

        const data = interaction.options.data[0];

        switch (data.name) {
            case "search": {
                const embed = await CreateGeneralEmbed(String(ensure(data.options)[0].value));
                const components = await CreateShipComponents(String(ensure(data.options)[0].value));
                interaction.editReply({
                    embeds: [
                        embed.embed.setFooter({
                            text: `took ${msToTime(Date.now() - start)}`,
                        }),
                    ],
                    components,
                    files: embed.file ? [embed.file] : [],
                });
                break;
            }
            case "compare": {
                const embed = await CreateGeneralEmbed(String(ensure(data.options)[0].value));
                const components = await CreateCompareComponents(ensure(data.options));
                interaction.editReply({
                    embeds: [
                        embed.embed.setFooter({
                            text: `took ${msToTime(Date.now() - start)}`,
                        }),
                    ],
                    components,
                    files: embed.file ? [embed.file] : [],
                });
                break;
            }
        }
    },
};

async function RetrieveFromAPI(name: string) {
    const WikiInfo: WikiShip = await RetrieveVehicleInfo(name);
    const UEXInfo: UEXShip = UEXShips.filter((ship: UEXShip) => ship.name.includes(WikiInfo.name))[0];

    return { WikiInfo, UEXInfo };
}

/** Creates a message embed for a specified ship. */
async function CreateGeneralEmbed(name: string): Promise<{ embed: EmbedBuilder; file: AttachmentBuilder | null }> {
    const embed = new EmbedBuilder();

    const { WikiInfo } = await RetrieveFromAPI(name);

    if (WikiInfo.production_status.en_EN !== "flight-ready") {
        embed
            .setTitle(`${WikiInfo.manufacturer.name} (${WikiInfo.manufacturer.code})`)
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
                    value: WikiInfo.foci.map((foci) => `- ${foci.en_EN}`).join("\n"),
                    inline: true,
                },
                {
                    name: "Crew Capacity",
                    value: `${WikiInfo.crew.min}`,
                    inline: true,
                },
                {
                    name: "Pledge Price (USD)",
                    value: `${WikiInfo.msrp !== undefined ? `$${WikiInfo.msrp}` : "Not for sale"}`,
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
                    value: `${WikiInfo.production_status ? WikiInfo.production_status.en_EN : "Unknown"}`,
                }
            )

            .setImage(await RequestImage(WikiInfo.name));
    } else {
        // At which locations can the specified ship be rented at?
        let rentable: VehicleStore[] = [];
        // At which locations can the specified ship be bought at?
        let buyable: VehicleStore[] = [];

        // Some ships dont have ANY "shops" information returned,
        // so a check needs to be done to prevent any errors from trying to filter a non-existent value
        if (WikiInfo.shops) {
            rentable = WikiInfo.shops.filter(
                (shop) => shop.items.filter((item) => item.rentable === true).length !== 0
            );
            buyable = WikiInfo.shops.filter((shop) => shop.items.filter((item) => item.buyable === true).length !== 0);
        }

        // Do we have all the information we need?

        const complete: boolean =
            Object.prototype.hasOwnProperty.call(WikiInfo, "insurance") &&
            Object.prototype.hasOwnProperty.call(WikiInfo, "fuel") &&
            Object.prototype.hasOwnProperty.call(WikiInfo, "quantum") &&
            Object.prototype.hasOwnProperty.call(WikiInfo, "msrp") &&
            Object.prototype.hasOwnProperty.call(WikiInfo, "health");

        embed
            .setDescription(
                `# ${WikiInfo.name}\n${WikiInfo.description.en_EN}${
                    !complete &&
                    "\n\n**We've noticed that this ship might not have a complete set of information at the moment.\nWe rely on the starcitizen wiki for up-to-date information about ships, this can take time for the maintainers to compile!**"
                }`
            )
            .setTitle(`${WikiInfo.manufacturer.name} (${WikiInfo.manufacturer.code})`)
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
                    value: WikiInfo.foci.map((foci) => `- ${foci.en_EN}`).join("\n"),
                    inline: true,
                },
                {
                    name: "Crew Capacity",
                    value: WikiInfo.crew.min.toString(),
                    inline: true,
                },
                {
                    name: "Pledge Price (USD)",
                    value: `${WikiInfo.msrp !== undefined ? `$${WikiInfo.msrp || 0}` : "Not for sale"}`,
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
                        buyable.length !== 0 && buyable !== undefined
                            ? buyable.map((shop) => `${shop.name_raw}: ${shop.items[0].base_price} aUEC`).join("\n")
                            : "This vehicle is not available for purchase...",
                },
                {
                    name: "Where to rent",
                    value:
                        rentable.length !== 0 && rentable !== undefined
                            ? rentable
                                  .map(
                                      (shop) =>
                                          `- ${shop.name_raw}:\n - 1d: ${
                                              shop.items[0].rental_price_days.duration_1
                                                  ? `${shop.items[0].rental_price_days.duration_1}aUEC`
                                                  : "not available"
                                          }\n - 3d: ${
                                              shop.items[0].rental_price_days.duration_3
                                                  ? `${shop.items[0].rental_price_days.duration_3}aUEC`
                                                  : "not available"
                                          }\n - 7d: ${
                                              shop.items[0].rental_price_days.duration_7
                                                  ? `${shop.items[0].rental_price_days.duration_7}aUEC`
                                                  : "not available"
                                          }\n - 30d: ${
                                              shop.items[0].rental_price_days.duration_30
                                                  ? `${shop.items[0].rental_price_days.duration_30}aUEC`
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
                    value: Intl.NumberFormat("en").format(WikiInfo.health || 0),
                    inline: true,
                },
                {
                    name: "Shield Health",
                    value: Intl.NumberFormat("en").format(WikiInfo.shield_hp || 0),
                    inline: true,
                },
                {
                    name: "Speed (m/s)",
                    value: `SCM: ${WikiInfo.speed.scm} | Max: ${WikiInfo.speed.max}`,
                    inline: true,
                },
                {
                    name: "Mass",
                    value: `${Intl.NumberFormat("en").format(WikiInfo.mass)} kg`,
                    inline: true,
                },
                WikiInfo.fuel
                    ? {
                          name: "Hydrogen",
                          value: `Capacity: ${Intl.NumberFormat("en").format(
                              WikiInfo.fuel.capacity
                          )} L\n**Hydrogen Usage**\nMain: ${WikiInfo.fuel.usage.main} | Retro: ${
                              WikiInfo.fuel.usage.retro
                          }\nManeuvering: ${WikiInfo.fuel.usage.maneuvering} |  VTOL: ${WikiInfo.fuel.usage.vtol}`,
                          inline: true,
                      }
                    : { name: "Hydrogen", value: "Unknown", inline: true },
                {
                    name: "Quantum",
                    value: WikiInfo.quantum
                        ? `Speed: ${Intl.NumberFormat("en").format(
                              WikiInfo.quantum.quantum_speed / 1000
                          )} km/s\nSpool Time: ${msToTime(
                              WikiInfo.quantum.quantum_spool_time * 1000
                          )}\nFuel Capacity: ${Intl.NumberFormat("en").format(
                              WikiInfo.quantum.quantum_fuel_capacity
                          )} L\nRange: ${Intl.NumberFormat("en").format(WikiInfo.quantum.quantum_range)}`
                        : "Unknown",
                    inline: true,
                },
                WikiInfo.emission
                    ? {
                          name: "Emissions",
                          value: `IR: ${WikiInfo.emission.ir}\nEM Idle: ${WikiInfo.emission.em_idle} | EM Max: ${WikiInfo.emission.em_max}`,
                      }
                    : { name: "Emissions", value: "Unknown" },
                WikiInfo.insurance
                    ? {
                          name: "Insurance",
                          value: `Claim Time: ${msToTime(
                              WikiInfo.insurance.claim_time * 1000 * 60
                          )}\nExpedite Time: ${msToTime(
                              WikiInfo.insurance.expedite_time * 1000 * 60
                          )} | Expedite Cost: ${Intl.NumberFormat("en").format(WikiInfo.insurance.expedite_cost)} aUEC`,
                      }
                    : { name: "Insurance", value: "Unknown" },
                {
                    name: "Production Status",
                    value: `${WikiInfo.production_status.en_EN} since ${WikiInfo.version}`,
                }
            )
            .setImage(await RequestImage(WikiInfo.name));
    }
    return { embed, file: null };
}
/** Generates the components for a single ship*/
async function CreateShipComponents(
    name: string,
    page = "General"
    // biome-ignore lint/suspicious/noExplicitAny: Discord.js's AnyComponentBuilder generic causes issues when passing components into replies. Specifying any stops this. I cannot set a specific generic as multiple are being used.
): Promise<ActionRowBuilder<any>[]> {
    const { WikiInfo, UEXInfo } = await RetrieveFromAPI(name);
    const RSI = await SearchGalactapedia(WikiInfo.name);

    const disabledLink = (item: string) => {
        return new ButtonBuilder()
            .setLabel(`${item} unavailable`)
            .setStyle(ButtonStyle.Link)
            .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            .setDisabled(true);
    };

    const buttons = [
        UEXInfo?.url_store
            ? new ButtonBuilder().setURL(UEXInfo.url_store).setLabel("Go to store page").setStyle(ButtonStyle.Link)
            : disabledLink("Store"),
        new ButtonBuilder()
            .setURL(`https://starcitizen.tools/${WikiInfo.name.replaceAll(" ", "_")}`)
            .setLabel("View wiki page")
            .setStyle(ButtonStyle.Link),
        RSI && RSI.length > 0
            ? new ButtonBuilder().setURL(RSI[0].rsi_url).setLabel("View Galactapedia entry").setStyle(ButtonStyle.Link)
            : disabledLink("Galactapedia"),
    ];
    let select: StringSelectMenuBuilder;
    const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>();
    const serieRow = new ActionRowBuilder<StringSelectMenuBuilder>();
    let serieSelect: StringSelectMenuBuilder;

    const components: ActionRowBuilder<AnyComponentBuilder>[] = [];
    const pageSelect = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("vehicles_page")
            .setPlaceholder("Select a page")
            .setDisabled(!!(WikiInfo.hardpoints === undefined || WikiInfo.production_status.en_EN !== "flight-ready"))
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("General")
                    .setValue(`${WikiInfo.uuid}_General`)
                    .setDefault(page === "General")
                    .setDescription("Provides a general overview of the vehicle, its price and where to buy it."),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Weapons")
                    .setValue(`${WikiInfo.uuid}_Weapons`)
                    .setDefault(page === "Weapons")
                    .setDescription("Provides an overview of the vehicles weapons."),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Components")
                    .setValue(`${WikiInfo.uuid}_Components`)
                    .setDefault(page === "Components")
                    .setDescription("Provides an overview of the vehicles components")
            )
    );
    components.push(pageSelect);

    const serieFilter = (await FetchVehicleSerie(WikiInfo.chassis_id)).filter((ship) => ship.name !== WikiInfo.name);

    if (serieFilter.length !== 0) {
        serieSelect = new StringSelectMenuBuilder()
            .setCustomId("vehicles_variant")
            .setPlaceholder("Select variant")
            .addOptions(
                serieFilter.map((ship) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(ship.name)
                        .setValue(ship.link.split("https://api.star-citizen.wiki/api/v2/vehicles/")[1]);
                })
            );
        serieRow.addComponents(serieSelect);
        components.push(serieRow);
    }

    if (WikiInfo.loaner && WikiInfo.loaner?.length !== 0) {
        select = new StringSelectMenuBuilder()
            .setCustomId("vehicles_loaner")
            .setPlaceholder("Select Loaner")
            .addOptions(
                WikiInfo.loaner.map((ship) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(ship.name)
                        .setValue(ship.link.split("https://api.star-citizen.wiki/api/v2/vehicles/")[1])
                )
            );
        selectRow.addComponents(select);
        components.push(selectRow);
    }

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    components.push(buttonRow);

    return components;
}

async function CreateCompareComponents(
    options: CommandInteractionOption[]
    // biome-ignore lint/suspicious/noExplicitAny: Discord.js's AnyComponentBuilder generic causes issues when passing components into replies. Specifying any stops this. I cannot set a specific generic as multiple are being used.
): Promise<ActionRowBuilder<any>[]> {
    const selectOptions = await Promise.all(
        options.map(async (ship) => {
            const { WikiInfo } = await RetrieveFromAPI(String(ship.value));
            return new StringSelectMenuOptionBuilder().setLabel(WikiInfo.name).setValue(WikiInfo.uuid);
        })
    );

    const components: ActionRowBuilder<AnyComponentBuilder>[] = [];
    const select = new StringSelectMenuBuilder()
        .setCustomId("vehicles_compare")
        .setPlaceholder("Select vehicle to compare")
        .addOptions(selectOptions);
    const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
    components.push(selectRow);

    return components;
}

async function CreateWeaponsEmbed(name: string): Promise<{ embed: EmbedBuilder; file: AttachmentBuilder | null }> {
    const { WikiInfo } = await RetrieveFromAPI(name);

    const TurretWeapons = (i: number) => {
        const temp = [];
        for (const [k, v] of Object.entries(
            WikiInfo.hardpoints
                .filter((hardpoint) => hardpoint.type === "Turret" || hardpoint.type === "TurretBase")
                [i].children.reduce((acc, child) => {
                    if (!acc[ensure(child.item.name)]) {
                        acc[ensure(child.item.name)] = {
                            count: 0,
                            size: ensure(child.item.size),
                        };
                    }
                    acc[ensure(child.item.name)].count++;
                    return acc;
                }, {} as Record<string, { count: number; size: number }>)
        )) {
            temp.push(
                `> ${
                    Object.entries(
                        WikiInfo.hardpoints
                            .filter((hardpoint) => hardpoint.type === "Turret" || hardpoint.type === "TurretBase")
                            [i].children.reduce((acc, child) => {
                                if (!acc[ensure(child.item.name)]) {
                                    acc[ensure(child.item.name)] = {
                                        count: 0,
                                    };
                                }
                                acc[ensure(child.item.name)].count++;
                                return acc;
                            }, {} as Record<string, { count: number }>)
                    )
                        .slice(-1)
                        .find(([k1]) => k1 === k)
                        ? "└─"
                        : "├─"
                } x${v.count} S${v.size} ${k}${v.count > 1 ? "s" : ""} `
            );
        }
        return temp;
    };

    const embed = new EmbedBuilder()
        .setDescription(
            `# ${WikiInfo.name} > Weapons
            ${
                WikiInfo.hardpoints !== undefined
                    ? `${
                          WikiInfo.hardpoints.filter((hardpoint) => hardpoint.type === "WeaponGun").length !== 0
                              ? `## Fixed Weaponry
                              ${WikiInfo.hardpoints
                                  .filter((hardpoint) => hardpoint.type === "WeaponGun")
                                  .map((weapon) => {
                                      return `### ${weapon.item.name}
                              > ${ensure(weapon.item.manufacturer).name} (**${
                                          ensure(weapon.item.manufacturer).code
                                      }**)\n> **Size**: ${weapon.item.size} | ${weapon.item.mass}kg\n> **Class**: ${
                                          ensure(weapon.item.vehicle_weapon).type
                                      }\n> **Capacity**: ${ensure(weapon.item.vehicle_weapon).capacity}\n> **Range**: ${
                                          ensure(weapon.item.vehicle_weapon).range
                                      }m\n`;
                                  })
                                  .join("\n")}`
                              : ""
                      }\n${
                          WikiInfo.hardpoints.filter(
                              (hardpoint) => hardpoint.type === "Turret" || hardpoint.type === "TurretBase"
                          ).length !== 0
                              ? `## Gimbal/Turret Weaponry\n${WikiInfo.hardpoints
                                    .filter(
                                        (hardpoint) => hardpoint.type === "Turret" || hardpoint.type === "TurretBase"
                                    )
                                    .map((weapon, i) => {
                                        return `### ${weapon.item.name}\n> **Size**: ${
                                            weapon.item.size
                                        }\n> **Location**: ${weapon.position}\n> **Weapon(s)**:\n${TurretWeapons(
                                            i
                                        ).join("\n")}`;
                                    })
                                    .join("\n")}`
                              : ""
                      }`
                    : "This ship does not have any hardpoint information!"
            }`
        )
        .setTimestamp()
        .setColor(blue)
        .setTitle(WikiInfo.manufacturer.name);

    return { embed, file: null };
}

async function CreateComponentsEmbed(name: string): Promise<{ embed: EmbedBuilder; file: AttachmentBuilder | null }> {
    const { WikiInfo } = await RetrieveFromAPI(name);

    const components = () => {
        const temp: string[] = [];
        for (const [k, v] of Object.entries(
            WikiInfo.hardpoints
                .filter(
                    (hardpoint) =>
                        hardpoint.type === "Shield" ||
                        hardpoint.type === "QuantumDrive" ||
                        hardpoint.type === "PowerPlant" ||
                        hardpoint.type === "Cooler"
                )
                .reduce((acc, child) => {
                    if (!acc[ensure(child.item.name)]) {
                        acc[ensure(child.item.name)] = {
                            count: 0,
                            item: child.item,
                        };
                    }
                    ensure(acc[ensure(child.item.name)]).count++;
                    return acc;
                }, {} as Record<string, { count: number; item: MasterItem }>)
        )) {
            temp.push(
                `## x${v.count} [${k}](https://starcitizen.tools/${k.replaceAll(" ", "_")})\n${
                    // more empty arrays for descriptions...
                    (v.item.description as unknown as []).length !== 0
                        ? v.item.description?.en_EN
                        : "This item does not have a description"
                }\n\n> **Manufacturer**: ${v.item.manufacturer?.name} (${v.item.manufacturer?.code})\n> **Type**: ${
                    v.item.type
                }\n> **Size**: ${v.item.size}\n> **Grade**: ${v.item.grade} | **Class**: ${v.item.class}`
            );
        }
        return temp;
    };

    const embed = new EmbedBuilder()
        .setDescription(
            WikiInfo.hardpoints !== undefined
                ? `# ${WikiInfo.name} > Components\n${
                      WikiInfo.hardpoints.filter(
                          (hardpoint) =>
                              hardpoint.type === "Shield" ||
                              hardpoint.type === "QuantumDrive" ||
                              hardpoint.type === "PowerPlant" ||
                              hardpoint.type === "Cooler"
                      ).length !== 0
                          ? components().join("\n")
                          : "Strange... this ship doesnt appear to have any core components listed..."
                  }`
                : "This ship does not have any hardpoint information!"
        )
        .setTimestamp()
        .setColor(blue)
        .setTitle(WikiInfo.manufacturer.name);

    return { embed, file: null };
}
