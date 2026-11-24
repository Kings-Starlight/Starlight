import z from "zod";
import type { UEXClient } from "../client";

export class UexDailyNewsRoute {
  constructor(private readonly client: UEXClient) {}

  /**
   * Gets the daily commodity statuses from UEX
   * @param filters
   * @param filters.data Type of news data to obtain
   * @returns
   */
  async getDailyNews(filters: {
    data: "commodities_routes" | "commodities_prices" | "last_commodity_data_reports";
  }) {
    return this.client.get(`data_extract`, { data: filters.data }, z.any(), true);
  }
}
