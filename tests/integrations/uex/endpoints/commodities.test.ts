import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy, uexReplies } from "../helpers";
import { Agricium, AgriciumAverages } from "./fixtures/commodities.fixtures";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("commodities", () => {
  it("asks for all commodities", async () => {
    const request = await requestMadeBy(() => client.commodities.getCommodities());

    expect(request.path).toBe("/2.0/commodities/");
    expect(request.query).toEqual({});
  });

  it("asks for all commodity prices for all terminals", async () => {
    const request = await requestMadeBy(() => client.commodities.getAllCommodityPrices());

    expect(request.path).toBe("/2.0/commodities_prices_all/");
    expect(request.query).toEqual({});
  });

  it("matches the commodity schema", async () => {
    uexReplies([Agricium]);

    await expect(client.commodities.getCommodities()).resolves.toEqual([Agricium]);
  });

  it("asks for commodity prices via commodity ID", async () => {
    const request = await requestMadeBy(() =>
      client.commodities.getCommodityPrices({ commodityID: 5 }),
    );

    expect(request.path).toBe("/2.0/commodities_prices/");
    expect(request.query).toEqual({ id_commodity: "5" });
  });

  it("asks for commodity prices via a single terminal ID", async () => {
    const request = await requestMadeBy(() =>
      client.commodities.getCommodityPrices({ terminalID: [5] }),
    );

    expect(request.path).toBe("/2.0/commodities_prices/");
    expect(request.query).toEqual({ id_terminal: "5" });
  });

  it("asks for commodity prices via a multiple terminal ID", async () => {
    const request = await requestMadeBy(() =>
      client.commodities.getCommodityPrices({ terminalID: [1, 2, 3, 4, 5, 6, 7] }),
    );

    expect(request.path).toBe("/2.0/commodities_prices/");
    expect(request.query).toEqual({ id_terminal: "1,2,3,4,5,6,7" });
  });

  it("should not ask for more than 10 terminals", async () => {
    const request = await requestMadeBy(() =>
      client.commodities.getCommodityPrices({
        terminalID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      }),
    );

    expect(request.path).toBe("/2.0/commodities_prices/");
    expect(request.query).toEqual({ id_terminal: "1,2,3,4,5,6,7,8,9,10" });
  });

  it("should sort & deduplicate terminal ids", async () => {
    const request = await requestMadeBy(() =>
      client.commodities.getCommodityPrices({
        terminalID: [5, 10, 10, 2, 14, 9, 5, 112, 56, 4, 250],
      }),
    );

    expect(request.path).toBe("/2.0/commodities_prices/");
    expect(request.query).toEqual({ id_terminal: "2,4,5,9,10,14,56,112,250" });
  });

  it("asks for all commodity alerts", async () => {
    const request = await requestMadeBy(() => client.commodities.getCommoditiesAlerts());

    expect(request.path).toBe("/2.0/commodities_alerts/");
    expect(request.query).toEqual({});
  });

  it("asks for commodity alerts via commodity ID", async () => {
    const request = await requestMadeBy(() =>
      client.commodities.getCommoditiesAlertsByCommodityID(1),
    );

    expect(request.path).toBe("/2.0/commodities_alerts/");
    expect(request.query).toEqual({ id_commodity: "1" });
  });

  it("asks for a commodity's price history", async () => {
    const request = await requestMadeBy(() =>
      client.commodities.getCommodityPriceHistory({ terminalID: 1, commodityID: 5 }),
    );

    expect(request.path).toBe("/2.0/commodities_prices_history/");
    expect(request.query).toEqual({ id_terminal: "1", id_commodity: "5" });
  });

  it("asks for commodity averages", async () => {
    const request = await requestMadeBy(() => client.commodities.getCommodityAverages(1));

    expect(request.path).toBe("/2.0/commodities_averages/");
    expect(request.query).toEqual({ id_commodity: "1" });
  });

  it("matches the CommodityAverages schema", async () => {
    uexReplies([AgriciumAverages]);

    await expect(client.commodities.getCommodityAverages(1)).resolves.toEqual([AgriciumAverages]);
  });

  it("asks for commodity terminal states", async () => {
    const request = await requestMadeBy(() => client.commodities.getCommodityTerminalStates(), {
      buy: [],
      sell: [],
    });

    expect(request.path).toBe("/2.0/commodities_status/");
    expect(request.query).toEqual({});
  });
});
