import { beforeEach, describe, expect, it, vi } from "vitest";
import { UEXClient } from "../../../../src/integrations/uex/client";
import { fetchMock, requestMadeBy, uexReplies } from "../helpers";
import {
  Aberdeen,
  Abyss,
  Area4,
  BudsGrowery,
  JumpPoint,
  Lorville,
  Microtech,
  PortTressler,
  stanton,
  Terminal,
  TerminalDistance,
  UEE,
} from "./fixtures/locations.fixtures";

const client = new UEXClient("test-token");

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("Star Systems", () => {
  it("asks for all star systems", async () => {
    const request = await requestMadeBy(() => client.locations.getStarSystems());

    expect(request.path).toBe("/2.0/star_systems/");
    expect(request.query).toEqual({});
  });
  it("matches the schema", async () => {
    uexReplies([stanton]);
    await expect(client.locations.getStarSystems()).resolves.toEqual([stanton]);
  });
});

describe("Orbits", () => {
  it("asks for all orbits", async () => {
    const request = await requestMadeBy(() => client.locations.getOrbits());

    expect(request.path).toBe("/2.0/orbits/");
    expect(request.query).toEqual({});
  });
  it("asks for all orbits in a star system", async () => {
    const request = await requestMadeBy(() => client.locations.getOrbits(68));

    expect(request.path).toBe("/2.0/orbits/");
    expect(request.query).toEqual({ id_star_system: "68" });
  });
  it("matches the schema", async () => {
    uexReplies([Abyss]);
    await expect(client.locations.getOrbits()).resolves.toEqual([Abyss]);
  });
});

describe("Planets", () => {
  it("asks for all planets", async () => {
    const request = await requestMadeBy(() => client.locations.getPlanets());

    expect(request.path).toBe("/2.0/planets/");
    expect(request.query).toEqual({});
  });
  it("asks for all planets in a star system", async () => {
    const request = await requestMadeBy(() => client.locations.getPlanets({ starSystemID: 68 }));

    expect(request.path).toBe("/2.0/planets/");
    expect(request.query).toEqual({ id_star_system: "68" });
  });
  it("asks for all planets in a star system and faction", async () => {
    const request = await requestMadeBy(() =>
      client.locations.getPlanets({ starSystemID: 68, factionID: 14 }),
    );

    expect(request.path).toBe("/2.0/planets/");
    expect(request.query).toEqual({ id_star_system: "68", id_faction: "14" });
  });
  it("asks for all planets in a faction and jurisdiction", async () => {
    const request = await requestMadeBy(() =>
      client.locations.getPlanets({ jurisdictionID: 2, factionID: 14 }),
    );

    expect(request.path).toBe("/2.0/planets/");
    expect(request.query).toEqual({ id_jurisdiction: "2", id_faction: "14" });
  });
  it("matches the schema", async () => {
    uexReplies([Microtech]);
    await expect(client.locations.getPlanets()).resolves.toEqual([Microtech]);
  });
});

describe("Moons", () => {
  it("asks for all moons", async () => {
    const request = await requestMadeBy(() => client.locations.getMoons());

    expect(request.path).toBe("/2.0/moons/");
    expect(request.query).toEqual({});
  });
  it("asks for all moons in a system", async () => {
    const request = await requestMadeBy(() => client.locations.getMoons({ starSystemID: 68 }));

    expect(request.path).toBe("/2.0/moons/");
    expect(request.query).toEqual({ id_star_system: "68" });
  });
  it("asks for all moons for a planet", async () => {
    const request = await requestMadeBy(() => client.locations.getMoons({ planetID: 3 }));

    expect(request.path).toBe("/2.0/moons/");
    expect(request.query).toEqual({ id_planet: "3" });
  });
  it("matches the schema", async () => {
    uexReplies([Aberdeen]);
    await expect(client.locations.getMoons()).resolves.toEqual([Aberdeen]);
  });
});

describe("Space Stations", () => {
  it("asks for all space stations", async () => {
    const request = await requestMadeBy(() => client.locations.getSpaceStations());

    expect(request.path).toBe("/2.0/space_stations/");
    expect(request.query).toEqual({});
  });
  it("asks for all space stations in a system", async () => {
    const request = await requestMadeBy(() =>
      client.locations.getSpaceStations({ starSystemID: 68 }),
    );

    expect(request.path).toBe("/2.0/space_stations/");
    expect(request.query).toEqual({ id_star_system: "68" });
  });
  it("matches the schema", async () => {
    uexReplies([PortTressler]);
    await expect(client.locations.getSpaceStations()).resolves.toEqual([PortTressler]);
  });
});

