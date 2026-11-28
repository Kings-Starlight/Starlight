import z from "zod";

export const WikiPaginatedMetaSchema = z.object({
  current_page: z.int(),
  from: z.int(),
  last_page: z.int(),
  links: z.array(
    z.object({
      url: z.string().nullable(),
      label: z.string(),
      page: z.int().nullable().optional(),
      active: z.boolean(),
    }),
  ),
  path: z.string(),
  per_page: z.int(),
  to: z.int(),
  total: z.int(),
});

export const WikiPaginationLinksSchema = z.object({
  first: z.string(),
  last: z.string(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});

export const WikiMetaSchema = z.object({
  processed_at: z.string(),
  resource: z.object({
    type: z.string(),
    uuid: z.uuid(),
    slug: z.string(),
    api_url: z.string(),
    web_url: z.string(),
    version: z.string(),
  }),
});

export const WikiPaginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    links: WikiPaginationLinksSchema,
    meta: WikiPaginatedMetaSchema,
  });

export const WikiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: WikiMetaSchema,
  });
