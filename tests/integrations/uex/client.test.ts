import { beforeEach, describe, expect, it, vi } from "vitest";
import z from "zod";
import { UEXClient } from "../../../src/integrations/uex/client";

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

describe("UEXClient", () => {
  const fetchMock = vi.fn<typeof fetch>();
  const Item = z.array(z.object({ id: z.number() }));

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  it("refuses to be constructed without a token", () => {
    expect(() => new UEXClient(undefined)).toThrow("UEX API token not provided");
  });

  it("sends the bearer token to the UEX API", async () => {
    fetchMock.mockResolvedValueOnce(json({ status: "ok", data: [] }));

    await new UEXClient("test-token").get("vehicles", {}, Item);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe("https://api.uexcorp.uk/2.0/vehicles/");
    expect(init?.headers).toMatchObject({ Authorization: "Bearer test-token" });
  });

  it("unwraps `data` and validates it against the schema", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ status: "ok", http_code: 200, data: [{ id: 1, extra: "dropped" }] }),
    );

    // Zod strips keys the schema doesn't declare.
    await expect(new UEXClient("t").get("x", {}, Item)).resolves.toEqual([{ id: 1 }]);
  });

  it("throws when the envelope status is not ok", async () => {
    fetchMock.mockResolvedValueOnce(json({ status: "error", data: null }));

    await expect(new UEXClient("t").get("x", {}, Item)).rejects.toThrow("UEX API returned: error");
  });

  it("throws a ZodError when `data` doesn't match the schema", async () => {
    fetchMock.mockResolvedValueOnce(json({ status: "ok", data: [{ id: "not-a-number" }] }));

    await expect(new UEXClient("t").get("x", {}, Item)).rejects.toBeInstanceOf(z.ZodError);
  });

  it("throws a ZodError when the response isn't a UEX envelope at all", async () => {
    fetchMock.mockResolvedValueOnce(json({ unexpected: true }));

    await expect(new UEXClient("t").get("x", {}, Item)).rejects.toBeInstanceOf(z.ZodError);
  });
});
