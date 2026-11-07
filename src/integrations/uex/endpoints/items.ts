import z from "zod";
import type { RequireAtLeastOne } from "../../../utils/typeHelpers";
import type { UEXClient } from "../client";

const ItemSchema = z.object({
  id: z.int(), // route ID, may change during website updates
  id_parent: z.int(),
  id_category: z.int(),
  id_company: z.int(),
  id_vehicle: z.int(), // if linked to a vehicle
  name: z.string(),
  section: z.string().nullable(), // coming from categories
  category: z.string().nullable(), // coming from categories
  company_name: z.string().nullable(), // coming from companies
  vehicle_name: z.string().nullable(), // coming from vehicles
  slug: z.string(), // UEX URLs
  size: z.string().nullable(),
  uuid: z.string().nullable(), // star citizen uuid
  color: z.string().nullable(), // red | blue | green | yellow | orange | purple | pink | brown | black | white | gray
  color2: z.string().nullable(), // red | blue | green | yellow | orange | purple | pink | brown | black | white | gray
  url_store: z.string().nullable(), // pledge store URL
  wiki: z.string().nullable(), // wiki URL
  quality: z.int().nullable(), // quality level
  is_exclusive_pledge: z.int(),
  is_exclusive_subscriber: z.int(),
  is_exclusive_concierge: z.int(),
  is_commodity: z.int(),
  is_harvestable: z.int(),
  screenshot: z.string(), // item image URL (suspended due to server costs)
  attributes: z.any().optional(), // deprecated
  notification: z.any(), // heads up about an item, such as known bugs, etc.
  game_version: z.string().nullable(),
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
});
const ItemAttributeSchema = z.object({
  id: z.int(),
  id_item: z.int(),
  id_category: z.int(),
  id_category_attribute: z.int(),
  category_name: z.string().nullable(),
  item_name: z.string(),
  item_uuid: z.string().nullable(),
  item_wiki: z.string().nullable(), // wiki URL
  attribute_name: z.string(),
  value: z.string().nullable(),
  unit: z.string().nullable(),
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
});

const ItemPriceSchema = z.object({
  id: z.int(),
  id_item: z.int(),
  id_parent: z.int(),
  id_category: z.int(),
  id_vehicle: z.int(),
  id_star_system: z.int(),
  id_planet: z.int(),
  id_orbit: z.int(),
  id_moon: z.int(),
  id_city: z.int(),
  id_outpost: z.int(),
  id_poi: z.int(),
  id_faction: z.int().optional(),
  id_terminal: z.int(),
  price_buy: z.float32().nullable(), // last, per unit
  price_buy_min: z.float32().nullable(),
  price_buy_min_week: z.float32().nullable(),
  price_buy_min_month: z.float32().nullable(),
  price_buy_max: z.float32().nullable(),
  price_buy_max_week: z.float32().nullable(),
  price_buy_max_month: z.float32().nullable(),
  price_buy_avg: z.float32().nullable(),
  price_buy_avg_week: z.float32().nullable(),
  price_buy_avg_month: z.float32().nullable(),
  price_sell: z.float32().nullable(), // last, per unit
  price_sell_min: z.float32().nullable(),
  price_sell_min_week: z.float32().nullable(),
  price_sell_min_month: z.float32().nullable(),
  price_sell_max: z.float32().nullable(),
  price_sell_max_week: z.float32().nullable(),
  price_sell_max_month: z.float32().nullable(),
  price_sell_avg: z.float32().nullable(),
  price_sell_avg_week: z.float32().nullable(),
  price_sell_avg_month: z.float32().nullable(),
  durability: z.float32(), // last (%)
  durability_min: z.float32(),
  durability_min_week: z.float32(),
  durability_min_month: z.float32(),
  durability_max: z.float32(),
  durability_max_week: z.float32(),
  durability_max_month: z.float32(),
  durability_avg: z.float32(),
  durability_avg_week: z.float32(),
  durability_avg_month: z.float32(),
  faction_affinity: z.int(), // datarunner's affinity average at a location (between -100 and 100)
  game_version: z.string(),
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  item_name: z.string(),
  item_wiki: z.string().nullable(), // wiki URL
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
const ItemPriceMiniSchema = z.object({
  id: z.int(),
  id_item: z.int(),
  id_terminal: z.int(),
  id_category: z.int(),
  price_buy: z.float32().nullable(), // last, per unit
  price_sell: z.float32().nullable(), // last, per unit
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
  item_name: z.string(),
  item_uuid: z.string().nullable(), // star citizen uuid
  terminal_name: z.string(),
});

const ItemCategorySchema = z.object({
  id: z.int(),
  type: z.string(), // item, service, contract
  section: z.string(),
  name: z.string(),
  is_game_related: z.int(), // if exists in-game
  is_mining: z.int(), // mining related
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
});

export class UexItemEndpoints {
  constructor(private readonly client: UEXClient) {}

  async getItems(
    filters: RequireAtLeastOne<
      {
        categoryID: number;
        companyID: number;
        uuid: string;
        size: string;
      },
      "categoryID" | "companyID" | "uuid" | "size"
    >,
  ) {
    return this.client.get(
      `items`,
      {
        id_category: filters.categoryID,
        id_company: filters.companyID,
        uuid: filters.uuid,
        size: filters.size,
      },
      z.array(ItemSchema),
    );
  }

  async getItemAttributes(
    filters: RequireAtLeastOne<
      {
        itemID: number;
        categoryID: number;
        uuid: string;
      },
      "categoryID" | "itemID" | "uuid"
    >,
  ) {
    return this.client.get(
      `items_attributes`,
      {
        id_item: filters.itemID,
        id_category: filters.categoryID,
        uuid: filters.uuid,
      },
      z.array(ItemAttributeSchema),
    );
  }

  async getItemPrices(
    filters: RequireAtLeastOne<
      {
        /** Maximum of 10 IDs. anything over will be discarded */
        terminalID: number[];
        itemID: number;
        categoryID: number;
        uuid?: string;
      },
      "terminalID" | "itemID" | "categoryID"
    >,
  ) {
    return this.client.get(
      `items_prices`,
      {
        id_terminal:
          filters.terminalID &&
          Array.from(new Set<number>(filters.terminalID))
            .slice(0, 10)
            .sort((a, b) => a - b)
            .join(","),
        id_item: filters.itemID,
        id_category: filters.categoryID,
        uuid: filters.uuid,
      },
      z.array(ItemPriceSchema),
    );
  }

  async getAllItemPrices() {
    return this.client.get(`items_prices_all`, {}, z.array(ItemPriceMiniSchema));
  }

  async getItemCategories(filters: { section?: string } = {}) {
    return this.client.get(
      `categories`,
      { type: "item", section: filters.section },
      z.array(ItemCategorySchema),
    );
  }
}
