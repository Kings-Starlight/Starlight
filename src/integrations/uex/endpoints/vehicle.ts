import z from "zod";
import type { RequireAtLeastOne } from "../../../utils/typeHelpers";
import type { UEXClient } from "../client";

const VehicleSchema = z.object({
  id: z.number(),
  id_company: z.number(), // manufacturer
  id_parent: z.number(), // Parent ship series
  ids_vehicles_loaners: z.string().nullable(),
  name: z.string(),
  name_full: z.string(),
  slug: z.string(),
  uuid: z.string().nullable(), // SC UUID
  scu: z.number(),
  crew: z.string().nullable(),
  mass: z.number(),
  width: z.number(),
  height: z.number(),
  length: z.number(),
  fuel_quantum: z.float64(),
  fuel_hydrogen: z.float64(),
  container_sizes: z.string().nullable(),
  is_addon: z.int(), // e.g. galaxy refinery module
  is_boarding: z.int(),
  is_bomber: z.int(),
  is_cargo: z.int(),
  is_carrier: z.int(),
  is_civilian: z.int(),
  is_concept: z.int(),
  is_construction: z.int(),
  is_datarunner: z.int(),
  is_docking: z.int(), // does it have a docking port?
  is_emp: z.int(),
  is_exploration: z.int(),
  is_ground_vehicle: z.int(),
  is_hangar: z.int(), // does it contain a hangar? e.g. polaris
  is_industrial: z.int(),
  is_interdiction: z.int(),
  is_loading_dock: z.int(), // can this ship operate in loading docks? e.g. hull-c
  is_medical: z.int(),
  is_military: z.int(),
  is_mining: z.int(),
  is_passenger: z.int(),
  is_qed: z.int(),
  is_racing: z.int(),
  is_refinery: z.int(),
  is_refuel: z.int(),
  is_repair: z.int(),
  is_research: z.int(),
  is_salvage: z.int(),
  is_scanning: z.int(),
  is_science: z.int(),
  is_showdown_winner: z.int(), // has this ship won the ship showdown?
  is_spaceship: z.int(),
  is_starter: z.int(),
  is_stealth: z.int(),
  is_tractor_beam: z.int(), // Does does it have a tractor beam?
  is_quantum_capable: z.int(),
  url_photo: z.string().nullable(),
  url_store: z.string().nullable(),
  url_brochure: z.string().nullable(),
  url_hotsite: z.string().nullable(),
  url_video: z.string().nullable(),
  pad_type: z.literal(["", "XS", "S", "M", "L", "XL"]).nullable(),
  game_version: z.string(),
  date_added: z.int(),
  date_modified: z.int(),
  company_name: z.string().nullable(),
});
const VehicleLoanerSchema = z.object({
  id: z.int(),
  id_company: z.int(),
  id_parent: z.int(),
  ids_vehicles_loaners: z.string().nullable(),
  name: z.string(),
  name_full: z.string(),
  uuid: z.string().optional(),
  scu: z.number(),
  crew: z.string(),
  is_addon: z.int(),
  is_concept: z.int(),
  is_civilian: z.int(),
  is_military: z.int(),
  is_exploration: z.int(),
  is_passenger: z.int(),
  is_industrial: z.int(),
  is_mining: z.int(),
  is_salvage: z.int(),
  is_refinery: z.int(),
  is_cargo: z.int(),
  is_medical: z.int(),
  is_racing: z.int(),
  is_repair: z.int(),
  is_refuel: z.int(),
  is_interdiction: z.int(),
  is_tractor_beam: z.int(),
  is_qed: z.int(),
  is_emp: z.int(),
  is_construction: z.int(),
  is_datarunner: z.int(),
  is_science: z.int(),
  is_boarding: z.int(),
  is_stealth: z.int(),
  is_research: z.int(),
  is_carrier: z.int(),
  is_ground_vehicle: z.int(),
  is_spaceship: z.int(),
  is_showdown_winner: z.int(),
  url_store: z.string().nullable(),
  url_brochure: z.string().nullable(),
  url_hotsite: z.string().nullable(),
  url_video: z.string().nullable(),
  url_photos: z.array(z.string()).nullable(),
  game_version: z.string(),
  date_added: z.int(),
  date_modified: z.int(),
  company_name: z.string().nullable(),
  get loaners() {
    return z.array(VehicleLoanerSchema).optional();
  },
});
const VehicleStorePriceSchema = z.object({
  id: z.int(),
  id_vehicle: z.int(),
  price: z.float32(),
  price_warbond: z.float32(),
  price_package: z.float32(),
  price_concierge: z.float32(),
  on_sale: z.int(),
  on_sale_warbond: z.int(),
  on_sale_concierge: z.int(),
  currency: z.string(),
  game_version: z.string(),
  date_added: z.int(),
  date_modified: z.int(),
  vehicle_name: z.string(),
});
const VehicleBuySchema = z.object({
  id: z.int(),
  id_vehicle: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_faction: z.int().optional(),
  id_terminal: z.int(),
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
  faction_affinity: z.int(),
  game_version: z.string(),
  date_added: z.int(),
  date_modified: z.int(),
  datarunner: z.string().nullable(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  city_name: z.string().nullable(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_is_player_owned: z.int(),
});
const VehicleBuyMiniSchema = z.object({
  id: z.int(),
  id_vehicle: z.int(),
  id_terminal: z.int(),
  price_buy: z.float32(),
  date_added: z.int(),
  date_modified: z.int(),
  vehicle_name: z.string(),
  terminal_name: z.string(),
});
const VehicleRentSchema = z.object({
  id: z.int(),
  id_vehicle: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_faction: z.int().optional(),
  id_terminal: z.int(),
  price_rent: z.float32(), // last
  price_rent_min: z.float32(),
  price_rent_min_week: z.float32(),
  price_rent_min_month: z.float32(),
  price_rent_max: z.float32(),
  price_rent_max_week: z.float32(),
  price_rent_max_month: z.float32(),
  price_rent_avg: z.float32(),
  price_rent_avg_week: z.float32(),
  price_rent_avg_month: z.float32(),
  faction_affinity: z.int(),
  game_version: z.string(),
  date_added: z.int(),
  date_modified: z.int(),
  datarunner: z.string().nullable(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  city_name: z.string().nullable(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_is_player_owned: z.int(),
});
const VehicleRentMiniSchema = z.object({
  id: z.int(),
  id_vehicle: z.int(),
  id_terminal: z.int(),
  price_rent: z.float32(),
  date_added: z.int(),
  date_modified: z.int(),
  vehicle_name: z.string(),
  terminal_name: z.string(),
});

export type UexVehicle = z.infer<typeof VehicleSchema>;

export class UexVehicleEndpoints {
  constructor(private readonly client: UEXClient) {}
  /**
   * Gets all vehicles
   * includes optional filter to target vehicles made by a specific manufacturer
   * @param filters
   * @param filters.companyID target manufacturer ID
   * @returns
   */
  async getVehicles(filters: { companyID?: number } = {}) {
    return this.client.get("vehicles", { id_company: filters.companyID }, z.array(VehicleSchema));
  }

  /* Vehicle Loaners */

  /**
   * Gets all vehicles that have loaners, and their associated loaners.
   * Includes optional filters to narrow down what loaners are returned.
   * @param filters
   * @param filters.vehicleID ID of the parent vehicle
   * @param filters.name Name of the parent vehicle
   * @returns
   */
  async getVehicleLoaners(filters: { vehicleID?: number; name?: string } = {}) {
    return this.client.get(
      `vehicles_loaners`,
      { id_vehicle: filters.vehicleID, name: filters.name },
      z.array(VehicleLoanerSchema),
    );
  }

  /* Vehicle Store Prices */

  /**
   * Gets the store prices of all vehicles
   * @param filters
   * @param filters.vehicleID ID of the target vehicle
   * @returns
   */
  async getVehicleStorePrices(filters: { vehicleID?: number } = {}) {
    return this.client.get(
      `vehicles_prices`,
      { id_vehicle: filters.vehicleID },
      z.array(VehicleStorePriceSchema),
    );
  }

  /* Vehicle Ingame Prices */

  /**
   * Gets all vehicle purchase prices, for every terminal
   * @returns
   */
  async getAllVehicleBuyPrices() {
    return this.client.get(`vehicles_purchases_prices_all`, {}, z.array(VehicleBuyMiniSchema));
  }
  /**
   * Gets all known ingame purchase prices for the specified vehicle across all terminals
   * @param filters
   * @param filters.vehicleID ID of the target vehicle
   * @param filters.terminalID ID of the target terminal
   * @param filters.uuid UUID of the target vehicle
   * @returns
   */
  async getVehicleBuyPrices(
    filters: RequireAtLeastOne<
      { vehicleID: number; terminalID: number; uuid?: string },
      "terminalID" | "vehicleID"
    >,
  ) {
    return this.client.get(
      "vehicles_purchases_prices",
      {
        id_vehicle: filters.vehicleID,
        id_terminal: filters.terminalID,
        uuid: filters.uuid,
      },
      z.array(VehicleBuySchema),
    );
  }

  /**
   * Gets all vehicle rent prices, for every terminal
   * @returns
   */
  async getAllVehicleRentPrices() {
    return this.client.get(`vehicles_rentals_prices_all`, {}, z.array(VehicleRentMiniSchema));
  }
  /**
   * Gets all known ingame rent prices for the specified terminal
   * @param filters
   * @param filters.vehicleID ID of the target vehicle
   * @param filters.terminalID ID of the target terminal
   * @param filters.uuid UUID of the target vehicle
   * @returns
   */
  async getVehicleRentPrices(
    filters: RequireAtLeastOne<
      { vehicleID: number; terminalID: number; uuid?: string },
      "terminalID" | "vehicleID"
    >,
  ) {
    return this.client.get(
      "vehicles_rentals_prices",
      {
        id_vehicle: filters.vehicleID,
        id_terminal: filters.terminalID,
        uuid: filters.uuid,
      },
      z.array(VehicleRentSchema),
    );
  }
}
