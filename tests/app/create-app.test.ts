import { describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/app/create-app";
import { UEXClient } from "../../src/integrations/uex/client";

describe("createApp", () => {
  it("wires a UEX client from the UEX env var", () => {
    vi.stubEnv("UEX", "test-token");

    expect(createApp().integrations.uex).toBeInstanceOf(UEXClient);
  });

  it("fails fast when the UEX token is missing", () => {
    vi.stubEnv("UEX", undefined);

    expect(() => createApp()).toThrow("UEX API token not provided");
  });
});
