import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy } from "../helpers";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("items", () => {
  it("asks for items", async () => {
    const request = await requestMadeBy(() => client.items.getItems({ categoryID: 17 }));

    expect(request.path).toBe("/2.0/items/");
    expect(request.query).toEqual({ id_category: "17" });
  });
  it("asks for item attributes", async () => {
    const request = await requestMadeBy(() => client.items.getItemAttributes({ itemID: 114 }));

    expect(request.path).toBe("/2.0/items_attributes/");
    expect(request.query).toEqual({ id_item: "114" });
  });
  it("asks for an item price", async () => {
    const request = await requestMadeBy(() => client.items.getItemPrices({ itemID: 114 }));

    expect(request.path).toBe("/2.0/items_prices/");
    expect(request.query).toEqual({ id_item: "114" });
  });
  it("should not ask for more than 10 terminals", async () => {
    const request = await requestMadeBy(() =>
      client.items.getItemPrices({
        terminalID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      }),
    );

    expect(request.path).toBe("/2.0/items_prices/");
    expect(request.query).toEqual({ id_terminal: "1,2,3,4,5,6,7,8,9,10" });
  });
  it("asks for all item prices", async () => {
    const request = await requestMadeBy(() => client.items.getAllItemPrices());

    expect(request.path).toBe("/2.0/items_prices_all/");
    expect(request.query).toEqual({});
  });
  it("asks for all item categories", async () => {
    const request = await requestMadeBy(() => client.items.getItemCategories());

    expect(request.path).toBe("/2.0/categories/");
    expect(request.query).toEqual({ type: "item" });
  });
});
