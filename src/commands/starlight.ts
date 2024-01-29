import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { client } from "@/src/runtime";
import { blue, dev, msToTime, prod, red } from "@utilities/general";
import pjson from "@/package.json";
import { Github } from "@utilities/octokit";
import { ErrorResponse } from "../utilities/errors";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("starlight")
        .setDescription("Various information about me"),
    async modalInteraction(interaction: ModalSubmitInteraction) {
        Github.rest.issues
            .create({
                owner: "kingultron99",
                repo: "Starlight",
                title: interaction.fields.getTextInputValue(
                    "starlight_feedback-title"
                ),
                body: interaction.fields.getTextInputValue(
                    "starlight_feedback-description"
                ),
                assignees: ["kingultron99"],
            })
            .then(() => {
                interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(":tada: Success!")
                            .setDescription(
                                "# Thank you!\n Your feedback has been submitted and an issue has been created.\nIts thanks to people like you, that <@864438005599305729> can continue to improve!\n\n## Want to go the extra mile?\n press the button below to support the development of <@864438005599305729>!\nAll tips & donations go towards keeping the bot hosted."
                            )
                            .setColor("Green")
                            .setTimestamp(),
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setURL("https://ko-fi.com/king_ultron99")
                                .setLabel("Support me on Ko-Fi")
                                .setStyle(ButtonStyle.Link)
                        ),
                    ],
                });
            })
            .catch((err: Error) =>
                ErrorResponse(
                    interaction,
                    "Sorry, I was unable to submit your report.",
                    err
                )
            );
    },
    async buttonInteraction(interaction: ButtonInteraction) {
        if (interaction.customId !== "starlight_feedback-confirm") {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    {
                        description:
                            "# Submit Feedback:\nYou can use this tool to create feature requests or issue bug reports.\n\n## PLEASE NOTE:\nIf it is found that users are abusing this tool, either to troll or to send unrelated submissions, we will remove this tool completely. \n\nPlease use this carefully.",
                        color: red,
                    },
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("starlight_feedback-confirm")
                            .setLabel("Confirm")
                            .setStyle(ButtonStyle.Danger)
                    ),
                ],
            });
            return;
        }
        const modal = new ModalBuilder()
            .setCustomId("starlight_feedback-submit")
            .setTitle("Send Feedback")
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("starlight_feedback-title")
                        .setStyle(TextInputStyle.Short)
                        .setLabel("Title")
                        .setRequired(true)
                ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("starlight_feedback-description")
                        .setStyle(TextInputStyle.Paragraph)
                        .setLabel("Description")
                        .setRequired(true)
                )
            );

        await interaction.showModal(modal);
    },
    async execute(interaction: CommandInteraction) {
        const file = new AttachmentBuilder(
            process.env.NODE_ENV === "production"
                ? "./src/assets/sl_banner.png"
                : "./src/assets/sld_banner.png"
        );

        const infoEmbed: EmbedBuilder = new EmbedBuilder()
            .setColor(process.env.NODE_ENV === "production" ? prod : dev)
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
                {
                    name: "Response Ping",
                    value: "pinging...",
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
            )
            .setFooter({ text: "Brought to you by king_ultron99#0647." })
            .setImage(
                process.env.NODE_ENV === "production"
                    ? "attachment://sl_banner.png"
                    : "attachment://sld_banner.png"
            )
            .setTimestamp();

        const sent = await interaction.reply({ embeds: [infoEmbed] });

        const components = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setURL("https://ko-fi.com/king_ultron99")
                .setLabel("Support me on Ko-Fi")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setCustomId("starlight_feedback")
                .setLabel("Send us feedback!")
                .setStyle(ButtonStyle.Primary),
        ]);

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
            components: [components],
            files: [file],
        });
    },
};
