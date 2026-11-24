import z from "zod";
import type { RequireAtLeastOne } from "../../../utils/typeHelpers";
import type { UEXClient } from "../client";

const FuelPriceSchema = z.object({
  id: z.int(),
  id_commodity: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_faction: z.int(),
  id_terminal: z.int(),

  // buy
  price_buy: z.float32(), // last
  price_buy_min: z.float32(),
  price_buy_min_week: z.float32(),
  price_buy_min_month: z.float32(),
  price_buy_max: z.float32(),
  price_buy_max_week: z.float32(),
  price_buy_max_month: z.float32(),
  price_buy_avg: z.float32(),
  price_buy_avg_week: z.float32(),
  price_buy_avg_month: z.float32(),
  // factions
  faction_affinity: z.int(), // datarunner's affinity average at a location (between -100 and 100)

  // etc
  game_version: z.string(),
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  commodity_name: z.string(),
  commodity_code: z.string(),
  commodity_slug: z.string(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  city_name: z.string().nullable(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_slug: z.string(),
  terminal_mcs: z.int(), // maximum container size operated by freight elevator (in SCU)
});
const FuelPriceMiniSchema = z.object({
  id: z.int(),
  id_commodity: z.int(),
  id_terminal: z.int(),
  price_buy: z.float32(),
  price_buy_avg: z.float32(),
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  commodity_name: z.string().optional(),
  commodity_code: z.string().optional(),
  commodity_slug: z.string().optional(),
  terminal_name: z.string().optional(),
  terminal_code: z.string().optional(),
  terminal_slug: z.string().optional(),
});

export class UexFuelEndpoints {
  constructor(private readonly client: UEXClient) {}

  /**
   * Gets all known fuel prices based on the specified criteria
   * At least one of the following must be supplied, but any combination is also valid.
   * @param filters
   * @param filters.terminalID ID of the target terminal
   * @param filters.commodityID ID of the target commodity
   * @param filters.terminalName Name of the terminal
   * @param filters.terminalCode UEX identifier
   * @param filters.terminalSlug UEX identifier
   * @param filters.commodityName Name of the commodity
   * @param filters.commodityCode UEX identifier
   * @param filters.commoditySlug UEX identifier
   * @returns
   */
  async getFuelPrices(
    filters: RequireAtLeastOne<
      {
        /** Maximum of 10 IDs. anything over will be discarded */
        terminalID: number[];
        commodityID: number;
        terminalName: string;
        terminalCode: string;
        terminalSlug: string;
        commodityName: string;
        commodityCode: string;
        commoditySlug: string;
      },
      | "terminalID"
      | "commodityID"
      | "terminalName"
      | "terminalCode"
      | "terminalSlug"
      | "commodityName"
      | "commodityCode"
      | "commoditySlug"
    >,
  ) {
    return this.client.get(
      `fuel_prices`,
      {
        id_terminal:
          filters.terminalID &&
          Array.from(new Set<number>(filters.terminalID))
            .slice(0, 10)
            .sort((a, b) => a - b)
            .join(","),
        id_commodity: filters.commodityID,
        terminal_name: filters.terminalName,
        terminal_code: filters.terminalCode,
        terminal_slug: filters.terminalSlug,
        commodity_name: filters.commodityName,
        commodity_code: filters.commodityCode,
        commodity_slug: filters.commoditySlug,
      },
      z.array(FuelPriceSchema),
    );
  }

  /**
   * Gets all known fuel prices
   * @returns
   */
  async getAllFuelPrices() {
    return this.client.get(`fuel_prices_all`, {}, z.array(FuelPriceMiniSchema));
  }
}
