import z from "zod";
import type { UEXClient } from "../client";

const MoonSchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  name_origin: z.string(), // first moon names
  code: z.string(), // UEX code
  is_available: z.int(), // UEX
  is_available_live: z.int(), // StarCitizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  date_added: z.int(),
  date_modified: z.int(),
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});
const OrbitSchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  name_origin: z.string(), // discovery name
  code: z.string(), // UEX code
  is_available: z.int(), // UEX
  is_available_live: z.int(), // StarCitizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  is_lagrange: z.int(),
  is_man_made: z.int(),
  is_asteroid: z.int(),
  is_planet: z.int(),
  is_star: z.int(),
  is_jump_point: z.int(),
  date_added: z.int(),
  date_modified: z.int(),
  star_system_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});
const PlanetSchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  name_origin: z.string(), // discovery name
  code: z.string(), // UEX code
  is_available: z.int(), // UEX
  is_available_live: z.int(), // StarCitizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  is_lagrange: z.int().nullish(),
  date_added: z.int(),
  date_modified: z.int(),
  star_system_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});
const PoiSchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_space_station: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  nickname: z.string(),
  type: z.string(),
  subtype: z.string(),
  is_available: z.int(), // UEX
  is_available_live: z.int(), // Star Citizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  is_monitored: z.int(),
  is_armistice: z.int(),
  is_landable: z.int(),
  is_decommissioned: z.int(),
  is_mining_related: z.int(),
  has_quantum_marker: z.int(),
  has_trade_terminal: z.int(),
  has_habitation: z.int(),
  has_refinery: z.int(),
  has_cargo_center: z.int(),
  has_clinic: z.int(),
  has_food: z.int(),
  has_shops: z.int(),
  has_refuel: z.int(),
  has_repair: z.int(),
  has_gravity: z.int(),
  has_loading_dock: z.int(),
  has_docking_port: z.int(),
  has_freight_elevator: z.int(),
  pad_types: z.string().nullable(), // XS|S|M|L|XL
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  city_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});
const OutpostSchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  nickname: z.string(),
  is_available: z.int(), // UEX
  is_available_live: z.int(), // Star Citizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  is_monitored: z.int(),
  is_armistice: z.int(),
  is_landable: z.int(),
  is_decommissioned: z.int(),
  has_quantum_marker: z.int(),
  has_trade_terminal: z.int(),
  has_habitation: z.int(),
  has_refinery: z.int(),
  has_cargo_center: z.int(),
  has_clinic: z.int(),
  has_food: z.int(),
  has_shops: z.int(),
  has_refuel: z.int(),
  has_repair: z.int(),
  has_gravity: z.int(),
  has_loading_dock: z.int(),
  has_docking_port: z.int(),
  has_freight_elevator: z.int(),
  pad_types: z.string().nullable(), // XS|S|M|L|XL
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});
const SpaceStationSchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_city: z.int(), // city next to space station
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  nickname: z.string(), // our nickname
  is_available: z.int(), // UEX
  is_available_live: z.int(), // Star Citizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  is_monitored: z.int(),
  is_armistice: z.int(),
  is_landable: z.int(),
  is_decommissioned: z.int(),
  is_lagrange: z.int(),
  is_jump_point: z.int(),
  has_quantum_marker: z.int(),
  has_trade_terminal: z.int(),
  has_habitation: z.int(),
  has_refinery: z.int(),
  has_cargo_center: z.int(),
  has_clinic: z.int(),
  has_food: z.int(),
  has_shops: z.int(),
  has_refuel: z.int(),
  has_repair: z.int(),
  has_gravity: z.int(),
  has_loading_dock: z.int(),
  has_docking_port: z.int(),
  has_freight_elevator: z.int(),
  pad_types: z.string().nullable(), // XS|S|M|L|XL
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  city_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});
const CitySchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  code: z.string(),
  is_available: z.int(), // UEX
  is_available_live: z.int(), // Star Citizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  is_monitored: z.int(),
  is_armistice: z.int(),
  is_landable: z.int(),
  is_decommissioned: z.int(),
  has_quantum_marker: z.int(),
  has_trade_terminal: z.int(),
  has_habitation: z.int(),
  has_refinery: z.int(),
  has_cargo_center: z.int(),
  has_clinic: z.int(),
  has_food: z.int(),
  has_shops: z.int(),
  has_refuel: z.int(),
  has_repair: z.int(),
  has_gravity: z.int(),
  has_loading_dock: z.int(),
  has_docking_port: z.int(),
  has_freight_elevator: z.int(),
  pad_types: z.string().nullable(), // XS|S|M|L|XL
  wiki: z.string().nullable(),
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  star_system_name: z.string().nullable(),
  planet_name: z.string().nullable(),
  orbit_name: z.string().nullable(),
  moon_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});
