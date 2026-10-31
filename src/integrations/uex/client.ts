import z from "zod";
import { HttpClient } from "../shared/http";
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

  constructor(token: string | undefined) {
    if (token === undefined) throw new Error("UEX API token not provided!");

    this.http = new HttpClient({
      baseUrl: "https://api.uexcorp.uk/2.0/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.vehicles = new UexVehicleEndpoints(this);
  }

  async get<T>(
    resource: string,
    params: Record<string, string | number> = {},
    schema: z.ZodType<T>,
  ): Promise<T> {
    const response = UexResponse.parse(await this.http.get<unknown>(`${resource}/`, params));

    if (response.status !== "ok") {
      throw new Error(`UEX API returned: ${response.status}`);
    }

    return schema.parse(response.data);
  }
}
