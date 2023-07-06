export interface Command {
    data: SlashCommandBuilder;
    autocomplete: (
        Interaction: AutocompleteInteraction<CacheType>
    ) => Promise<void>;
    execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}
