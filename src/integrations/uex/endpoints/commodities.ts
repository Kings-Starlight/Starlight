import z from "zod";
import type { UEXClient } from "../client";

const CommoditiesSchema = z.object({
  id: z.int(),
  id_parent: z.int().nullable(),
  id_item: z.int().nullable(),
  ids_star_systems: z.string().nullable().optional(),
  ids_planets: z.string().nullable().optional(),
  ids_moons: z.string().nullable().optional(),
  ids_poi: z.string().nullable().optional(),
  ids_orbits: z.string().nullable().optional(),
  uuid: z.string().nullable(),
  name: z.string(),
  code: z.string(),
  slug: z.string(),
  kind: z.string().nullable(),
  weight_scu: z.number().nullable(),
  price_buy: z.float32(),
  price_sell: z.float32(),
  is_available: z.int(),
  is_available_live: z.int(),
  is_visible: z.int(),
  is_extractable: z.int(),
  is_mineral: z.int(),
  is_raw: z.int(),
  is_pure: z.int(),
  is_refined: z.int(),
  is_refinable: z.int(),
  is_harvestable: z.int(),
  is_buyable: z.int(),
  is_sellable: z.int(),
  is_temporary: z.int(),
  is_illegal: z.int(),
  is_volatile_qt: z.int(),
  is_volatile_time: z.int(),
  is_inert: z.int(),
  is_explosive: z.int(),
  is_buggy: z.int(),
  is_fuel: z.int(),
  wiki: z.string().nullable(),
  date_added: z.int(),
  date_modified: z.int(),
});

