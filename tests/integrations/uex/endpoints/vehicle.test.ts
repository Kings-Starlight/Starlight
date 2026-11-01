import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy, uexReplies } from "../helpers";
import { cutlassBlack, originfourhungie_i } from "./vehicle.fixtures";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("vehicles", () => {
  it("asks for every vehicle", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicles());

    expect(request.path).toBe("/2.0/vehicles/");
    expect(request.query).toEqual({});
  });

  it("filters by manufacturer", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehiclesByCompanyID(5));

    expect(request.path).toBe("/2.0/vehicles/");
    expect(request.query).toEqual({ id_company: "5" });
  });

  it("returns vehicles that match the schema", async () => {
    uexReplies([cutlassBlack]);

    await expect(client.vehicles.getVehicles()).resolves.toEqual([cutlassBlack]);
  });

  it("rejects a vehicle that is missing a required field", async () => {
    const { name: _name, ...cutlassWithoutName } = cutlassBlack;
    uexReplies([cutlassWithoutName]);

    await expect(client.vehicles.getVehicles()).rejects.toThrow();
  });
});

describe("loaners", () => {
  it("asks for every vehicle that has loaners", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleLoaners());

    expect(request.path).toBe("/2.0/vehicles_loaners/");
    expect(request.query).toEqual({});
  });

  it("looks up one vehicle by id", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleLoanersByID(7));

    expect(request.path).toBe("/2.0/vehicles_loaners/");
    expect(request.query).toEqual({ id_vehicle: "7" });
  });

  it("looks up one vehicle by name", async () => {
    const request = await requestMadeBy(() =>
      client.vehicles.getVehicleLoanersByName("Cutlass Black"),
    );

    expect(request.path).toBe("/2.0/vehicles_loaners/");
    expect(request.query).toEqual({ name: "Cutlass Black" });
  });

  it("keeps special characters in the name intact", async () => {
    const request = await requestMadeBy(() =>
      client.vehicles.getVehicleLoanersByName("Cutlass & Co #1"),
    );

    expect(request.query).toEqual({ name: "Cutlass & Co #1" });
  });

  it("matches the vehicleLoaner schema", async () => {
    uexReplies([originfourhungie_i]);

    await expect(client.vehicles.getVehicleLoaners()).resolves.toEqual([originfourhungie_i]);
  });
});

describe("store prices", () => {
  it("asks for every vehicle's store price", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleStorePrices());

    expect(request.path).toBe("/2.0/vehicles_prices/");
    expect(request.query).toEqual({});
  });

  it("looks up one vehicle's store price", async () => {
    const request = await requestMadeBy(() => client.vehicles.GetVehicleStorePricesByVehicleID(7));

    expect(request.path).toBe("/2.0/vehicles_prices/");
    expect(request.query).toEqual({ id_vehicle: "7" });
  });
});

describe("in-game purchase prices", () => {
  it("asks for every price at every terminal", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleBuyPrices());

    expect(request.path).toBe("/2.0/vehicles_purchases_prices_all/");
    expect(request.query).toEqual({});
  });

  it("looks up one vehicle across terminals", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleBuyPricesByVehicleID(7));

    expect(request.path).toBe("/2.0/vehicles_purchases_prices/");
    expect(request.query).toEqual({ id_vehicle: "7" });
  });

  it("looks up one terminal's prices", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleBuyPricesByTerminalID(9));

    expect(request.path).toBe("/2.0/vehicles_purchases_prices/");
    expect(request.query).toEqual({ id_terminal: "9" });
  });
});

describe("in-game rental prices", () => {
  it("asks for every rental price at every terminal", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleRentPrices());

    expect(request.path).toBe("/2.0/vehicles_rentals_prices_all/");
    expect(request.query).toEqual({});
  });

  it("looks up one vehicle across terminals", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleRentPricesByVehicleID(7));

    expect(request.path).toBe("/2.0/vehicles_rentals_prices/");
    expect(request.query).toEqual({ id_vehicle: "7" });
  });

  it("looks up one terminal's prices", async () => {
    const request = await requestMadeBy(() => client.vehicles.getVehicleRentPricesByTerminalID(9));

    expect(request.path).toBe("/2.0/vehicles_rentals_prices/");
    expect(request.query).toEqual({ id_terminal: "9" });
  });
});
