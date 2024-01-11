import {
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { client } from "@/src/runtime";
import { blue, msToTime } from "@utilities/general";
import pjson from "@/package.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("starlight")
        .setDescription("Various information about me"),
    async execute(interaction: CommandInteraction) {
        const infoEmbed: EmbedBuilder = new EmbedBuilder()
            .setColor(blue)
            .setDescription(
                `# Starlight${
                    process.env.NODE_ENV === "production" ? "" : " In-dev"
                }.\nThe solution for your trading and general knowledge needs.\n`
            )
            .setFields(
                {
                    name: "Version",
                    value: `${pjson.version}`,
                    inline: true,
                },
                {
                    name: "Status",
                    value:
                        process.env.NODE_ENV === "production"
                            ? "Production"
                            : "Development",
                    inline: true,
                },
                {
                    name: "Uptime",
                    value: msToTime(client.uptime),
                    inline: true,
                },
                {
                    name: "WS Heartbeat",
                    value: `${client.ws.ping}ms`,
                    inline: true,
                },
                { name: "Response Ping", value: "pinging..." },
                {
                    name: "Server",
                    value: "Starlight Mainframe ( MT Datacenter 8FK-Q2X-K )",
                },
                {
                    name: "Relay Provider",
                    value: "Aciedo CommRelay [ relays ST4-64, ST4-22, ST2-55 ]",
                },
                { name: "Address", value: "uee.stanton.mic.8fkq2xk.starlight" },
                {
                    name: "Powered By",
                    value: "**[UEX](https://uexcorp.space/)**",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "**[StarCitizen Wiki](https://starcitizen.tools)**",
                    inline: true,
                }
            )
            .setFooter({ text: "Brought to you by king_ultron99#0647." })
            .setTimestamp();

        const sent = await interaction.reply({ embeds: [infoEmbed] });

        interaction.editReply({
            embeds: [
                infoEmbed.setFields(
                    {
                        name: "Version",
                        value: `${pjson.version}`,
                        inline: true,
                    },
                    {
                        name: "Status",
                        value:
                            process.env.NODE_ENV === "production"
                                ? "Production"
                                : "Development",
                        inline: true,
                    },
                    {
                        name: "Uptime",
                        value: msToTime(client.uptime),
                        inline: true,
                    },
                    {
                        name: "WS Heartbeat",
                        value: `${client.ws.ping}ms`,
                        inline: true,
                    },
                    {
                        name: "Response Ping",
                        value: `${
                            sent.createdTimestamp - interaction.createdTimestamp
                        }ms`,
                        inline: true,
                    },
                    {
                        name: "Server",
                        value: "Starlight Mainframe ( MT Datacenter 8FK-Q2X-K )",
                    },
                    {
                        name: "Relay Provider",
                        value: "Aciedo CommRelay [ relays ST4-64, ST4-22, ST2-55 ]",
                    },
                    {
                        name: "Address",
                        value: "uee.stanton.mic.8fkq2xk.starlight",
                    },
                    {
                        name: "Powered By",
                        value: "**[UEX](https://uexcorp.space/)**",
                        inline: true,
                    },
                    {
                        name: "\u200b",
                        value: "**[StarCitizen Wiki](https://starcitizen.tools)**",
                        inline: true,
                    }
                ),
            ],
        });
    },
};
