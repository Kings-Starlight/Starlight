import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy } from "../helpers";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("news", () => {
  it("asks for the latest news", async () => {
    const request = await requestMadeBy(() =>
      client.news.getDailyNews({ data: "commodities_prices" }),
    );

    expect(request.path).toBe("/2.0/data_extract/");
    expect(request.query).toEqual({ data: "commodities_prices" });
  });
});
