// import StartClient from "./infra/discord";
import { UEXClient } from "./integrations/uex/client";

// StartClient();

const uex = new UEXClient(process.env.UEX);

console.log((await uex.locations.getPlanets({}))[0]);
