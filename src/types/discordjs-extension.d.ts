import "discord.js";
import { Collection, SlashCommandBuilder } from "discord.js";
declare module "discord.js" {
    export interface Client<Ready> {
        commands: Collection<
            string,
            {
                data: SlashCommandBuilder;
                execute: (interaction: CommandInteraction) => Promise<void>;
            }
        >;
    }
}
