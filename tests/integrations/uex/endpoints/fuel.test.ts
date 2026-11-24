import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy } from "../helpers";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("fuel", () => {
  it("asks for all fuel prices", async () => {
    const request = await requestMadeBy(() => client.fuel.getAllFuelPrices());

    expect(request.path).toBe("/2.0/fuel_prices_all/");
    expect(request.query).toEqual({});
  });
  it("asks for hydrogen fuel prices", async () => {
    const request = await requestMadeBy(() =>
      client.fuel.getFuelPrices({ commodityName: "hydrogen" }),
    );

    expect(request.path).toBe("/2.0/fuel_prices/");
    expect(request.query).toEqual({ commodity_name: "hydrogen" });
  });
  it("should not ask for more than 10 terminals", async () => {
    const request = await requestMadeBy(() =>
      client.fuel.getFuelPrices({
        terminalID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      }),
    );

    expect(request.path).toBe("/2.0/fuel_prices/");
    expect(request.query).toEqual({ id_terminal: "1,2,3,4,5,6,7,8,9,10" });
  });
});