describe("Cities", () => {
  it("asks for all cities", async () => {
    const request = await requestMadeBy(() => client.locations.getCities());

    expect(request.path).toBe("/2.0/cities/");
    expect(request.query).toEqual({});
  });
  it("asks for all cities in a system", async () => {
    const request = await requestMadeBy(() => client.locations.getCities({ starSystemID: 68 }));

    expect(request.path).toBe("/2.0/cities/");
    expect(request.query).toEqual({ id_star_system: "68" });
  });
  it("matches the schema", async () => {
    uexReplies([Lorville]);
    await expect(client.locations.getCities()).resolves.toEqual([Lorville]);
  });
});

describe("Outposts", () => {
  it("asks for all outposts", async () => {
    const request = await requestMadeBy(() => client.locations.getOutposts());

    expect(request.path).toBe("/2.0/outposts/");
    expect(request.query).toEqual({});
  });
  it("asks for all outposts on a planet", async () => {
    const request = await requestMadeBy(() => client.locations.getOutposts({ planetID: 190 }));

    expect(request.path).toBe("/2.0/outposts/");
    expect(request.query).toEqual({ id_planet: "190" });
  });
  it("matches the schema", async () => {
    uexReplies([BudsGrowery]);
    await expect(client.locations.getOutposts()).resolves.toEqual([BudsGrowery]);
  });
});

describe("Points of Interest", () => {
  it("asks for all POIs", async () => {
    const request = await requestMadeBy(() => client.locations.getPOIs());

    expect(request.path).toBe("/2.0/poi/");
    expect(request.query).toEqual({});
  });
  it("asks for all POIs in a system", async () => {
    const request = await requestMadeBy(() => client.locations.getPOIs({ starSystemID: 68 }));

    expect(request.path).toBe("/2.0/poi/");
    expect(request.query).toEqual({ id_star_system: "68" });
  });
  it("matches the schema", async () => {
    uexReplies([Area4]);
    await expect(client.locations.getPOIs()).resolves.toEqual([Area4]);
  });
});

describe("Jump Points", () => {
  it("asks for all jump points", async () => {
    const request = await requestMadeBy(() => client.locations.getJumpPoints());

    expect(request.path).toBe("/2.0/jump_points/");
    expect(request.query).toEqual({});
  });
  it("asks for all jump points with a target destination", async () => {
    const request = await requestMadeBy(() =>
      client.locations.getJumpPoints({ DestinationSystemID: 68 }),
    );

    expect(request.path).toBe("/2.0/jump_points/");
    expect(request.query).toEqual({ id_star_system_destination: "68" });
  });
  it("matches the schema", async () => {
    uexReplies([JumpPoint]);
    await expect(client.locations.getJumpPoints()).resolves.toEqual([JumpPoint]);
  });
});

describe("Jurisdictions", () => {
  it("asks for all jurisdictions", async () => {
    const request = await requestMadeBy(() => client.locations.getJurisdictions());

    expect(request.path).toBe("/2.0/jurisdictions/");
    expect(request.query).toEqual({});
  });
  it("matches the schema", async () => {
    uexReplies([UEE]);
    await expect(client.locations.getJurisdictions()).resolves.toEqual([UEE]);
  });
});

describe("Terminals", () => {
  it("asks for all terminals", async () => {
    const request = await requestMadeBy(() => client.locations.getTerminals());

    expect(request.path).toBe("/2.0/terminals/");
    expect(request.query).toEqual({});
  });
  it("asks for all terminals on a planet", async () => {
    const request = await requestMadeBy(() => client.locations.getTerminals({ planetID: 68 }));
    expect(request.path).toBe("/2.0/terminals/");
    expect(request.query).toEqual({ id_planet: "68" });
  });
  it("matches the schema", async () => {
    uexReplies([Terminal]);
    await expect(client.locations.getTerminals()).resolves.toEqual([Terminal]);
  });
  it("ignores deprecated schema fields in the response", async () => {
    uexReplies([
      {
        ...Terminal,
        screenshot:
          "https://cdn.uexcorp.space/uid11252/data/submit/4e90710459b8d89e2a14cc07fa2cc318ae8c90de-cover.jpg",
        screenshot_full:
          "https://cdn.uexcorp.space/uid11252/data/submit/4e90710459b8d89e2a14cc07fa2cc318ae8c90de-full.jpg",
        screenshot_author: "bloxware",
        mcs: 0,
      },
    ]);
    await expect(client.locations.getTerminals()).resolves.toEqual([Terminal]);
  });
  it("gets the distance between two terminals", async () => {
    uexReplies(TerminalDistance);
    const request = await requestMadeBy(() =>
      client.locations.getTerminalDistances({ originTerminalID: 671, destinationTerminalID: 400 }),
    );
    expect(request.path).toBe("/2.0/terminals_distances/");
    expect(request.query).toEqual({ id_terminal_origin: "671", id_terminal_destination: "400" });
  });
  it("matches the termainl distance schema", async () => {
    uexReplies(TerminalDistance);

    await expect(
      client.locations.getTerminalDistances({ originTerminalID: 671, destinationTerminalID: 400 }),
    ).resolves.toEqual(TerminalDistance);
  });
});
