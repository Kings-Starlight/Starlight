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
const JumpPointSchema = z.object({
  id: z.int(),
  id_star_system_origin: z.int(),
  id_star_system_destination: z.int(),
  id_orbit_origin: z.int(),
  id_orbit_destination: z.int(),
  star_system_origin_name: z.string().optional(),
  star_system_destination_name: z.string().optional(),
  orbit_origin_name: z.string().optional(),
  orbit_destination_name: z.string().optional(),
  date_added: z.int(),
  date_modified: z.int(),
});
const JurisdictionSchema = z.object({
  id: z.int(),
  id_faction: z.number(),
  name: z.string(),
  nickname: z.string(),
  is_available: z.int(), // UEX
  is_available_live: z.int(), // game
  is_visible: z.int(), // UEX (public)
  is_default: z.int(),
  wiki: z.string().nullable(),
  date_added: z.int(),
  date_modified: z.int(),
  faction_name: z.string().nullable(),
});
const TerminalSchema = z.object({
  id: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_space_station: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_city: z.int(),
  id_faction: z.int().nullable(),
  id_company: z.int(),
  name: z.string(),
  fullname: z.string(), // rule based, in-game aligned canonical name
  nickname: z.string(), // short name
  displayname: z.string().nullable(), // storage name | name displayed on the terminal screen
  code: z.string(), // our code
  type: z.string(), // our type
  contact_url: z.string().nullable(), // contact page URL (player terminals only)
  is_available: z.int(), // UEX
  is_available_live: z.int(), // Star Citizen
  is_visible: z.int(), // UEX (public)
  is_default_system: z.int(), // uex default
  is_affinity_influenceable: z.int(), // reputation affects prices
  is_habitation: z.int(),
  is_refinery: z.int(),
  is_cargo_center: z.int(),
  is_medical: z.int(),
  is_food: z.int(),
  is_shop_fps: z.int(), // trading fps items
  is_shop_vehicle: z.int(), // trading vehicle stuff
  is_refuel: z.int(),
  is_repair: z.int(),
  is_nqa: z.int(), // no questions asked terminal
  is_jump_point: z.int(), // located at jump point
  is_player_owned: z.int(),
  is_auto_load: z.int(),
  has_loading_dock: z.int(),
  has_docking_port: z.int(),
  has_freight_elevator: z.int(),
  game_version: z.string().nullable(), // last updated
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
  company_name: z.string().nullable(),
  max_container_size: z.int(), // in scu, csv values, 1|2|4|8|16|24|32
});
const TerminalDistanceSchema = z.object({
  orbit_name_origin: z.string().nullable(),
  terminal_name_origin: z.string(),
  terminal_nickname_origin: z.string(),
  terminal_code_origin: z.string(),
  orbit_name_destination: z.string().nullable(),
  terminal_name_destination: z.string(),
  terminal_nickname_destination: z.string(),
  terminal_code_destination: z.string(),
  distance: z.string(), // gigameters
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

  /* Jump Points */

  async getJumpPoints(
    filters: {
      OriginStarSystemID?: number;
      DestinationSystemID?: number;
      OriginOrbitID?: number;
      DestinationOrbitID?: number;
    } = {},
  ) {
    return this.client.get(
      `jump_points`,
      {
        id_star_system_origin: filters.OriginStarSystemID,
        id_star_system_destination: filters.DestinationSystemID,
        id_orbit_origin: filters.OriginOrbitID,
        id_orbit_destination: filters.DestinationOrbitID,
      },
      z.array(JumpPointSchema),
    );
  }

  /* Jurisdictions */

  async getJurisdictions() {
    return this.client.get(`jurisdictions`, {}, z.array(JurisdictionSchema));
  }

  /* Terminals */

  async getTerminals(
    filters: {
      starSystemID?: number;
      planetID?: number;
      moonID?: number;
      spaceStationID?: number;
      cityID?: number;
      outpostID?: number;
      poiID?: number;
      factionID?: number;
      companyID?: number;
      type?: string;
    } = {},
  ) {
    return this.client.get(
      `terminals`,
      {
        id_star_system: filters.starSystemID,
        id_planet: filters.planetID,
        id_moon: filters.moonID,
        id_space_station: filters.spaceStationID,
        id_city: filters.cityID,
        id_outpost: filters.outpostID,
        id_poi: filters.poiID,
        id_faction: filters.factionID,
        id_company: filters.companyID,
        type: filters.type,
      },
      z.array(TerminalSchema).nullable(),
    );
  }

  async getTerminalDistances(filters: { originTerminalID: number; destinationTerminalID: number }) {
    return this.client.get(
      `terminals_distances`,
      {
        id_terminal_origin: filters.originTerminalID,
        id_terminal_destination: filters.destinationTerminalID,
      },
      TerminalDistanceSchema,
    );
  }
}
