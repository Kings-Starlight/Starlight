import {
    ButtonInteraction,
    CacheType,
    Interaction,
    StringSelectMenuInteraction,
} from "discord.js";

export interface Command {
    flags: {
        dev: boolean;
    };
    data: SlashCommandBuilder;
    autocomplete: (
        Interaction: AutocompleteInteraction<CacheType>
    ) => Promise<void>;
    selectInteraction: (
        Interaction: AnySelectMenuInteraction<CacheType>
    ) => Promise<void>;
    buttonInteraction: (
        Interaction: ButtonInteraction<CacheType>
    ) => Promise<void>;
    execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}
