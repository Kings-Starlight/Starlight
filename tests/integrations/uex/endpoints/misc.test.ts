import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy } from "../helpers";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("categories", () => {
  it("asks for all categories", async () => {
    const request = await requestMadeBy(() => client.misc.getCategories({}));

    expect(request.path).toBe("/2.0/categories/");
    expect(request.query).toEqual({});
  });
  it("asks for all category attributes", async () => {
    const request = await requestMadeBy(() => client.misc.getCategoryAttributes({ categoryID: 1 }));

    expect(request.path).toBe("/2.0/categories_attributes/");
    expect(request.query).toEqual({ id_category: "1" });
  });
});
