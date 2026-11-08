import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy } from "../helpers";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("refineries", () => {
  it("asks for all refinery audits", async () => {
    const request = await requestMadeBy(() => client.refineries.getRefineryAudits());

    expect(request.path).toBe("/2.0/refineries_audits/");
    expect(request.query).toEqual({});
  });
  it("asks for all refinery capacities", async () => {
    const request = await requestMadeBy(() => client.refineries.getRefineryCapacities());

    expect(request.path).toBe("/2.0/refineries_capacities/");
    expect(request.query).toEqual({});
  });
  it("asks for all refinery methods", async () => {
    const request = await requestMadeBy(() => client.refineries.getRefineryMethods());

    expect(request.path).toBe("/2.0/refineries_methods/");
    expect(request.query).toEqual({});
  });
  it("asks for all refinery yields", async () => {
    const request = await requestMadeBy(() => client.refineries.getRefineryYields());

    expect(request.path).toBe("/2.0/refineries_yields/");
    expect(request.query).toEqual({});
  });
});
