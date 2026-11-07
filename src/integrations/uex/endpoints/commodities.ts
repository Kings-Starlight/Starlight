import z from "zod";
import type { RequireAtLeastOne } from "../../../utils/typeHelpers";
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
  slug: z.string().nullable(),
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
  commodity_name: z.string().nullish(),
  commodity_code: z.string().nullish(),
  commodity_slug: z.string().nullish(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  terminal_name: z.string().nullish(),
  terminal_code: z.string().nullish(),
  terminal_slug: z.string().nullish(),
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
  commodity_name: z.string().nullish(),
  commodity_code: z.string().nullish(),
  commodity_slug: z.string().nullish(),
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
  commodity_name: z.string().nullish(),
  commodity_code: z.string().nullish(),
  commodity_slug: z.string().nullish(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  city_name: z.string().nullable(),
  terminal_name: z.string().nullish(),
  terminal_code: z.string().nullish(),
  terminal_slug: z.string().nullish(),
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
  commodity_name: z.string().nullish(),
  commodity_code: z.string().nullish(),
  commodity_slug: z.string().nullish(),
  terminal_name: z.string().nullish(),
  terminal_code: z.string().nullish(),
  terminal_slug: z.string().nullish(),
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
  commodity_name: z.string().nullish(),
  commodity_code: z.string().nullish(),
  commodity_slug: z.string().nullish(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  city_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  terminal_name: z.string().nullish(),
  terminal_code: z.string().nullish(),
  terminal_slug: z.string().nullish(),
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
const CommodityTerminalStateArraysSchema = z.object({
  buy: z.array(CommodityTerminalStateSchema),
  sell: z.array(CommodityTerminalStateSchema),
});
const CommodityRoutesSchema = z.object({
  id: z.int(),
  id_commodity: z.int(),
  id_star_system_origin: z.int(),
  id_star_system_destination: z.int(),
  id_planet_origin: z.int(),
  id_planet_destination: z.int(),
  id_orbit_origin: z.int(),
  id_orbit_destination: z.int(),
  id_terminal_origin: z.int(),
  id_terminal_destination: z.int(),
  id_faction_origin: z.int(),
  id_faction_destination: z.int(),

  code: z.string(), // unique route hash, e.g. https://uexcorp.space/trade/route?code={code}

  // prices
  price_origin: z.float32(), // scu
  price_origin_users: z.float32(), // scu, coming from users trades
  price_origin_users_rows: z.float32(), // user trips
  price_destination: z.float32(), // scu
  price_destination_users: z.float32(), // scu, coming from users trades
  price_destination_users_rows: z.float32(), // user trips
  price_margin: z.float32(),
  price_roi: z.float32(),

  // scu
  scu_origin: z.float32(),
  scu_origin_users: z.float32(), // average from users trades
  scu_origin_users_rows: z.float32(), // number of user trades used to calculate 'scu_origin_users'
  scu_destination: z.float32(),
  scu_destination_users: z.float32(), // average from users trades
  scu_destination_users_rows: z.float32(), // number of user trades used to calculate 'scu_destination_users'
  scu_margin: z.float32(), // percentage

  // inventory
  status_origin: z.int(), // stock level at origin, higher is better
  status_destination: z.int(), // stock level at destination, lower is better

  // etc
  investment: z.float32(), // maximum investment expected (scu_buy_avg * price_buy_avg)
  profit: z.float32(), // maximum profit expected
  distance: z.float32(), // Distance in Giga Meters (GM)
  score: z.int(), // UEX score level, higher is better
  container_sizes_origin: z.string().nullable(), // csv
  container_sizes_destination: z.string().nullable(), // csv
  game_version_origin: z.string().nullable(), // e.g. 3.24
  game_version_destination: z.string().nullable(), // e.g. 4.0

  // location attributes
  has_docking_port_origin: z.int(),
  has_docking_port_destination: z.int(),
  has_freight_elevator_origin: z.int(),
  has_freight_elevator_destination: z.int(),
  has_loading_dock_origin: z.int(), // external freight elevator / autoload area
  has_loading_dock_destination: z.int(), // external freight elevator / autoload area
  has_refuel_origin: z.int(),
  has_refuel_destination: z.int(),
  has_cargo_center_origin: z.int(),
  has_cargo_center_destination: z.int(),
  has_quantum_marker_origin: z.int(),
  has_quantum_marker_destination: z.int(),
  is_monitored_origin: z.int(), // uee commlink
  is_monitored_destination: z.int(), // uee commlink
  is_space_station_origin: z.int(),
  is_space_station_destination: z.int(),
  is_on_ground_origin: z.int(),
  is_on_ground_destination: z.int(),

  // commodity
  commodity_name: z.string().optional(),
  commodity_code: z.string().optional(),
  commodity_slug: z.string().optional(),

  // location details
  origin_star_system_name: z.string().nullable(),
  origin_planet_name: z.string().nullable(),
  origin_orbit_name: z.string().nullable(),
  origin_terminal_name: z.string().nullable(),
  origin_terminal_code: z.string().nullable(),
  origin_terminal_slug: z.string().nullable(),
  origin_terminal_is_player_owned: z.int(),
  origin_faction_name: z.string().nullable(),
  destination_star_system_name: z.string().nullable(),
  destination_planet_name: z.string().nullable(),
  destination_orbit_name: z.string().nullable(),
  destination_terminal_name: z.string().nullable(),
  destination_terminal_code: z.string().nullable(),
  destination_terminal_slug: z.string().nullable(),
  destination_terminal_is_player_owned: z.int(),
  destination_faction_name: z.string().nullable(),

  // dates
  date_added: z.int(),
});
interface CommodityRouteParams {
  // Required group: at least one
  originTerminalID?: number;
  originPlanetID?: number;
  originOrbitID?: number;
  commodityID?: number;

  // Optional inputs
  destinationTerminalID?: number;
  destinationPlanetID?: number;
  destinationOrbitID?: number;
  originFactionID?: number;
  destinationFactionID?: number;
  investment?: number;
}

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
   * Gets all commodity prices for the specified filters
   * @param {object} filters
   * @param {number} filters.commodityID the ID of the target commodity
   * @param {number} filters.terminalID the IDs of the target terminals (max 10)
   * @returns an array of commodity prices
   */
  async getCommodityPrices(
    filters:
      | { commodityID: number; terminalID?: number[] }
      | { commodityID?: number; terminalID: number[] },
  ) {
    return this.client.get(
      `commodities_prices`,
      {
        id_commodity: filters.commodityID,
        id_terminal:
          filters.terminalID &&
          Array.from(new Set<number>(filters.terminalID))
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
   * @param {object} filters
   * @param {number} filters.terminalID ID of the target terminal
   * @param {number} filters.commodityID ID of the target commodity
   * @returns an array containing price history information
   */
  async getCommodityPriceHistory(filters: { terminalID: number; commodityID: number }) {
    return this.client.get(
      `commodities_prices_history`,
      { id_terminal: filters.terminalID, id_commodity: filters.commodityID },
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
   * @param commodityID ID of the target commodity
   * @returns an array containing the target commoditys current alerts
   */
  async getCommoditiesAlertsByCommodityID(commodityID: number) {
    return this.client.get(
      `commodities_alerts`,
      { id_commodity: commodityID },
      z.array(CommodityAlertSchema),
    );
  }
  /**
   * Gets the current 15-day averages of a specified commodity's prices and stock data
   * @param commodityID ID of the target commodity
   * @returns an array containing the target commodity's averages
   */
  async getCommodityAverages(commodityID: number) {
    return this.client.get(
      `commodities_averages`,
      { id_commodity: commodityID },
      z.array(CommodityAveragesSchema),
    );
  }
  /**
   * Gets all current inventory states that are used by all terminals
   * @returns an array of states
   */
  async getCommodityTerminalStates() {
    return this.client.get(`commodities_status`, {}, CommodityTerminalStateArraysSchema);
  }

  /**
   * Gets a list of common routes based on reports
   * @param {object} filters
   * @returns
   */

  async getCommodityRoutes(
    filters: RequireAtLeastOne<
      CommodityRouteParams,
      "originTerminalID" | "originPlanetID" | "originOrbitID" | "commodityID"
    >,
  ) {
    return this.client.get(
      `commodities_routes`,
      {
        // Required group: at least one
        id_terminal_origin: filters.originTerminalID,
        id_planet_origin: filters.originPlanetID,
        id_orbit_origin: filters.originOrbitID,
        id_commodity: filters.commodityID,

        // Optional inputs
        id_terminal_destination: filters.destinationTerminalID,
        id_planet_destination: filters.destinationPlanetID,
        id_orbit_destination: filters.destinationOrbitID,
        id_faction_origin: filters.originFactionID,
        id_faction_destination: filters.destinationFactionID,
        investment: filters.investment,
      },
      z.array(CommodityRoutesSchema),
    );
  }
}
