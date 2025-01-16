import { type AutocompleteInteraction, type CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { FPSItemShort, MasterItem } from "../types/sc_wiki";
import { FetchItemInfo, Items, RequestImage, VehicleWeapons } from "../api/wikiAPI";
import { blue, ensure } from "../utilities/general";
import { it } from "node:test";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vehicle_equipment")
        .setDescription("Information about the various vehicle components found around the 'verse")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("The type of equipment item you wish to retrieve information on.")
                .setRequired(true)
                .setChoices(
                    { name: "Quantum Drives", value: "a" },
                    { name: "Coolers", value: "b" },
                    { name: "Power Plants", value: "c" },
                    { name: "Shield Generators", value: "d" },
                    { name: "Armaments", value: "e" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("The name of the item you wish to retrieve information on.")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        let choices: { name: string; value: string }[] = [];
        switch (interaction.options.getString("type")) {
            case "a":
                choices = Items.filter((item) => item.type === "QuantumDrive").map((qDrive: FPSItemShort) => ({
                    name: qDrive.name,
                    value: qDrive.uuid ? qDrive.uuid : qDrive.name,
                }));
                break;
            case "b":
                choices = Items.filter((item) => item.type === "Cooler").map((cooler: FPSItemShort) => ({
                    name: cooler.name,
                    value: cooler.uuid ? cooler.uuid : cooler.name,
                }));
                break;
            case "c":
                choices = Items.filter((item) => item.type === "PowerPlant").map((pPlant: FPSItemShort) => ({
                    name: pPlant.name,
                    value: pPlant.uuid ? pPlant.uuid : pPlant.name,
                }));
                break;

            case "d":
                choices = Items.filter((item) => item.type === "Shield").map((sGen: FPSItemShort) => ({
                    name: sGen.name,
                    value: sGen.uuid ? sGen.uuid : sGen.name,
                }));
                break;
            case "e":
                choices = VehicleWeapons.map((armament: FPSItemShort) => ({
                    name: armament.name,
                    value: armament.uuid ? armament.uuid : armament.name,
                }));
        }
        const filtered = choices
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((choice) => choice.name.toLowerCase().includes(focusedValue.toLowerCase()));
        await interaction.respond(
            filtered.slice(0, 24).map((choice) => ({
                name: choice.name,
                value: choice.value,
            }))
        );
    },
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();

        const { embed } = await CreateEquipmentEmbed(
            ensure(interaction.options.get("type")?.value).toString(),
            ensure(interaction.options.get("item")?.value).toString()
        );

        interaction.editReply({ embeds: [embed] });
    },
};
async function retrieveFromAPI(name: string): Promise<MasterItem> {
    const data = await FetchItemInfo(name);
    return data;
}

async function CreateEquipmentEmbed(type: string, name: string): Promise<{ embed: EmbedBuilder }> {
    const item = await retrieveFromAPI(name);

    const embed = new EmbedBuilder()
        .setTitle(`Available since ${item.version}`)
        .setDescription(
            `# ${item.name ? item.name : "This item doesnt have a name.... weird."}\n\n${
                item.description !== undefined ? item.description?.en_EN : "This item has no description"
            }`
        )
        .setColor(blue)
        .addFields(
            ...ensure(item.description_data).map((entry) => {
                return { name: entry.name, value: entry.type, inline: true };
            }),
            {
                name: "Mass (KG)",
                value: ensure(item.mass).toString(),
                inline: true,
            },
            {
                name: "Dimensions (W x H x L)",
                value: item.dimension?.true_dimension
                    ? `${item.dimension?.true_dimension.width}m x ${item.dimension?.true_dimension.height}m x ${item.dimension?.true_dimension.length}m`
                    : `${item.dimension?.width}m x ${item.dimension?.height}m x ${item.dimension?.length}m`,
                inline: false,
            }
        );

    switch (type) {
        case "a":
            embed.addFields(
                {
                    name: "Jump Range (KM)",
                    value: `${ensure(item.quantum_drive).jump_range}`,
                    inline: true,
                },
                {
                    name: "Modes",
                    value: `${ensure(item.quantum_drive)
                        .modes.map((mode) => {
                            return `**${mode.type.split("_")[0].toUpperCase()}**\n> **Speed**: ${
                                mode.drive_speed
                            }\n> **Stage 1 Accel Rate**: ${mode.stage_one_accel_rate}\n> **Stage 2 Accel Rate**: ${
                                mode.stage_two_accel_rate
                            }\n> **Spool Time (s)**: ${mode.spool_up_time}\n`;
                        })
                        .join("\n")}`,
                    inline: false,
                }
            );
            break;
        case "b": {
            embed.addFields({
                name: "Cooling rate",
                value: `${ensure(item.cooler).cooling_rate}`,
            });
            break;
        }
        case "d":
            embed.addFields(
                {
                    name: "Max health",
                    value: ensure(item.shield).max_shield_health.toString(),
                    inline: true,
                },
                {
                    name: "Max regen rate",
                    value: ensure(item.shield).max_shield_regen.toString(),
                    inline: true,
                },
                {
                    name: "Regen Delay (s)",
                    value: `> **Downed**: ${item.shield?.regen_delay.downed}\n> **Damaged**: ${item.shield?.regen_delay.damage}`,
                    inline: false,
                }
            );
            break;
        case "e":
            embed.addFields(
                {
                    name: "Capacity",
                    value: ensure(item.vehicle_weapon).capacity.toString(),
                    inline: true,
                },
                {
                    name: "Firing Modes",
                    value: `${ensure(item.vehicle_weapon?.modes).map(
                        (mode) =>
                            `**${mode.type.toUpperCase()}** (${mode.mode})\n> **RPM**: ${
                                mode.rpm
                            }\n> **DPS**: ${mode.damage_per_second.toFixed(2)}\n`
                    )}`,
                    inline: false,
                }
            );
            break;
    }

    embed.addFields(
        {
            name: "Durability",
            value: ensure(item.durability).health.toString(),
            inline: true,
        },
        {
            name: "Repairable?",
            value: ensure(item.durability).repairable ? "Yes" : "No",
            inline: true,
        },
        {
            name: "Salvageable?",
            value: ensure(item.durability).salvageable ? "Yes" : "No",
            inline: true,
        }
    );

    return { embed };
}
