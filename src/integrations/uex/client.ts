import z from "zod";
import { HttpClient } from "../shared/http";
import { UexCommoditiesEndpoints } from "./endpoints/commodities";
import { UexFuelEndpoints } from "./endpoints/fuel";
import { UexItemEndpoints } from "./endpoints/items";
import { UexLocationEndpoints } from "./endpoints/locations";
import { UexMiscEndpoints } from "./endpoints/misc";
import { UexDailyNewsRoute } from "./endpoints/news";
import { UexRefineryRoutes } from "./endpoints/refineries";
import { UexVehicleEndpoints } from "./endpoints/vehicle";

const UexResponse = z.object({
  status: z.string(),
  http_code: z.int().optional(),
  data: z.unknown(),
  message: z.string().optional(),
});

export class UEXClient {
  private readonly http: HttpClient;
  readonly vehicles: UexVehicleEndpoints;
  readonly commodities: UexCommoditiesEndpoints;
  readonly locations: UexLocationEndpoints;
  readonly items: UexItemEndpoints;
  readonly refineries: UexRefineryRoutes;
  readonly fuel: UexFuelEndpoints;
  readonly news: UexDailyNewsRoute;
  readonly misc: UexMiscEndpoints;

  constructor(token: string | undefined) {
    if (token === undefined) throw new Error("UEX API token not provided!");

    this.http = new HttpClient({
      baseUrl: "https://api.uexcorp.uk/2.0/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.vehicles = new UexVehicleEndpoints(this);
    this.commodities = new UexCommoditiesEndpoints(this);
    this.locations = new UexLocationEndpoints(this);
    this.items = new UexItemEndpoints(this);
    this.refineries = new UexRefineryRoutes(this);
    this.fuel = new UexFuelEndpoints(this);
    this.news = new UexDailyNewsRoute(this);
    this.misc = new UexMiscEndpoints(this);
  }

  async get<T>(
    resource: string,
    params: Record<string, string | number | undefined> = {},
    schema: z.ZodType<T>,
    /** set this to true if you're expecting the returned content to be a string.
     * it will tell http.get to skip parsing json and return the string as is */
    string: boolean = false,
  ): Promise<T> {
    if (string) {
      const response = await this.http.get(`${resource}/`, params, true);
      return schema.parse(response);
    }

    const response = UexResponse.parse(await this.http.get<unknown>(`${resource}/`, params));
    if (response.status !== "ok") {
      throw new Error(`UEX API returned: ${response.status}`);
    }
    return schema.parse(response.data);
  }
}
