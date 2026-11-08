import z from "zod";
import type { UEXClient } from "../client";

const RefineryAuditSchema = z.object({
  id: z.int(),
  id_commodity: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_space_station: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_faction: z.int().optional(),
  id_terminal: z.int(),
  yield: z.int(), // yield bonus percentage
  capacity: z.int(), // refinery capacity percentage
  method: z.string(), // refining method
  quantity: z.int(), // units
  quantity_yield: z.int(), // units
  quantity_inert: z.int(), // units
  total_cost: z.int(), // cost in UEC
  total_time: z.int(), // time in minutes
  date_added: z.int(), // timestamp
  date_reported: z.int(), // timestamp
  game_version: z.string(),
  datarunner: z.string().nullable(), // datarunner ign
  commodity_name: z.string(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  city_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  terminal_name: z.string(),
});
const RefineryCapacitySchema = z.object({
  id: z.int(),
  id_commodity: z.int().optional(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_space_station: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_faction: z.int().optional(),
  id_terminal: z.int(),
  id_report: z.int(), // last report
  value: z.int(), // yield bonus percentage
  value_week: z.int(), // yield bonus percentage, last 7 days
  value_month: z.int(), // yield bonus percentage, last 30 days
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  city_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  terminal_name: z.string(),
});
const RefineryMethodSchema = z.object({
  id: z.int(),
  name: z.string(),
  code: z.string(),
  rating_yield: z.int(), // 1 low | 2 medium | 3 high
  rating_cost: z.int(), // 1 low | 2 medium | 3 high
  rating_speed: z.int(), // 1 slow | 2 medium | 3 fast
  date_added: z.int(), // timestamp
  date_modified: z.int().optional(), // timestamp
});
const RefineryYieldSchema = z.object({
  id: z.int(),
  id_commodity: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_space_station: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_faction: z.int().optional(),
  id_terminal: z.int(),
  id_report: z.int(), // last report
  value: z.int(), // percentage of yield bonus at refinery
  value_week: z.int(), // percentage of yield bonus at refinery (last 7 days)
  value_month: z.int(), // percentage of yield bonus at refinery (last 30 days)
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  commodity_name: z.string(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  city_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  terminal_name: z.string(),
});

export class UexRefineryRoutes {
  constructor(private readonly client: UEXClient) {}

  async getRefineryAudits() {
    return this.client.get(`refineries_audits`, {}, z.array(RefineryAuditSchema));
  }

  async getRefineryCapacities() {
    return this.client.get(`refineries_capacities`, {}, z.array(RefineryCapacitySchema));
  }

  async getRefineryMethods() {
    return this.client.get(`refineries_methods`, {}, z.array(RefineryMethodSchema));
  }

  async getRefineryYields() {
    return this.client.get(`refineries_yields`, {}, z.array(RefineryYieldSchema));
  }
}
