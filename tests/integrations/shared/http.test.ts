import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, HttpClient } from "../../../src/integrations/shared/http";

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });

describe("HttpClient.get", () => {
  const fetchMock = vi.fn<typeof fetch>();
  const client = new HttpClient({
    baseUrl: "https://api.example.test/v1/",
    headers: { Authorization: "Bearer secret" },
  });

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    // Retries sleep between attempts. Fake timers let us test the backoff
    // schedule exactly, without the suite actually waiting.
    vi.useFakeTimers();
    return () => vi.useRealTimers();
  });

  it("resolves the URL against the base, applies params, and merges headers", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }));

    await client.get("things/", { limit: 5, q: "a b" });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe("https://api.example.test/v1/things/?limit=5&q=a+b");
    expect(init?.method).toBe("GET");
    expect(init?.headers).toMatchObject({
      Accept: "application/json",
      Authorization: "Bearer secret",
    });
  });

  it("returns the parsed JSON body on success", async () => {
    fetchMock.mockResolvedValueOnce(json({ hello: "world" }));

    await expect(client.get("x")).resolves.toEqual({ hello: "world" });
  });

  it("does not retry client errors", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));

    await expect(client.get("x")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      retryable: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a 5xx and returns the eventual success", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(json({ ok: true }));

    const result = client.get("x");
    await vi.runAllTimersAsync();

    await expect(result).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("gives up after 3 attempts and reports a retryable ApiError", async () => {
    fetchMock.mockImplementation(async () => new Response(null, { status: 503 }));

    const result = client.get("x").catch((error: unknown) => error);
    await vi.runAllTimersAsync();

    const error = await result;
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 503, retryable: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("backs off exponentially (500ms, then 1000ms) when there is no Retry-After", async () => {
    fetchMock.mockImplementation(async () => new Response(null, { status: 500 }));

    const result = client.get("x").catch((error: unknown) => error);

    await vi.advanceTimersByTimeAsync(499);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(999);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    await result;
  });

  it("waits for the Retry-After header on a 429", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "retry-after": "2" } }))
      .mockResolvedValueOnce(json({ ok: true }));

    const result = client.get("x");

    await vi.advanceTimersByTimeAsync(1999);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);

    await expect(result).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("caps an excessive Retry-After at 30 seconds", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "retry-after": "999" } }))
      .mockResolvedValueOnce(json({ ok: true }));

    const result = client.get("x");

    await vi.advanceTimersByTimeAsync(29_999);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);

    await expect(result).resolves.toEqual({ ok: true });
  });

  it("recovers from a transient network error", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(json({ ok: true }));

    const result = client.get("x");
    await vi.runAllTimersAsync();

    await expect(result).resolves.toEqual({ ok: true });
  });

  it("wraps a persistent network error in a retryable ApiError with no status", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const result = client.get("x").catch((error: unknown) => error);
    await vi.runAllTimersAsync();

    const error = await result;
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: undefined, retryable: true });
    expect((error as ApiError).message).toContain("fetch failed");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
