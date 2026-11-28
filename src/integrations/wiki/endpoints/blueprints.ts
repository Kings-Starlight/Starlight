import type { WikiClient } from "../client";
import { BlueprintSchema } from "../schemas/blueprints";

export class WikiBlueprintEndpoints {
  constructor(private readonly client: WikiClient) {}

  /**
   * Gets a paginated list of all known crafting blueprints.
   * Provides some filters to sort and narrow the search scope.
   * @param filters
   * @param filters.pageNumber used to navigate through paginated results
   * @param filters.sort how to sort the returned results
   * @param filters.query Search blueprints by crafted item name
   * @param filters.outputUUID The UUID of the crafted item
   * @param filters.outputType The type of item the crafted result will be
   * @param filters.ingredient The name or UUID of the involved ingredient
   * @returns
   */
  async getBlueprints(
    filters: {
      pageNumber: number;
      sort:
        | "craft_time_seconds"
        | "-craft_time_seconds"
        | "ingredient_count"
        | "-ingredient_count"
        | "unlocking_missions_count"
        | "-unlocking_missions_count";
      query?: string;
      outputUUID?: string;
      outputType?: string;
      ingredient?: string;
    } = { pageNumber: 1, sort: "-craft_time_seconds" },
  ) {
    return this.client.get(
      "blueprints",
      {
        "page[number]": filters.pageNumber,
        sort: filters.sort,
        "filter[query]": filters.query,
        "filter[output.uuid]": filters.outputUUID,
        "filter[output.type]": filters.outputType,
        "filter[ingredient]": filters.ingredient,
      },
      BlueprintSchema,
      "paginated",
    );
  }

  /**
   * Gets information on a specific blueprint
   * @param blueprint The UUID of the target blueprint
   * @returns
   */
  async getBlueprint(blueprint: string) {
    return this.client.get(`blueprints/${blueprint}`, {}, BlueprintSchema, "standard");
  }
}
