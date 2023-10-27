import "discord.js";
import { Collection, SlashCommandBuilder } from "discord.js";
import { Command } from "@/commands";
declare module "discord.js" {
    export interface Client<Ready> {
        commands: Collection<string, Command>;
    }
}
