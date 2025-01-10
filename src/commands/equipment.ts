import {
  ActionRowBuilder,
  type AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  type CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { blue, ensure } from "@utilities/general";
import {
  Armor,
  Clothes,
  FetchItemInfo,
  Food,
  RequestImage,
  WeaponAttachments,
  Weapons,
} from "../api/wikiAPI";
import type { FPSItemShort, MasterItem, Weapon } from "@/src/types/sc_wiki";

module.exports = {
  flags: {
    dev: false,
  },
  data: new SlashCommandBuilder()
    .setName("equipment")
    .setDescription(
      "Information about the various FPS equipment found around the 'verse"
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(
          "The type of equipment item you wish to retrieve information on."
        )
        .setRequired(true)
        .setChoices(
          { name: "Armor", value: "a" },
          { name: "Weapons", value: "b" },
          { name: "Weapon Attachments", value: "c" },
          { name: "Food", value: "d" },
          { name: "Clothes", value: "e" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription(
          "The name of the item you wish to retrieve information on."
        )
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    let choices: { name: string; value: string }[] = [];

    switch (interaction.options.getString("type")) {
      case "a":
        choices = Armor.map((armor: FPSItemShort) => ({
          name: armor.name,
          value: armor.uuid ? armor.uuid : armor.name,
        }));
        break;
      case "b":
        choices = Weapons.map((weapon: Weapon) => ({
          name: weapon.name,
          value: weapon.uuid ? weapon.uuid : weapon.name,
        }));
        break;
      case "c":
        choices = WeaponAttachments.map((weaponAttachment: FPSItemShort) => ({
          name: weaponAttachment.name,
          value: weaponAttachment.uuid
            ? weaponAttachment.uuid
            : weaponAttachment.name,
        }));
        break;

      case "d":
        choices = Food.map((food: FPSItemShort) => ({
          name: food.name,
          value: food.uuid ? food.uuid : food.name,
        }));
        break;
      case "e":
        choices = Clothes.map((clothes: FPSItemShort) => ({
          name: clothes.name,
          value: clothes.uuid ? clothes.uuid : clothes.name,
        }));
        break;
    }
    const filtered = choices
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((choice) =>
        choice.name.toLowerCase().includes(focusedValue.toLowerCase())
      );
    await interaction.respond(
      filtered.slice(0, 24).map((choice) => ({
        name: choice.name,
        value: choice.value,
      }))
    );
  },
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    const { embed, components } = await CreateEquipmentEmbed(
      ensure(interaction.options.get("type")?.value).toString(),
      ensure(interaction.options.get("item")?.value).toString()
    );

    interaction.editReply({ embeds: [embed], components: components });
  },
};

async function RetrieveFromAPI(name: string): Promise<MasterItem> {
  const data = await FetchItemInfo(name);
  return data;
}

async function CreateEquipmentEmbed(
  type: string,
  name: string
): Promise<{
  embed: EmbedBuilder;
  components: ActionRowBuilder<ButtonBuilder>[];
}> {
  const item = await RetrieveFromAPI(name);

  const embed = new EmbedBuilder()
    .setTitle(`Available since ${item.version}`)
    .setImage(await RequestImage(ensure(item.name)))
    .setDescription(
      `# ${
        item.name ? item.name : "This item doesnt have a name.... weird."
      }\n\n${
        item.description !== undefined
          ? item.description?.en_EN
          : "This item has no description"
      }`
    )
    .setColor(blue)
    .addFields(
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
        inline: true,
      }
    );
  if (item.description_data?.length !== 0) {
    embed.addFields(
      ...ensure(
        item.description_data?.map((item) => {
          return {
            name:
              item.name === "NDR" ? "Nutritional Density Rating" : item.name,
            value: item.type,
            inline: true,
          };
        })
      )
    );
  }

  let components: ActionRowBuilder<ButtonBuilder>[] = [];

  switch (type) {
    case "a": {
      embed.addFields({
        name: "Resistances",
        value: ensure(
          item.clothing?.resistances?.map((item) => {
            return `- ${item.type}: ${item.multiplier}x`;
          })
        ).join("\n"),
      });

      let name: string;

      switch (ensure(item.name).split(" ")[0]) {
        case "Lynx":
          name = `${ensure(item.name).split(" ")[0]}_(armour_set)`;
          break;
        default:
          name = ensure(item.name).split(" ")[0];
          break;
      }
      const buttons = [
        new ButtonBuilder()
          .setURL(`https://starcitizen.tools/${name}`)
          .setLabel("View wiki page")
          .setStyle(ButtonStyle.Link),
      ];

      components = [
        new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
      ];
      break;
    }
    case "b": {
      let modes = { name: "Firing Modes", value: "N/A", inline: true };
      let damages = { name: "Damage Types", value: "N/A", inline: true };
      if (
        item.personal_weapon?.modes !== null &&
        item.personal_weapon?.modes !== undefined
      ) {
        modes = {
          name: "Firing Modes",
          value: ensure(item.personal_weapon?.modes)
            .map(
              (mode) =>
                `- ${mode.mode}: ${
                  mode.rpm
                }rpm | ${mode.damage_per_second.toFixed(2)} DPS`
            )
            .join("\n"),
          inline: false,
        };
      }
      if (item.personal_weapon?.damages !== undefined) {
        damages = {
          name: "Dammage types",
          value: ensure(item.personal_weapon?.damages)
            .map((item) => `- ${item.name}/${item.type} ${item.damage}dmg`)
            .join("\n"),
          inline: false,
        };
      }

      let magazine = {
        name: "Magazine",
        value: "Info not available...",
        inline: true,
      };

      if (item.ports !== undefined)
        for (const port of item.ports) {
          if (port.position === "Magazine") {
            magazine = {
              name: "Magazine",
              value: ensure(port.equipped_item.name),
              inline: true,
            };
          }
        }

      embed.addFields(modes, damages, magazine);
      const buttons = [
        new ButtonBuilder()
          .setURL(
            `https://starcitizen.tools/${ensure(item.name).replaceAll(
              " ",
              "_"
            )}`
          )
          .setLabel("View wiki page")
          .setStyle(ButtonStyle.Link),
      ];

      components = [
        new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
      ];
      break;
    }
    case "c":
      {
        const buttons = [
          new ButtonBuilder()
            .setURL(
              `https://starcitizen.tools/${ensure(item.name).replaceAll(
                " ",
                "_"
              )}`
            )
            .setLabel("View wiki page")
            .setStyle(ButtonStyle.Link),
        ];

        components = [
          new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
        ];
      }
      break;
    case "d": {
      // some items have next to no information, causing the command to error out if we try to ensure their information.
      if (
        item.food?.container_type !== null &&
        item.food?.can_be_reclosed !== null
      ) {
        embed.addFields(
          {
            name: "Packaging type",
            value: ensure(item.food?.container_type)
              .replace(/([A-Z])/g, " $1")
              .replace(/^./g, (str) => {
                return str.toUpperCase();
              }),
            inline: true,
          },

          {
            name: "Resealable",
            value: ensure(item.food?.can_be_reclosed) ? "Yes" : "no",
            inline: true,
          }
        );
      }
      break;
    }
    case "e": {
      embed.addFields(
        {
          name: "Brand",
          value: `${item.manufacturer?.name} (${item.manufacturer?.code})`,
          inline: true,
        },
        {
          name: "Clothing type",
          value: ensure(item.clothing?.clothing_type),
          inline: true,
        },
        {
          name: "Temperature Resistances",
          value: `${item.clothing?.temp_resistance_min} / ${item.clothing?.temp_resistance_max} °C`,
          inline: true,
        }
      );
      break;
    }
  }

  return { embed, components };
}
