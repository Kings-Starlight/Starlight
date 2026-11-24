import z from "zod";
import type { UEXClient } from "../client";

const CategorySchema = z.object({
  id: z.int(),
  type: z.string(), // item, service, contract
  section: z.string(),
  name: z.string(),
  is_game_related: z.int(), // if exists in-game
  is_mining: z.int(), // mining related
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
});
const CategoryAttributeSchema = z.object({
  id: z.int(),
  id_category: z.int(),
  name: z.string(),
  category_name: z.int(), // parent
  description: z.string(),
  is_lower_better: z.int(), // does not apply to all attributes
  date_added: z.int(), // timestamp
  date_modified: z.int(), // timestamp
});

export class UexMiscEndpoints {
  constructor(private readonly client: UEXClient) {}

  /**
   * Gets all UEX categories.
   * Provides some optional filters to narrow the scope
   * @param filters
   * @param filters.type
   * @param filters.section
   * @returns
   */
  async getCategories(filters: { type?: "item" | "service" | "contract"; section?: string }) {
    return this.client.get(
      "categories",
      { type: filters.type, section: filters.section },
      z.array(CategorySchema),
    );
  }

  /**
   * Gets category attributes for all categories or for a specified one.
   * @param filters
   * @param filters.categoryID ID of a specific category
   * @returns
   */
  async getCategoryAttributes(filters: { categoryID?: number }) {
    return this.client.get(
      "categories_attributes",
      { id_category: filters.categoryID },
      z.array(CategoryAttributeSchema),
    );
  }
}