const CommodityAlertSchema = z.object({
  id_commodity: z.int(),
  id_terminal: z.int(),
  price_buy: z.float32(),
  price_sell: z.float32(),
  scu_buy: z.float32(),
  scu_sell: z.float32(),
  status_buy: z.int(),
  status_sell: z.int(),
  date_added: z.int(),
  game_version: z.string(),
  commodity_name: z.string(),
  commodity_code: z.string(),
  commodity_slug: z.string(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_slug: z.string(),
});

const CommodityAveragesSchema = z.object({
  id: z.int(),
  id_commodity: z.int(),

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
  price_buy_users: z.float32(), // last 15d, average from user trades
  price_buy_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // sell
  price_sell: z.float32(), // last
  price_sell_min: z.float32(),
  price_sell_min_week: z.float32(),
  price_sell_min_month: z.float32(),
  price_sell_max: z.float32(),
  price_sell_max_week: z.float32(),
  price_sell_max_month: z.float32(),
  price_sell_avg: z.float32(),
  price_sell_avg_week: z.float32(),
  price_sell_users: z.float32(), // last 15d, average from user trades
  price_sell_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // scu buy
  scu_buy: z.float32(), // last
  scu_buy_min: z.float32(),
  scu_buy_min_week: z.float32(),
  scu_buy_min_month: z.float32(),
  scu_buy_max: z.float32(),
  scu_buy_max_week: z.float32(),
  scu_buy_max_month: z.float32(),
  scu_buy_avg: z.float32(),
  scu_buy_avg_week: z.float32(),
  scu_buy_avg_month: z.float32(),
  scu_buy_total: z.float32(), // cumulative stock available
  scu_buy_total_week: z.float32(),
  scu_buy_total_month: z.float32(),
  scu_buy_users: z.float32(), // last 15d, average from user trades
  scu_buy_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // reported stockfloat (sell)
  scu_sell_stock: z.float32(), // last
  scu_sell_stock_week: z.float32(),
  scu_sell_stock_month: z.float32(),

  // scu sell
  scu_sell: z.float32(), // last calculated, based on reported level (scu_sell_stock)
  scu_sell_min: z.float32(),
  scu_sell_min_week: z.float32(),
  scu_sell_min_month: z.float32(),
  scu_sell_max: z.float32(),
  scu_sell_max_week: z.float32(),
  scu_sell_max_month: z.float32(),
  scu_sell_avg: z.float32(),
  scu_sell_avg_week: z.float32(),
  scu_sell_avg_month: z.float32(),
  scu_sell_total: z.float32(), // cumulative amount demanded
  scu_sell_total_week: z.float32(),
  scu_sell_total_month: z.float32(),
  scu_sell_users: z.float32(), // last 15d, average from user trades
  scu_sell_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // inventory buy
  status_buy: z.int().nullable(),
  status_buy_min: z.int().nullable(),
  status_buy_min_week: z.int().nullable(),
  status_buy_min_month: z.int().nullable(),
  status_buy_max: z.int().nullable(),
  status_buy_max_week: z.int().nullable(),
  status_buy_max_month: z.int().nullable(),
  status_buy_avg: z.int().nullable(),
  status_buy_avg_week: z.int().nullable(),
  status_buy_avg_month: z.int().nullable(),
  status_sell: z.int().nullable(),
  status_sell_min: z.int().nullable(),
  status_sell_min_week: z.int().nullable(),
  status_sell_min_month: z.int().nullable(),
  status_sell_max: z.int().nullable(),
  status_sell_max_week: z.int().nullable(),
  status_sell_max_month: z.int().nullable(),
  status_sell_avg: z.int().nullable(),
  status_sell_avg_week: z.int().nullable(),
  status_sell_avg_month: z.int().nullable(),

  // variation coefficient, lower is better
  volatility_price_buy: z.float32(),
  volatility_price_sell: z.float32(),
  volatility_scu_buy: z.float32(),
  volatility_scu_sell: z.float32(),

  // etc
  cax_score: z.int(), // uex score, higher is better
  game_version: z.string(),
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  commodity_name: z.string(),
  commodity_code: z.string(),
  commodity_slug: z.string(),
});

const CommodityPricesSchema = z.object({
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
  price_buy_users: z.float32(), // last 15d, average from user trades
  price_buy_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // sell
  price_sell: z.float32(), // last
  price_sell_min: z.float32(),
  price_sell_min_week: z.float32(),
  price_sell_min_month: z.float32(),
  price_sell_max: z.float32(),
  price_sell_max_week: z.float32(),
  price_sell_max_month: z.float32(),
  price_sell_avg: z.float32(),
  price_sell_avg_week: z.float32(),
  price_sell_avg_month: z.float32(),
  price_sell_users: z.float32(), // last 15d, average from user trades
  price_sell_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // scu buy
  scu_buy: z.float32(), // last
  scu_buy_min: z.float32(),
  scu_buy_min_week: z.float32(),
  scu_buy_min_month: z.float32(),
  scu_buy_max: z.float32(),
  scu_buy_max_week: z.float32(),
  scu_buy_max_month: z.float32(),
  scu_buy_avg: z.float32(),
  scu_buy_avg_week: z.float32(),
  scu_buy_avg_month: z.float32(),
  scu_buy_users: z.float32(), // last 15d, average from user trades
  scu_buy_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // reported inventory scu at location (sell)
  scu_sell_stock: z.float32(), // last amount of SCU reported at location
  scu_sell_stock_avg: z.float32(),
  scu_sell_stock_avg_week: z.float32(),
  scu_sell_stock_avg_month: z.float32(),

  // scu sell demand (forecasted)
  scu_sell: z.float32(), // last
  scu_sell_min: z.float32(),
  scu_sell_min_week: z.float32(),
  scu_sell_min_month: z.float32(),
  scu_sell_max: z.float32(),
  scu_sell_max_week: z.float32(),
  scu_sell_max_month: z.float32(),
  scu_sell_avg: z.float32(),
  scu_sell_avg_week: z.float32(),
  scu_sell_avg_month: z.float32(),
  scu_sell_users: z.float32(), // last 15d, average from user trades
  scu_sell_users_rows: z.int().nullable(), // trips in the last 15d, coming from user trades

  // inventory state for purchase
  status_buy: z.int().nullable(),
  status_buy_min: z.int().nullable(),
  status_buy_min_week: z.int().nullable(),
  status_buy_min_month: z.int().nullable(),
  status_buy_max: z.int().nullable(),
  status_buy_max_week: z.int().nullable(),
  status_buy_max_month: z.int().nullable(),
  status_buy_avg: z.int().nullable(),
  status_buy_avg_week: z.int().nullable(),
  status_buy_avg_month: z.int().nullable(),

  // inventory state for sell
  status_sell: z.int().nullable(),
  status_sell_min: z.int().nullable(),
  status_sell_min_week: z.int().nullable(),
  status_sell_min_month: z.int().nullable(),
  status_sell_max: z.int().nullable(),
  status_sell_max_week: z.int().nullable(),
  status_sell_max_month: z.int().nullable(),
  status_sell_avg: z.int().nullable(),
  status_sell_avg_week: z.int().nullable(),
  status_sell_avg_month: z.int().nullable(),

  // price coefficient of variation. higher is worse
  volatility_price_buy: z.float32(),
  volatility_price_sell: z.float32(),
  volatility_scu_buy: z.float32(),
  volatility_scu_sell: z.float32(),

  // factions
  faction_affinity: z.int().nullable(), // datarunner's affinity average at a location (between -100 and 100)

  // container
  container_sizes: z.string().nullable(), // in scu, csv values, 1|2|4|8|16|24|32

  // quality (0-1000)
  quality: z.int().nullable(), // last
  quality_min: z.int().nullable(),
  quality_min_week: z.int().nullable(),
  quality_min_month: z.int().nullable(),
  quality_max: z.int().nullable(),
  quality_max_week: z.int().nullable(),
  quality_max_month: z.int().nullable(),
  quality_avg: z.int().nullable(),
  quality_avg_week: z.int().nullable(),
  quality_avg_month: z.int().nullable(),

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
  terminal_is_player_owned: z.int(),
});

const CommodityPricesMiniSchema = z.object({
  id: z.int(),
  id_commodity: z.int(),
  id_terminal: z.int(),
  price_buy: z.float32(), // last
  price_buy_avg: z.float32(),
  price_sell: z.float32(), // last
  price_sell_avg: z.float32(),
  scu_buy: z.float32(), // last
  scu_buy_avg: z.float32(),
  scu_sell_stock: z.float32(), // last
  scu_sell_stock_avg: z.float32(), // average reported
  scu_sell: z.float32(),
  scu_sell_avg: z.float32(),
  status_buy: z.int().nullable(),
  status_sell: z.int().nullable(),
  container_sizes: z.string().nullable(), // in scu, csv values, 1|2|4|8|16|24|32
  quality: z.int().nullable(), // 0-1000
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  commodity_name: z.string(),
  commodity_code: z.string(),
  commodity_slug: z.string(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_slug: z.string(),
});

const CommodityPriceHistorySchema = z.object({
  id: z.int(),
  id_commodity: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_terminal: z.int(),
  id_faction: z.int(),

  // prices
  price_buy: z.float32(),
  price_sell: z.float32(),

  // scu
  scu_buy: z.float32(),
  scu_sell_stock: z.float32(),
  scu_sell: z.float32(),

  // inventory
  status_buy: z.int().nullable(),
  status_sell: z.int().nullable(),
  quality: z.int().nullable(), // 0-1000

  // etc
  game_version: z.string(),
  date_added: z.int(),
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
  faction_name: z.string().nullable(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_slug: z.string(),
});

const CommodityTerminalStateSchema = z.object({
  code: z.int(), // status code
  name: z.string(),
  name_short: z.string(),
  name_abbr: z.string(),
  percentage: z.string(), // range label
  percentage_start: z.float32(),
  percentage_end: z.float32(),
  colors: z.string(),
});

export class UexCommoditiesEndpoints {
  constructor(private readonly client: UEXClient) {}
  /**
   * Gets all commodities covered by UEX
   * @returns an array of commodities
   */
  async getCommodities() {
    return this.client.get(`commodities`, {}, z.array(CommoditiesSchema));
  }
  /**
   * Gets all prices for the specified commodity from all terminals
   * @param id ID of the target commodity
   * @returns
   */
  async getCommodityPricesByCommodityID(id: number) {
    return this.client.get(
      `commodities_prices`,
      { id_commodity: id },
      z.array(CommodityPricesSchema),
    );
  }
  /**
   * Gets all commodity prices for the specified terminals
   * @param id an array of terminal IDs. A maximum of 10, anything else will be stripped and ignored
   * @returns
   */
  async getCommodityPricesByTerminalID(id: number[]) {
    return this.client.get(
      `commodities_prices`,
      {
        id_terminal: Array.from(new Set(id))
          .slice(0, 10)
          .sort((a, b) => a - b)
          .join(","),
      },
      z.array(CommodityPricesSchema),
    );
  }
  /**
   * Gets all commodity price information from all terminals
   * @returns an array containing prices for every commodity
   */
  async getAllCommodityPrices() {
    return this.client.get(`commodities_prices_all`, {}, z.array(CommodityPricesMiniSchema));
  }
  /**
   * Gets known price history of a commodity from a specific terminal
   * @param terminalId ID of the target terminal
   * @param commodityId ID of the target commodity
   * @returns an array containing price history information for the specified terminal/commodity
   */
  async getCommodityPriceHistory(terminalId: number, commodityId: number) {
    return this.client.get(
      `commodities_prices_history`,
      { id_terminal: terminalId, id_commodity: commodityId },
      z.array(CommodityPriceHistorySchema),
    );
  }
  /**
   * Gets all current commodity alerts
   * @returns an array of all current commodity alerts
   */
  async getCommoditiesAlerts() {
    return this.client.get(`commodities_alerts`, {}, z.array(CommodityAlertSchema));
  }
  /**
   * Gets any current alerts for the specified commodity
   * @param id ID of the target commodity
   * @returns an array containing the target commoditys current alerts
   */
  async getCommoditiesAlertsByCommodityID(id: number) {
    return this.client.get(
      `commodities_alerts`,
      { id_commodity: id },
      z.array(CommodityAlertSchema),
    );
  }
  /**
   * Gets the current 15-day averages of a specified commodity's prices and stock data
   * @param id ID of the target commodity
   * @returns an array containing the target commodity's averages
   */
  async getCommodityAverages(id: number) {
    return this.client.get(
      `commodities_averages`,
      { id_commodity: id },
      z.array(CommodityAveragesSchema),
    );
  }
  /**
   * Gets all current inventory states that are used by all terminals
   * @returns an array of states
   */
  async getCommodityTerminalStates() {
    return this.client.get(`commodities_status`, {}, z.array(CommodityTerminalStateSchema));
  }
}
