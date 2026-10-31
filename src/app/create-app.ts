import { UEXClient } from "../integrations/uex/client";
import type AppContext from "./context";

export function createApp(): AppContext {
  return {
    integrations: {
      uex: new UEXClient(process.env.UEX),
    },
  };
}
