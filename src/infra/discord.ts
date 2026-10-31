import { Client, Events, GatewayIntentBits } from "discord.js";

export default function StartClient() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, (client) => {
    console.log(`online as ${client.user.tag}`);
  });

  client.login(process.env.TOKEN);
}
