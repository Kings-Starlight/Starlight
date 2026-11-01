import { vi } from "vitest";

export const fetchMock = vi.fn<typeof fetch>();

/** Makes UEX answer with `data`. */
export function uexReplies(data: unknown) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify({ status: "ok", data }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
}

/**
 * Runs `call` against a fake UEX that returns an empty list, and reports the
 * request it received: the path, and the query string as a plain object.
 */
export async function requestMadeBy(call: () => Promise<unknown>) {
  uexReplies([]);
  await call();

  const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
  return { path: url.pathname, query: Object.fromEntries(url.searchParams) };
}