const StarSystemSchema = z.object({
  id: z.int(),
  id_faction: z.int(),
  id_jurisdiction: z.int(),
  name: z.string(),
  code: z.string(), // our code
  is_available: z.int(), // UEX
  is_available_live: z.int(), // Star Citizen
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  wiki: z.string().nullable(), // Wiki URL
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});

export class UexLocationEndpoints {
  constructor(private readonly client: UEXClient) {}

  /* Moons */

  async getMoons(filters: { starSystemID?: number; planetID?: number } = {}) {
    return this.client.get(
      `moons`,
      { id_star_system: filters.starSystemID, id_planet: filters.planetID },
      z.array(MoonSchema),
    );
  }

  /* Orbits */

  async getOrbits(starSystemID?: number) {
    return this.client.get(`orbits`, { id_star_system: starSystemID }, z.array(OrbitSchema));
  }

  /* Planets */

  async getPlanets(
    filters: { starSystemID?: number; factionID?: number; jurisdictionID?: number } = {},
  ) {
    return this.client.get(
      `planets`,
      {
        id_star_system: filters.starSystemID,
        id_faction: filters.factionID,
        id_jurisdiction: filters.jurisdictionID,
      },
      z.array(PlanetSchema),
    );
  }

  /* POI */

  async getPOIs(
    filters: {
      starSystemID?: number;
      planetID?: number;
      moonID?: number;
      cityID?: number;
      outpostID?: number;
      spaceStationID?: number;
    } = {},
  ) {
    return this.client.get(
      `poi`,
      {
        id_star_system: filters.starSystemID,
        id_planet: filters.planetID,
        id_moon: filters.moonID,
        id_city: filters.cityID,
        id_outpost: filters.outpostID,
        id_space_station: filters.spaceStationID,
      },
      z.array(PoiSchema),
    );
  }

  /* Outposts */

  async getOutposts(
    filters: { starSystemID?: number; factionID?: number; planetID?: number; moonID?: number } = {},
  ) {
    return this.client.get(
      `outposts`,
      {
        id_star_system: filters.starSystemID,
        id_faction: filters.factionID,
        id_planet: filters.planetID,
        id_moon: filters.moonID,
      },
      z.array(OutpostSchema),
    );
  }

  /* Space Stations */

  async getSpaceStations(
    filters: { starSystemID?: number; planetID?: number; moonID?: number; cityID?: number } = {},
  ) {
    return this.client.get(
      `space_stations`,
      {
        id_star_system: filters.starSystemID,
        id_planet: filters.planetID,
        id_moon: filters.moonID,
        id_city: filters.cityID,
      },
      z.array(SpaceStationSchema),
    );
  }

  /* Cities */

  async getCities(filters: { starSystemID?: number; planetID?: number; moonID?: number } = {}) {
    return this.client.get(
      `cities`,
      {
        id_star_system: filters.starSystemID,
        id_planet: filters.planetID,
        id_moon: filters.moonID,
      },
      z.array(CitySchema),
    );
  }

  /* Star Systems */
  async getStarSystems() {
    return this.client.get(`star_systems`, {}, z.array(StarSystemSchema));
  }
}
