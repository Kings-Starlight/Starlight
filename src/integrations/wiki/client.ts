import type z from "zod";
import { HttpClient } from "../shared/http";
import { WikiBlueprintEndpoints } from "./endpoints/blueprints";
import {
  type WikiMetaSchema,
  type WikiPaginatedMetaSchema,
  WikiPaginatedResponseSchema,
  type WikiPaginationLinksSchema,
  WikiResponseSchema,
} from "./schemas/client";

type PaginatedResponse<T> = {
  data: T[];
  links: z.infer<typeof WikiPaginationLinksSchema>;
  meta: z.infer<typeof WikiPaginatedMetaSchema>;
};

type StandardResponse<T> = {
  data: T;
  meta: z.infer<typeof WikiMetaSchema>;
};

type ResponseFormat = "standard" | "paginated";

export class WikiClient {
  private readonly http: HttpClient;

  public pageSize: number;
  readonly blueprints: WikiBlueprintEndpoints;

  constructor() {
    this.http = new HttpClient({
      baseUrl: "https://api.star-citizen.wiki/api/",
      headers: {},
    });

    this.pageSize = 10;
    this.blueprints = new WikiBlueprintEndpoints(this);
  }

  async get<T extends z.ZodType>(
    resource: string,
    params: Record<string, string | number | undefined>,
    schema: T,
    format: "paginated",
  ): Promise<PaginatedResponse<z.infer<T>>>;

  async get<T extends z.ZodType>(
    resource: string,
    params: Record<string, string | number | undefined>,
    schema: T,
    format: "standard",
  ): Promise<StandardResponse<z.infer<T>>>;

  async get(
    resource: string,
    params: Record<string, string | number | undefined> = {},
    schema: z.ZodType,
    format: ResponseFormat,
  ) {
    const responseSchema =
      format === "paginated" ? WikiPaginatedResponseSchema(schema) : WikiResponseSchema(schema);

    const response = responseSchema.parse(
      await this.http.get<unknown>(`${resource}/`, { "page[size]": this.pageSize, ...params }),
    );

    return response;
  }
}
