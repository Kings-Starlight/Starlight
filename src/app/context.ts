import type { UEXClient } from "../integrations/uex/client";

export default interface AppContext {
  integrations: {
    uex: UEXClient;
  };
}
